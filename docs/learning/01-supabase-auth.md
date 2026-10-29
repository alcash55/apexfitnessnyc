# Lesson 1: make identity and access trustworthy

Do this before changing Checkout. The target is one authenticated user linked to one current client record, with private reads and writes authorized at the point of access.

## A1. Connect the right environment

Read `frontend/lib/supabase/config.ts`, `browser.ts`, `server.ts`, and `frontend/lib/supabaseAdmin.ts`.

The browser and SSR auth client use a public project URL and public key. `getDb()` uses a server secret that bypasses RLS. A public API key identifies the application; it does not establish that the visitor owns a client record. [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)

Your tasks:

1. Open the confirmed owner project in Supabase. Record which project is production and which isolated project or local stack you will use for learning.
2. In `frontend/`, copy `.env.example` to `.env.local`. Fill it privately using keys from that chosen environment. Next.js runs from `frontend/`; a key only in `backend/.env` will not configure it.
3. Set `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL` to the same chosen project. Use that project's public key and corresponding server key. A token from project A must never be used with project B's privileged database client.
4. The existing names are `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`. Supabase also offers publishable and secret keys. Keep the current names for compatibility while checking supported key types in the official docs. Never put a server secret under a `NEXT_PUBLIC_` name.
5. Add a build-time `server-only` boundary to the privileged database and Stripe modules in your implementation lesson. Verify that importing them from a Client Component fails. Never expose a key by returning it as props or logging configuration objects.
6. Restart Next.js after setting local values. Build a fresh deployment after changing browser-visible production environment values.

To inspect the owner's migration history later, run these from `backend/`, not the repository root:

```sh
npx supabase projects list
npx supabase link --project-ref syjbeztrbuezlmzmspfz
npx supabase migration list --linked
npx supabase db push --linked --dry-run
```

The link command changes your local CLI target. The migration-list and dry-run commands inspect that target; they do not apply migrations. Do not follow them with a remote reset or an unreviewed push. If prompted for a database password, enter it privately in the terminal. Do not paste credentials into an issue or chat. For an isolated development project, link its own ref instead. Compare existing remote history and schema before planning any changes. [Supabase migration workflow](https://supabase.com/docs/guides/local-development/cli-workflows)

Checkpoint: you can identify which environment each URL and key belongs to, and the app can sign in with a synthetic test account in the isolated environment. Do not equate "public pages load" with "auth works"; missing config deliberately renders visitors signed out.

### Configure Auth for that environment

In the chosen development project's Authentication settings, enable the email/password provider and set the intended invitation-only signup policy. Hiding a signup form does not disable direct signup at the provider. Test that public signup is denied while trusted administrative invitations still work.

Set the development Site URL to the origin you actually run, such as `http://localhost:3000`. Add the invitation/recovery redirect URLs your code sends to the allowed redirect list. The current code requests `http://localhost:3000/auth/callback?next=/account/set-password` locally. Match the scheme, hostname, port, path, and the chosen template flow. `localhost` and `127.0.0.1` are different origins. The checked-in local config's HTTPS `127.0.0.1` entry is not a substitute for this HTTP localhost destination.

For hosted email tests, verify the project's email delivery configuration and permitted test recipients. Use your own synthetic test address; do not send experimental invitations to existing clients. For production, use the approved HTTPS domain and narrowly scoped redirect entries rather than unrestricted preview-domain wildcards. Do not change the owner's live email templates while testing the lesson.

## A2. Understand and verify the schema

Read migrations in chronological order, especially `20260918000000_client_auth.sql` and its preceding client-management migrations. Do not run the auth migration alone against an empty database; it depends on existing tables.

- `auth.users` is Supabase's identity store. Do not store passwords yourself.
- `public.clients.auth_user_id` links a business client to an identity. The partial unique index prevents two clients from sharing a non-null identity.
- `public.admins` is a trusted allowlist. A user must not grant themselves membership by editing profile metadata.
- Sensitive tables use RLS with no browser read/write policies in this design. Server code uses `getDb()` and must enforce ownership itself.

In the isolated environment, inspect only schema state first. The following read-only SQL checks table existence and RLS configuration without printing customer rows:

```sql
select to_regclass('public.clients') as clients,
       to_regclass('public.admins') as admins,
       to_regprocedure('public.custom_access_token_hook(jsonb)') as token_hook;

select c.relname, c.relrowsecurity
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('clients', 'admins', 'orders', 'training_payments');
```

Review policies and grants as well as the RLS flag. This server-mediated architecture can work, but RLS does not rescue an unauthorized service-role query. Do not add permissive browser policies just to make a failing query return data.

Bootstrap a synthetic admin identity in the development environment and deliberately add that identity's UUID to the admin allowlist using a trusted administrative process. Then create/link a separate synthetic client. Do not grant an email domain or every signed-in user admin access. Keep real admin bootstrap and production role changes owner-controlled.

Concretely, create the test identity through the development project's Auth Users screen, copy its user UUID, and add one `public.admins` row with that exact `auth_user_id` using the development project's Table Editor. This is privileged bootstrapping, not a public application feature. Create a separate synthetic `public.clients` row with its required name/email fields, then exercise the application's admin invitation path to link that client. Do not reuse the admin identity as your only client test; separate identities expose ownership mistakes.

Checkpoint: anonymous and ordinary authenticated database clients cannot enumerate clients, admins, orders, or payment history. The server can access only what its authorization checks permit.

## A3. Activate and understand custom claims

Creating `custom_access_token_hook` does not enable it. Register the function as the Custom Access Token Hook in the chosen project's Auth settings. The local `[auth.hook.custom_access_token]` block is currently commented out too. Hosted settings and local config are separate. Review execution grants, schema permissions, and the function's trusted ownership before enabling it. [Supabase custom access token hook](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook)

The hook adds `is_admin` and `client_id` when tokens are issued. Link the client first, then issue a fresh session or refresh it so new claims reflect the link. In an exercise, ensure the hook clears a previous `client_id` when the user becomes unlinked instead of retaining a stale claim. Preserve required Supabase claims.

Checkpoint: a fresh admin login has the expected admin claim, a fresh client login has its own client ID, and an unlinked user does not inherit a previous link. Inspect claims locally without sharing full tokens.

## A4. Trace cookies and repair the callback assumptions

Read `proxy.ts` -> `lib/supabase/middleware.ts` -> `lib/supabase/server.ts` -> `lib/auth.ts`, then `app/login/login-form.tsx` and `app/auth/callback/route.ts`.

The browser signs in through Supabase Auth. SSR needs browser/server clients and cookie refresh so the next server render sees the session. Next.js 16 calls its routing hook Proxy; the helper filename `middleware.ts` does not mean a second framework middleware exists. Proxy is useful for early navigation checks, not final authorization. [Supabase SSR setup](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs), [Next.js auth guide](https://nextjs.org/docs/app/guides/authentication)

Your tasks:

1. Keep cookie writes on Route Handlers or Proxy responses; Server Components cannot reliably persist refreshed cookies themselves.
2. Review the installed `@supabase/ssr` callback contract. Current docs pass cache headers alongside refreshed cookies. The current helper accepts only cookies. Carry required headers and cookies onto the final response, including redirects, so refreshed sessions are neither lost nor shared through caching.
3. Do not describe these SSR cookies as necessarily HttpOnly. The browser auth client needs token access in this design. Do not log cookies or cache private responses across users. [Supabase SSR advanced guide](https://supabase.com/docs/guides/auth/server-side/advanced-guide)
4. Validate `next` in Login and callback against an internal destination allowlist. An authenticated visitor must not be redirected to an external or protocol-relative URL supplied by another person. Review both server `redirect()` and browser `router.push()` callers.
5. Inspect the actual invite and password-reset email templates. The callback currently handles only `code`. Confirm whether the configured flow returns a code, a token hash, or fragment tokens. For a server token-hash flow, validate an allowed OTP type, call `verifyOtp`, establish cookies, and then redirect. For PKCE, exchange the code with its verifier. Do not assume two different email flows produce identical URLs. [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates)
6. Test invite completion and recovery separately, including expired/reused links and an invite opened in a different browser. Never log link tokens or treat a supplied email address as proof of identity.
7. Return a 303 redirect to the intended page after a logout POST so the browser follows with GET. Handle sign-out errors and choose the intended local/global logout scope. A successful UI redirect alone does not prove the session ended.

Checkpoint: a test client can receive an invite, set a password, log in, refresh a protected page, recover a password, and log out. A failed callback cannot access member data.

## A5. Separate authentication from current authorization

`getClaims()` verifies a token's signature and expiry. It does not make an embedded client link or admin role current. Where revocation must take effect immediately, consider a fresh Auth user check as well as your own current membership lookup. [Supabase session verification limits](https://supabase.com/docs/guides/auth/server-side/advanced-guide)

Design two server-only helpers as your first code exercise:

- A current-client helper verifies identity and resolves `clients.auth_user_id` from the verified user ID. Do not accept a client ID from the browser, email, or an unchecked claim as the final authority.
- A current-admin helper verifies identity and checks the current `admins` row before any sensitive read or write.

A possible return contract is below. It is a design prompt, not an implemented helper or a requirement to use these exact names:

```ts
type ClientAccess =
  | { kind: "allowed"; userId: string; clientId: string }
  | { kind: "signed-out" }
  | { kind: "unlinked" }
  | { kind: "unavailable" };
```

`unavailable` must not allow access. Use existing project error conventions if you prefer throwing on infrastructure failure. The important distinction is an authorization denial versus a broken database.

Use the helpers before `getDb()` queries in Account, Dashboard, Payments, Library, the three admin pages, and their API handlers. Page guards do not protect Route Handlers that a caller can invoke directly. Do not change permissions based on user-editable metadata. Add exact route matching to your routing decisions rather than assuming every string prefix denotes a real protected route.

For browser cookie-authenticated writes, review trusted origins and CSRF protection. JSON parsing alone is not a security boundary. Browser protections must not block Stripe's separately signed server-to-server webhook.

Checkpoint: an old valid token cannot read data or create Checkout after the client's link is removed; a removed admin cannot read client details or expenses. An ordinary client cannot read or write a different client's records. This is the prerequisite for Lesson 2.

## A6. Make invitation/linking failures recoverable

`inviteUserByEmail()` and updating `clients.auth_user_id` are separate operations. The current handler sends the invite before confirming the client update affected exactly one intended row. An invalid client ID or database failure can leave an invited but unlinked identity.

Validate the target client and existing link before inviting. Define what happens when the email already exists, when the link update fails, when a request is retried, and when a client is already linked. Do not automatically delete an existing identity to repair a failed invite. Test fresh claims after linking. Keep the privileged invite operation on the server. [Supabase invite API](https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail)

Write down your answers before moving on: why does a valid JWT not prove current membership? Why does a service-role client need stricter application guards? Why can a button hidden from the UI still be called over HTTP?
