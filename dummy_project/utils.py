import hashlib

# Vulnerability 3: Hardcoded API Secret Key
SECRET_TOKEN = "AQ.Ab8RN6LkYV3XjLhOmKS3yOpR"

def hash_password(password):
    # Vulnerability 4: Weak Cryptographic Hash (MD5)
    hasher = hashlib.md5()
    hasher.update(password.encode('utf-8'))
    return hasher.hexdigest()
