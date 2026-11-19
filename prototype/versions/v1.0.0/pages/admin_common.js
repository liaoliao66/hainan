/** 管理后台共用：Toast / 弹窗 / 本地存储 / CRUD 表格 / 统一入口嵌入 */
(function applyConsoleEntry() {
  try {
    const params = new URLSearchParams(location.search);
    const file = (location.pathname.split('/').pop() || '').toLowerCase();
    const hashMap = {
      'admin_base.html': 'base',
      'admin_overview.html': 'overview',
      'admin_production.html': 'production',
      'admin_traffic.html': 'traffic',
      'admin_equipment.html': 'equipment',
      'admin_business.html': 'business',
      'admin_dispatch.html': 'dispatch'
    };
    if (params.get('embed') === '1') {
      document.documentElement.classList.add('admin-embed');
      const style = document.createElement('style');
      style.textContent = `
        html.admin-embed,html.admin-embed body{height:100%;margin:0}
        html.admin-embed body{display:block!important;min-height:100%;overflow:auto;background:#f8fafc}
        html.admin-embed body > aside{display:none!important}
        html.admin-embed main{padding:12px 16px!important;max-width:none}
        html.admin-embed .admin-embed-hide{display:none!important}
        html.admin-embed #pageTitle,html.admin-embed #pageDesc{font-size:inherit}
        html.admin-embed [data-panel="scene"] .scene-layout{display:grid!important;grid-template-columns:minmax(280px,34%) 1fr;gap:12px;align-items:start}
      `;
      document.head.appendChild(style);
      return;
    }
    if (hashMap[file] && !params.get('standalone')) {
      const mod = (location.hash || '#home').replace(/^#/, '') || 'home';
      location.replace('admin_console.html#' + hashMap[file] + '/' + mod);
    }
  } catch (e) {}
})();

window.AdminKit = (function () {
  function toast(m) {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = m;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 1800);
  }

  function uid(p) {
    return (p || 'id') + Math.random().toString(36).slice(2, 8);
  }

  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function load(key, defaults) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : clone(defaults);
    } catch (e) {
      return clone(defaults);
    }
  }

  function save(key, state) {
    localStorage.setItem(key, JSON.stringify(state));
    toast('已保存到本地演示存储');
  }

  function ensureModal() {
    if (document.getElementById('modal')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<div class="modal-mask" id="modal">
  <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-slate-200">
    <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
      <h3 class="font-semibold" id="modalTitle">编辑</h3>
      <button type="button" class="text-slate-400 hover:text-slate-700 text-xl leading-none" id="modalClose">×</button>
    </div>
    <div class="p-4 space-y-3 text-sm max-h-[70vh] overflow-auto" id="modalBody"></div>
    <div class="px-4 py-3 border-t border-slate-100 flex justify-end gap-2" id="modalFoot">
      <button type="button" class="rounded-xl border px-3 py-1.5" id="modalCancel">取消</button>
      <button type="button" class="rounded-xl bg-sky-700 text-white px-3 py-1.5" id="modalOk">确定</button>
    </div>
  </div>
</div>
<style>
.toast{position:fixed;right:20px;bottom:20px;z-index:80;background:#0f172a;color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;opacity:0;transform:translateY(8px);transition:.2s}
.toast.show{opacity:1;transform:none}
.modal-mask{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:60;display:none;align-items:center;justify-content:center;padding:16px}
.modal-mask.show{display:flex}
[data-panel].hidden{display:none!important}
</style>`;
    document.body.appendChild(wrap);
    document.getElementById('modalClose').onclick = closeModal;
    document.getElementById('modalCancel').onclick = closeModal;
  }

  let modalOk = null;
  function openModal(title, html, onOk, opts) {
    ensureModal();
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = html;
    const foot = document.getElementById('modalFoot');
    const viewOnly = opts && opts.viewOnly;
    foot.style.display = viewOnly ? 'none' : 'flex';
    if (viewOnly) {
      document.getElementById('modalClose').onclick = closeModal;
    }
    modalOk = onOk;
    document.getElementById('modalOk').onclick = () => {
      if (modalOk && modalOk() !== false) closeModal();
    };
    document.getElementById('modal').classList.add('show');
  }

  function closeModal() {
    const m = document.getElementById('modal');
    if (m) m.classList.remove('show');
    modalOk = null;
  }

  function field(label, id, value, type) {
    if (type === 'select') {
      const opts = value.options
        .map((o) => `<option value="${o}" ${o === value.value ? 'selected' : ''}>${o}</option>`)
        .join('');
      return `<label class="text-xs text-slate-500 block">${label}<select id="${id}" class="mt-1 w-full rounded border px-2 py-1.5 text-sm" ${value.disabled ? 'disabled' : ''}>${opts}</select></label>`;
    }
    if (type === 'textarea') {
      return `<label class="text-xs text-slate-500 block">${label}<textarea id="${id}" class="mt-1 w-full rounded border px-2 py-1.5 text-sm" rows="3" ${value && value.disabled ? 'disabled' : ''}>${(value && value.value) != null ? value.value : value || ''}</textarea></label>`;
    }
    if (type === 'checkbox') {
      return `<label class="text-xs text-slate-500 flex items-center gap-2"><input id="${id}" type="checkbox" ${value ? 'checked' : ''} ${value && value.disabled ? 'disabled' : ''}> ${label}</label>`;
    }
    const v = value && typeof value === 'object' ? value.value : value;
    const dis = value && typeof value === 'object' && value.disabled ? 'disabled' : '';
    return `<label class="text-xs text-slate-500 block">${label}<input id="${id}" type="${type || 'text'}" class="mt-1 w-full rounded border px-2 py-1.5 text-sm" value="${v == null ? '' : v}" ${dis}></label>`;
  }

  function val(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'number') return el.value === '' ? 0 : +el.value;
    return el.value;
  }

  function showPanel(name, meta, opts) {
    document.querySelectorAll('[data-panel]').forEach((el) => {
      el.classList.toggle('hidden', el.getAttribute('data-panel') !== name);
    });
    document.querySelectorAll('#sideNav .nav').forEach((a) => {
      const on = a.getAttribute('data-nav') === name;
      a.classList.toggle('bg-slate-700', on);
      a.classList.toggle('text-white', on);
      a.classList.toggle('text-slate-200', !on);
    });
    if (meta && meta[name]) {
      const title = document.getElementById('pageTitle');
      const desc = document.getElementById('pageDesc');
      if (title) title.textContent = meta[name].title;
      if (desc) desc.textContent = meta[name].desc;
    }
    if (!(opts && opts.silentHash) && location.hash !== '#' + name) {
      location.hash = name;
    }
  }

  function bindNav(meta) {
    document.querySelectorAll('#sideNav .nav').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showPanel(a.getAttribute('data-nav'), meta);
      });
    });
    window.addEventListener('hashchange', () => {
      const name = (location.hash || '#home').replace(/^#/, '') || 'home';
      if (meta && meta[name]) showPanel(name, meta, { silentHash: true });
    });
  }

  function nowAsof() {
    const n = new Date();
    const p = (x) => String(x).padStart(2, '0');
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
  }

  const SOURCE_SYSTEMS = [
    '演示数据（本后台维护）',
    '码头生产管理系统',
    '卡口通行系统',
    '设备设施监测系统',
    '视频监控平台',
    '气象通航信息',
    '经营分析系统',
    '智慧调度/应急系统',
    '海关通关（模拟）',
    '其他（手填）'
  ];

  const MODE_LABEL = { demo: '演示数据', formal: '正式接口', mixed: '混合' };
  const WALL_SOURCE_KEY = 'hn_wall_source_v1';

  function defaultSource(partial) {
    return Object.assign(
      {
        mode: 'demo',
        system: '演示数据（本后台维护）',
        systemCustom: '',
        api: '',
        note: '当前为演示数据，仅供汇报展示，不作生产决策依据。'
      },
      partial || {}
    );
  }

  function resolveSystem(src) {
    if (!src) return '';
    if (src.system === '其他（手填）') return String(src.systemCustom || '').trim();
    return String(src.system || '').trim();
  }

  function sourceModeLabel(src) {
    return MODE_LABEL[(src && src.mode) || 'demo'] || '演示数据';
  }

  function sourceSummary(src) {
    const mode = sourceModeLabel(src);
    if (!src || src.mode === 'demo') return mode;
    const sys = resolveSystem(src) || '未填系统';
    const api = String(src.api || '').trim() || '未填接口';
    return `${mode} · ${sys} · ${api}`;
  }

  function ensureSources(state, keys, presets) {
    if (!state.sources) state.sources = {};
    keys.forEach((k) => {
      const preset = (presets && presets[k]) || {};
      state.sources[k] = defaultSource(Object.assign({}, preset, state.sources[k] || {}));
    });
    return state;
  }

  function validateSource(src, title) {
    const name = title || '模块';
    if (!src || src.mode === 'demo') return null;
    const sys = resolveSystem(src);
    if (!sys || sys === '演示数据（本后台维护）') {
      return `「${name}」正式/混合模式请选择来源系统（不可仍为演示）`;
    }
    if (!String(src.api || '').trim()) {
      return `「${name}」正式/混合模式请填写接口标识`;
    }
    if (src.mode === 'mixed' && !String(src.note || '').trim()) {
      return `「${name}」混合模式请在说明中写清各指标来源`;
    }
    return null;
  }

  function validateAllSources(state, keys, meta) {
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const title = meta && meta[k] ? meta[k].title : k;
      const err = validateSource(state.sources && state.sources[k], title);
      if (err) return err;
    }
    return null;
  }

  function publishWallSource(themeKey, state, keys) {
    let bag = {};
    try {
      bag = JSON.parse(localStorage.getItem(WALL_SOURCE_KEY) || '{}') || {};
    } catch (e) {
      bag = {};
    }
    const modules = {};
    (keys || Object.keys((state && state.sources) || {})).forEach((k) => {
      modules[k] = clone((state.sources && state.sources[k]) || defaultSource());
    });
    const modes = Object.keys(modules).map((k) => modules[k].mode);
    let wallMode = 'demo';
    if (modes.length && modes.every((m) => m === 'formal')) wallMode = 'formal';
    else if (modes.some((m) => m === 'formal' || m === 'mixed')) wallMode = 'mixed';
    if (state && state.global && state.global.demo === false && wallMode === 'demo') {
      /* 总开关关闭且模块仍标演示：大屏按「待接正式」提示 */
      wallMode = 'pending';
    }
    bag[themeKey] = {
      updatedAt: new Date().toISOString(),
      globalDemo: !!(state && state.global && state.global.demo),
      globalBadge: state && state.global && state.global.badge != null ? !!state.global.badge : true,
      wallMode,
      modules
    };
    localStorage.setItem(WALL_SOURCE_KEY, JSON.stringify(bag));
  }

  function paintSourceHost(modKey, src, onChange) {
    const host = document.querySelector(`[data-source-host="${modKey}"]`);
    if (!host) return;
    const s = defaultSource(src);
    const sysOpts = SOURCE_SYSTEMS.map(
      (x) => `<option value="${x}" ${s.system === x ? 'selected' : ''}>${x}</option>`
    ).join('');
    const modeCls =
      s.mode === 'formal'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : s.mode === 'mixed'
          ? 'bg-sky-50 text-sky-700 border-sky-200'
          : 'bg-amber-50 text-amber-700 border-amber-200';
    host.innerHTML = `
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div class="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <div class="font-semibold text-sm">数据来源配置</div>
            <p class="text-xs text-slate-500 mt-0.5">说明本模块大屏数据是演示维护，还是来自哪个业务系统接口</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full border ${modeCls}">${sourceModeLabel(s)}</span>
        </div>
        <div class="grid md:grid-cols-2 gap-3 text-sm">
          <label class="text-xs text-slate-500 block">数据模式
            <select data-src-field="mode" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
              <option value="demo" ${s.mode === 'demo' ? 'selected' : ''}>演示数据</option>
              <option value="formal" ${s.mode === 'formal' ? 'selected' : ''}>正式接口</option>
              <option value="mixed" ${s.mode === 'mixed' ? 'selected' : ''}>混合（部分演示+部分接口）</option>
            </select>
          </label>
          <label class="text-xs text-slate-500 block">来源系统
            <select data-src-field="system" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm">${sysOpts}</select>
          </label>
          <label class="text-xs text-slate-500 block md:col-span-2 ${s.system === '其他（手填）' ? '' : 'hidden'}" data-src-custom-wrap>
            自定义系统名称
            <input data-src-field="systemCustom" type="text" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" value="${s.systemCustom || ''}" placeholder="例如：第三方堆场系统">
          </label>
          <label class="text-xs text-slate-500 block md:col-span-2">接口标识
            <input data-src-field="api" type="text" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" value="${s.api || ''}" placeholder="例如：GET /api/throughput/summary 或 生产系统-吞吐汇总">
          </label>
          <label class="text-xs text-slate-500 block md:col-span-2">说明
            <textarea data-src-field="note" rows="2" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" placeholder="补充口径，如：实际取生产系统，目标值本后台配置">${s.note || ''}</textarea>
          </label>
        </div>
        <div class="mt-3 text-xs text-slate-500 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2" data-src-preview>
          当前：${sourceSummary(s)}
        </div>
      </div>`;
    const read = () => {
      const next = defaultSource(s);
      host.querySelectorAll('[data-src-field]').forEach((el) => {
        next[el.getAttribute('data-src-field')] = el.value;
      });
      return next;
    };
    const refresh = () => {
      const next = read();
      const wrap = host.querySelector('[data-src-custom-wrap]');
      if (wrap) wrap.classList.toggle('hidden', next.system !== '其他（手填）');
      const preview = host.querySelector('[data-src-preview]');
      if (preview) preview.textContent = '当前：' + sourceSummary(next);
      const badge = host.querySelector('.rounded-full');
      if (badge) {
        badge.textContent = sourceModeLabel(next);
        badge.className =
          'text-xs px-2.5 py-1 rounded-full border ' +
          (next.mode === 'formal'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : next.mode === 'mixed'
              ? 'bg-sky-50 text-sky-700 border-sky-200'
              : 'bg-amber-50 text-amber-700 border-amber-200');
      }
      if (onChange) onChange(modKey, next);
    };
    host.querySelectorAll('[data-src-field]').forEach((el) => {
      el.addEventListener('change', refresh);
      el.addEventListener('input', refresh);
    });
  }

  function mountSources(state, keys, onChange) {
    keys.forEach((k) => {
      const panel = document.querySelector(`[data-panel="${k}"]`);
      if (!panel) return;
      let host = panel.querySelector(`[data-source-host="${k}"]`);
      if (!host) {
        host = document.createElement('div');
        host.setAttribute('data-source-host', k);
        host.className = 'mb-0';
        panel.insertBefore(host, panel.firstChild);
      }
      paintSourceHost(k, state.sources[k], (key, next) => {
        state.sources[key] = next;
        if (onChange) onChange(key, next);
      });
    });
  }

  function homeSourceCell(state, key) {
    return sourceSummary(state.sources && state.sources[key]);
  }

  return {
    toast,
    uid,
    clone,
    load,
    save,
    openModal,
    closeModal,
    field,
    val,
    showPanel,
    bindNav,
    nowAsof,
    ensureModal,
    SOURCE_SYSTEMS,
    MODE_LABEL,
    WALL_SOURCE_KEY,
    defaultSource,
    resolveSystem,
    sourceModeLabel,
    sourceSummary,
    ensureSources,
    validateSource,
    validateAllSources,
    publishWallSource,
    mountSources,
    paintSourceHost,
    homeSourceCell
  };
})();
