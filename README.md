# extension-chrome

First-party Chrome extension host for Tiinex — browser-hosted operator support over public Tiinex boundaries.

## Current bounded tranche

This source implements a provider-neutral Manifest V3 operator aid with three deliberately narrow surfaces:

- **Play → Finish benchmark:** records the browser-observed wall-clock interval between an explicit Play and Finish signal. It does not claim model-internal latency or hidden runtime timing.
- **Observed run conditions:** surfaces only explicit `slow-run`, `safety-check`, and `delayed-run` observations supplied by the operator or an armed page event. The UI labels these as observations and does not infer hidden safety state.
- **Handoff download helper:** downloads an explicit HTTP(S) package URL once per exact opaque package identity, blocks pending/completed duplicates, and applies retry backoff after interruption. Automatic download is off by default and only reacts to an armed page event that explicitly reports a qualified result.

The extension does **not** contain provider selectors, high-frequency polling, synthetic click loops, hidden endpoint access, rate-limit/safeguard bypasses, or Handoff semantic validation. Shared Handoff meaning stays in Docs/Core. Provider-specific observation adapters belong in the relevant Interop repository.

## Load unpacked

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked** and select this repository root.
4. Pin **Tiinex Operator Aid** if desired.

The manifest intentionally has no `host_permissions`. Page observation access is granted only when the operator opens the extension and presses **Arm page**, using Chrome's `activeTab` + `scripting` capability.

## Operator flow

Use **Play** at the observable beginning of a run and **Finish** when the run is observably complete. The elapsed result is a browser-host measurement only.

Use the observed-condition buttons when the browser visibly exposes a slow, safety-check, or delayed state. These buttons record what was observed; they do not classify hidden model/runtime state.

For a Handoff package, enter the exact opaque package identity and its HTTP(S) URL, then choose **Download once**. A completed identity will not download again. Interrupted attempts are retry-limited with exponential backoff.

## Optional page-event bridge

After **Arm page**, the content bridge listens for one provider-neutral DOM event:

```js
window.dispatchEvent(new CustomEvent('tiinex:host-observation', {
  detail: { type: 'play' }
}));
```

Supported `type` values are `play`, `finish`, `slow-run`, `safety-check`, `delayed-run`, `clear`, and `handoff-result`.

A bounded Handoff result signal is shaped like:

```js
window.dispatchEvent(new CustomEvent('tiinex:host-observation', {
  detail: {
    type: 'handoff-result',
    qualified: true,
    identity: 'opaque-exact-package-identity',
    url: 'https://example.invalid/result.handoff-package.zip'
  }
}));
```

The Chrome host treats `qualified` as an observable upstream claim; it does not create or verify Tiinex qualification authority. Automatic download also requires the operator to enable the popup toggle, and normal dedupe/backoff rules still apply.

## Qualification

```bash
npm test
```

The local tests cover benchmark state transitions, observation-only status handling, exact-identity download dedupe/backoff, URL restrictions, manifest permissions, provider isolation, and the absence of polling/synthetic-click behavior.

## Boundary

This repository remains the Chrome host frontier. Shared semantics and Handoff mechanics stay in Docs/Core; OpenAI-specific browser behavior stays in Interop OpenAI. The historical `.topics/refactor/001-extension-chrome-foundation.trace.md` Parent uses the known older cross-Workspace locator pattern, so this tranche intentionally adds no new extension-local Tiinex artifact lineage.
