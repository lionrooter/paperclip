# PRD — Normalize Lionroot Paperclip Fork

**Status:** Approved
**Date:** 2026-03-09

## Goal
Make the vendored Paperclip fork under `command-post/paperclip-server` durable and syncable: preserve Lionroot-owned OpenClaw integration, land any in-flight adapter changes, normalize the fork onto a clear fork mainline, and bring in the latest upstream Paperclip changes without losing local behavior.

## Problem
Paperclip is currently running from a vendor-sync branch with uncommitted local adapter changes. Lionroot-specific behavior exists, but it is not cleanly normalized onto the fork’s mainline. That makes future upstream syncs fragile and obscures which behavior is truly fork-owned.

## Requirements
1. Commit the current OpenClaw adapter working changes with tests.
2. Inventory Lionroot-owned Paperclip deltas versus upstream.
3. Add a maintained patch inventory document for future syncs.
4. Normalize the fork onto a canonical mainline branch.
5. Sync latest upstream Paperclip changes while preserving Lionroot patches.
6. Verify Paperclip still builds/tests for the affected surfaces.
7. Preserve the running OpenClaw adapter semantics used by Command Post.

## Non-Goals
- Refactor Command Post’s Paperclip client unless upstream drift forces it.
- Re-architect Paperclip’s plugin system.
- Upstream the OpenClaw adapter in this task.

## Success Criteria
- Paperclip fork has clean committed Lionroot changes.
- Fork has an explicit patch inventory doc.
- Canonical fork branch is current and deployable.
- Latest upstream changes are merged in.
- Targeted tests for OpenClaw adapter and affected bootstrap surfaces pass.
