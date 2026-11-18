/** 管理后台共用：Toast / 弹窗 / 本地存储 / CRUD 表格 */
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

  function showPanel(name, meta) {
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
      document.getElementById('pageTitle').textContent = meta[name].title;
      document.getElementById('pageDesc').textContent = meta[name].desc;
    }
    location.hash = name;
  }

  function bindNav(meta) {
    document.querySelectorAll('#sideNav .nav').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showPanel(a.getAttribute('data-nav'), meta);
      });
    });
  }

  function nowAsof() {
    const n = new Date();
    const p = (x) => String(x).padStart(2, '0');
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
  }

  return { toast, uid, clone, load, save, openModal, closeModal, field, val, showPanel, bindNav, nowAsof, ensureModal };
})();
