/** 大屏读取管理后台「数据来源」配置，同步角标文案 */
window.WallSourceBadge = (function () {
  const KEY = 'hn_wall_source_v1';
  const LABEL = {
    demo: '演示数据',
    formal: '正式接口',
    mixed: '混合取数',
    pending: '待接正式'
  };

  function readTheme(themeKey) {
    try {
      const bag = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
      return bag[themeKey] || null;
    } catch (e) {
      return null;
    }
  }

  function textFor(themeKey) {
    const t = readTheme(themeKey);
    if (!t) return '演示数据';
    if (t.globalBadge === false && t.wallMode === 'demo') return '正式展示';
    return LABEL[t.wallMode] || '演示数据';
  }

  function titleFor(themeKey) {
    const t = readTheme(themeKey);
    if (!t || !t.modules) return '尚未在管理后台配置数据来源';
    const lines = Object.keys(t.modules).map((k) => {
      const s = t.modules[k] || {};
      const mode = LABEL[s.mode] || s.mode;
      const sys = s.system === '其他（手填）' ? s.systemCustom || '其他' : s.system;
      const api = s.api || '—';
      return `${k}: ${mode} / ${sys} / ${api}`;
    });
    return lines.join('\n');
  }

  function apply(themeKey, selector) {
    const text = textFor(themeKey);
    const tip = titleFor(themeKey);
    const nodes = document.querySelectorAll(selector || '[data-wall-source-badge]');
    nodes.forEach((el) => {
      el.textContent = text;
      el.setAttribute('title', tip);
      el.classList.toggle('is-formal', text === '正式接口');
      el.classList.toggle('is-mixed', text === '混合取数');
      el.classList.toggle('is-demo', text === '演示数据' || text === '待接正式' || text === '正式展示');
    });
    return text;
  }

  return { readTheme, textFor, titleFor, apply };
})();
