import os
import base64
import json
import urllib.request
import urllib.error

REPO_NAME = "dailyrashifalai-app"

def github_api_request(url: str, token: str, method: str = "GET", data: dict = None):
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Python-Single-Commit-Uploader"
    }
    encoded_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def push_single_atomic_commit(token: str):
    print("==========================================================")
    print(" 🕉️  VedaAstra Single Atomic Commit Uploader")
    print("==========================================================")
    
    # 1. Get authenticated user
    user_info = github_api_request("https://api.github.com/user", token)
    owner = user_info.get("login")
    print(f"👤 GitHub User: {owner}")

    # 2. Get main branch reference
    ref_url = f"https://api.github.com/repos/{owner}/{REPO_NAME}/git/refs/heads/main"
    try:
        ref_data = github_api_request(ref_url, token)
        parent_commit_sha = ref_data["object"]["sha"]
    except Exception as e:
        print(f"⚠️ Could not fetch main branch: {e}")
        return

    # 3. Get parent tree sha
    commit_data = github_api_request(f"https://api.github.com/repos/{owner}/{REPO_NAME}/git/commits/{parent_commit_sha}", token)
    parent_tree_sha = commit_data["tree"]["sha"]

    # 4. Read all files in workspace & create blobs
    workspace_dir = os.path.dirname(os.path.abspath(__file__))
    ignore_dirs = {"venv", ".git", "__pycache__", ".DS_Store"}
    
    tree_items = []
    print("📦 Packing all files into single Git tree...")
    
    for root, dirs, files in os.walk(workspace_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            if f.endswith(".pyc") or f == ".DS_Store" or f == "Astro_Ai_APP_Complete.zip":
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, workspace_dir).replace("\\", "/")
            
            with open(full_path, "rb") as fp:
                file_content = fp.read()
                
            blob_payload = {
                "content": base64.b64encode(file_content).decode("utf-8"),
                "encoding": "base64"
            }
            blob_res = github_api_request(f"https://api.github.com/repos/{owner}/{REPO_NAME}/git/blobs", token, method="POST", data=blob_payload)
            
            tree_items.append({
                "path": rel_path,
                "mode": "100644",
                "type": "blob",
                "sha": blob_res["sha"]
            })
            print(f"  + Added: {rel_path}")

    # 5. Create new tree
    tree_payload = {
        "base_tree": parent_tree_sha,
        "tree": tree_items
    }
    new_tree = github_api_request(f"https://api.github.com/repos/{owner}/{REPO_NAME}/git/trees", token, method="POST", data=tree_payload)
    
    # 6. Create new single commit
    new_commit_payload = {
        "message": "VedaAstra AI Complete Single Commit Release for Vercel",
        "tree": new_tree["sha"],
        "parents": [parent_commit_sha]
    }
    new_commit = github_api_request(f"https://api.github.com/repos/{owner}/{REPO_NAME}/git/commits", token, method="POST", data=new_commit_payload)

    # 7. Update main branch pointer to new commit
    update_ref_payload = {"sha": new_commit["sha"], "force": True}
    github_api_request(ref_url, token, method="PATCH", data=update_ref_payload)

    print("==========================================================")
    print(" 🎉 SUCCESS! Pushed ONE SINGLE ATOMIC COMMIT to GitHub!")
    print(f" 🔗 Repository URL: https://github.com/{owner}/{REPO_NAME}")
    print("==========================================================")

if __name__ == "__main__":
    t = input("Enter your GitHub Personal Access Token (ghp_...): ").strip()
    if t:
        push_single_atomic_commit(t)
