# Security Policy & Credential Management

## Credential Rotation History

| Date | Action | Systems Affected |
| :--- | :--- | :--- |
| **2026-08-17** | **INCIDENT: Two credentials leaked in `change-fk.js` (root) and `.opencode/mcp-servers/change-fk.js` committed to public repo. Files deleted; tokens MUST be rotated.** | Supabase DB2 (`jbqjipwanfsxyqkfrrpx`) — Management API token (`sbp_...`) + service role key (`sb_secret_...`) |
| **2026-08-14** | Full rotation of all 4 database credentials post-git-history-rewrite | Supabase DB1, Supabase DB2, Neon DB1, Neon DB2 |
| **2026-08-14** | Vercel access token rotated | Vercel project deployment |
| **2026-08-14** | MCP server credentials updated to read from `siliconpath-credentials.txt` + `frontend/.env.local` only | `.opencode/mcp-servers/*` |
| **2026-08-07** | Git history force-rewritten (`git filter-branch` + force-push) to purge 20+ hardcoded secrets | All historic commits; old HEAD `078c59a` |
| **2026-08-07** | Supabase service role keys rotated (both projects) | `aqauempuwmbizqoaolop`, `jbqjipwanfsxyqkfrrpx` |
| **2026-08-07** | Neon API keys rotated (both projects) | `plain-glade-52224468`, `jolly-haze-11306362` |
| **2026-08-07** | Vercel token rotated | `vcp_...[REVOKED-2026-08-07]` |
| **2026-08-07** | Deleted 19 QA scripts + `multi-db.ts` + `test_neon.js` containing hardcoded credentials | Repository cleanup |

**Next scheduled rotation**: 2026-11-14 (quarterly) or immediately upon any suspected exposure.

---

## Secret Management Policy

### ���� NEVER DO
- **Hardcode secrets in source code** — not in scripts, not in tests, not in config files committed to git
- **Commit `.env`, `.env.local`, `.env.production`, or any `*.local` files** — these are gitignored for a reason
- **Store secrets in `siliconpath-credentials.txt` or similar reference files** — use only for manual `.env.local` population during initial setup
- **Share secrets via chat, email, or AI agent conversations** — use platform secret stores (Vercel Project Settings → Environment Variables, Supabase Dashboard → Settings → API)

### �� ALWAYS DO
- **Read secrets from environment variables** — `process.env.VAR_NAME` in code
- **Use platform secret stores**:
  - Vercel: Project Settings → Environment Variables (Production/Preview/Development scopes)
  - Supabase: Dashboard → Settings → API (anon key, service role key)
  - Neon: Dashboard → Connection Details
  - GitHub Actions: Repository Settings → Secrets and Variables → Actions
- **Rotate credentials quarterly** or immediately after any exposure
- **Use least-privilege keys**: anon keys for client, service role keys only in server/API routes
- **Audit `.gitignore`** — ensure `.env*`, `*.local`, `siliconpath-credentials.txt`, `SECRETS.md` are listed

### ��� Secret Detection
- **Pre-commit**: `git-secrets` / `truffleHog` patterns in `.github/workflows/security-scan.yml`
- **CI**: `gitleaks` scan on every PR
- **Manual**: `grep -r "sk-\|sbp_\|napi_\|vcp_\|re_\|ghp_" --include="*.ts" --include="*.js" .` before commit

---

## Supply Chain Security

### Dependency Policy
- **Pin exact versions** in `package-lock.json` (committed)
- **Audit weekly**: `npm audit --workspace=frontend --workspace=backend/api --workspace=backend/ai-gateway --workspace=backend/server`
- **Allow-list** in `package.json`: `overrides` for transitive deps with known CVEs
- **No `npm install` with `--legacy-peer-deps`** unless explicitly documented why

### Container Security
- **Multi-stage Dockerfiles** — build stage separate from runtime (no dev deps in final image)
- **Non-root user** in final stage (`USER nodejs`)
- **Distroless/Alpine base** where possible
- **Scan**: `trivy image <image>:<tag>` before push

---

## Incident Response

### If a Secret is Exposed
1. **Immediately rotate** the exposed credential in its platform (Supabase/Vercel/Neon/AWS/Groq/etc.)
2. **Update** the corresponding environment variable in Vercel/Project settings
3. **Redeploy** affected services (Vercel: trigger new deployment; Kubernetes: rollout restart)
4. **Audit access logs** for anomalous usage (Supabase: Logs → API; Vercel: Function Logs)
5. **Document** in this file under "Credential Rotation History" with date and systems affected
6. **Notify** team via secure channel (not email/chat if the secret was posted there)

### If Git History Contains Secrets
1. **Force-rewrite history**: `git filter-branch --force --index-filter "git rm --cached --ignore-unmatch <file>" --prune-empty --tag-name-filter cat -- --all`
2. **Force-push**: `git push origin --force --all && git push origin --force --tags`
3. **Notify all collaborators** to `git fetch origin && git reset --hard origin/main` (or re-clone)
4. **Rotate ALL credentials** that were in the rewritten history (assume compromised)

---

## Environment Variable Reference

The application reads exactly three environment variables (see `src/lib/supabase/`).

| Variable | Scope | Source | Rotation |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | All | Supabase Dashboard | Quarterly |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Supabase Dashboard | Quarterly |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Supabase Dashboard | Quarterly |

There is no production backend, admin API, cron, or AI-gateway layer in this repository.

---

## Security Checklist for Contributors

- [ ] No secrets in committed files (run `grep` check before commit)
- [ ] `.env.local` not committed (verify `git status`)
- [ ] All API routes use `createClient()` from `@/lib/supabase/server` (not hardcoded URLs/keys)
- [ ] Service role keys only in server-side code (`route.ts`, `lib/*`, never in components)
- [ ] Admin routes protected by `ADMIN_PASSWORD` / `ADMIN_HMAC_SECRET`
- [ ] Cron endpoints protected by `CRON_SECRET`
- [ ] Rate limiting on auth/AI/public-write endpoints
- [ ] CSP headers set in `middleware.ts`
- [ ] Dependency audit passed (`npm audit` clean or documented overrides)

---

## Reporting Security Issues

**Do not file public GitHub issues for security vulnerabilities.**

Use GitHub Security Advisories private reporting.

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We aim to acknowledge within 24 hours and patch within 72 hours for critical issues.