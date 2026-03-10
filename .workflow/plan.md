# Plan — Normalize Lionroot Paperclip Fork

**Status:** Approved
**Date:** 2026-03-09

## Steps
1. Inspect the current Paperclip fork state and identify Lionroot-owned deltas.
2. Commit the in-flight OpenClaw adapter changes with coverage.
3. Create `LIONROOT-PATCHES.md` documenting owned files, upstream patch files, and sync notes.
4. Normalize the fork to a canonical fork mainline branch.
5. Fetch and merge latest `upstream/master`, resolving conflicts by preserving documented Lionroot patches.
6. Run targeted verification for adapter behavior and affected server bootstrap surfaces.
7. Review the result and summarize the new durable state.

## Verification
- `pnpm exec vitest run packages/adapters/openclaw/src/server/execute.test.ts`
- relevant `vitest` coverage for affected bootstrap surfaces
- git status clean at the end
