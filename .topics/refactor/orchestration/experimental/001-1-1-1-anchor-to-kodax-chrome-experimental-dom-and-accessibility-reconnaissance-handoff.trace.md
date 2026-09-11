# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-11 17:22:00
  - Trace: [001-1-1-chrome-experimental-dom-and-accessibility-reconnaissance-task.trace.md](001-1-1-chrome-experimental-dom-and-accessibility-reconnaissance-task.trace.md)
  - Origin:
    - [relative](001-1-1-chrome-experimental-dom-and-accessibility-reconnaissance-task.trace.md)
- Current
  - Current Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-11 17:24:38
  - Authors: Anchor
  - Why: The denied human test exposed that current host DOM/accessibility behavior is not grounded enough to authorize automation safely.
  - Summary: Transfer discovery-only Chrome DOM/accessibility reconnaissance to Kodax, requiring bounded Sigma observation aid before any live host automation.
  - Status: ready/local

---

# Anchor to Kodax — Chrome experimental DOM and accessibility reconnaissance

## Handoff Parties

- Purpose: replace the premature Chrome human-test path with a bounded experimental discovery that requires human-assisted DOM/accessibility grounding before any live host automation.
- From: Anchor
- From Kind: role
- From Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
- To: Kodax
- To Kind: role
- To Reference: [Kodax Role](business::.topics/roles/001-6-kodax-role.trace.md)

## Transfers

- current-host-reconnaissance
  - Transfer Kind: work-and-responsibility
  - Description: inspect current Extension Chrome and adjacent `interop-openai` surfaces, then identify the exact current-host DOM/accessibility facts needed before a safe interaction design can be proposed.
  - Controlling Artifact: [Chrome Experimental DOM And Accessibility Reconnaissance](../001-1-1-chrome-experimental-dom-and-accessibility-reconnaissance-task.trace.md)
  - Boundary: first live-host step is to ask Sigma for targeted observation aid, not to automate the page.
- historical-prototype-review
  - Transfer Kind: work
  - Description: review Sigma's separately supplied historical `chrome.zip` as stale/experimental evidence; extract reusable observations such as old accessibility/test-id anchors, explicit activation, dedupe and capture patterns, while rejecting unsafe or obsolete mechanisms.
  - Boundary: do not copy the old debugger/polling/DOM paths into current code merely because they once worked.
- safety-model
  - Transfer Kind: work
  - Description: return a finite state/event model for any later experiment with explicit operator intent, one-shot eligibility, dedupe, re-entry protection, cooldown/backoff, maximum action count and visible failure states.
  - Boundary: no implementation that can continuously trigger host actions is authorized.

## Required Context

- extension-chrome-workspace
  - Material: Complete current Extension Chrome Workspace.
  - Material Reference: [Chrome Workspace](extension-chrome::.topics/.workspaces/tiinex-extension-chrome.workspace.md)
  - Purpose: Owning current host-specific implementation boundary.
  - Availability: available
- interop-openai-workspace
  - Material: Complete current `interop-openai` Workspace.
  - Material Reference: [Interop OpenAI Workspace](interop-openai::.topics/.workspaces/tiinex-interop-openai.workspace.md)
  - Purpose: Read-only adjacent experimental integration context.
  - Availability: available
- business-workspace
  - Material: Current Business Role and orchestration context.
  - Material Reference: [Business Workspace](business::.topics/.workspaces/tiinex-business.workspace.md)
  - Purpose: Role endpoints and Anchor/Sigma boundary only; not Chrome work ownership.
  - Availability: available
- docs-workspace
  - Material: Current canonical Docs Workspace.
  - Material Reference: [Docs Workspace](docs::.topics/.workspaces/tiinex-docs.workspace.md)
  - Purpose: Provenance/Handoff/Role boundaries; read-only.
  - Availability: available

## Reference Context

- sigma-historical-chrome-archive
  - Material: historical `chrome.zip` prototype supplied by Sigma in the Anchor conversation.
  - Purpose: stale/experimental host evidence and workaround archaeology only.
  - Availability: available
  - Notes: Supplied separately by Sigma as historical reference evidence; package carriage does not make it Required Context or semantic authority.
- denied-human-test
  - Material: [Sigma Chrome Human-Test Denial And Experimental Boundary Feedback](../001-1-sigma-chrome-human-test-denial-and-experimental-boundary-feedback.trace.md)
  - Purpose: Exact human constraint that replaces the prior test request.
  - Availability: available

## Retained Responsibilities

- current-dom-and-accessibility-observation
  - Retained By: Sigma
  - Retained By Reference: [Sigma Role](business::.topics/roles/001-4-sigma-role.trace.md)
  - Responsibility: answer bounded Kodax questions about current visible DOM/accessibility hierarchy or provide screenshots/DevTools/a11y-tree observations when requested.
  - Boundary: Sigma is not expected to design the implementation or continuously steer Kodax.
- risk-and-next-experiment-gate
  - Retained By: Anchor
  - Retained By Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
  - Responsibility: decide whether returned discovery is safe and mature enough to authorize a later bounded prototype or human test.
  - Boundary: this Handoff does not pre-authorize that later step.

## Exclusions And Dependencies

- live-host-automation
  - Kind: excluded-scope
  - Description: No auto-submit, synthetic click loop, debugger-driven submit, automatic download, hidden host action or repeated page mutation is authorized.
  - Responsible Party Or Role: later explicit experiment only after review.
- polling-and-reentrant-observers
  - Kind: excluded-scope
  - Description: No continuous polling, high-frequency timers or observer-to-action feedback loops.
  - Responsible Party Or Role: excluded.
- openai-semantic-assumption
  - Kind: excluded-scope
  - Description: Do not treat external DOM structure, accessibility labels or undocumented host state as stable Tiinex/OpenAI semantic authority.
  - Responsible Party Or Role: discovery must report uncertainty.
- release-and-remote-mutation
  - Kind: excluded-scope
  - Description: No store release, deployment, remote push or publication.
  - Responsible Party Or Role: later explicit gate.

## Completion Expectation

- Signal Kind: return
- Signal Meaning: Return a Chrome-owned discovery/evidence artifact and normal Handoff to Anchor containing: exact questions asked of Sigma and observations received (if available), historical-vs-current host evidence, safe interaction invariants, unresolved UNKNOWNs, and the smallest proposed next experiment. No live automation implementation is required or implied.
- Return To: Anchor
- Return To Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)

## Interpretation Limits

- Does Not Mean: the OpenAI host DOM is stable, historical workarounds are reusable, interop-openai is production-ready, or a safe automation path has been proven.
- Must Not Be Used To Claim: absence of a reproduced infinite loop proves safety; or that a DOM selector grants authority to act.
- Authority Limits: bounded experimental discovery only.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-1-1-chrome-experimental-dom-and-accessibility-reconnaissance-task.trace.md](001-1-1-chrome-experimental-dom-and-accessibility-reconnaissance-task.trace.md)
  - Value: PkEnKGgvn1Vt4UiMqpfoEquU79QsOhCViSvFemPVCBQ

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: QdpPdi2LTwkZZJi1VB-nGYeRICm-64S2QZUwJUQ4yyI