# Operations activation — 26 September 2026

## Independent health checks

Railway project: ProfilePath Operations (`78d38e1b-18f2-4b5b-9492-d261e556b99d`).
Production environment: `57f3514a-acfb-4528-816d-6d93def6bf1e`.
Health service: `220fe7f8-2a05-40ec-a235-6cf65c574141`.

The runner uses `operations/Dockerfile`, `node scripts/check-health.mjs`, a 15-minute UTC cron (`*/15 * * * *`) and restart policy NEVER. There is no public Railway endpoint. Configuration is in native service settings; deprecated railway.toml is not used.

A real external execution at 2026-09-26 04:04:29 UTC returned `ProfilePath storage health is OK.` The initial request failed with HTTP 401 until the Sites authorization header used the Bearer scheme. Both runner scripts now accept either a raw token or a Bearer-prefixed value. The access value is held in Railway service variables, not source.

A successful probe is not proof of continuous uptime or alert delivery. Failure notification delivery and missed-run detection remain unverified.

## Backup credentials and remaining storage work

Generated a read-only backup token and an independent encryption passphrase. Railway shared production secrets contain PROFILEPATH_BACKUP_TOKEN and PROFILEPATH_BACKUP_PASSPHRASE. Sites holds only BACKUP_RUNNER_TOKEN_HASH. The existing database override takes precedence, including explicit revocation. The health service is not linked to the backup secrets.

No scheduled backup service, persistent external volume, or real production backup archive is active. Provisioning storage was blocked by the Railway infrastructure agent's usage limit; direct connected tools do not expose volume creation. No paid usage allowance was changed.

Once storage is available, create a separate private backup service from this repository with operations/Dockerfile, mount a durable volume at /backups, link the shared backup secrets, and set PROFILEPATH_URL, PROFILEPATH_SITE_ACCESS_TOKEN and PROFILEPATH_BACKUP_DIR=/backups. Run scripts/backup-runner.mjs with Node 24. Verify an encrypted archive and restore into fresh storage before enabling a daily schedule. Add retention and a tested failure destination. Do not reuse the health service or its 15-minute schedule for backups.

Restores explicitly insert a revoked runner-token sentinel, so a fresh database cannot revive a credential that was previously revoked. Rotate runner access after recovery.

## Launch details

The existing Sites HTTPS address remains canonical. The owner display name, existing public business support email, and a 14-day refund policy are configured. No custom domain has been selected or attached, and no legal merchant entity was inferred from the owner's separate business. Complete the merchant identity review before sales.

Stripe and payment collection remain off. Full launch review remains unset because production sign-in and operator flows were not tested through a signed-in browser. See qa/2026-09-26.md for the actual browser scope.
