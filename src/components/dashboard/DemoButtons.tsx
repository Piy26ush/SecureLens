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
    <div className="flex flex-wrap gap-2">
      {demos.map(({ key, label, icon: Icon }, i) => (
        <motion.button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onLoad(key)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i, duration: 0.3 }}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium text-[#9a9a9a] transition-all hover:border-[#6366F1]/40 hover:bg-[#6366F1]/[0.06] hover:text-[#c7c8ff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon className="h-3 w-3 text-[#737373] transition-colors group-hover:text-[#6366F1]" />
          <span>{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
