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

PDF.js extracts selectable text locally; Tesseract.js 7 reads scanned PDFs and JPG/PNG photos locally in the browser. Limits: 10 MB, 15 PDF pages, eight OCR pages, six-megapixel render canvas, 60,000 extracted characters. Users review/correct text and explicitly apply at most 5,000 characters to a notice. English OCR assets are self-hosted from locked dependencies, loaded only on demand. Recognition confidence and name/address/date/privacy wording checks are review aids, never authenticity or Google eligibility verdicts. Wording suggestions require explicit user route selection.

## Commerce and operator launch gate

Case Pass: USD 79, one case, 90 days from the first confirmed paid event, no auto-renewal. Basic case text, raw data export and existing document downloads remain accessible after expiration. Hosted checkout requires terms-version acceptance. Purchases are listed per owner and receipts are retrieved from Stripe. Full refunds and opened disputes revoke access; out-of-order fulfillment cannot reinstate a held payment. Partial refunds retain access. Won/withdrawn disputes require an operator review; automatic access restoration is not implemented.

Required environment: STRIPE_SECRET_KEY (prefer restricted), STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID, SITE_URL and PAYMENTS_ENABLED=true. Operator identity, support contact, refund policy, terms review and browser review are saved through Operator workspace → Launch settings; legacy OPERATOR_NAME, SUPPORT_EMAIL, REFUND_POLICY and LAUNCH_REVIEWED environment values supply initial defaults. OWNER_EMAIL controls the operator-only launch status; it is not published to customers. No secrets are exposed by launch checks. A nonempty setting is not evidence of live operational testing.

Listen for checkout.session.completed, checkout.session.async_payment_succeeded, charge.refunded and charge.dispute.created. Receipt delivery uses payment_intent_data.receipt_email. Complete sandbox acceptance and tax review before enabling sales. External Stripe authentication is currently unavailable; no real checkout was run.

## Data and operations

Authenticated `/api/account/export` provides an owner-scoped JSON export of all case text, evidence metadata and purchases. The import UI validates a selected case, strips paid entitlements, removes its ID/version and stages it for review as a new case. Original R2 documents are downloaded individually; this is a customer backup facility, not an automated disaster-recovery service. Use the separate operator system backup for complete records and original documents. External operations activation is tracked separately from the application. The browser QA scope and remaining authentication checks are recorded in docs/qa/2026-09-26.md. Unexpected request failures produce metadata-only diagnostic logs without notice text, documents or credentials. Save, checkout and upload endpoints have owner-based rate limits. Runtime identity still relies on the hosting platform stripping user-supplied auth headers and injecting verified identity.

## Nonpayment preparation and recovery safeguards

A free pre-submission screen surfaces unfinished bracketed fields, outdated drafts, missing identity/notice, evidence checklist gaps, recommended route conflicts and profile comparison inconsistencies. It never labels a case Google-approved or predicts an outcome.

Each successful update atomically preserves the prior case text. The latest 10 prior versions are owner-scoped and can be loaded for review, then explicitly saved. Concurrent stale writes do not create usable snapshots or overwrite newer changes. Deleting a case also deletes its snapshots. These snapshots are in the same database: they protect against editing mistakes, not loss of the hosting database. Customer backups include a snapshot index with retained prior text and support conversations.

`/packet` renders a structured private print/PDF view with identity, preparation review, draft, evidence/file index, record comparison, follow-ups and timeline. It requires an active pass for a real case. `/packet?example=1` is explicitly fictional. Route access is checked server-side and the packet is non-cacheable. Original evidence bytes remain separate attachments.


## Customer support and administration

Customers open requests from Contact support, attach a case reference, and optionally allow the operator to read the current saved case text. Revoking sharing immediately removes that operator view; original files are not shared through tickets. Each customer can read/reply to/resolve/delete their own threads. Operators read and reply from Operator workspace, filter requests and keep internal customer notes. No email notification or representation service is implied. No messages were sent to real customers during implementation.

`OWNER_EMAIL` remains the sole operator authority. Account email is recorded from verified hosting identity when a case is saved. The operator customer directory lists at most 100 accounts per search; support lists at most 100 requests. Existing accounts without a directory entry appear without a guessed email until their next save. Operator controls do not grant or change paid access.

## System backups and disaster recovery

Operator workspace → Backups & health creates an encrypted `.ppbackup` download containing case data, ownership IDs, saved versions, document metadata and original R2 bytes, support threads, customers, payment/hold records and launch settings. PBKDF2-SHA256 (600,000 iterations) derives an AES-256-GCM key with random salt/IV; compressed content is authenticated. Keep the passphrase separately. Runtime secrets, runner-token hashes, transient limits and diagnostics are deliberately excluded. Restore SQL explicitly revokes runner access, including the BACKUP_RUNNER_TOKEN_HASH environment fallback. Rotate the backup credential after recovery; never allow a restored database to reactivate an old credential.

The export reads the database tables in one D1 batch, downloads immutable original objects with size/SHA-256 checks, then compares a second manifest fingerprint. Any business-record change or missing document fails the export. Retry during quiet usage; this is an optimistic consistent-copy mechanism, not a native database snapshot. Limits are 5,000 rows per table, 25 MB of manifest text, 100 MB of original documents and 160 MB unpacked total. Arrange database-native streaming backup before exceeding these limits; do not silently omit records. The latest 10 retained case snapshots are included, not an unlimited version history.

A copy only becomes independent when stored outside the hosting account. Downloading in the operator UI is manual. To schedule independent copies, use `scripts/backup-runner.mjs` on a separate runner; secrets are supplied through environment variables:

- `PROFILEPATH_URL`: actual deployed HTTPS origin.
- `PROFILEPATH_BACKUP_TOKEN`: create in the operator panel; all-record read-only access. Only its hash is stored server-side; rotate/revoke through the panel.
- `PROFILEPATH_BACKUP_PASSPHRASE`: at least 16 characters; strong random passphrase recommended.
- `PROFILEPATH_SITE_ACCESS_TOKEN`: additional hosting credential needed while the audience is private. Never make it public in Git or source.
- `PROFILEPATH_BACKUP_DIR`: private output folder (default `private-backups`).

The repository's external operations workflow is **disabled until** the repository variable `PROFILEPATH_OPERATIONS_ENABLED=true` is set with the URL variable and required secrets. Once enabled, it checks health every 15 minutes and stores an encrypted daily archive as a GitHub Actions artifact retained for 14 days. Treat artifact retention as a ceiling and arrange longer retention separately if required. A skipped workflow is not operational monitoring. This GitHub workflow has not been activated and no backup artifact has been stored there. A separate Railway operations service can run the same health checker using the root railway.toml and operations/Dockerfile; runtime credentials belong in Railway variables, never in source. Inspect the external deployment logs to confirm actual execution. No external alert delivery has been verified. GitHub Actions failure notifications must be enabled by the owner and tested with a deliberate failed health check; no automatic messages are sent by application code.

Recovery procedure:

1. Obtain the externally stored archive and separately held passphrase. Run `node --experimental-strip-types scripts/restore-backup.mjs ARCHIVE NEW_PRIVATE_DIRECTORY` with `PROFILEPATH_BACKUP_PASSPHRASE` in the environment. The output directory must not exist. Large text cells are rebuilt with bounded SQL statements to respect D1 import limits. Checksums, file counts and authenticated encryption are verified before preparing files.
2. Provision **fresh** D1/R2 storage, apply this commit's Drizzle migrations, then import the generated `restore.sql`. Upload each file from `objects/` using its existing ID as the object key, preserving MIME information from `manifest.json`. Do not restore into live/nonempty tables.
3. Reconfigure runtime secrets separately, including operator identity and authentication integration. Keep `PAYMENTS_ENABLED=false`. Case paid flags are reset in recovery SQL; reconcile all payment/refund/dispute records before enabling any entitlements or sales.
4. Compare row counts and file hashes, test sign-in for separate owners, case history, support isolation and evidence downloads. Reapply deletion requests after the backup timestamp before any cutover. Old independent archives must follow the operator's deletion/retention policy.
5. Change hosting bindings only after validation. Keep the previous system available for rollback. A production cutover and real external restore drill have not been run from this environment.

## Monitoring and verification

`/api/health` probes required DB schema and an R2 read, returns only status/time, and emits HTTP 503 on failure. `scripts/check-health.mjs` is an independent runner. Unexpected application failures return 503 with a random reference; stored diagnostics allow only fixed categories and keep 30 days. The operator view summarizes seven days. Hosting-provider logs can still include request metadata.

Verification commands: `pnpm exec tsc --noEmit`, `node --experimental-strip-types --test tests/recovery.test.ts tests/operations.test.ts`, build, then `node tests/runtime-smoke.mjs`. The runtime suite uses isolated D1/R2, not production customer data. `tests/ocr-smoke.mjs` checks actual local OCR and packaged engine assets. Real-browser layout, hydration and the full sign-in flow are not covered by these checks. The required Sites control-browser skill is unavailable in the current environment, so rendered desktop/mobile QA remains outstanding.
