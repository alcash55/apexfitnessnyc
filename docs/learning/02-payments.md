# Lesson 2: one authenticated purchase, recorded exactly once

Prerequisite: Lesson 1's current-client and current-admin checks pass. Keep the existing one-time-payment model. This project sells the owner's services, so begin with the owner's Stripe account and hosted Checkout. Stripe Connect for paying independent sellers and Stripe Billing subscriptions are separate designs, not requirements here.

## P1. Define what a purchase means

Read `lib/plans.ts`, `app/programs/programs.tsx`, `app/payments/page.tsx`, and the two Checkout handlers.

Write the invariants first:

- Only an authenticated, currently linked client may create a purchase for themselves.
- The server decides price, currency, product, and ownership. The browser sends a plan identifier, never an authoritative price or client ID.
- A Checkout Session is an attempt to pay. A redirect or a created session is not a paid order.
- Verified payment processing is safe to repeat. One payment produces one ledger effect and, if applicable, one enrollment effect.
- Refunds do not erase the original financial event. A payment and a program entitlement are related but distinct records.

Confirm what the $300/$450/$600 plans actually buy, whether they are cumulative options or installments, whether the client can buy multiple times, and when access begins/ends. Do not infer a subscription from the word month. Obtain owner-approved terms and the contractual cancellation process before taking live payments. See [contract issue #34](https://github.com/derekw0803/apexfitnessnyc/issues/34).

Your task: remove/disable anonymous `/api/checkout`, or make it use the same current-client authorization and checkout service. Keeping it hidden from Programs is insufficient. Add a direct unauthorized-request test for both paths. Protect payment confirmation pages too, not just payment creation.

## P2. Configure Stripe in the owner's sandbox

Use the owner's authorized Stripe sandbox or test environment. Organization membership in Supabase does not grant Stripe access. Have the owner grant appropriate Stripe access rather than sharing their personal login.

Set `STRIPE_SECRET_KEY` privately in `frontend/.env.local`. Use a sandbox/test key for lessons. Keep it server-only. With a full redirect to Stripe-hosted Checkout, this existing client button does not need Stripe.js or a browser publishable key. The server creates a session and returns its URL.

Set an explicit `NEXT_PUBLIC_SITE_URL=http://localhost:3000` locally. Production redirects must use the intended HTTPS Apex domain. Validate the configured base URL and do not build payment return URLs from arbitrary request headers or a caller-supplied redirect.

Inspect the installed Stripe SDK and its supported API types before changing `lib/stripe.ts`'s pinned API version. Match webhook event format/version to what your handler expects. Do not guess a new version string or suppress a mismatch with a type assertion.

Hosted Checkout reduces direct card-data handling; it does not eliminate merchant PCI responsibilities. Do not build card inputs or accept raw card numbers in an Apex endpoint. [Stripe integration security](https://docs.stripe.com/security/guide)

Checkpoint: you can identify the Stripe account/environment, the sandbox key, the intended Apex return domain, and the isolated Supabase destination without exposing any secret.

## P3. Create Checkout at a guarded server boundary

Trace `PayButton.startCheckout()` -> `POST /api/payments/checkout` -> `getPlan()` -> `getStripe().checkout.sessions.create()`.

Your implementation steps:

1. Use your current-client helper. Deny signed-out and unlinked/revoked users before calling Stripe. Derive client ownership from trusted server state.
2. Parse request JSON as `unknown`. Reject null, arrays, missing fields, invalid plan IDs, and invalid checkout-attempt identifiers. A `Record<string, unknown>` annotation does not validate input.
3. Look up the plan from the server catalog. Integer cents avoid floating-point currency arithmetic. Decide whether to keep inline `price_data` or use server-owned Stripe Price IDs; both require the browser's amount to be ignored/rejected.
4. Create a server-side pending purchase or checkout-attempt record associated with the authorized client. Define its plan/version, amount, currency, status, and stable attempt ID before calling the external API.
5. Pass a stable idempotency key in Stripe request options for retries of that same attempt. Persist enough information to recover a successful Stripe request whose response was lost. Reusing one key forever for a client/plan prevents legitimate repeat purchases; generating a new key on every network retry defeats deduplication. [Stripe request idempotency](https://docs.stripe.com/api/idempotent_requests)
6. Put only minimal internal purchase/client identifiers in Stripe metadata. Do not include health history. Client IDs here are for association, not independent authentication.
7. Return a minimal validated response. Handle invalid input, authorization denial, provider failure, and success distinctly. Bound abuse and repeated session creation on the server; disabling a button only improves UX.

A useful type exercise for the button is to describe what it can display without conflating pending and paid:

```ts
type CheckoutResult =
  { kind: "redirect"; url: string } | { kind: "error"; message: string };
```

Choose one shared response schema between handler and consumer. Validate the actual network response; TypeScript does not automatically validate `response.json()`.

Checkpoint: changing a displayed amount or sending another client's ID does not change who pays for what. Retrying one attempt does not create an extra session, while a deliberate new purchase can create a new attempt. No secret appears in the browser bundle or response.

## P4. Authenticate the webhook and keep it reachable

`app/api/stripe/webhook/route.ts` already checks the signature against the raw request text. Preserve that. Do not parse/re-serialize before signature verification, and do not require a Supabase cookie here. A forged request must fail even if it claims the payment is complete. [Stripe webhooks](https://docs.stripe.com/webhooks)

For local development, install/login to Stripe CLI in the owner's sandbox, run the application, then forward relevant events:

```sh
stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,charge.refunded --forward-to localhost:3000/api/stripe/webhook
```

The listener prints a signing secret. Put it privately in `STRIPE_WEBHOOK_SECRET` and restart the app. A deployed endpoint has its own signing secret; do not reuse the CLI secret there. Do not place either secret in this workbook or a screenshot.

Complete an actual Checkout through the authenticated page in sandbox. Generic `stripe trigger` fixtures often lack Apex metadata and the linked test client, so they do not prove this application's full path.

Keep webhook processing bounded. Either commit the small database transaction before returning success, or durably enqueue verified work before acknowledging it. Returning 200 before any durable record exists loses work; doing unbounded email or AI work before acknowledging causes retries. Do not rely on an unawaited promise surviving a serverless response.

Checkpoint: no customer cookie is needed for a valid Stripe event, an invalid signature causes no writes, and a transient persistence failure remains recoverable.

## P5. Make financial writes repeatable and transactional

Read `20260817000000_create_orders.sql`, `20260909000000_create_training_payments.sql`, and the webhook together.

The current order upsert is unique by session ID. The subsequent `training_payments.insert()` is not. Two deliveries can produce two ledger rows. A query-before-insert check alone also races under concurrency. [Bug #35](https://github.com/derekw0803/apexfitnessnyc/issues/35)

Design a new migration rather than editing already-applied migrations. Decide how the model records the server-created attempt, client, Stripe session, payment intent, event ID, amount/currency, processing state, refunds, and environment. Keep historical/manual payment rows valid. Use database uniqueness for provider identifiers and foreign keys for ownership.

Use an atomic database operation, such as a carefully permissioned Postgres function called through Supabase RPC, to apply the order and ledger effect together. Two separate Supabase HTTP queries are not one transaction. Do not make external Stripe requests while holding a database transaction open. Restrict execution of any privileged function and validate what it can update.

Match the event to the stored purchase: account/environment, internal purchase ID, client, allowed plan, expected currency/amount, and appropriate payment state. Do not reject a valid old purchase solely because today's catalog price changed. Decide explicitly whether zero-cost/discounted sessions are supported. If not, reject or flag them rather than treating every completed session as paid.

Record event receipt and processing safely. A failed event must be retryable; inserting an event ID as processed before the financial transaction succeeds can permanently skip it. A unique event ID alone also does not prove two different events cannot describe the same payment. Keep effect uniqueness at the payment/session level too.

Checkpoint: sequential duplicates, simultaneous duplicates, two event types for one payment, and a partial database failure all leave one correct ledger effect. An unrelated Stripe session cannot create a valid Apex payment.

## P6. Handle refunds, delayed methods, and order-independent delivery

`charge.refunded` currently marks any refund as fully refunded and leaves the client ledger unchanged. An older completion replay can then overwrite the order status. [Bug #36](https://github.com/derekw0803/apexfitnessnyc/issues/36)

Keep the original paid amount and the refunded amount, distinguish partial/full refunds, and show the net amount where appropriate. Associate refunds by provider IDs. Define how reconciliation works if a refund is processed before the app has recorded the original payment. Do not assume event delivery order.

If asynchronous payment methods are enabled, a completed Checkout can still be unpaid. Handle later success/failure and grant access only when the supported payment status warrants it. If you limit the first release to immediate card payments, configure that deliberately and document it. Define how expired/abandoned sessions and disputes appear in operations without inventing automatic entitlement rules.

Keep fulfillment idempotent too. Decide whether the coach manually assigns a program or verified payment creates a dated enrollment. Do not equate paying for a one-hour session with lifetime access to all programs. A refund/access decision needs an explicit business rule and an audit trail.

Checkpoint: duplicate full/partial refunds are harmless, completion replay cannot erase a refund, and the dashboard never treats provider failure as an empty payment history.

## P7. Show payment truth to the right person

`/payments?paid=1` currently displays Payment received from a query flag. `/checkout/success` retrieves Stripe's session but does not check the viewer's ownership before displaying its email/amount. Neither is an adequate private confirmation for your new authenticated flow.

Authorize the viewer first, then resolve the requested purchase through that client's server-owned records. If retrieving Stripe's session, verify its association with that same stored purchase. A Checkout session ID is not authorization. Never fetch arbitrary session IDs and display another client's details.

Render explicit states such as pending, paid, partially refunded, refunded, and unavailable. A browser redirect may beat the webhook, so pending must offer a safe refresh/recheck and support reference. The success page must not create payments or enrollments. Visiting a cancel URL alone cannot prove nothing was charged in another tab.

Checkpoint: changing `paid`, `session_id`, or a path ID cannot create payment/access or reveal another client. Closing the browser after payment still results in the correct record and fulfillment.

## P8. Promote only after the evidence exists

Use [04-verification](04-verification.md) to collect test results. For a live rollout, review migrations/backups, production auth redirects and templates, owner-approved terms, keys, HTTPS return URLs, the production Stripe endpoint and event types, and operational alerts. Keep server configuration isolated from preview deployments. Do not copy live secrets into public PRs or point learning webhooks at production Supabase.

Explain these distinctions back to yourself: checkout-attempt idempotency versus webhook-effect idempotency; authentication versus payment ownership; a financial ledger versus enrollment; a real paid event versus a convincing-looking success page.
