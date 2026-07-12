import { o as __toESM } from "../_runtime.mjs";
import { n as require_react, t as Ft } from "../_libs/monaco-editor__react+react.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AnimatePresence, n as useTransform, r as useMotionValue, t as animate } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as Check, a as Terminal, c as OctagonAlert, d as FolderTree, f as FileCodeCorner, g as ChevronDown, h as Copy, i as Timer, l as LoaderCircle, m as Database, n as TriangleAlert, o as Shield, p as ExternalLink, r as Trash2, s as ShieldCheck, t as Zap, u as Github, v as BookOpen, y as Activity } from "../_libs/lucide-react.mjs";
import { t as loader } from "../_libs/@monaco-editor/loader+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Omo0gGQx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Header() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.header, {
		initial: {
			opacity: 0,
			y: -8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .4 },
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
				className: "h-6 w-6 text-white",
				strokeWidth: 2.25
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-slate-50",
					children: "SecureLens"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-indigo-300",
					children: "v1.0"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-slate-400",
				children: "AI-Assisted Secure Code Auditor"
			})]
		})]
	});
}
var demos = [
	{
		key: "sql",
		label: "SQL Injection",
		icon: Database
	},
	{
		key: "command",
		label: "Command Injection",
		icon: Terminal
	},
	{
		key: "path",
		label: "Path Traversal",
		icon: FolderTree
	}
];
function DemoButtons({ onLoad, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-3 gap-2",
		children: demos.map(({ key, label, icon: Icon }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
			type: "button",
			disabled,
			onClick: () => onLoad(key),
			initial: {
				opacity: 0,
				y: 6
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				delay: .05 * i,
				duration: .3
			},
			whileHover: { y: -1 },
			className: "group flex items-center justify-center gap-2 rounded-lg border border-[#21262d] bg-slate-900/60 px-3 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-indigo-500/40 hover:bg-slate-900 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: label
			})]
		}, key))
	});
}
function CodeEditor({ value, onChange, disabled }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		loader.init().then(() => setReady(true)).catch(() => setReady(false));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex-1 overflow-hidden rounded-xl border border-[#21262d] bg-[#0b1020]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-[#21262d] bg-slate-950/60 px-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-red-500/70" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-amber-500/70" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-500/70" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] uppercase tracking-wider text-slate-500",
					children: "audit.py — python"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] text-slate-500",
					children: [value.split("\n").length, " lines"]
				})
			]
		}), ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ft, {
			height: "calc(100% - 33px)",
			defaultLanguage: "python",
			language: "python",
			theme: "vs-dark",
			value,
			onChange: (v) => onChange(v ?? ""),
			options: {
				readOnly: disabled,
				fontFamily: "'Fira Code', ui-monospace, SFMono-Regular, monospace",
				fontLigatures: true,
				fontSize: 13,
				lineNumbers: "on",
				minimap: { enabled: false },
				scrollBeyondLastLine: false,
				renderLineHighlight: "gutter",
				padding: {
					top: 12,
					bottom: 12
				},
				smoothScrolling: true,
				cursorBlinking: "smooth",
				tabSize: 4
			}
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value,
			onChange: (e) => onChange(e.target.value),
			disabled,
			spellCheck: false,
			placeholder: "Paste Python code here for security auditing...",
			className: "h-[calc(100%-33px)] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-slate-200 outline-none placeholder:text-slate-600",
			style: { fontFamily: "'Fira Code', ui-monospace, monospace" }
		})]
	});
}
var STAGES = [
	"Parsing Python Code",
	"Building Abstract Syntax Tree",
	"Detecting Security Vulnerabilities",
	"Retrieving OWASP & CWE Knowledge",
	"Generating AI Explanation",
	"Security Report Ready"
];
function PipelineLoader({ running, finished }) {
	const [stage, setStage] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!running) {
			setStage(0);
			return;
		}
		setStage(0);
		const total = STAGES.length - 1;
		const interval = setInterval(() => {
			setStage((s) => s < total - 1 ? s + 1 : s);
		}, 700);
		return () => clearInterval(interval);
	}, [running]);
	(0, import_react.useEffect)(() => {
		if (finished) setStage(STAGES.length - 1);
	}, [finished]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-center justify-center px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 8
			},
			animate: {
				opacity: 1,
				y: 0
			},
			className: "mb-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold text-slate-100",
				children: "Running Security Audit"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-slate-400",
				children: "SecureLens is analyzing your code through a deterministic pipeline."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md space-y-2",
			children: STAGES.map((label, i) => {
				const isDone = i < stage || finished && i < STAGES.length - 1;
				const isActive = i === stage && !finished;
				const isFinal = i === STAGES.length - 1 && finished;
				const idle = i > stage && !finished;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						x: -12
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: i * .08 },
					className: `flex items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors ${isFinal ? "border-emerald-500/40 bg-emerald-500/10" : isActive ? "border-indigo-500/50 bg-indigo-500/10" : isDone ? "border-[#21262d] bg-slate-900/60" : "border-[#21262d] bg-slate-950/40"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-6 w-6 shrink-0 items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							mode: "wait",
							children: isFinal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { scale: 0 },
								animate: { scale: 1 },
								className: "flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "h-3.5 w-3.5 text-white",
									strokeWidth: 3
								})
							}, "final") : isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { scale: 0 },
								animate: { scale: 1 },
								className: "flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/90",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "h-3 w-3 text-white",
									strokeWidth: 3
								})
							}, "done") : isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-indigo-400" })
							}, "active") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, { className: "h-2 w-2 rounded-full bg-slate-700" }, "idle")
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-sm ${isFinal ? "font-medium text-emerald-300" : isActive ? "font-medium text-slate-100" : isDone ? "text-slate-300" : idle ? "text-slate-500" : "text-slate-400"}`,
						children: label
					})]
				}, label);
			})
		})]
	});
}
function EmptyState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "flex h-full flex-col items-center justify-center px-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full bg-indigo-500/10 blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex h-24 w-24 items-center justify-center rounded-2xl border border-[#21262d] bg-gradient-to-br from-slate-900 to-slate-950 shadow-inner",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
						className: "h-11 w-11 text-indigo-400",
						strokeWidth: 1.75
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold text-slate-100",
				children: "No Security Scan Yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-slate-400",
				children: "Paste Python code or load a demo example and start your security audit."
			})
		]
	});
}
function SafeScanState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			scale: .95
		},
		animate: {
			opacity: 1,
			scale: 1
		},
		transition: { duration: .4 },
		className: "flex h-full flex-col items-center justify-center px-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full bg-emerald-500/15 blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex h-24 w-24 items-center justify-center rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-slate-950 shadow-inner",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						className: "h-12 w-12 text-emerald-400",
						strokeWidth: 1.75
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold text-emerald-300",
				children: "No vulnerabilities detected."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-slate-400",
				children: "Your code passed the security audit."
			})
		]
	});
}
function useCount(target, duration = .9) {
	const mv = useMotionValue(0);
	const [display, setDisplay] = (0, import_react.useState)("0");
	const rounded = useTransform(mv, (v) => Number.isInteger(target) ? Math.round(v).toString() : v.toFixed(2));
	(0, import_react.useEffect)(() => {
		const controls = animate(mv, target, {
			duration,
			ease: "easeOut"
		});
		const unsub = rounded.on("change", (v) => setDisplay(v));
		return () => {
			controls.stop();
			unsub();
		};
	}, [
		target,
		duration,
		mv,
		rounded
	]);
	return display;
}
function riskTone(score) {
	if (score >= 75) return {
		color: "text-red-400",
		ring: "ring-red-500/20",
		bar: "bg-red-500"
	};
	if (score >= 50) return {
		color: "text-orange-400",
		ring: "ring-orange-500/20",
		bar: "bg-orange-500"
	};
	if (score >= 25) return {
		color: "text-amber-400",
		ring: "ring-amber-500/20",
		bar: "bg-amber-500"
	};
	return {
		color: "text-emerald-400",
		ring: "ring-emerald-500/20",
		bar: "bg-emerald-500"
	};
}
function MetricsCards({ riskScore, totalFindings, linesScanned, executionMs }) {
	const risk = useCount(riskScore);
	const total = useCount(totalFindings);
	const lines = useCount(linesScanned);
	const exec = useCount(executionMs);
	const tone = riskTone(riskScore);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
		children: [
			{
				label: "Risk Score",
				value: risk,
				suffix: "/100",
				icon: TriangleAlert,
				color: tone.color,
				ring: tone.ring,
				progress: Math.min(100, Math.max(0, riskScore)),
				bar: tone.bar
			},
			{
				label: "Total Findings",
				value: total,
				icon: Activity,
				color: "text-indigo-400",
				ring: "ring-indigo-500/20"
			},
			{
				label: "Lines Scanned",
				value: lines,
				icon: FileCodeCorner,
				color: "text-slate-300",
				ring: "ring-slate-500/20"
			},
			{
				label: "Execution Time",
				value: exec,
				suffix: "ms",
				icon: Timer,
				color: "text-slate-300",
				ring: "ring-slate-500/20"
			}
		].map((c, i) => {
			const Icon = c.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					delay: .05 * i,
					duration: .3
				},
				className: `rounded-xl border border-[#21262d] bg-slate-900/60 p-4 ring-1 ${c.ring}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium uppercase tracking-wider text-slate-500",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${c.color}` })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-2 font-mono text-2xl font-semibold tabular-nums ${c.color}`,
						children: [c.value, c.suffix && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-0.5 text-sm text-slate-500",
							children: c.suffix
						})]
					}),
					"progress" in c && c.progress !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-1 overflow-hidden rounded-full bg-slate-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: { width: 0 },
							animate: { width: `${c.progress}%` },
							transition: {
								duration: .9,
								ease: "easeOut"
							},
							className: `h-full ${c.bar}`
						})
					})
				]
			}, c.label);
		})
	});
}
function CodeBlock({ code, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: `overflow-x-auto rounded-lg border ${tone === "danger" ? "bg-red-950/30 border-red-900/40" : "bg-emerald-950/25 border-emerald-900/40"} p-3 font-mono text-[12px] leading-relaxed text-slate-200`,
		style: { fontFamily: "'Fira Code', ui-monospace, monospace" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code })
	});
}
function CodeComparison({ vulnerable, secure }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	if (!vulnerable && !secure) return null;
	const copy = async () => {
		if (!secure) return;
		try {
			await navigator.clipboard.writeText(secure);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 md:grid-cols-2",
		children: [vulnerable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-red-400",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✕" }), " Vulnerable Code"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
			code: vulnerable,
			tone: "danger"
		})] }), secure && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1.5 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-emerald-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" }), " Secure Fix"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: copy,
				className: "flex items-center gap-1 rounded-md border border-[#21262d] bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					initial: false,
					children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
						initial: {
							opacity: 0,
							y: -3
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: 3
						},
						className: "flex items-center gap-1 text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "h-3 w-3",
							strokeWidth: 3
						}), " Copied"]
					}, "copied") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " Copy Fix"]
					}, "copy")
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
			code: secure,
			tone: "safe"
		})] })]
	});
}
var SEV_STYLES = {
	critical: {
		bg: "bg-red-500/10",
		text: "text-red-400",
		border: "border-red-500/30",
		dot: "bg-red-500",
		label: "Critical"
	},
	high: {
		bg: "bg-orange-500/10",
		text: "text-orange-400",
		border: "border-orange-500/30",
		dot: "bg-orange-500",
		label: "High"
	},
	medium: {
		bg: "bg-amber-500/10",
		text: "text-amber-400",
		border: "border-amber-500/30",
		dot: "bg-amber-500",
		label: "Medium"
	},
	low: {
		bg: "bg-emerald-500/10",
		text: "text-emerald-400",
		border: "border-emerald-500/30",
		dot: "bg-emerald-500",
		label: "Low"
	}
};
function severityRank(sev) {
	const s = sev?.toLowerCase();
	if (s === "critical") return 0;
	if (s === "high") return 1;
	if (s === "medium") return 2;
	if (s === "low") return 3;
	return 4;
}
function FindingCard({ finding, index, defaultOpen }) {
	const [open, setOpen] = (0, import_react.useState)(!!defaultOpen);
	const sev = SEV_STYLES[String(finding.severity ?? "low").toLowerCase()] ?? SEV_STYLES.low;
	const name = finding.type || finding.name || finding.vulnerability || finding.title || "Security Finding";
	const line = finding.line ?? finding.line_number ?? null;
	const explanation = finding.explanation || finding.ai_explanation || [
		finding.what_happened,
		finding.why_dangerous,
		finding.why_fix_works
	].filter(Boolean).join("\n\n") || null;
	const attack = finding.attack_scenario ?? null;
	const vulnerable = finding.snippet ?? finding.vulnerable_code ?? null;
	const secure = finding.fix_snippet ?? finding.secure_fix ?? finding.fix ?? null;
	const cwe = finding.cwe_id ?? finding.cwe ?? null;
	const owasp = finding.owasp_category ?? finding.owasp_id ?? finding.owasp ?? null;
	const source = finding.source_citation ?? finding.source ?? finding.citation ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		layout: true,
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: index * .04,
			duration: .3
		},
		className: `overflow-hidden rounded-xl border ${sev.border} bg-slate-900/60 backdrop-blur`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((o) => !o),
			className: "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-900",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `inline-flex items-center gap-1.5 rounded-md border ${sev.border} ${sev.bg} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${sev.text}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${sev.dot}` }), sev.label]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 truncate text-sm font-medium text-slate-100",
					children: name
				}),
				line != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-md border border-[#21262d] bg-slate-950 px-2 py-0.5 font-mono text-[11px] text-slate-400",
					children: ["L", line]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
					animate: { rotate: open ? 180 : 0 },
					className: "text-slate-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			initial: false,
			children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					height: 0,
					opacity: 0
				},
				animate: {
					height: "auto",
					opacity: 1
				},
				exit: {
					height: 0,
					opacity: 0
				},
				transition: {
					duration: .25,
					ease: "easeOut"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 border-t border-[#21262d] px-4 py-4",
					children: [
						explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }),
								children: "AI Explanation"
							}), finding.model_used && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded-md tracking-wide",
								children: ["⚡ ", finding.model_used]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-line text-sm leading-relaxed text-slate-300",
							children: explanation
						})] }),
						attack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-orange-400" }),
							children: "Attack Scenario"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 text-sm leading-relaxed text-slate-300",
							children: attack
						})] }),
						(vulnerable || secure) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "h-3.5 w-3.5" }),
							children: "Code Comparison"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeComparison, {
							vulnerable,
							secure
						})] }),
						(cwe || owasp || source) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }),
							children: "References"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [
								cwe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefBadge, {
									label: "CWE",
									value: cwe,
									color: "indigo"
								}),
								owasp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefBadge, {
									label: "OWASP",
									value: owasp,
									color: "violet"
								}),
								source && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefBadge, {
									label: "Source",
									value: source,
									color: "slate"
								})
							]
						})] })
					]
				})
			}, "body")
		})]
	});
}
function SectionTitle({ icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400",
		children: [
			icon,
			" ",
			children
		]
	});
}
function RefBadge({ label, value, color }) {
	const styles = {
		indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-500/15",
		violet: "border-violet-500/30 bg-violet-500/10 text-violet-300 hover:border-violet-500/60 hover:bg-violet-500/15",
		slate: "border-[#21262d] bg-slate-800/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
	}[color];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${styles}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-wider opacity-70",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono",
			children: value
		})]
	});
}
function FindingsList({ findings }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2.5",
		children: [...findings].sort((a, b) => severityRank(String(a.severity)) - severityRank(String(b.severity))).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingCard, {
			finding: f,
			index: i,
			defaultOpen: i === 0
		}, i))
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "flex flex-wrap items-center justify-between gap-2 border-t border-[#21262d] px-6 py-3 text-[11px] text-slate-500",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SecureLens Engine online" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AST · OWASP · CWE · AI" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "h-3.5 w-3.5" })]
		})]
	});
}
var DEMOS = {
	sql: `import sqlite3

def get_user(username: str):
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()
    # Vulnerable: string concatenation in SQL query
    query = "SELECT * FROM users WHERE username = '" + username + "'"
    cursor.execute(query)
    return cursor.fetchone()

def login(request):
    user = get_user(request.args.get("username"))
    return {"user": user}
`,
	command: `import os
import subprocess

def ping_host(host: str):
    # Vulnerable: unsanitized user input passed to shell
    return os.system("ping -c 1 " + host)

def run_backup(filename):
    subprocess.call("tar -czf backup.tar.gz " + filename, shell=True)
`,
	path: `from flask import Flask, request, send_file

app = Flask(__name__)

@app.route("/download")
def download():
    filename = request.args.get("file")
    # Vulnerable: path traversal via user-controlled filename
    return send_file("/var/app/uploads/" + filename)

def read_config(name):
    with open("/etc/app/" + name, "r") as f:
        return f.read()
`
};
var API_URL = "http://localhost:8000";
async function scanCode(code, signal) {
	const res = await fetch(`${API_URL}/api/scan`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code }),
		signal
	});
	if (!res.ok) {
		let detail = `Request failed (${res.status})`;
		try {
			const j = await res.json();
			if (j?.detail) detail = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
		} catch {}
		const err = new Error(detail);
		err.status = res.status;
		throw err;
	}
	return res.json();
}
function SecureLensPage() {
	const [code, setCode] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("idle");
	const [finished, setFinished] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const loadDemo = (kind) => {
		setCode(DEMOS[kind]);
		setResult(null);
		setView("idle");
	};
	const clear = () => {
		setCode("");
		setResult(null);
		setView("idle");
	};
	const scan = async () => {
		if (!code.trim()) {
			toast.error("No code to scan", { description: "Paste Python code or load a demo example." });
			return;
		}
		setView("scanning");
		setFinished(false);
		setResult(null);
		const startedAt = performance.now();
		try {
			const data = await scanCode(code);
			const elapsed = performance.now() - startedAt;
			const minMs = 2400;
			if (elapsed < minMs) await new Promise((r) => setTimeout(r, minMs - elapsed));
			setFinished(true);
			await new Promise((r) => setTimeout(r, 550));
			setResult(data);
			setView("result");
		} catch (err) {
			const e = err;
			const title = e.status === 400 ? "Invalid request" : e.status === 422 ? "Could not parse code" : e.status === 500 ? "Scanner error" : "Scan failed";
			toast.error(title, {
				description: e.message || "Please try again.",
				action: {
					label: "Retry",
					onClick: () => scan()
				}
			});
			setView("idle");
		}
	};
	const findings = result?.findings ?? [];
	const total = result?.total_findings ?? result?.total ?? findings.length;
	const isBusy = view === "scanning";
	const getRiskScoreNumber = (score) => {
		if (!score) return 0;
		const s = score.toLowerCase();
		if (s === "critical") return 100;
		if (s === "high") return 75;
		if (s === "medium") return 45;
		if (s === "low") return 0;
		return 0;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-950 text-slate-200 antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none fixed inset-0 -z-10 opacity-60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.main, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			transition: { duration: .4 },
			className: "flex min-h-screen flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-5 lg:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex min-h-[560px] flex-col gap-4 rounded-2xl border border-[#21262d] bg-slate-900/40 p-4 backdrop-blur lg:min-h-0 lg:w-[45%] lg:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500",
							children: "Demo Examples"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoButtons, {
							onLoad: loadDemo,
							disabled: isBusy
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex min-h-[380px] flex-1 flex-col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeEditor, {
								value: code,
								onChange: setCode,
								disabled: isBusy
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: clear,
								disabled: isBusy,
								className: "flex items-center gap-2 rounded-lg border border-[#21262d] bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-red-500/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Clear Code"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
								onClick: scan,
								disabled: isBusy,
								whileHover: { y: -1 },
								whileTap: { scale: .98 },
								className: "group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-indigo-400 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" }), isBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Scanning…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), "Scan Code"] })]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "flex min-h-[560px] flex-1 flex-col overflow-hidden rounded-2xl border border-[#21262d] bg-slate-900/40 backdrop-blur lg:min-h-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
						mode: "wait",
						children: [
							view === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								exit: { opacity: 0 },
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {})
							}, "idle"),
							view === "scanning" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								exit: { opacity: 0 },
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelineLoader, {
									running: true,
									finished
								})
							}, "scanning"),
							view === "result" && result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: 8
								},
								animate: {
									opacity: 1,
									y: 0
								},
								exit: { opacity: 0 },
								className: "flex flex-1 flex-col overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-[#21262d] px-5 py-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-sm font-semibold text-slate-100",
											children: "Security Report"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300",
											children: "Ready"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricsCards, {
										riskScore: getRiskScoreNumber(result.risk_score ? String(result.risk_score) : void 0),
										totalFindings: Number(total ?? 0),
										linesScanned: Number(result.lines_scanned ?? code.split("\n").length),
										executionMs: Number(result.execution_time_ms ?? result.execution_time ?? 0)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:thin]",
									children: total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeScanState, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "text-xs font-semibold uppercase tracking-wider text-slate-400",
											children: [
												"Findings (",
												findings.length,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-slate-500",
											children: "Sorted by severity"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingsList, { findings })] })
								})]
							}, "result")
						]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})]
		})]
	});
}
//#endregion
export { SecureLensPage as component };
