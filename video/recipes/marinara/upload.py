#!/usr/bin/env python3
"""upload.py <local> <key> — put a file in R2 claude-renders -> https://renders.pwhite.org/<key> (source ~/blender-render/env.sh first)."""
import os, sys, mimetypes, boto3
s3 = boto3.client("s3", endpoint_url=os.environ["R2_ENDPOINT"], aws_access_key_id=os.environ["R2_ACCESS_KEY"], aws_secret_access_key=os.environ["R2_SECRET_KEY"], region_name="auto")
ct = {'.m4a': 'audio/mp4', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png'}.get(os.path.splitext(sys.argv[1])[1], mimetypes.guess_type(sys.argv[1])[0] or 'application/octet-stream')
s3.upload_file(sys.argv[1], "claude-renders", sys.argv[2], ExtraArgs={"ContentType": ct}); print(f"https://renders.pwhite.org/{sys.argv[2]}")
