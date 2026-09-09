# extension-chrome

First-party Chrome extension for Tiinex — browser-hosted Workspace interaction, artifact capture, grounding support and bounded automation over Tiinex App, Core and Interop contracts.

## Turn-2 boundary

This repository is the Chrome host frontier. It may bridge browser capabilities into public Tiinex contracts, but it must not become semantic authority, copy shared Core/App implementation, or absorb OpenAI-specific behavior that belongs in `interop-openai`.

The repository is intentionally source-minimal until its owning Task qualifies the extension contract and build/distribution model.
