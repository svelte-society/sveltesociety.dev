# Cloudflare Tunnel rate-limit correction

## Scope and risk

Restore browsing during crawler bursts while retaining per-visitor and global crawler limits. This is a high-risk request-admission change across Nginx and Bun. The original checkout was behind upstream main; this branch starts at upstream `2e790b88`. Coolify staging and production branch mappings have been inspected; staging has been deployed and checked through the public tunnel. Existing Cloudflare header trust assumes the origin is reachable only through trusted ingress.

## Current program model

`cloudflared → ops/nginx.conf → src/hooks/request_guard.ts → services/auth/routes`.
Nginx and the application already prefer `CF-Connecting-IP` to the immediate peer address. Nginx default access logs still display the peer. Per-visitor state lives in Nginx shared zones and in the application's process-local map. Both layers apply a shared crawler allowance, but browser GET queries usually omit `Origin` and fail the existing exemption. The application also charges exempt requests to that shared allowance, unlike Nginx.

## Proposed program shape

- Update `src/hooks/request_guard.ts`: recognize same-origin GET/HEAD with Fetch Metadata, exclude exempt requests from the shared counter, retain visitor limits.
- Update `ops/nginx.conf`: recognize the same browser read case; explicitly forward the chosen visitor address; log the chosen visitor, peer and limiter outcomes.
- Add `src/hooks/request_guard.test.ts` and `tests/gateway/rate-limits.test.ts`: verify actual admission behavior, including shared-peer visitor isolation and crawler saturation.
- Add focused CI and a gateway test command so both layers remain covered.

Control flow remains `identify visitor → per-visitor limits → classify request → crawler-only global limit → resolve`. Existing HTML, same-origin mutation and webhook exemptions remain in place. No limiter thresholds change and no database or public API changes are needed.

## Contracts and invariants

`request_guard: Handle` remains the public hook. Cloudflare visitor addresses stay authoritative; arbitrary X-Forwarded-For input is not added as a fallback. Empty CF headers use the existing peer fallback consistently with Nginx. Same-origin read recognition requires GET/HEAD, `Sec-Fetch-Site: same-origin`, and an absent or matching Origin. It is a load-management heuristic, not authentication; per-visitor limits always apply. Only non-exempt requests consume the shared app budget. State cleanup must run even when traffic is being rejected. No awaits occur between checking and incrementing a counter. Denials remain HTTP 429 with Retry-After and must not be cached.

## Vertical slices and verification

1. Reproduce visitor isolation and browser-query denial through the real application hook with a controlled clock; fix the exemption and counter accounting; verify abusive visitors and distributed non-browser floods remain limited.
2. Exercise the real Nginx configuration against a local lightweight upstream: distinct CF IPs from one peer, abusive client, saturated crawler budget, browser reads and preserved exclusions. Inspect forwarding and access logs.
3. Review both layers together and run focused tests, formatting, and available project checks. CI must execute the hook and gateway regressions.

## Risks, rollout and recovery

Removing all global limits was considered but would discard protection against distributed crawler traffic. Merely raising thresholds would postpone the same browser failure. Fetch Metadata remains spoofable by non-browser clients, as are the existing HTML and Origin heuristics; this patch preserves per-visitor enforcement and does not claim to replace edge bot protection.

Deploy by rebuilding both application and gateway images; the Nginx config is baked into `ops/Dockerfile`. Check logs for distinct `client_ip` values, populated CF headers, and whether 429s originate in Nginx or upstream. If CF headers are missing, inspect Cloudflare's Remove visitor IP headers transform and intervening proxies; do not trust arbitrary X-Forwarded-For to conceal the configuration fault. Keep the gateway reachable only through trusted ingress and do not expose Bun directly. Roll back both images together to the prior release if needed. No data migration or recovery is required. Cloudflare account settings have not been inspected. Staging gateway logs confirm populated visitor headers and distinct visitor addresses behind the shared proxy peer.

References: [Cloudflare headers](https://developers.cloudflare.com/fundamentals/reference/http-headers/), [browser Origin behavior](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin), [Nginx empty limit keys](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html).

## Verification results

- Application guard: 22 regression tests pass. Against the previous hook, 9 tests fail, including missing-Origin browser reads and exempt-traffic accounting.
- Gateway: the actual Nginx 1.27.5 binary serves the production configuration with only fixture addresses and paths substituted. Visitor isolation, flood behavior, connection limits, forwarded headers, access logs and upstream/local 429 behavior pass. The original config fails the visitor/browser regression scenarios.
- Changed TypeScript files pass a focused strict check. Independent code review found no blocking issues.
- The repository-wide `bun run check` is not clean: it reports unrelated component/service/test typing issues and missing local environment/dependencies. This change does not repair the broader baseline.
- Coolify successfully rebuilt both staging services from the fix. Public browser checks covered the home page, library listing/detail, search, and client-side navigation without console errors. Gateway logs show distinct visitor addresses sharing one proxy peer, and successful remote queries/navigation data.
- A bounded staging-only burst returned 20 successful responses and 30 HTTP 429 responses, with `Retry-After: 1` and `Cache-Control: no-store`; requests succeeded again after two seconds.
- Full browser-suite validation exposed a test-environment collision: parallel browser contexts all used the localhost peer address and consumed one visitor budget. Tests should simulate distinct Cloudflare visitor identities while retaining the production guard.
- These checks establish the browser-admission defect and staging recovery; they do not establish that every historical production symptom had the same cause.
