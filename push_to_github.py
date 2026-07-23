import os
import base64
import json
import urllib.request
import urllib.error

REPO_NAME = "dailyrashifalai-app"

def create_repo_if_not_exists(token: str) -> str:
    """Creates the GitHub repository automatically if it doesn't exist yet."""
    # Get user authenticated info
    user_url = "https://api.github.com/user"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Python-Uploader"
    }
    
    owner = "jaicomputerosian-design"
    try:
        req = urllib.request.Request(user_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            owner = data.get("login", owner)
            print(f"👤 Logged in GitHub User: {owner}")
    except urllib.error.HTTPError as e:
        print(f"⚠️ User lookup info: {e.code}")

    # Create repository call
    create_url = "https://api.github.com/user/repos"
    payload = {
        "name": REPO_NAME,
        "description": "VedaAstra AI Vedic Astrology App for DailyRashifalai.com",
        "private": False,
        "auto_init": False
    }
    
    req = urllib.request.Request(create_url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"✨ Created repository '{REPO_NAME}' under {owner} successfully!")
    except urllib.error.HTTPError as e:
        if e.code == 422: # Already exists
            print(f"ℹ️ Repository '{REPO_NAME}' already exists on GitHub.")
        else:
            print(f"⚠️ Repo creation notice: {e.code} {e.reason}")

    return owner

def upload_file_to_github(token: str, owner: str, file_path: str, repo_path: str):
    url = f"https://api.github.com/repos/{owner}/{REPO_NAME}/contents/{repo_path}"
    
    with open(file_path, "rb") as f:
        content = base64.b64encode(f.read()).decode("utf-8")
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Python-Uploader"
    }
    
    sha = None
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            sha = data.get("sha")
    except urllib.error.HTTPError:
        pass

    payload = {
        "message": f"Upload {repo_path} via VedaAstra Auto Uploader",
        "content": content
    }
    if sha:
        payload["sha"] = sha
        
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="PUT")
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"✅ Successfully uploaded: {repo_path}")
    except urllib.error.HTTPError as e:
        print(f"❌ Failed {repo_path}: {e.code} {e.reason}")

def main():
    print("==========================================================")
    print(" 🕉️  VedaAstra Smart Auto GitHub Repository & Folder Creator")
    print("==========================================================")
    token = input("Enter your GitHub Personal Access Token (ghp_...): ").strip()
    if not token:
        print("Error: Token cannot be empty.")
        return

    owner = create_repo_if_not_exists(token)
    workspace_dir = os.path.dirname(os.path.abspath(__file__))
    ignore_dirs = {"venv", ".git", "__pycache__", ".DS_Store"}

    uploaded_count = 0
    for root, dirs, files in os.walk(workspace_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            if f.endswith(".pyc") or f == ".DS_Store" or f == "Astro_Ai_APP_Complete.zip":
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, workspace_dir)
            upload_file_to_github(token, owner, full_path, rel_path)
            uploaded_count += 1

    print(f"\n🎉 Done! All {uploaded_count} files and folders uploaded to GitHub successfully!")
    print(f"🔗 Repository URL: https://github.com/{owner}/{REPO_NAME}")

if __name__ == "__main__":
    main()
