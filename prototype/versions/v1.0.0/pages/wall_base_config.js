/** 大屏基础配置：主题启用/排序、模块上墙（由管理后台写入） */
window.WallBaseConfig = (function () {
  const THEME_KEY = 'hn_wall_theme_cfg_v1';
  const MODULE_KEY = 'hn_wall_module_cfg_v1';

  const DEFAULT_THEMES = [
    { key: '概览', enabled: true, sort: 1, isDefault: true },
    { key: '生产', enabled: true, sort: 2, isDefault: false },
    { key: '交通', enabled: true, sort: 3, isDefault: false },
    { key: '设备', enabled: true, sort: 4, isDefault: false },
    { key: '经营', enabled: true, sort: 5, isDefault: false },
    { key: '调度', enabled: true, sort: 6, isDefault: false }
  ];

  function loadThemeCfg() {
    try {
      const raw = localStorage.getItem(THEME_KEY);
      if (!raw) return { themes: DEFAULT_THEMES.map((x) => Object.assign({}, x)) };
      const data = JSON.parse(raw);
      if (!data.themes || !data.themes.length) return { themes: DEFAULT_THEMES.map((x) => Object.assign({}, x)) };
      return data;
    } catch (e) {
      return { themes: DEFAULT_THEMES.map((x) => Object.assign({}, x)) };
    }
  }

  function loadModuleCfg() {
    try {
      return JSON.parse(localStorage.getItem(MODULE_KEY) || '{"modules":[]}');
    } catch (e) {
      return { modules: [] };
    }
  }

  function orderedThemeKeys() {
    return loadThemeCfg()
      .themes.slice()
      .sort((a, b) => a.sort - b.sort)
      .map((t) => t.key);
  }

  function disabledThemeKeys() {
    return loadThemeCfg()
      .themes.filter((t) => !t.enabled)
      .map((t) => t.key);
  }

  function defaultThemeKey() {
    const list = loadThemeCfg().themes;
    const d = list.find((t) => t.isDefault && t.enabled) || list.find((t) => t.enabled);
    return d ? d.key : '概览';
  }

  /** 写入 wall_theme_nav 使用的全局变量 */
  function applyThemeGlobals() {
    const disabled = disabledThemeKeys();
    if (typeof THEME_DISABLED !== 'undefined') {
      THEME_DISABLED.length = 0;
      disabled.forEach((k) => THEME_DISABLED.push(k));
    }
    window.THEME_ORDER = orderedThemeKeys();
    window.THEME_DEFAULT = defaultThemeKey();
  }

  function isModuleOnWall(themeId, modKey) {
    const cfg = loadModuleCfg();
    const hit = (cfg.modules || []).find((m) => m.themeId === themeId && m.key === modKey);
    if (!hit) return true;
    return !!hit.onWall;
  }

  function applyModuleVisibility(themeId) {
    document.querySelectorAll('[data-wall-mod]').forEach((el) => {
      const key = el.getAttribute('data-wall-mod');
      const on = isModuleOnWall(themeId, key);
      el.classList.toggle('wall-mod-off', !on);
      el.style.display = on ? '' : 'none';
    });
  }

  function getThemeKeysForNav() {
    applyThemeGlobals();
    const order = window.THEME_ORDER || Object.keys(typeof THEME_PAGES !== 'undefined' ? THEME_PAGES : {});
    return order.filter((k) => typeof THEME_PAGES === 'undefined' || THEME_PAGES[k]);
  }

  return {
    THEME_KEY,
    MODULE_KEY,
    DEFAULT_THEMES,
    loadThemeCfg,
    loadModuleCfg,
    orderedThemeKeys,
    disabledThemeKeys,
    defaultThemeKey,
    applyThemeGlobals,
    isModuleOnWall,
    applyModuleVisibility,
    getThemeKeysForNav
  };
})();

/* 若已加载 wall_theme_nav，立即同步禁用列表与顺序 */
if (typeof THEME_PAGES !== 'undefined') {
  WallBaseConfig.applyThemeGlobals();
}
