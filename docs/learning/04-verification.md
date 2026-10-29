# Lesson 4: prove the boundaries

Run each lesson's checks before starting the next one. Use synthetic admin/client identities, an isolated Supabase database, and the owner's authorized Stripe sandbox. Do not put full JWTs, secrets, email links, card details, or customer records in test output.

## First exercise to implement

Start with A1 through A4 to establish a working test login. Then implement A5's current-client/current-admin checks before editing Stripe. The smallest meaningful first failing test uses an already-issued token after removing the client link and expects the next private request to be denied.

Keep a learning log with four lines for each change: the current behavior, the invariant you want, the test that proves it, and what you changed. Explain why the check belongs on the server. Ask for review of one lesson-sized diff at a time.

## Existing project commands

Run from `frontend/`:

```sh
npm test
npm run build
npm run test:e2e
```

The Vitest suite covers mocked route/UI logic. It does not establish remote schema, Auth configuration, actual email delivery, or Stripe account setup. The Playwright workflow intentionally starts with Supabase auth config blank and is signed out. Keep it for public-page regressions, but add a separate authenticated integration workflow for the lesson. Never make the existing public test suite depend on production keys.

Before this workbook, the audit observed 109 passing unit tests and a browser run with 15 passes and five screenshot failures. Some reference text still says Pricing rather than Programs. Do not update screenshots to hide unrelated failures. Report them separately and preserve the existing appearance while learning payment logic.

## Auth evidence

- [ ] Public pages load without a login. Protected APIs reject direct signed-out requests.
- [ ] The chosen project URLs/keys match, schema/migration history is understood, and the custom hook is enabled in the chosen environment.
- [ ] A synthetic admin can invite/link a synthetic client; an ordinary user cannot invite or assign roles.
- [ ] Invitation completion and password recovery each work, including fresh-browser invite, expired link, and reused link cases.
- [ ] External/protocol-relative `next` values do not navigate off the trusted site.
- [ ] Reloading a private page retains the correct session; token refresh preserves final response cookies and necessary private cache headers.
- [ ] Client A cannot retrieve or update client B through pages, direct APIs, or altered payloads.
- [ ] Unlinking A denies the next private operation using A's existing token, including payment creation and library access.
- [ ] Removing an admin denies sensitive page reads and writes with the existing token.
- [ ] Logout/deactivation has the documented effect, and login deactivation does not silently erase financial records.
- [ ] A broken authorization lookup fails closed and displays an appropriate error rather than empty history.
- [ ] A browser/public-key database client cannot read protected tables. Privileged keys cannot be imported into Client Components.

## Checkout evidence

- [ ] Both checkout endpoints deny anonymous users; no unused anonymous path remains.
- [ ] Only a currently linked client can create their own purchase. A supplied different client ID is rejected or ignored as non-authoritative.
- [ ] Unknown plan, null/array JSON, and malformed attempt ID return controlled errors without calling Stripe.
- [ ] A tampered browser amount/currency cannot change the server charge.
- [ ] Two retries of one checkout attempt produce one session. A deliberate new attempt can produce another session.
- [ ] Test declines and additional card authentication work without recording a successful payment prematurely.
- [ ] All return URLs use the configured environment, never a caller's arbitrary redirect.

Use Stripe's [official testing page](https://docs.stripe.com/testing) for test payment values in hosted Checkout. Never enter real card data in a test environment. Do not perform load testing against Stripe to prove your own rate limiter.

## Webhook and ledger evidence

- [ ] A forged event or changed raw body fails signature verification and writes nothing.
- [ ] A valid sandbox webhook succeeds without customer cookies and without a login redirect.
- [ ] The event's environment and purchase association match the stored purchase; unrelated sessions do not create client records.
- [ ] Sequential and concurrent duplicates produce one payment effect. Two different event IDs for the same payment do not double-credit it.
- [ ] Failure between financial writes rolls back or remains recoverable; retry completes exactly once.
- [ ] A webhook arrives even when the browser never loads the return page.
- [ ] The return page can show pending before webhook persistence, then resolves correctly.
- [ ] Partial refund, full refund, repeated refund, and out-of-order completion/refund preserve correct original/refunded/net amounts.
- [ ] Delayed methods either have later success/failure handling or are explicitly disabled for this release.
- [ ] Fulfillment happens once under the defined product rules. Paying for a session does not grant unrelated programs.
- [ ] Provider/database failures are observable through non-sensitive IDs and a responsible owner can reconcile them.

Do not treat a mocked Stripe SDK call or a generic CLI fixture as proof of the full journey. Complete at least one authenticated sandbox Checkout against the isolated database. Compare provider IDs and amounts privately across the app and Stripe Dashboard.

## Ownership and display evidence

- [ ] Appending `paid=1` never confirms payment or grants access.
- [ ] Changing a session/purchase ID cannot reveal another client's email, receipt, or amount.
- [ ] Direct success/cancel URL visits change no financial state.
- [ ] Member history distinguishes pending, paid, partial/full refund, and unavailable states according to the chosen design.
- [ ] Sensitive responses are not shared across authenticated users through server/CDN caches.

## When this is ready for the owner

Provide the exact commit, test results, intended migrations, expected environment names, verified Auth redirects/email templates, Stripe endpoint/event configuration, rollback/reconciliation plan, and who handles failures and cancellations. Separate code review from a live rollout. A documented exercise or a passing mocked suite does not close the audit issue.
