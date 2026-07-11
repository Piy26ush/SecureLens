export const DEMOS = {
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
`,
};
