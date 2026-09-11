(() => {
  const INSTALL_KEY = '__tiinexOperatorAidBridgeInstalled';
  const EVENT_NAME = 'tiinex:host-observation';
  const ALLOWED = new Set(['play', 'finish', 'slow-run', 'safety-check', 'delayed-run', 'clear', 'handoff-result']);

  if (globalThis[INSTALL_KEY]) return;
  globalThis[INSTALL_KEY] = true;

  window.addEventListener(EVENT_NAME, (event) => {
    const detail = event instanceof CustomEvent && event.detail && typeof event.detail === 'object'
      ? event.detail
      : {};
    const type = typeof detail.type === 'string' ? detail.type : '';
    if (!ALLOWED.has(type)) return;

    const message = {
      kind: 'page-observation',
      observation: {
        type,
        observedAt: Date.now()
      }
    };

    if (type === 'handoff-result') {
      message.observation.identity = typeof detail.identity === 'string' ? detail.identity : '';
      message.observation.url = typeof detail.url === 'string' ? detail.url : '';
      message.observation.qualified = detail.qualified === true;
    }

    chrome.runtime.sendMessage(message).catch(() => {});
  });
})();
