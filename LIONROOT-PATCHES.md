# LIONROOT-PATCHES.md

Maintained Lionroot delta for the Paperclip fork under `command-post/paperclip-server`.

## 1. Lionroot-owned surface

These files implement the OpenClaw adapter and should be treated as Lionroot-owned. Upstream does not provide this adapter.

- `packages/adapters/openclaw/package.json`
- `packages/adapters/openclaw/tsconfig.json`
- `packages/adapters/openclaw/src/index.ts`
- `packages/adapters/openclaw/src/cli/format-event.ts`
- `packages/adapters/openclaw/src/cli/index.ts`
- `packages/adapters/openclaw/src/server/execute.ts`
- `packages/adapters/openclaw/src/server/index.ts`
- `packages/adapters/openclaw/src/server/parse.ts`
- `packages/adapters/openclaw/src/server/test.ts`
- `packages/adapters/openclaw/src/server/execute.test.ts`
- `packages/adapters/openclaw/src/ui/build-config.ts`
- `packages/adapters/openclaw/src/ui/index.ts`
- `packages/adapters/openclaw/src/ui/parse-stdout.ts`

### Current adapter semantics to preserve

- Webhook payloads include a top-level `message` field.
- Webhook payloads include a top-level merged `context` object for hook consumers.
- Hook payload context includes `source: "paperclip"` and the computed wake metadata.
- `payloadTemplate.context` can extend the top-level `context`, but computed wake metadata wins on collisions.
- The original nested `paperclip` payload remains present for consumers that depend on the full Paperclip context envelope.

## 2. Structural wiring added by Lionroot

These upstream-owned files must continue to register the OpenClaw adapter in CLI/server/UI surfaces.

- `cli/package.json`
- `cli/src/adapters/registry.ts`
- `packages/shared/src/constants.ts`
- `pnpm-lock.yaml`
- `server/package.json`
- `server/src/adapters/registry.ts`
- `ui/package.json`
- `ui/src/adapters/openclaw/config-fields.tsx`
- `ui/src/adapters/openclaw/index.ts`
- `ui/src/adapters/registry.ts`
- `ui/src/components/AgentProperties.tsx`
- `ui/src/components/agent-config-primitives.tsx`
- `ui/src/pages/Agents.tsx`
- `ui/src/pages/OrgChart.tsx`
- `vitest.config.ts`

## 3. Upstream patch files

These are small targeted patches in upstream-owned files and are the most likely merge-conflict points during sync.

### `Dockerfile`
- Keep the Lionroot Docker workaround that skips the server image build step and uses the pre-built `server/dist` output until upstream container builds are confirmed stable for the deployment path you use.

### `server/src/index.ts`
- Preserve the Lionroot loopback behavior that treats `0.0.0.0` as loopback in `isLoopbackHost(...)`. This keeps private/local deployment behavior working when Paperclip binds on all interfaces.

## 4. Mainline policy

- Fork mainline should be the deployable Lionroot branch, not an ad hoc vendor-sync branch.
- Future upstream syncs should merge `upstream/master` into the fork mainline and resolve only the documented files above.
- If `pnpm-lock.yaml` conflicts, regenerate it from a clean install rather than hand-editing.
