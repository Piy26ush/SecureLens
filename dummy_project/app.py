import os
import sqlite3

def run_query(username):
    # Vulnerability 1: SQL Injection
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = "SELECT * FROM accounts WHERE name = '" + username + "'"
    cursor.execute(query)
    return cursor.fetchall()

def run_ping(ip_address):
    # Vulnerability 2: Command Injection
    os.system("ping -c 1 " + ip_address)
