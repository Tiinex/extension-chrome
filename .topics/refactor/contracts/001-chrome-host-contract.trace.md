# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-09 16:50:33
  - Trace: [001-extension-chrome-foundation.trace.md](../001-extension-chrome-foundation.trace.md)
  - Origin:
    - [relative](../001-extension-chrome-foundation.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-09 16:51:17
  - Authors: Anchor
  - Why: Keep Chrome integration thin before implementation pressure creates copied/shared logic.
  - Summary: Minimal browser-extension host boundary over public Tiinex contracts.
  - Status: ready/local

---

# Chrome host contract

## Objective
Define the minimal browser-extension host surface before implementation.

## Scope
Browser capability projection, Workspace/material interaction, capture boundaries and host-to-runtime/Interop bridging.

## Dependencies
Parent Extension Chrome foundation Task and public App/Core/Interop/Runtime boundaries.

## Done Criteria
The extension can remain thin and environment-specific automation is injected rather than embedded.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-extension-chrome-foundation.trace.md](../001-extension-chrome-foundation.trace.md)
  - Value: bgR_GKRNNgPqk7HltQZSnVhVnMI5qNRNiS110ZyJHxU

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: kMKPyRZ0IWGfu-tF1UzyhAYOOUvyQCwdn3uEd0J1s44