import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Play, Terminal, Database, FolderTree, AlertOctagon, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";

const SAMPLE_CODES = {
  sql: {
    title: "SQL Injection",
    icon: Database,
    code: `def get_user(username: str):\n    conn = sqlite3.connect("app.db")\n    cursor = conn.cursor()\n    # Unsanitized string concatenation\n    query = "SELECT * FROM users WHERE name = '" + username + "'"\n    cursor.execute(query)\n    return cursor.fetchone()`,
    finding: {
      type: "SQL Injection (CWE-89)",
      severity: "CRITICAL",
      line: 5,
      explanation: "Direct string concatenation allows an attacker to manipulate the SQL statement context (e.g. username = \"' OR '1'='1\").",
      fix: `def get_user(username: str):\n    conn = sqlite3.connect("app.db")\n    cursor = conn.cursor()\n    # Parameterized SQL Query\n    cursor.execute("SELECT * FROM users WHERE name = ?", (username,))\n    return cursor.fetchone()`,
    },
  },
  command: {
    title: "Command Injection",
    icon: Terminal,
    code: `def ping_host(host: str):\n    # Dangerous OS command execution\n    cmd = "ping -c 1 " + host\n    output = os.popen(cmd).read()\n    return output`,
    finding: {
      type: "OS Command Injection (CWE-78)",
      severity: "HIGH",
      line: 3,
      explanation: "Passing unvalidated user input to os.popen allows execution of arbitrary shell commands (e.g. host = \"8.8.8.8; rm -rf /\").",
      fix: `def ping_host(host: str):\n    # Safe subprocess execution without shell shell=False\n    result = subprocess.run(["ping", "-c", "1", host], capture_output=True, text=True, check=True)\n    return result.stdout`,
    },
  },
  path: {
    title: "Path Traversal",
    icon: FolderTree,
    code: `def read_user_file(filename: str):\n    # Direct file path construction\n    file_path = "/var/www/uploads/" + filename\n    with open(file_path, "r") as f:\n        return f.read()`,
    finding: {
      type: "Path Traversal (CWE-22)",
      severity: "HIGH",
      line: 3,
      explanation: "Constructing file paths without sanitizing allows directory traversal (e.g. filename = \"../../etc/passwd\").",
      fix: `def read_user_file(filename: str):\n    base_dir = os.path.abspath("/var/www/uploads/")\n    file_path = os.path.abspath(os.path.join(base_dir, filename))\n    if not file_path.startswith(base_dir):\n        raise PermissionError("Path traversal attempt detected")\n    with open(file_path, "r") as f:\n        return f.read()`,
    },
  },
};

export function MicroAuditorSandbox() {
  const [selectedDemo, setSelectedDemo] = useState<keyof typeof SAMPLE_CODES>("sql");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const demo = SAMPLE_CODES[selectedDemo];

  const handleRunScan = () => {
    setIsScanning(true);
    setHasScanned(false);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 1400);
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(10, 10, 15, 0.85)",
        borderRadius: "20px",
        border: "1px solid rgba(128, 82, 255, 0.25)",
        padding: "32px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(128, 82, 255, 0.15)",
        maxWidth: "960px",
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Sparkles size={16} color="#8052ff" />
            <h3 style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "16px", fontWeight: 500, color: "#ffffff", margin: 0 }}>
              Live Micro-Auditor Sandbox
            </h3>
          </div>
          <p style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "13px", color: "#a0a0a0", margin: 0 }}>
            Test the deterministic AST static auditor live on sample Python code snippets.
          </p>
        </div>

        {/* Demo Selector Pills */}
        <div style={{ display: "flex", gap: "8px" }}>
          {(Object.keys(SAMPLE_CODES) as Array<keyof typeof SAMPLE_CODES>).map((key) => {
            const item = SAMPLE_CODES[key];
            const Icon = item.icon;
            const isSelected = selectedDemo === key;

            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedDemo(key);
                  setHasScanned(false);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: isSelected ? "rgba(128, 82, 255, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  border: isSelected ? "1px solid rgba(128, 82, 255, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "22.5px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontFamily: "'Inter', ui-sans-serif, sans-serif",
                  color: isSelected ? "#ffffff" : "#a0a0a0",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon size={13} color={isSelected ? "#8052ff" : "#a0a0a0"} />
                {item.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Window */}
      <div
        style={{
          backgroundColor: "#050508",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
          position: "relative",
          marginBottom: "24px",
        }}
      >
        {/* Code Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            backgroundColor: "rgba(15, 15, 22, 0.8)",
          }}
        >
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: "11px", color: "#a0a0a0" }}>
            vulnerable_sample.py
          </span>
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: "11px", color: "#ffb829" }}>
            Python 3.12 AST Scope
          </span>
        </div>

        {/* Laser Scan Beam Animation */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "3px",
                backgroundColor: "#8052ff",
                boxShadow: "0 0 20px #8052ff, 0 0 40px #8052ff",
                zIndex: 10,
              }}
            />
          )}
        </AnimatePresence>

        {/* Code Text */}
        <pre
          style={{
            margin: 0,
            padding: "20px",
            fontFamily: "'Fira Code', ui-monospace, monospace",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "#e0e0e0",
            overflowX: "auto",
          }}
        >
          <code>{demo.code}</code>
        </pre>
      </div>

      {/* Action Button & Results Panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <motion.button
          onClick={handleRunScan}
          disabled={isScanning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            backgroundColor: "#8052ff",
            color: "#ffffff",
            border: "none",
            borderRadius: "22.5px",
            padding: "12px 28px",
            fontSize: "14px",
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(128, 82, 255, 0.3)",
            width: "fit-content",
          }}
        >
          {isScanning ? (
            <>
              <RefreshCw size={15} className="animate-spin" />
              Scanning AST Nodes...
            </>
          ) : (
            <>
              <Play size={15} />
              Run Instant AST Audit
            </>
          )}
        </motion.button>

        {/* Audit Results Container */}
        <AnimatePresence>
          {hasScanned && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertOctagon size={16} color="#ef4444" />
                  <span style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "14px", fontWeight: 500, color: "#f87171" }}>
                    {demo.finding.type}
                  </span>
                </div>
                <span
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    borderRadius: "9999px",
                    padding: "3px 10px",
                    fontSize: "10px",
                    fontFamily: "'Fira Code', monospace",
                    color: "#f87171",
                    fontWeight: 600,
                  }}
                >
                  SEVERITY: {demo.finding.severity}
                </span>
              </div>

              <p style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "13px", color: "#e0e0e0", lineHeight: 1.5, margin: "0 0 16px" }}>
                {demo.finding.explanation}
              </p>

              {/* Secure Fix Snippet */}
              <div style={{ backgroundColor: "#050508", borderRadius: "10px", padding: "14px", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#4ade80", fontWeight: 500, marginBottom: "8px" }}>
                  <CheckCircle2 size={13} />
                  AST Grounded Secure Fix:
                </div>
                <pre style={{ margin: 0, fontFamily: "'Fira Code', monospace", fontSize: "12px", color: "#4ade80", overflowX: "auto" }}>
                  <code>{demo.finding.fix}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
