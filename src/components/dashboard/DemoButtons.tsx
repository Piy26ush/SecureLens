import { Database, Terminal, FolderTree } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onLoad: (kind: "sql" | "command" | "path") => void;
  disabled?: boolean;
}

const demos = [
  { key: "sql" as const, label: "SQL Injection", icon: Database },
  { key: "command" as const, label: "Command Injection", icon: Terminal },
  { key: "path" as const, label: "Path Traversal", icon: FolderTree },
];

export function DemoButtons({ onLoad, disabled }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {demos.map(({ key, label, icon: Icon }, i) => (
        <motion.button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onLoad(key)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i, duration: 0.3 }}
          whileHover={{ y: -1 }}
          className="group flex items-center justify-center gap-2 rounded-lg border border-[#21262d] bg-slate-900/60 px-3 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-indigo-500/40 hover:bg-slate-900 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-indigo-400" />
          <span className="truncate">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
