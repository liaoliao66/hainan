const THEME_PAGES = {
  '概览': 'pc_wall_command_screen.html',
  '生产': 'pc_wall_theme_production.html',
  '交通': 'pc_wall_theme_traffic.html',
  '设备': 'pc_wall_theme_equipment.html',
  '经营': 'pc_wall_theme_business.html',
  '调度': 'pc_wall_theme_dispatch.html'
};

/** 已开放主题列表；空数组表示全部可跳转 */
const THEME_DISABLED = [];
const THEME_DISABLED_TIP = '该主题本期未开放';

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
  toast._t = setTimeout(() => t.classList.remove('show'), 1600);
}

function tickClock() {
  const n = new Date();
  const pad = (x) => String(x).padStart(2, '0');
  const date = document.getElementById('hd-date');
  const week = document.getElementById('hd-week');
  const time = document.getElementById('hd-time');
  const asof = document.getElementById('hd-asof');
  const weekStr = '星期' + '日一二三四五六'[n.getDay()];
  if (date) {
    const base = `${n.getFullYear()}年${pad(n.getMonth() + 1)}月${pad(n.getDate())}日`;
    date.textContent = week ? base : `${base} ${weekStr}`;
  }
  if (week) week.textContent = weekStr;
  if (time) time.textContent = `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
  if (asof) asof.textContent = `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`;
  if (typeof mountWeather === 'function') mountWeather();
}

function renderThemeNav(active) {
  const el = document.getElementById('themes');
  if (!el) return;
  const health = el.querySelector('.health');
  const extras = [...el.querySelectorAll(':scope > button')];
  const links = Object.keys(THEME_PAGES)
    .map((k) => {
      if (THEME_DISABLED.includes(k)) {
        return `<span class="theme off" data-theme="${k}" title="${THEME_DISABLED_TIP}">${k}</span>`;
      }
      let href = THEME_PAGES[k];
      if (k === '概览' && active && active !== '概览') href += `?from=${encodeURIComponent(active)}`;
      return `<a class="theme ${k === active ? 'on' : ''}" href="${href}">${k}</a>`;
    })
    .join('');
  const keep = (health ? health.outerHTML : '') + extras.map((n) => n.outerHTML).join('');
  el.innerHTML = links + keep;
  el.querySelectorAll('.theme.off').forEach((node) => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      toast(THEME_DISABLED_TIP);
    });
  });
}

function openDrill(n, t, s) {
  const box = document.getElementById('drill');
  if (!box) return;
  const title = document.getElementById('d-title');
  const type = document.getElementById('d-t') || document.getElementById('d-type');
  const status = document.getElementById('d-s') || document.getElementById('d-status');
  const feat = typeof findMapFeature === 'function' ? findMapFeature(n) : null;
  const kind = (feat && feat.type) || t || '';
  const state = (feat && feat.status) || s || '';
  if (title) title.textContent = n || '-';
  if (type) type.textContent = kind || '-';
  if (status) status.textContent = state || '-';
  const kicker = document.getElementById('d-kicker');
  if (kicker) kicker.textContent = kind || '对象';
  const pill = document.getElementById('d-pill');
  if (pill) {
    pill.textContent = state;
    pill.className = 'd-pill ' + (typeof toneOf === 'function' ? toneOf(state) : '');
  }
  const side = document.getElementById('side-name');
  if (side) side.textContent = n || '-';
  const tm = document.getElementById('d-time');
  if (tm) tm.textContent = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  const icon = document.getElementById('d-icon');
  if (icon) icon.className = 'fa-solid ' + ((typeof POI_ICON !== 'undefined' && POI_ICON[kind]) || 'fa-location-dot');
  const dims = document.getElementById('d-dims');
  if (dims) {
    dims.innerHTML = feat
      ? renderFeatureDims(feat)
      : `<div class="dim"><div class="row"><span>类型</span><b>${escHtml(t || '-')}</b></div><div class="row"><span>状态</span><b>${escHtml(s || '-')}</b></div></div>`;
  }
  if (typeof showPoiTrack === 'function') showPoiTrack(feat);
  if (typeof TrackReplay !== 'undefined' && TrackReplay.stop) TrackReplay.stop();
  box.classList.add('show');
  box.classList.toggle('yard-on', !!feat);
  if (typeof bindTrackReplayInDrill === 'function') {
    requestAnimationFrame(() => bindTrackReplayInDrill());
  }
  document.getElementById('map')?.classList.add('drill-on');
  const close = document.getElementById('d-close');
  if (close && !close.dataset.bound) {
    close.dataset.bound = '1';
    close.onclick = () => {
      box.classList.remove('show');
      box.classList.remove('yard-on');
      document.getElementById('map')?.classList.remove('drill-on');
      if (typeof TrackReplay !== 'undefined' && TrackReplay.stop) TrackReplay.stop();
      if (typeof showPoiTrack === 'function') showPoiTrack(null);
      document.querySelectorAll('.poi').forEach((poi) => poi.classList.remove('focus'));
    };
  }
}

function focusPoiByName(name) {
  if (!wallCan('pick')) {
    toast('未登录操控席，不能点选');
    return false;
  }
  let hit = false;
  document.querySelectorAll('.poi').forEach((p) => {
    p.classList.remove('focus');
    const n = p.dataset.n || p.dataset.name || '';
    if (name && n === name) {
      hit = true;
      p.classList.add('focus');
      openDrill(n, p.dataset.t || p.dataset.type || '', p.dataset.s || '');
      toast('定位：' + n);
    }
  });
  if (!hit && name && typeof findMapFeature === 'function') {
    const feat = findMapFeature(name);
    if (feat) {
      openDrill(feat.name, feat.type, feat.status);
      toast('定位：' + feat.name);
      return true;
    }
  }
  return hit;
}

const WALL_ROLE = {
  guest: { name: '未登录', theme: false, pick: false, video: false, drag: false, reset: false },
  leader: { name: '领导', theme: true, pick: true, video: true, drag: false, reset: false },
  duty: { name: '值班长', theme: true, pick: true, video: true, drag: false, reset: true },
  config: { name: '配置员', theme: true, pick: true, video: true, drag: true, reset: true }
};

function wallRoleKey() {
  return localStorage.getItem('wall-role') || 'leader';
}

function wallCan(action) {
  const role = WALL_ROLE[wallRoleKey()] || WALL_ROLE.leader;
  return !!role[action];
}

function applyRoleChrome() {
  document.body.dataset.role = wallRoleKey();
  const allowTheme = wallCan('theme');
  document.querySelectorAll('[data-theme], #themes a.theme').forEach((el) => {
    el.style.pointerEvents = allowTheme ? '' : 'none';
    el.style.opacity = allowTheme ? '' : '.45';
  });
  const edit = document.getElementById('btnEdit');
  const lib = document.getElementById('btnLib');
  const reset = document.getElementById('btnReset');
  if (edit) edit.disabled = !wallCan('drag');
  if (lib) lib.disabled = !wallCan('drag');
  if (reset) reset.disabled = !wallCan('reset');
  if (!wallCan('drag')) document.body.classList.remove('edit-on');
  window.dispatchEvent(new CustomEvent('wall-role'));
}

function mountWallRole() {
  const tool = document.querySelector('.tool');
  if (!tool || document.getElementById('role-select')) {
    applyRoleChrome();
    return;
  }
  const wrap = document.createElement('label');
  wrap.style.cssText = 'display:flex;align-items:center;gap:4px;color:#cbd5e1';
  wrap.innerHTML = '操控席 <select id="role-select" style="background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:4px 6px"><option value="guest">未登录</option><option value="leader">领导</option><option value="duty">值班长</option><option value="config">配置员</option></select>';
  tool.insertBefore(wrap, tool.children[1] || null);
  const sel = wrap.querySelector('select');
  sel.value = wallRoleKey();
  sel.onchange = () => {
    localStorage.setItem('wall-role', sel.value);
    applyRoleChrome();
    toast('操控席已切换为' + (WALL_ROLE[sel.value] || WALL_ROLE.leader).name);
  };
  applyRoleChrome();
}

function bindPois() {
  document.querySelectorAll('.poi').forEach((p) => {
    if (p.classList.contains('bad') || p.classList.contains('warn')) p.classList.add('pulse');
    p.addEventListener('click', () => {
      if (!wallCan('pick')) {
        toast('未登录操控席，不能点选');
        return;
      }
      document.querySelectorAll('.poi').forEach((x) => x.classList.remove('focus'));
      p.classList.add('focus');
      const n = p.dataset.n || p.dataset.name || '对象';
      openDrill(n, p.dataset.t || p.dataset.type || '', p.dataset.s || '作业中');
      toast('选中 ' + n);
    });
  });
}

function bindTables() {
  document.querySelectorAll('.tbl tbody tr').forEach((tr) => {
    tr.classList.add('clickable');
    tr.addEventListener('click', () => {
      document.querySelectorAll('.tbl tbody tr').forEach((x) => x.classList.remove('on'));
      tr.classList.add('on');
      const n = tr.dataset.n || tr.querySelector('.hl')?.textContent?.trim();
      if (n) focusPoiByName(n);
      else toast('已选中行');
    });
  });
}

function bindVideos() {
  document.querySelectorAll('.vcell').forEach((cell) => {
    cell.addEventListener('click', () => {
      if (!wallCan('video')) {
        toast('未登录操控席，不能放大视频');
        return;
      }
      document.querySelectorAll('.vcell').forEach((x) => x.classList.remove('on'));
      cell.classList.add('on');
      const name = cell.childNodes[0]?.textContent?.trim() || '视频';
      const offline = cell.querySelector('.tag.r');
      if (offline) {
        toast(name + ' 离线 · 已降级占位');
        setDegrade(true, name + ' 视频离线，已切换占位画面');
      } else {
        toast('调取视频：' + name);
        openDrill(name, '视频', '实时预览');
      }
    });
  });
}

function bindLayers() {
  const tools = document.querySelector('.map-tools');
  if (!tools) return;
  tools.querySelectorAll('[data-layer]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const layer = btn.dataset.layer;
      if (layer === '复位') {
        if (typeof showPoiTrack === 'function') showPoiTrack(null);
        document.getElementById('drill')?.classList.remove('show', 'yard-on');
        document.getElementById('map')?.classList.remove('drill-on');
        document.querySelectorAll('.poi').forEach((p) => {
          p.classList.remove('hide', 'focus');
          p.style.display = '';
        });
        tools.querySelectorAll('[data-layer]').forEach((b) => b.classList.remove('on'));
        const all = tools.querySelector('[data-layer="全部"]');
        if (all) all.classList.add('on');
        document.getElementById('drill')?.classList.remove('show');
        toast('视角复位');
        return;
      }
      if (layer === '全部') {
        document.querySelectorAll('.poi').forEach((p) => {
          p.classList.remove('hide');
          p.style.display = '';
        });
        tools.querySelectorAll('[data-layer]').forEach((b) => b.classList.remove('on'));
        btn.classList.add('on');
        toast('显示全部图层');
        return;
      }
      const on = !btn.classList.contains('on');
      tools.querySelectorAll('[data-layer]').forEach((b) => {
        if (b.dataset.layer !== '复位') b.classList.remove('on');
      });
      if (on) btn.classList.add('on');
      document.querySelectorAll('.poi').forEach((p) => {
        const pl = p.dataset.layer || p.dataset.t || p.dataset.type || '';
        const show = !on || pl === layer || (layer === '告警' && (p.classList.contains('bad') || p.classList.contains('warn')));
        p.classList.toggle('hide', !show);
        p.style.display = show ? '' : 'none';
      });
      toast(on ? '仅显示：' + layer : '恢复全部');
      if (!on) {
        document.querySelectorAll('.poi').forEach((p) => {
          p.classList.remove('hide');
          p.style.display = '';
        });
      }
    });
  });
}

function bindScrollPause() {
  document.querySelectorAll('.scroll').forEach((sc) => {
    const inner = sc.querySelector('.scroll-inner');
    if (!inner) return;
    sc.addEventListener('mouseenter', () => (inner.style.animationPlayState = 'paused'));
    sc.addEventListener('mouseleave', () => (inner.style.animationPlayState = 'running'));
  });
}

function bindAlerts() {
  document.querySelectorAll('.alert, .alert-item').forEach((a) => {
    if (a.querySelector('.tag.r')) a.classList.add('blink');
    a.classList.add('clickable');
    a.addEventListener('click', () => {
      const name = a.dataset.n || a.querySelector('span')?.textContent?.trim() || '告警';
      if (!focusPoiByName(name)) {
        openDrill(name, '告警', a.querySelector('.tag')?.textContent || '未闭环');
        toast('告警：' + name);
      }
    });
  });
}

function setDegrade(on, msg) {
  let bar = document.getElementById('degrade-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'degrade-bar';
    bar.className = 'degrade-bar';
    const wall = document.querySelector('.wall');
    if (wall) wall.appendChild(bar);
    else document.body.appendChild(bar);
  }
  bar.textContent = msg || '部分数据源降级：视频/地磅离线，展示缓存快照';
  bar.classList.toggle('show', !!on);
}

function bindFreshness() {
  const el = document.getElementById('fresh-sec');
  if (!el) return;
  let sec = Number(el.dataset.sec || 30);
  const tick = () => {
    sec -= 1;
    if (sec <= 0) {
      sec = Number(el.dataset.sec || 30);
      el.classList.add('flash');
      setTimeout(() => el.classList.remove('flash'), 400);
    }
    el.textContent = sec + 's';
  };
  el.textContent = sec + 's';
  setInterval(tick, 1000);
}

function bumpKpis() {
  document.querySelectorAll('.kpi .v').forEach((v) => {
    const raw = v.textContent.replace(/[^\d.-]/g, '');
    if (!raw || raw.includes('-') && raw.indexOf('-') > 0) return;
    const num = parseFloat(raw);
    if (Number.isNaN(num)) return;
    const isInt = !String(num).includes('.') && !v.textContent.includes('.');
    const delta = isInt ? (Math.random() > 0.5 ? 1 : 0) : +(Math.random() * 0.08).toFixed(2);
    const next = isInt ? Math.max(0, Math.round(num + (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.6 ? 1 : 0))) : +(num + (Math.random() > 0.5 ? delta : -delta / 2)).toFixed(2);
    const suffix = v.textContent.replace(/[\d.]+/, '');
    v.textContent = (isInt ? next : next) + (suffix.match(/%/) ? '%' : '');
    if (v.textContent.match(/^[\d.]+$/)) v.textContent = String(isInt ? next : next);
    v.classList.add('flash');
    setTimeout(() => v.classList.remove('flash'), 500);
  });
}

function setFlip(el, n, len) {
  if (!el) return;
  const s = String(Math.floor(n)).padStart(len, '0');
  el.innerHTML = [...s].map((d) => `<div class="flip-digit flip">${d}</div>`).join('');
  setTimeout(() => el.querySelectorAll('.flip-digit').forEach((d) => d.classList.remove('flip')), 450);
}

function bindRefresh(flipId, baseVal, len) {
  const btn = document.getElementById('btn-refresh') || document.querySelector('[data-action="refresh"]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    bumpKpis();
    if (flipId) {
      const el = document.getElementById(flipId);
      const cur = baseVal + Math.floor(Math.random() * 80);
      setFlip(el, cur, len || 5);
    }
    document.querySelectorAll('.wall, .card').forEach((c) => {
      c.classList.add('refreshing');
      setTimeout(() => c.classList.remove('refreshing'), 600);
    });
    const fresh = document.getElementById('fresh-sec');
    if (fresh) {
      fresh.dataset.sec = fresh.dataset.sec || '30';
      fresh.textContent = fresh.dataset.sec + 's';
    }
    toast('数据已刷新');
  });
}

function bindDegradeToggle() {
  const btn = document.getElementById('btn-degrade');
  if (!btn) return;
  let on = false;
  btn.addEventListener('click', () => {
    on = !on;
    btn.classList.toggle('on', on);
    setDegrade(on);
    document.querySelectorAll('.vcell .tag.g').forEach((t, i) => {
      if (i === 0 && on) {
        t.className = 'st tag r';
        t.textContent = '离线';
      } else if (!on && t.textContent === '离线') {
        t.className = 'st tag g';
        t.textContent = '在线';
      }
    });
    toast(on ? '已模拟数据降级' : '已恢复正常接入');
  });
}

function ensureToolExtras() {
  const tool = document.querySelector('.tool');
  if (!tool) return;
  if (!document.getElementById('fresh-wrap')) {
    const span = document.createElement('span');
    span.id = 'fresh-wrap';
    span.innerHTML = '时效 <b id="fresh-sec" data-sec="30">30s</b>';
    tool.appendChild(span);
  }
  if (!document.getElementById('btn-refresh')) {
    const b = document.createElement('button');
    b.id = 'btn-refresh';
    b.textContent = '刷新数据';
    tool.appendChild(b);
  }
  if (!document.getElementById('btn-degrade')) {
    const b = document.createElement('button');
    b.id = 'btn-degrade';
    b.textContent = '模拟降级';
    tool.appendChild(b);
  }
}

/** 主题整屏统一初始化 */
function initWallTheme(active, opts) {
  opts = opts || {};
  ensureToolExtras();
  mountWallRole();
  renderThemeNav(active);
  applyRoleChrome();
  tickClock();
  setInterval(tickClock, 1000);
  bindPois();
  bindTables();
  bindVideos();
  bindLayers();
  bindScrollPause();
  bindAlerts();
  bindFreshness();
  bindRefresh(opts.flipId, opts.flipBase || 18200, opts.flipLen || 5);
  bindDegradeToggle();
  if (typeof mountEnvBoards === 'function') mountEnvBoards();
  if (typeof mountEquipBoards === 'function') mountEquipBoards();
  if (typeof mountHydroWind === 'function') mountHydroWind();
  if (typeof mountAlertBoards === 'function') mountAlertBoards();
  if (opts.flipId && opts.flipBase != null) setFlip(document.getElementById(opts.flipId), opts.flipBase, opts.flipLen || 5);
}
