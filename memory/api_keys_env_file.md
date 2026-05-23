---
name: API keys via env file, not 1Password CLI
description: Use cached env files for API keys instead of 1Password service account CLI, which is unreliable for Claude Code sessions.
type: feedback
originSessionId: 476f84c9-c665-442e-8d96-be1726d5d796
---
Use `source ~/.config/api-keys/keys.env` for API keys instead of `op` CLI.

**Why:** The 1Password service account has recurring issues: field name mismatches, URI encoding problems with parentheses, `--reveal` flag inconsistencies, empty responses with no error. We've hit these multiple times across sessions. The Cloudflare keys pattern (`~/.config/cloudflare/keys.env`) has never failed.

**How to apply:** At the start of any session that needs API keys, run `source ~/.config/api-keys/keys.env`. The file provides `OPENROUTER_API_KEY` and `ANTHROPIC_API_KEY`. Cloudflare keys are still at `~/.config/cloudflare/keys.env`. Only fall back to `op` CLI for keys not yet cached in env files.
