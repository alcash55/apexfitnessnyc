# Learn auth and payments by completing Apex

This workbook is for Alex to implement. The accompanying `LEARNING` JSDoc blocks explain the code's current behavior and the next exercise. They do not implement the fixes or make the existing payment flow ready for production.

Start with [01: Supabase and auth](01-supabase-auth.md). Finish its checkpoints before [02: authenticated payments](02-payments.md). Use [03: every page and endpoint](03-route-map.md) to connect the files, and [04: verification](04-verification.md) to prove each change.

## What already exists

This is a Next.js 16.2.1 App Router application in `frontend/`, with Supabase migrations and an older Express application in `backend/`. The active Next.js server owns the payment endpoints. You do not need to run the old Express server to use Stripe.

The owner has already started the integration:

- Supabase browser and server clients, cookie refresh, password login, account pages, admin invitations, and a custom JWT hook exist.
- `/payments` calls `/api/payments/checkout`. It checks a session and prices a selected program on the server.
- Stripe-hosted Checkout collects the card. A signed webhook records an order and sometimes a client payment.
- Migrations define clients, admins, orders, payment history, program enrollment, and protected health data.

Important work remains. Current authorization can outlive revocation, an old anonymous checkout remains, payment retries can duplicate ledger entries, refunds are incomplete, and a URL flag can display a false confirmation. Existing tests do not prove a real Supabase login or Stripe payment.

## The owner's project and your learning environment

Alex confirmed the owner's project is `derekw0803's Project`, ref `syjbeztrbuezlmzmspfz`, in organization `leeezrivjdgkwgqrxatf`. Its project URL is `https://syjbeztrbuezlmzmspfz.supabase.co`. These identifiers are not credentials.

At workbook creation, the CLI could list this project, but this checkout was not linked to it and `.env`, `frontend/.env.local`, `frontend/.env`, and `backend/.env` were absent. The project's remote schema, enabled auth hook, email templates, and deployed environment values have not been verified. Membership in the organization does not configure this application automatically.

Identify the owner's production project, then use a separate Supabase development project in that organization or a local Supabase stack for exercises. A Stripe sandbox alone does not isolate Supabase: a sandbox webhook can still write fake payments into a production database if you configure that URL/key pair. Do not test with client health records.

## The complete request path

1. The owner invites a client and links `auth.users.id` to `clients.auth_user_id`.
2. The client completes the invitation and signs in. Supabase issues access and refresh tokens; the SSR integration maintains cookies.
3. The server verifies identity and checks the current client link before returning private pages or creating Checkout.
4. The browser sends a program ID and a checkout-attempt identifier. The server decides the client, price, currency, and destination URLs.
5. The server creates a Stripe Checkout Session. The client enters card details on Stripe's page.
6. Stripe sends a signed event to `/api/stripe/webhook`. The handler verifies it and safely records the payment, even when delivered more than once.
7. A client sees their own verified payment status and receives the promised program through a defined fulfillment process.

The browser return and webhook can arrive in either order. Either can be retried. The webhook may arrive after the client closes the browser.

## What "behind auth" means here

Keep marketing pages, Login, and the invitation/recovery callback reachable without an existing session. Protect member pages, payment creation, private payment confirmations, and all customer data on the server.

Stripe's webhook is an intentional exception. Stripe cannot send the customer's Supabase cookie. Authenticate that request using its signature and endpoint signing secret. Do not redirect it to Login. Stripe-hosted Checkout is external and uses a session URL; do not treat possession of that URL as permission to read Apex customer data. [Stripe webhook authentication](https://docs.stripe.com/webhooks)

## Read TypeScript as a set of contracts

- `unknown` means incoming data still needs validation. `as SomeType` changes what the compiler believes; it does not validate JSON, a JWT field, or a database row.
- A discriminated union such as `kind: 'allowed'` gives the caller an explicit case to handle. Avoid an optional `clientId` that callers can accidentally use before authorization.
- `Promise<T>` says what an asynchronous function eventually produces. A rejected operation is not the same as a successful query with no rows.
- A React `'use client'` component runs browser code. It may start a request and display a price, but cannot protect a secret or authorize a payment.
- A Route Handler is an HTTP entry point. Every caller can bypass your button and send a request to it directly.
- `@param`, `@returns`, and `@remarks` in JSDoc document a contract. `LEARNING` describes an exercise. Neither enforces behavior at runtime.

Use your editor's hover and Go to definition on `getSessionClaims`, `getDb`, `getPlan`, and `getStripe`. Trace each caller before editing. Search all annotations with `rg -n 'LEARNING' frontend`.

For the language details, read the official [TypeScript narrowing chapter](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) alongside the `ClientAccess` exercise and the [JSDoc reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) alongside the annotated helpers. Learn why the compiler can narrow an explicit `kind` case but cannot make an unchecked type assertion safe.

## Work in small lessons

For each lesson, write down the invariant, add a test that demonstrates its current failure, implement the smallest change, and explain the result in your own words. Example invariant: "After unlinking this login, an old valid token cannot create Checkout for that client."

Create a lesson implementation branch from `docs/auth-payments-workbook` while its PR is open, or from your fork's `dev` after the workbook is merged. This workbook branch contains documentation and comments only. Do not close the audit issues just because these instructions exist. The exercises correspond mainly to upstream [#35](https://github.com/derekw0803/apexfitnessnyc/issues/35), [#36](https://github.com/derekw0803/apexfitnessnyc/issues/36), [#37](https://github.com/derekw0803/apexfitnessnyc/issues/37), and [#41](https://github.com/derekw0803/apexfitnessnyc/issues/41).
