# MCP Servers — Setup Guide

Run these commands from your project root to add each MCP server to Claude Code.
Store tokens in `.env.local` (never commit this file).

---

## 1. GitHub MCP (Essential)

Manage repos, PRs, issues, and monitor GitHub Actions from Claude Code.

```bash
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

Add to `.env.local`:
```
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
```

Get token at: https://github.com/settings/tokens
Required scopes: `repo`, `workflow`, `read:org`

**Use cases:**
- "Check if the latest GitHub Actions deploy succeeded"
- "Create a PR for the feature branch"
- "List open issues in this repo"

---

## 2. Filesystem MCP

Read/write project files. Useful for batch-generating multiple markdown articles.

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/your/project
```

Replace `/path/to/your/project` with your actual project path, e.g. `/Users/jigar/interview-prep-blog`

**Use cases:**
- "Create 5 placeholder markdown files for my planned articles"
- "Read all my existing content files and give me a content calendar"
- "Update the slug in all posts that reference a renamed article"

---

## 3. Playwright MCP

Browser automation for testing, screenshotting, and verifying deployed pages.

```bash
claude mcp add playwright -- npx -y @playwright/mcp
```

**Use cases:**
- "Screenshot the deployed blog at https://... and check if the TOC renders"
- "Generate OG image screenshots for all posts"
- "Test that all internal links on the homepage work"

---

## 4. Memory MCP

Persist project decisions and published article slugs across Claude Code sessions.

```bash
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory
```

**Use cases:**
- Store: "All published slugs so far: [list]"
- Store: "Decided to use tabs, not spaces. Color: #0f172a sidebar."
- Retrieve context at the start of a new session without re-explaining

---

## 5. Sequential Thinking MCP

Forces Claude Code to reason step-by-step before writing complex logic.
Especially useful for the lib/ data layer and routing decisions.

```bash
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
```

**Use cases:**
- Complex lib/posts.ts logic
- Debugging SSG route generation issues
- Planning the search index schema

---

## .claude/mcp.json (commit this, without tokens)

After adding all servers, export the config:

```bash
claude mcp list
```

Your `.claude/mcp.json` should look like:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

Add to `.gitignore`:
```
.env.local
```

Commit `.claude/mcp.json` (it uses `${VAR}` references, not actual tokens).
