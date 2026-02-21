import React, { useEffect, useMemo, useRef, useState } from "react";
import * as ReactRouter from "react-router";
const { Link, useLocation } = ReactRouter;
import {
  Home,
  Library,
  Workflow,
  History,
  BarChart3,
  User,
} from "lucide-react";

type WorkflowStatus = "idle" | "queued" | "running" | "succeeded" | "failed" | "canceled";

type WorkflowStep = {
  id: string;
  title: string;
  tool: "Prompt" | "Transform" | "Review" | "Export" | "Custom";
  notes?: string;
};

type Workflow = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  steps: WorkflowStep[];
  updatedAt: string;
};

type RunEventLevel = "info" | "warn" | "error" | "success";

type RunEvent = {
  id: string;
  ts: string;
  level: RunEventLevel;
  message: string;
};

type WorkflowRun = {
  id: string;
  workflowId: string;
  workflowName: string;
  status: WorkflowStatus;
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  events: RunEvent[];
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function statusPill(status: WorkflowStatus) {
  switch (status) {
    case "running":
      return "bg-white/10 text-white border border-white/10";
    case "queued":
      return "bg-white/10 text-white/80 border border-white/10";
    case "succeeded":
      return "bg-white/10 text-white border border-white/10";
    case "failed":
      return "bg-white/10 text-white border border-white/10";
    case "canceled":
      return "bg-white/10 text-white/80 border border-white/10";
    default:
      return "bg-white/10 text-white/70 border border-white/10";
  }
}

function levelDot(level: RunEventLevel) {
  switch (level) {
    case "success":
      return "bg-white";
    case "error":
      return "bg-white";
    case "warn":
      return "bg-white/80";
    default:
      return "bg-white/60";
  }
}

const seedWorkflows: Workflow[] = [
  {
    id: "wf_design-metrics",
    name: "Design Metrics Framework",
    description: "Turn a rough product idea into measurable product metrics and success criteria.",
    tags: ["product", "metrics", "strategy"],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    steps: [
      { id: "s1", title: "Extract goals + constraints", tool: "Prompt" },
      { id: "s2", title: "Draft north-star + input metrics", tool: "Transform" },
      { id: "s3", title: "Risk + instrumentation checklist", tool: "Review" },
      { id: "s4", title: "Export to PRD section", tool: "Export" },
    ],
  },
  {
    id: "wf_sales-email",
    name: "Sales Email Rewrite (Professional)",
    description: "Rewrite a messy outbound email into a tight, intent-driven message with variants.",
    tags: ["sales", "email", "outreach"],
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    steps: [
      { id: "s1", title: "Clarify ICP + offer", tool: "Prompt" },
      { id: "s2", title: "Rewrite v1", tool: "Transform" },
      { id: "s3", title: "Generate 2 variants", tool: "Transform" },
      { id: "s4", title: "Tone + compliance check", tool: "Review" },
    ],
  },
];

// Left Rail Navigation (matches Command Center / Prompt Library)
function LeftRail() {
  const location = useLocation();

  const navItems = [
    { path: "/app", label: "Command Center", icon: Home },
    { path: "/app/library", label: "Prompt Library", icon: Library },
    { path: "/app/workflows", label: "Workflows", icon: Workflow },
    { path: "/app/history", label: "History", icon: History },
    { path: "/app/usage", label: "Usage", icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-[#13161B] flex flex-col">
      <div className="p-6 border-b border-white/[0.06]">
        <Link to="/app" className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-black font-serif font-bold text-lg">
            P
          </div>
          <span className="font-serif font-bold text-lg text-white">PromptPilot</span>
        </Link>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          Operator Environment
        </p>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                active
                  ? "text-white bg-white/5 shadow-[inset_2px_0_0_0_rgba(255,255,255,0.8)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <Link
          to="/app/account"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            location.pathname === "/app/account"
              ? "text-white bg-white/5"
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          }`}
        >
          <User size={18} />
          Account
        </Link>
        <div className="mt-3 px-3 py-2.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
          <p className="text-xs text-gray-500 mb-1">Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Free</p>
            <Link to="/pricing" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Upgrade
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-xs text-gray-500">Extension Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkflowsPage() {
  const [tab, setTab] = useState<"workflows" | "runs">("workflows");
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const [workflows, setWorkflows] = useState<Workflow[]>(seedWorkflows);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(seedWorkflows[0]?.id ?? null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState("product, strategy");
  const [newStepsText, setNewStepsText] = useState(
    "Extract requirements\nDraft structure\nReview for clarity\nExport to doc"
  );

  const selectedWorkflow = useMemo(
    () => workflows.find((w) => w.id === selectedWorkflowId) ?? null,
    [workflows, selectedWorkflowId]
  );

  const selectedRun = useMemo(
    () => runs.find((r) => r.id === selectedRunId) ?? null,
    [runs, selectedRunId]
  );

  const allTags = useMemo(() => {
    const t = new Set<string>();
    workflows.forEach((w) => w.tags.forEach((x) => t.add(x)));
    return Array.from(t).sort();
  }, [workflows]);

  const filteredWorkflows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workflows
      .filter((w) => (tagFilter ? w.tags.includes(tagFilter) : true))
      .filter((w) => {
        if (!q) return true;
        return (
          w.name.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [workflows, query, tagFilter]);

  const filteredRuns = useMemo(() => {
    const q = query.trim().toLowerCase();
    return runs
      .filter((r) => (selectedWorkflowId ? r.workflowId === selectedWorkflowId : true))
      .filter((r) => {
        if (!q) return true;
        return r.workflowName.toLowerCase().includes(q) || r.status.includes(q);
      })
      .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
  }, [runs, query, selectedWorkflowId]);

  const streamRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!streamRef.current) return;
    streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [selectedRun?.events?.length]);

  function createWorkflow() {
    const name = newName.trim();
    if (!name) return;

    const tags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const steps = newStepsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((title, idx) => ({
        id: uid("step"),
        title,
        tool: (idx === 0 ? "Prompt" : idx === 1 ? "Transform" : idx === 2 ? "Review" : "Export") as WorkflowStep["tool"],
      }));

    const wf: Workflow = {
      id: uid("wf"),
      name,
      description: newDesc.trim() || "—",
      tags: tags.length ? tags : ["workflow"],
      steps,
      updatedAt: new Date().toISOString(),
    };

    setWorkflows((prev) => [wf, ...prev]);
    setSelectedWorkflowId(wf.id);
    setTab("workflows");
    setIsNewOpen(false);
    setNewName("");
    setNewDesc("");
  }

  function startRun(wf: Workflow) {
    const now = new Date().toISOString();
    const runId = uid("run");

    const run: WorkflowRun = {
      id: runId,
      workflowId: wf.id,
      workflowName: wf.name,
      status: "queued",
      startedAt: now,
      events: [
        { id: uid("ev"), ts: now, level: "info", message: "Queued run." },
        { id: uid("ev"), ts: now, level: "info", message: "Allocating execution context…" },
      ],
    };

    setRuns((prev) => [run, ...prev]);
    setSelectedRunId(runId);
    setTab("runs");

    const steps = wf.steps.length ? wf.steps : [{ id: "s", title: "Execute", tool: "Custom" as const }];
    const startedAtMs = Date.now();
    let i = 0;

    const timer = window.setInterval(() => {
      i += 1;
      setRuns((prev) =>
        prev.map((r) => {
          if (r.id !== runId) return r;

          const ts = new Date().toISOString();
          let status: WorkflowStatus = r.status;
          let events = r.events;

          if (r.status === "queued") {
            status = "running";
            events = [
              ...events,
              { id: uid("ev"), ts, level: "info", message: "Run started." },
              { id: uid("ev"), ts, level: "info", message: `Workflow: ${wf.name}` },
            ];
            return { ...r, status, events };
          }

          const stepIdx = Math.min(i - 1, steps.length - 1);
          const step = steps[stepIdx];

          events = [
            ...events,
            {
              id: uid("ev"),
              ts,
              level: "info",
              message: `Step ${stepIdx + 1}/${steps.length}: ${step.title}`,
            },
            {
              id: uid("ev"),
              ts,
              level: "info",
              message: `Tool: ${step.tool} • Generating output…`,
            },
          ];

          const done = i >= steps.length + 1;
          if (done) {
            const finishedAt = new Date().toISOString();
            const durationMs = Date.now() - startedAtMs;
            status = "succeeded";
            events = [
              ...events,
              { id: uid("ev"), ts: finishedAt, level: "success", message: "Run completed successfully." },
            ];
            window.clearInterval(timer);
            return { ...r, status, finishedAt, durationMs, events };
          }

          return { ...r, status: "running", events };
        })
      );
    }, 900);
  }

  return (
    <div className="min-h-screen bg-[#13161B]">
      <LeftRail />

      <div className="ml-60 min-h-screen">
        <div className="mx-auto max-w-[1400px] px-6 py-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">Workflows</h1>
              <p className="mt-1 text-sm text-gray-500">
                Build repeatable, auditable runs — with a real execution stream and history.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                onClick={() => setIsNewOpen(true)}
              >
                New workflow
              </button>
              <Link
                to="/app"
                className="rounded-xl border border-white/[0.12] bg-transparent px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Command Center
              </Link>
            </div>
          </div>

          {/* Toolbar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
            <div className="flex items-center gap-2">
              <button
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  tab === "workflows"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
                onClick={() => setTab("workflows")}
              >
                Drafts
              </button>
              <button
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  tab === "runs"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
                onClick={() => setTab("runs")}
              >
                Runs
              </button>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
              <div className="w-full max-w-md">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search workflows, tags, runs…"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-white/20"
                />
              </div>
              <select
                value={tagFilter ?? ""}
                onChange={(e) => setTagFilter(e.target.value ? e.target.value : null)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-white/20"
              >
                <option value="">All tags</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main 3-column layout */}
          <div className="mt-5 grid grid-cols-12 gap-4">
            {/* Left: list */}
            <div className="col-span-12 md:col-span-4">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="text-sm font-medium text-gray-300">
                    {tab === "workflows" ? "Workflow drafts" : "Run history"}
                  </div>
                  {selectedWorkflow && (
                    <button
                      onClick={() => startRun(selectedWorkflow)}
                      className="rounded-xl border border-white/[0.12] bg-transparent px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Run
                    </button>
                  )}
                </div>
                <div className="border-t border-white/[0.06]" />
                <div className="max-h-[68vh] overflow-auto">
                  {tab === "workflows" ? (
                    <ul className="divide-y divide-white/[0.06]">
                      {filteredWorkflows.map((w) => {
                        const active = w.id === selectedWorkflowId;
                        return (
                          <li key={w.id}>
                            <button
                              type="button"
                              className={`w-full px-4 py-3 text-left transition-colors ${
                                active ? "bg-white/5" : "hover:bg-white/5"
                              }`}
                              onClick={() => {
                                setSelectedWorkflowId(w.id);
                                setSelectedRunId(null);
                              }}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-semibold text-white">{w.name}</div>
                                  <div className="mt-1 line-clamp-2 text-xs text-gray-500">
                                    {w.description}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 shrink-0">
                                  {new Date(w.updatedAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {w.tags.slice(0, 4).map((t) => (
                                  <span
                                    key={t}
                                    className="rounded-full border border-white/[0.1] px-2 py-0.5 text-[11px] text-gray-500"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </button>
                          </li>
                        );
                      })}
                      {!filteredWorkflows.length && (
                        <div className="px-4 py-6 text-sm text-gray-500">No workflows found.</div>
                      )}
                    </ul>
                  ) : (
                    <ul className="divide-y divide-white/[0.06]">
                      {filteredRuns.map((r) => {
                        const active = r.id === selectedRunId;
                        return (
                          <li key={r.id}>
                            <button
                              type="button"
                              className={`w-full px-4 py-3 text-left transition-colors ${
                                active ? "bg-white/5" : "hover:bg-white/5"
                              }`}
                              onClick={() => setSelectedRunId(r.id)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-semibold text-white">{r.workflowName}</div>
                                  <div className="mt-1 text-xs text-gray-500">
                                    Started {formatTime(r.startedAt)}
                                    {r.finishedAt ? ` • Finished ${formatTime(r.finishedAt)}` : ""}
                                  </div>
                                </div>
                                <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] ${statusPill(r.status)}`}>
                                  {r.status}
                                </span>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                      {!filteredRuns.length && (
                        <div className="px-4 py-6 text-sm text-gray-500">
                          No runs yet. Select a workflow and click Run.
                        </div>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Middle: stream/timeline */}
            <div className="col-span-12 md:col-span-5">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                <div className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-300">Execution stream</div>
                  <div className="mt-1 text-xs text-gray-500">
                    Real operators want: visibility, auditability, and fast iteration.
                  </div>
                </div>
                <div className="border-t border-white/[0.06]" />
                <div ref={streamRef} className="max-h-[68vh] overflow-auto px-4 py-3">
                  {selectedRun ? (
                    <div className="space-y-2">
                      {selectedRun.events.map((ev) => (
                        <div key={ev.id} className="flex items-start gap-3">
                          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-white/20">
                            <div className={`h-full w-full rounded-full ${levelDot(ev.level)}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-[11px] text-gray-500">{formatTime(ev.ts)}</div>
                              <div className="text-[11px] text-gray-500">{ev.level}</div>
                            </div>
                            <div className="mt-0.5 text-sm text-gray-200">{ev.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-sm text-gray-500">
                      Select a run to view the stream. This is where the “professional” feeling comes from — it’s not
                      magic, it’s traceability.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: details */}
            <div className="col-span-12 md:col-span-3">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <div className="text-sm font-medium text-gray-300">Details</div>
                <div className="mt-3 space-y-4">
                  {tab === "workflows" && selectedWorkflow ? (
                    <>
                      <div>
                        <div className="text-xs text-gray-500">Workflow</div>
                        <div className="mt-1 text-sm font-semibold text-white">{selectedWorkflow.name}</div>
                        <div className="mt-1 text-xs text-gray-500">{selectedWorkflow.description}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Steps</div>
                        <ol className="mt-2 space-y-2">
                          {selectedWorkflow.steps.map((s, idx) => (
                            <li
                              key={s.id}
                              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-xs text-gray-500">Step {idx + 1}</div>
                                <div className="text-[11px] text-gray-500">{s.tool}</div>
                              </div>
                              <div className="mt-1 text-sm text-white">{s.title}</div>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <button
                        type="button"
                        onClick={() => startRun(selectedWorkflow)}
                        className="w-full rounded-xl border border-white/[0.12] bg-white/10 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/15 transition-colors"
                      >
                        Run workflow
                      </button>
                    </>
                  ) : tab === "runs" && selectedRun ? (
                    <>
                      <div>
                        <div className="text-xs text-gray-500">Run</div>
                        <div className="mt-1 text-sm font-semibold text-white">{selectedRun.workflowName}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`rounded-full px-2 py-1 text-[11px] ${statusPill(selectedRun.status)}`}>
                            {selectedRun.status}
                          </span>
                          <div className="text-xs text-gray-500">
                            {selectedRun.durationMs ? `${Math.round(selectedRun.durationMs / 1000)}s` : "—"}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                        <div className="text-xs text-gray-500">Started</div>
                        <div className="mt-1 text-sm text-white">
                          {new Date(selectedRun.startedAt).toLocaleString()}
                        </div>
                        <div className="mt-3 text-xs text-gray-500">Finished</div>
                        <div className="mt-1 text-sm text-white">
                          {selectedRun.finishedAt
                            ? new Date(selectedRun.finishedAt).toLocaleString()
                            : "—"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-sm text-gray-500">
                      Select a workflow or run to see details.
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <div className="text-sm font-medium text-gray-300">Operator notes</div>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Next iteration: real “Run output” artifact pane, step inputs / variable bindings, templates → save as
                  workflow, run export / share.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New workflow modal */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#1a1d24] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-white">New workflow</div>
                <div className="mt-1 text-xs text-gray-500">
                  Keep it simple: name, tags, steps. We’ll add variables + execution config next.
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => setIsNewOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-6">
                <label className="text-xs text-gray-500">Name</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-white/20"
                  placeholder="e.g. PRD Builder (Professional)"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="text-xs text-gray-500">Tags (comma separated)</label>
                <input
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-white/20"
                  placeholder="product, strategy, tech"
                />
              </div>
              <div className="col-span-12">
                <label className="text-xs text-gray-500">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-white/20 resize-none"
                  rows={3}
                  placeholder="What does this workflow do?"
                />
              </div>
              <div className="col-span-12">
                <label className="text-xs text-gray-500">Steps (one per line)</label>
                <textarea
                  value={newStepsText}
                  onChange={(e) => setNewStepsText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-white/20 resize-none"
                  rows={6}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-white/[0.12] bg-transparent px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                onClick={() => setIsNewOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/25 transition-colors"
                onClick={createWorkflow}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
