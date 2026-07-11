# Tech Stack & Terminology Glossary

This document provides a comprehensive overview of the tech stack and security/AI terminology used in the **Securelens** blueprint.

---

## 🛠️ The Tech Stack

### 1. Frontend Layer
*   **React + Vite**: React is the industry-standard component library for building user interfaces. Vite is a modern frontend build tool that is extremely fast (offering instant Hot Module Replacement during development) compared to older systems like Create React App.
*   **Tailwind CSS**: A utility-first CSS framework that allows rapid UI styling by applying utility classes (e.g., `flex`, `bg-gray-900`, `p-4`) directly in HTML/React code.
*   **Monaco Editor (`@monaco-editor/react`)**: The exact code editor engine that powers VS Code. Using this in the web browser gives users professional coding features like line numbers, syntax coloring, auto-formatting, and indentation.
*   **Axios**: A popular promise-based HTTP client for making API requests from the browser to our FastAPI backend.
*   **React Syntax Highlighter**: A syntax-highlighting component used to render code snippets beautifully (especially green secure fixes and yellow/red vulnerability code blocks).
*   **Lucide React**: A modern, clean library of SVG icons designed for React applications.

### 2. Backend Layer
*   **FastAPI**: A modern, high-performance web framework for building APIs with Python. It automatically validates incoming data types and generates interactive documentation (Swagger UI).
*   **Uvicorn**: An ASGI (Asynchronous Server Gateway Interface) web server implementation for Python. It acts as the actual web server running the FastAPI application.
*   **SlowAPI**: A rate-limiting library specifically designed for FastAPI. It tracks incoming requests (by client IP) and limits them to prevent denial-of-service (DoS) attempts or expensive API abuses.

### 3. Data & AI (RAG) Layer
*   **LangChain**: A framework designed to simplify the creation of applications using Large Language Models (LLMs). We use it to build our RAG (Retrieval-Augmented Generation) query pipelines.
*   **ChromaDB**: A lightweight, open-source vector database designed specifically to store and query text embeddings. In development, it runs locally on the same server, saving infrastructure costs.
*   **Pinecone**: A fully managed cloud vector database. While ChromaDB is used for local development, Pinecone's free tier is planned for production because it scales to millions of vectors without consuming our backend server's memory.
*   **all-MiniLM-L6-v2 (Embedding Model)**: A lightweight machine learning model that converts plain text chunks into high-dimensional numerical vectors (384 dimensions). This runs locally inside our Python environment with zero API cost.
*   **Groq API**: An AI inference platform optimized for extreme speed. It hosts open-source models like Llama 3.1 70B and runs them at speeds of over 200 tokens per second. We use the free tier to keep response times under 3 seconds.

---

## 📖 Key Terminology & Concepts

### AI & Vector Concepts
*   **RAG (Retrieval-Augmented Generation)**: 
    Instead of relying solely on what an LLM already knows (which can lead to fake details or "hallucinations"), RAG works by finding real, relevant articles first (e.g., from OWASP Cheat Sheets stored in our database) and pasting those articles *into* the prompt sent to the LLM. This forces the LLM to write answers grounded in facts.
*   **Embeddings**: 
    A mathematical representation of text meaning. Unlike traditional databases that search for exact keywords, an embedding model turns sentences into coordinate points. Semantically similar concepts (e.g., "SQL Injection" and "unvalidated database query") end up close to each other in vector space, allowing the app to find related information even if they use different words.
*   **Vector Database**: 
    A database designed to index and search coordinates (embeddings). When the system queries it, the database performs a similarity search to return the closest text blocks.
*   **AST (Abstract Syntax Tree)**: 
    A tree representation of the abstract syntactic structure of source code written in a programming language.
*   **AST Scanner**: 
    A security scanner that translates code into a tree structure (AST) and walks through it to find unsafe constructs. It is deterministic, meaning it follows hardcoded rules (e.g., "flag any code where `os.system()` contains a variable"). Unlike LLMs, it has **zero risk of hallucinating** and is extremely fast.

### Security Standards & Organizations
*   **OWASP (Open Web Application Security Project)**: 
    A global non-profit organization focused on improving software security. They publish the famous **OWASP Top 10**, a document representing a broad consensus on the most critical security risks to web applications.
*   **CWE (Common Weakness Enumeration)**: 
    A community-developed list of common software and hardware security weaknesses (e.g., *CWE-89: Improper Neutralization of Special Elements used in an SQL Command*). It provides a common language for identifying bugs and vulnerabilities.

### Vulnerability Types
*   **SQL Injection (SQLi)**: 
    An attack where malicious SQL inputs are passed directly to database queries, allowing attackers to read, modify, or delete sensitive data.
*   **Command Injection**: 
    A vulnerability that occurs when unsafe input is passed directly to the host operating system shell (e.g., via `os.system()`), allowing attackers to run arbitrary system commands on the server.
*   **Path Traversal**: 
    A vulnerability allowing an attacker to access restricted files and directories (like system configuration files or source code) on the web server by manipulating file paths (e.g., utilizing `../` sequences).
*   **Pickle deserialization (`pickle.loads`)**: 
    Python's built-in tool for saving/loading objects is called `pickle`. However, loading untrusted pickle data allows attackers to execute arbitrary code on the server during the load process, making it a critical security risk.
