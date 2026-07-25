# 📦 SecureLens CLI & NPM Publishing Guide

This document provides a beginner-friendly, step-by-step explanation of the **SecureLens Command-Line Interface (CLI)**, NPM registry publishing, `npx` execution, and CI/CD automation.

---

## 🔰 1. Understanding NPM & NPX (Beginner 101)

### What is NPM?
**NPM (Node Package Manager)** is the world's largest open-source software registry. It allows developers to publish tools, libraries, and applications so anyone on Earth can use them.

### What is NPX?
**NPX (Node Package eXecute)** is a built-in runner that comes automatically with Node.js. 
Instead of forcing users to download and install a huge installer file, `npx` lets developers **run a command directly on-demand** inside any project folder with a single terminal command.

---

## ⚙️ 2. Project CLI Architecture (`securelens-ai`)

SecureLens includes a native CLI executable built into the project repository:

- **Package Name**: `securelens-ai`
- **Version**: `v1.0.0`
- **Executable Script**: [`bin/securelens.js`](file:///Users/piyush/Desktop/SecureLens/bin/securelens.js)
- **Configuration**: Configured inside [`package.json`](file:///Users/piyush/Desktop/SecureLens/package.json) via the `"bin"` property:
  ```json
  "bin": {
    "securelens": "./bin/securelens.js"
  }
  ```

When a user runs `npx securelens-ai`, Node.js executes `bin/securelens.js`, which traverses Python Abstract Syntax Trees (AST) locally on the user's computer.

---

## 🛠️ 3. CLI Subcommand Reference

All 3 security capabilities are bundled inside **1 single NPM package**:

### 1️⃣ Fast AST Static Scan
```bash
npx securelens-ai scan ./ --ast-only
```
- **Execution Time**: **< 100 milliseconds**
- **What it does**: Performs fast deterministic AST static analysis on all `.py` files in `./` to catch SQL Injections (CWE-89), OS Command Injections (CWE-78), and Path Traversals (CWE-22).

### 2️⃣ Full RAG + Gemini AI Audit
```bash
npx securelens-ai audit ./ --rag
```
- **Execution Time**: **~1-2 seconds**
- **What it does**: Combines AST parsing with semantic ChromaDB vector index lookups and Gemini 2.5 AI reasoning to output threat analysis and green code fixes directly in the terminal shell.

### 3️⃣ Executive PDF Security Report Export
```bash
npx securelens-ai export ./ --pdf
```
- **What it does**: Compiles all findings, risk metrics, and OWASP references into a structured executive Security Audit PDF report file.

---

## 🚀 4. How to Publish the CLI Package to NPM

Publishing your CLI tool to the global NPM registry is **100% FREE**. Follow these 4 steps:

### Step 1: Sign up for a free NPM Account
Go to [npmjs.com/signup](https://www.npmjs.com/signup) and create your account.

### Step 2: Log in from your Mac Terminal
Open terminal inside your project folder and run:
```bash
npm login
```
Enter your username, password, and email when prompted.

### Step 3: Verify Your Credentials
Check that you are logged in:
```bash
npm whoami
```

### Step 4: Publish to NPM Registry
Publish the package publicly to the world:
```bash
npm publish --access public
```

---

## 🤖 5. GitHub Actions CI/CD Pipeline Integration

Developers can automate SecureLens to scan code every time a Pull Request is opened by adding `.github/workflows/security.yml` to their repository:

```yaml
name: SecureLens Security Audit

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Run SecureLens AST Security Audit
        run: npx securelens-ai scan ./
```

> **Result**: Every time a developer submits code, GitHub Actions automatically runs `npx securelens-ai scan ./` and blocks vulnerable code before it ever reaches production!
