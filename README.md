# ProfilePath

A working Business Profile recovery product: free diagnosis and a proposed **$79 one-time Case Pass**. Eight recovery routes distinguish account restrictions, profile suspensions, lost ownership, verification, missing reviews, duplicate records, denied appeals and Google Ads issues.

## Included

- Responsive guided diagnosis, tailored plan, task completion and fictional interactive example.
- Private authenticated cases with persistent D1 storage, optimistic concurrency and owner-scoped queries.
- Evidence checklist plus private PDF/JPG/PNG R2 uploads (paid cases, 10 MB/file, 30 files/case, signature validation).
- Editable factual drafts, printable drafts and a server-authorized case packet download.
- Case timeline, support reference, saved cases and case/file deletion.
- Official-source library, transparent pricing and preview privacy/service scope.
- Stripe-hosted Checkout implementation and signed webhook fulfillment. Client input cannot grant paid access; the success URL never grants access.
- WebMCP read-only case-status tool, feature-detected.

## Current launch state

Private working preview. **No payments are collected.** Paid features can be explored through the clearly labeled fictional example. Live case saving uses the hosting platform’s ChatGPT identity; local managed preview has no mock authenticated user. Do not deploy behind a proxy that permits visitors to forge `oai-authenticated-user-*` headers.

### Before enabling paid sales

1. Establish the operator’s support contact, customer-facing refund terms and applicable tax treatment. Update the visible service terms; the present terms correctly state purchases are closed.
2. Create a separate Stripe sandbox and a one-time USD 79.00 Price. Store a least-privilege restricted key as `STRIPE_SECRET_KEY`, Price as `STRIPE_PRICE_ID`, webhook secret as `STRIPE_WEBHOOK_SECRET`, canonical HTTPS origin as `SITE_URL`. Never commit secrets.
3. Configure `/api/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Only paid USD 79.00 sessions tied to the owner’s case unlock it. Replayed successful events are idempotent. Refunds/disputes require operator handling; automated revocation is not implemented yet.
4. Test full checkout, delayed payment, signature rejection, return-before-webhook, duplicate events, owner isolation and document lifecycle against the deployed sandbox. No live payment test has been performed.
5. After the purchase terms and verification are complete, set `PAYMENTS_ENABLED=true` and the equivalent live Stripe settings. Price validation rejects a price that differs from the displayed $79. Confirm tax configuration before any collection. No automatic-tax setting is assumed.
6. Set the desired public access policy and domain. The current deployment remains private. Authentication is Sign in with ChatGPT; no Google OAuth or password collection is implemented.

## Development

Uses React 19, Vinext App Router, TypeScript, Tailwind, Radix/Shadcn primitives and Cloudflare D1/R2. Source of truth is this repository. Hosting metadata is in `.openai/hosting.json`.

```
pnpm install
pnpm exec tsc --noEmit
node --experimental-strip-types --test tests/recovery.test.ts
pnpm db:generate
pnpm build
```

Generate migrations from `db/schema.ts`; committed migrations are applied by Sites hosting. Do not change already-applied migrations. The schema stores case JSON and upload metadata separately from document bytes.

Guidance is rules-based and sourced, not a live Google diagnosis or an LLM-generated policy verdict. No emails or appeals are sent automatically. The sample business is fictional. Do not put private founder records into source or fixtures.

## Validation boundaries

Compile/build and domain/security tests are included. Browser visual verification and live Stripe checkout must be completed in a compatible testing environment. The platform must strip and securely inject authentication headers. The product does not guarantee reinstatement, recover a fixed review count, bypass restrictions, or infer Google’s internal suspension reason.
