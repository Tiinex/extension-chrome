# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.feedback.v1](https://github.com/Tiinex/docs/blob/e713557f8be630967571d11a73f9ecd05ae329ce/.topics/.schemas/core/feedback/tiinex.feedback.v1.schema.md)
  - Created At: 2026-09-11 17:22:00
  - Trace: [001-1-sigma-chrome-human-test-denial-and-experimental-boundary-feedback.trace.md](001-1-sigma-chrome-human-test-denial-and-experimental-boundary-feedback.trace.md)
  - Origin:
    - [relative](001-1-sigma-chrome-human-test-denial-and-experimental-boundary-feedback.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-11 17:22:00
  - Authors: Anchor
  - Why: The current Chrome plus interop-openai approach is highly experimental and may create unsafe repeated triggering if we automate before grounding the actual host surface.
  - Summary: Human-assisted, fail-closed discovery of current host DOM/accessibility behavior before any live Chrome automation.
  - Status: ready/local

---

# Chrome Experimental DOM And Accessibility Reconnaissance

## Objective

Establish a plausible, human-assisted and fail-closed interaction model for the highly experimental Chrome-extension + OpenAI-host seam before any live automation test or implementation expansion.

## Done Criteria

- Inspect the current `extension-chrome` implementation and current `interop-openai` boundary without assuming either already solves host interaction.
- Inspect Sigma's historical `chrome.zip` only as reference evidence: record useful proven anchors/workarounds and explicitly reject stale or unsafe assumptions.
- Ask Sigma for the smallest concrete human observation needed to map current DOM hierarchy/accessibility semantics before implementing host-driving behavior.
- Produce a selector/accessibility strategy that prefers stable roles/labels/test ids and observable state over deep brittle DOM paths.
- Define a finite event/state machine for any future interaction with explicit one-shot eligibility, dedupe, re-entry guards, cooldown/backoff and a hard maximum action count per operator intent.
- No background polling loop, MutationObserver-to-action feedback loop, repeated synthetic clicking, debugger submit path, automatic message submit, or automatic Handoff download is implemented in this reconnaissance.
- Separate what is known from the current host, what comes only from historical prototype evidence, and what remains UNKNOWN.

## Scope

Experimental discovery and design evidence only. No human acceptance test, no production automation and no remote mutation.

## Dependencies

- Sigma human aid for current host DOM/accessibility observations when Kodax identifies the exact questions.
- Current Extension Chrome Workspace.
- Current `interop-openai` Workspace as read-only adjacent experiment context.
- Historical `chrome.zip` supplied separately by Sigma as non-authoritative reference evidence.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-1-sigma-chrome-human-test-denial-and-experimental-boundary-feedback.trace.md](001-1-sigma-chrome-human-test-denial-and-experimental-boundary-feedback.trace.md)
  - Value: lV77YFoj49oncVL0FeI4alVYOt8n2nz1uR7GVaXoVL4

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: PkEnKGgvn1Vt4UiMqpfoEquU79QsOhCViSvFemPVCBQ