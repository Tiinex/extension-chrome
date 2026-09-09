# Continuity Context

- Envelope Schema: tiinex.root.v1
- Current
  - Current Schema: tiinex.workspace.v1
  - Created At: 2026-09-09 16:49:03
  - Authors: Anchor
  - Why: Establish durable source identity and a bounded host frontier before extension implementation begins.
  - Summary: Portable Workspace entrypoint for the first-party Chrome extension frontier.
  - Status: ready/local

---

# Tiinex Extension Chrome

## Schema Origins

- Tiinex Docs canonical schemas
  - Kind: github-tree
  - Repository: Tiinex/docs
  - Ref: master
  - Root Path: .topics/.schemas
  - Trust Role: canonical-core

## Workspace Entrypoints

### Extension Chrome source

- Source Kind: local-directory
- Repository: Tiinex/extension-chrome
- Root Path: .
- Repo Files Discovery: on

## Workspace Boundary

- First-party Chrome extension host for browser Workspace interaction, artifact capture, grounding support and bounded automation.
- Shared semantics/mechanics stay in their owning layers; OpenAI-specific environment behavior stays in Interop OpenAI.
- This initial Workspace establishes source and work lineage without fabricating a finished extension implementation.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: XHFd_Z9CSeHV_w7Etruo8l6Dre_YfEjht2-yc027Ctg