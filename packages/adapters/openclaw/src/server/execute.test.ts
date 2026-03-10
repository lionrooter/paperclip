import { afterEach, describe, expect, it, vi } from "vitest";
import { execute } from "./execute.js";

describe("openclaw execute", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends a default message and top-level context for hook consumers", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      return new Response(JSON.stringify({ ok: true, runId: "remote-run-1" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await execute({
      config: {
        url: "https://example.test/gateway/hooks/agent",
        webhookAuthHeader: "Bearer secret",
      },
      runId: "run-1",
      agent: {
        id: "agent-1",
        companyId: "company-1",
        name: "Cody",
        adapterType: "openclaw",
        adapterConfig: {},
      },
      context: {
        issueId: "issue-7",
        wakeReason: "approval-needed",
        issueIds: ["issue-7", "issue-8"],
      },
      onLog: vi.fn(async () => {}),
      onMeta: vi.fn(async () => {}),
    } as never);

    expect(result.exitCode).toBe(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [_url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(body.message).toContain("Paperclip heartbeat wake");
    expect(body.context).toEqual({
      source: "paperclip",
      runId: "run-1",
      agentId: "agent-1",
      companyId: "company-1",
      taskId: "issue-7",
      issueId: "issue-7",
      wakeReason: "approval-needed",
      issueIds: ["issue-7", "issue-8"],
    });
    expect(body.paperclip).toBeTruthy();
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer secret");
  });

  it("merges payloadTemplate context and preserves explicit message", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    await execute({
      config: {
        url: "https://example.test/gateway/hooks/agent",
        payloadTemplate: {
          message: "Custom wake",
          context: {
            extra: { repo: "lionroot-openclaw" },
            taskId: "static-task",
          },
        },
      },
      runId: "run-2",
      agent: {
        id: "agent-2",
        companyId: "company-2",
        name: "Leo",
        adapterType: "openclaw",
        adapterConfig: {},
      },
      context: {
        taskId: "task-2",
      },
      onLog: vi.fn(async () => {}),
      onMeta: vi.fn(async () => {}),
    } as never);

    const [_url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(body.message).toBe("Custom wake");
    expect(body.context).toEqual({
      extra: { repo: "lionroot-openclaw" },
      taskId: "task-2",
      source: "paperclip",
      runId: "run-2",
      agentId: "agent-2",
      companyId: "company-2",
      issueIds: [],
    });
  });
});
