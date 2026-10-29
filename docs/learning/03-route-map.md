# Lesson 3: every page and endpoint

This map covers every `app/**/page.tsx` and `app/**/route.ts` present when the workbook was written. Access describes the intended design. The exercise text calls out gaps in the current implementation; these comments are not implemented guards.

Read the matching `LEARNING` JSDoc block in each file. Public page wrappers often delegate rendering to a neighboring component; follow that import before changing the UI. All paths below are relative to `frontend/`.

## Pages

### Home: `app/page.tsx`

Intended access: Public. Start at P1.

Marketing remains public. Its CTA should lead to Login and then Payments for invited clients, or to a clear inquiry path for prospects. Never create a Checkout Session or expose a Stripe/Supabase secret while rendering this page.

Check: Follow Start Now as a signed-out visitor; you must not reach a working anonymous purchase endpoint.

### About Me: `app/about-me/page.tsx`

Intended access: Public. Start at P1.

This is a public trust page, not a payment processor. Keep credential and AI claims consistent with delivered services and lead purchase intent to the authenticated flow. Client photos or payment examples need permission and must not expose customer records.

Check: The page loads signed out and contains no private data or direct anonymous Checkout action.

### The Apex Way: `app/apexway/page.tsx`

Intended access: Public. Start at P1.

Explain the service publicly, but do not imply that browsing this page grants program access. Its CTA must join the same authenticated purchase path; advertised AI and performance claims do not establish implemented entitlements.

Check: Its CTA cannot bypass the current-client check at payment creation.

### Training: `app/training/page.tsx`

Intended access: Public. Start at P1.

Curriculum previews can be public. Actual member materials require the library's current enrollment check. Buying one product should not silently authorize every training or nutrition resource.

Check: A signed-out visitor can read the preview but cannot retrieve private member content.

### Programs: `app/programs/page.tsx`

Intended access: Public. Start at P1.

The rendered component is informational and has no checkout button today. Keep product descriptions and pricing consistent with the server catalog, then send invited clients to Login/Payments. Hiding the old anonymous API does not secure it; disable or guard that handler separately.

Check: Request both checkout APIs directly while signed out; neither may create a session.

### Contact: `app/contact/page.tsx`

Intended access: Public. Start at A1.

An inquiry is not an authenticated client or a paid order. Keep the form usable publicly without taking card or medical details, and keep its consent/notification behavior aligned with the privacy notice. Membership must be created through the trusted invitation/linking process.

Check: Submitting a synthetic inquiry never creates an enrollment or grants payment-history access.

### Links: `app/links/page.tsx`

Intended access: Public. Start at P1.

Social links are navigation into the same public-programs/authenticated-payments funnel. They must not expose session-specific Checkout URLs, customer IDs, or payment history. A saved link is not proof of ownership.

Check: Follow all purchase-related links signed out and verify the server still requires auth.

### Privacy: `app/privacy/page.tsx`

Intended access: Public. Start at P1.

Keep this notice available before Login and Checkout. Describe actual Supabase, Stripe, and notification data flows, access/deletion procedures, and retention. Authenticated payment features must not introduce undeclared health-data sharing or tracking.

Check: The notice is reachable signed out and its statements match the implemented flows.

### Terms: `app/terms/page.tsx`

Intended access: Public. Start at P1.

Terms must remain readable before purchase. Define the offer, total price, access duration, cancellation/refund process, and any results commitment with the owner. A future checkout exercise records the accepted version rather than treating this page visit as acceptance.

Check: A buyer can review the applicable version before payment, and a stored purchase references that version.

### Login: `app/login/page.tsx`

Intended access: Public entry. Start at A4.

The login form and server redirect already exist. Validate the untrusted next destination before both the already-signed-in redirect and browser navigation. Use current authorization on the destination page; a valid login alone does not prove a client link.

Check: Test internal return paths, external/protocol-relative next values, wrong credentials, and missing config.

### Account: `app/account/page.tsx`

Intended access: Current linked client. Start at A5.

This page reads clients by the JWT client_id today. Resolve the current client from the verified auth identity before the privileged query, then return only the displayed profile fields. Handle an unlinked account separately from a database error.

Check: Client A cannot view B, and A's old token cannot view the profile after unlinking.

### Change password: `app/account/password/page.tsx`

Intended access: Authenticated identity. Start at A4.

Proxy currently provides the navigation guard. Add/verify a server identity check on this entry point and use Supabase Auth for the password change, never a custom password column. Require suitable recent authentication according to the chosen Auth settings.

Check: A signed-out request cannot use the password form; a valid user can change and reauthenticate.

### Set password: `app/account/set-password/page.tsx`

Intended access: Verified invite/recovery session. Start at A4.

The current comment assumes a callback already established a session; prove that assumption for the actual email template. Check identity here and handle expired/reused links explicitly. Setting a password does not establish client/admin membership by itself.

Check: Test invite and recovery links separately, including opening an invite in a fresh browser.

### Delete login: `app/account/delete/page.tsx`

Intended access: Authenticated identity. Start at A5.

This page describes login deactivation, not erasure of financial/health records. Require a verified identity and ensure the POST route independently verifies it. Define reauthentication and revocation behavior without deleting legally retained business records.

Check: After deactivation, old tokens cannot read client data or create a payment; privacy erasure stays distinct.

### Dashboard: `app/dashboard/page.tsx`

Intended access: Current linked client. Start at A5.

The dashboard currently scopes privileged reads with the JWT client_id. Use the current-client helper before program, health, and payment queries, distinguish query failure from empty history, and display only that client's data. A payment should grant only the defined enrollment.

Check: Test two clients, an unlinked user, revocation with an old token, and a failed payment-history query.

### Exercise library: `app/library/page.tsx`

Intended access: Current client and enrollment, or current admin. Start at A5.

getLibraryAccess checks enrollment but trusts the token's admin flag and client ID. Re-check current membership before reading the catalog. Authorization must reflect program access rules, not the mere existence of a payment or a successful redirect.

Check: Unlinking or ending enrollment denies content with an already-issued token; a removed admin is also denied.

### Payments: `app/payments/page.tsx`

Intended access: Current linked client. Start at P7.

This page has a session check but reads history using the token client_id and trusts paid=1 for confirmation. Use current-client authorization, scope every purchase lookup, and render verified pending/paid/refunded/error states. A browser flag must not claim payment success.

Check: Client A cannot view B's purchase, and adding paid=1 cannot confirm or create any payment.

### Client roster: `app/admin/page.tsx`

Intended access: Current admin. Start at A5.

isAdminClaims is only a token snapshot. Perform a current database admin check before the service-role roster query. Do not leak customer names, contacts, or search results before authorization, and make database failure visible without exposing internals.

Check: A removed admin's existing token cannot read the roster; an ordinary client cannot enumerate customers.

### Admin client detail: `app/admin/clients/[id]/page.tsx`

Intended access: Current admin. Start at A6.

This page reads health, contacts, payments, and enrollment after only a JWT admin check. Re-check current admin membership first. Validate the target client for invite/revoke actions and keep those API handlers independently guarded; a hidden button grants no protection.

Check: Test removed-admin access to a known client URL and invite failures without sending real invitations.

### Admin expenses: `app/admin/expenses/page.tsx`

Intended access: Current admin. Start at A5.

Financial expense data requires current admin membership before the service-role read. The form and row-action handlers must have their own authorization. Do not present a failed database read as an empty ledger.

Check: An ordinary or removed admin cannot read or mutate expenses, including by direct API calls.

### Checkout success: `app/checkout/success/page.tsx`

Intended access: Current purchase owner. Start at P7.

This legacy page retrieves a Stripe session from session_id without viewer ownership. Require current auth and resolve the purchase through the client's server-owned records before displaying details. Success rendering must never create a payment or enrollment; the webhook can arrive later.

Check: Changing session_id cannot reveal another client's email/amount; arriving before the webhook renders pending.

### Checkout cancelled: `app/checkout/cancelled/page.tsx`

Intended access: Current client for private purchase details. Start at P7.

A generic cancellation page can be public only if it reveals no purchase details. For the authenticated flow, guard private context and route back to Payments. A cancel URL visit cannot prove no charge occurred in another tab, so verify any financial assertion.

Check: Opening the URL directly changes no payment/access state and makes no unsupported no-charge promise.

## HTTP endpoints

Browser calls require their own authorization even when a page already checked access. Webhooks and email callbacks are verified external entry points. For modules with several verbs, apply the requirement to each exported handler.

### `app/api/payments/checkout/route.ts`

Start at P3. Current checks cover a signed token and a client_id claim, not the live client link. Resolve current ownership before Stripe, validate JSON as unknown, price from getPlan, and persist one recoverable checkout attempt with a stable Stripe idempotency key. Derive metadata and return URLs on the server.

Check: Signed-out/revoked clients cause zero Stripe calls; a retried attempt creates one session and tampered price/client fields never control the charge.

### `app/api/checkout/route.ts`

Start at P1. This is the legacy anonymous route and conflicts with the requested authenticated-only design. Disable it or delegate to the same current-client checkout service as /api/payments/checkout. Do not preserve anonymous access merely because the public Programs UI no longer calls it.

Check: A direct signed-out POST cannot create Stripe Checkout, and both API entry points have explicit ownership tests.

### `app/api/stripe/webhook/route.ts`

Start at P5. Stripe authenticates with its signature, not a customer's cookie. Preserve raw-body verification. The order upsert is replay-safe only for that table; the training_payments insert can duplicate. Validate the stored purchase association and use an atomic, uniquely constrained financial write before durable acknowledgement.

Check: Invalid signature writes nothing; duplicate/concurrent events, partial failures, and refunds produce one correct ledger effect without depending on delivery order.

### `app/auth/callback/route.ts`

Start at A4. This public entry must establish a verified session before protected navigation. The existing handler accepts only code; inspect actual invite/recovery email templates and support the chosen verified exchange, including token_hash/OTP if configured. Validate internal next destinations and preserve response cookies.

Check: Expired/reused links fail safely, invite and recovery work independently, and no supplied redirect or email grants membership.

### `app/api/auth/logout/route.ts`

Start at A4. The server route currently signs out and redirects. Choose local/global session scope, handle errors, use an appropriate post-POST redirect, and verify private routes deny access afterward. Supabase SSR cookies are not necessarily HttpOnly; do not teach that as the reason to use this handler.

Check: A logout completes with correct cookies and navigation; old sessions follow the explicitly tested revocation policy.

### `app/api/account/update/route.ts`

Start at A5. Current ownership comes from the JWT client_id. Verify the current auth-user-to-client link, validate object-shaped JSON and allowed profile fields, and enforce the relationship again in the write query. Never accept auth_user_id, role, or another client ID from the form.

Check: Old/revoked tokens and cross-client fields cannot mutate records; invalid JSON returns a controlled client error.

### `app/api/account/delete/route.ts`

Start at A5. This deletes the authenticated login, not all business records. Verify current identity and the intended recent-auth policy before deletion. Ensure data reads/writes no longer trust an old still-valid client claim after unlinking; preserve the separate privacy-request process.

Check: An old token cannot access the dashboard or create Checkout after successful deactivation.

### `app/api/contact/route.ts`

Start at A1. Public inquiries intentionally remain outside member auth. Keep server validation, minimize data sent to notifications, enforce any relied-on consent at the server, and bound abuse. Do not connect an inquiry email to an existing client's billing authority.

Check: A synthetic lead cannot read records, become an admin, create a linked account, or change payment state.

### `app/api/admin/clients/route.ts`

Start at A5. The API already re-checks database admin membership. Preserve that independent guard even if Proxy and admin pages are protected, and handle infrastructure failure without returning customer data. Keep the response minimal for the roster.

Check: A direct GET from an ordinary or removed admin receives no client list.

### `app/api/admin/clients/[id]/route.ts`

Start at A5. GET and PATCH already re-check admin membership. Validate the target and allowed update schema. Changing the business email must not silently reassign auth identity, role, enrollment, or payment ownership; those require their explicit workflows.

Check: Unauthorized GET/PATCH fail, null/array bodies are rejected, and profile edits cannot change protected relationship fields.

### `app/api/admin/clients/[id]/invite/route.ts`

Start at A6. An Auth invitation and a client-link update are separate systems. Verify a real eligible client before sending, then confirm exactly one row links the intended identity. Define retry/existing-email/link-failure recovery without deleting unrelated identities or trusting profile metadata.

Check: A missing/already-linked target sends no unintended invite, and a failed linking step leaves a recoverable state with no privilege escalation.

### `app/api/admin/clients/[id]/revoke/route.ts`

Start at A5. This removes portal login while retaining business history. Keep the current database admin guard and verify that subsequent private routes check the live relationship. Deleting Auth state alone does not make every issued JWT immediately disappear.

Check: Using an existing client token after revocation cannot read data or create a purchase; payment history remains retained.

### `app/api/admin/clients/[id]/purge/route.ts`

Start at A5. This irreversible erasure path differs from revoking login. Keep admin authorization and explicit confirmation, review retention rules, and account for the database-delete/Auth-delete partial failure. Never test on a real client or assume all external copies are deleted.

Check: Only a current admin can purge a synthetic client; failures are recoverable and retained financial obligations are handled explicitly.

### `app/api/admin/expenses/route.ts`

Start at A5. Expense creation/listing is private administrative work, not proof of a customer payment. Preserve current admin checks, validate amount/date/category at the boundary, and keep manual expenses separate from Stripe-derived records.

Check: Direct unauthorized requests fail and malformed amounts cannot create financial records.

### `app/api/admin/expenses/[id]/route.ts`

Start at A5. Every update/delete must independently verify current admin membership and the target record. Validate allowed fields and record operational failures clearly. UI row controls and noindex tags do not authorize mutations.

Check: A removed admin cannot alter an expense and invalid targets produce controlled outcomes.

## Shared code to trace

- `app/layout.tsx` and `components/Nav.tsx`: display session-aware navigation. The Nav is presentation; it is not authorization.
- `lib/auth.ts`: token verification versus live role/client checks. This is the first implementation seam in A5.
- `lib/supabase/{config,browser,server,middleware}.ts`: project configuration and cookie/session transport.
- `lib/supabaseAdmin.ts`: privileged database client. Put authorization before its sensitive queries.
- `lib/libraryAccess.ts`: program entitlement, distinct from login or a successful payment.
- `lib/plans.ts`: server-authoritative catalog. The current page may display it, but the checkout handler must resolve it again.
- `lib/stripe.ts`: server key, SDK API version, and canonical return URL.
- `app/payments/pay-button.tsx`: UI request and redirect; the server remains authoritative.
- `app/login/login-form.tsx` and `app/account/password-form.tsx`: browser Auth operations, never privileged database operations.
- `app/account/account-form.tsx`, `delete/delete-form.tsx`, and admin client forms: user interaction only; their HTTP handlers enforce access.
- `backend/supabase/migrations/`: schema history. Add a new migration for new invariants; do not rewrite applied migrations.
- `backend/src/routes/contact.ts`: legacy unauthenticated administrative contact routes. Do not deploy this server for the payment lessons.

## Intended HTTP outcomes

Use 401 for a missing/invalid identity on protected APIs, 403 or the project's deliberate 404 policy for a disallowed identity, and 400 for invalid request data. Infrastructure/provider failures are server errors, not empty history. For page requests, use safe internal login redirects or a deliberate access-denied view. A webhook's invalid signature is a verification failure, not a login redirect. Pick consistent response contracts and test them.
