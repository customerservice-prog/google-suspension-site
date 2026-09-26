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
3. Configure `/api/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Only paid USD 79.00 sessions tied to the owner’s case unlock it. Replayed successful events are idempotent. Also enable `charge.refunded` and `charge.dispute.created` for automatic full-refund/dispute access revocation. Dispute resolution still requires operator review.
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

## Case review improvements

The free workspace now records structured diagnostic answers and recommends route changes with an explanation. Account restrictions take priority over individual profile appeals; Ads remains separate. Decisions in the timeline produce specific next steps. Optional document-name/address comparisons surface differences for human review, not authenticity or eligibility verdicts. Case review findings are included in paid exports. Drafts track their factual basis and warn about stale content without overwriting edits. Switching cases protects unsaved changes.

`tests/recovery.test.ts` covers route precedence, unknown answers, evidence comparison, draft staleness, and decision guidance alongside the original payment-signature and recovery-content tests.

## Recovery journey and notice import

`app/journey-workspace.tsx` provides eight follow-up paths, independent profile comparisons, editable response drafts, calendar-file downloads and a de-identified process playbook. The playbook derives only the observed distinctions from the saved recovery analysis: public visibility, account restriction, management access and duplicate identity. It explicitly leaves the original suspension cause and final ownership/merge outcome unknown.

PDF.js extracts selectable text locally (5 MB, 15 pages, 5,000 characters). The PDF worker is copied from the locked dependency into public assets by the framework launcher. PDF bytes are not uploaded by this feature. Scans/screenshots need manual text entry; no OCR, LLM verdict or document authentication is claimed. Wording suggestions require explicit user route selection.

## Commerce and operator launch gate

Case Pass: USD 79, one case, 90 days from the first confirmed paid event, no auto-renewal. Basic case text, raw data export and existing document downloads remain accessible after expiration. Hosted checkout requires terms-version acceptance. Purchases are listed per owner and receipts are retrieved from Stripe. Full refunds and opened disputes revoke access; out-of-order fulfillment cannot reinstate a held payment. Partial refunds retain access. Won/withdrawn disputes require an operator review; automatic access restoration is not implemented.

Required environment: STRIPE_SECRET_KEY (prefer restricted), STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID, SITE_URL, OPERATOR_NAME, SUPPORT_EMAIL, REFUND_POLICY, LAUNCH_REVIEWED=true, PAYMENTS_ENABLED=true. OWNER_EMAIL controls the operator-only launch status; it is not published to customers. No secrets are exposed by launch checks. A nonempty setting is not evidence of live operational testing.

Listen for checkout.session.completed, checkout.session.async_payment_succeeded, charge.refunded and charge.dispute.created. Receipt delivery uses payment_intent_data.receipt_email. Complete sandbox acceptance and tax review before enabling sales. External Stripe authentication is currently unavailable; no real checkout was run.

## Data and operations

Authenticated `/api/account/export` provides an owner-scoped JSON export of all case text, evidence metadata and purchases. The import UI validates a selected case, strips paid entitlements, removes its ID/version and stages it for review as a new case. Original R2 documents are downloaded individually; this is a customer backup facility, not an automated disaster-recovery service. Hosting-level backup retention, restoration drills, external error alerting and real-browser QA remain launch tasks. Unexpected request failures produce metadata-only diagnostic logs without notice text, documents or credentials. Save, checkout and upload endpoints have owner-based rate limits. Runtime identity still relies on the hosting platform stripping user-supplied auth headers and injecting verified identity.

## Nonpayment preparation and recovery safeguards

A free pre-submission screen surfaces unfinished bracketed fields, outdated drafts, missing identity/notice, evidence checklist gaps, recommended route conflicts and profile comparison inconsistencies. It never labels a case Google-approved or predicts an outcome.

Each successful update atomically preserves the prior case text. The latest 10 prior versions are owner-scoped and can be loaded for review, then explicitly saved. Concurrent stale writes do not create usable snapshots or overwrite newer changes. Deleting a case also deletes its snapshots. These snapshots are in the same database: they protect against editing mistakes, not loss of the hosting database. Customer backups include a snapshot index; load a snapshot first to export its previous text.

`/packet` renders a structured private print/PDF view with identity, preparation review, draft, evidence/file index, record comparison, follow-ups and timeline. It requires an active pass for a real case. `/packet?example=1` is explicitly fictional. Route access is checked server-side and the packet is non-cacheable. Original evidence bytes remain separate attachments.
