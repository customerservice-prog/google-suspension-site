FROM node:24-alpine
WORKDIR /app
COPY scripts/check-health.mjs /app/scripts/check-health.mjs
COPY scripts/backup-runner.mjs /app/scripts/backup-runner.mjs
COPY lib/backup-crypto.ts /app/lib/backup-crypto.ts
CMD ["node", "scripts/check-health.mjs"]
