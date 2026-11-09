/**
 * Figma 整屏截图 1:1 壳：底栏主题热区 + 汇报全屏
 * 布局按 1920×1080 画板百分比定位
 */
const FIGMA_THEME_ORDER = ['概览', '生产', '交通', '设备', '经营', '调度'];
const FIGMA_THEME_LABEL = {
  概览: '港区概览',
  生产: '生产运行',
  交通: '港区交通',
  设备: '设备设施',
  经营: '经营分析',
  调度: '智慧调度'
};

function figmaToast(m) {
  if (typeof toast === 'function') return toast(m);
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = m;
  t.classList.add('show');
  clearTimeout(figmaToast._t);
  figmaToast._t = setTimeout(() => t.classList.remove('show'), 1600);
}

function mountFigmaBottomNav(activeKey, opts) {
  const box = document.getElementById('figma-nav');
  if (!box) return;
  const start = (opts && opts.start) || 25.9;
  const w = (opts && opts.itemW) || 7.6;
  const gap = (opts && opts.gap) || 0.52;
  const top = (opts && opts.top) || 95.3;
  const h = (opts && opts.h) || 3.7;
  box.innerHTML = FIGMA_THEME_ORDER.map((k, i) => {
    const left = start + i * (w + gap);
    const label = FIGMA_THEME_LABEL[k] || k;
    if (typeof THEME_DISABLED !== 'undefined' && THEME_DISABLED.includes(k)) {
      return `<button type="button" class="hot" style="left:${left}%;top:${top}%;width:${w}%;height:${h}%" title="${label}" onclick="figmaToast('该主题本期未开放')"></button>`;
    }
    if (k === activeKey) {
      return `<button type="button" class="hot on" style="left:${left}%;top:${top}%;width:${w}%;height:${h}%" title="${label}" aria-current="page"></button>`;
    }
    let href = THEME_PAGES[k];
    if (k === '概览' && activeKey && activeKey !== '概览') href += `?from=${encodeURIComponent(activeKey)}`;
    return `<a class="hot" style="left:${left}%;top:${top}%;width:${w}%;height:${h}%" href="${href}" title="${label}"></a>`;
  }).join('');
}

function mountFigmaTopTabs(activeKey) {
  const box = document.getElementById('figma-top-tabs');
  if (!box) return;
  // 对齐概览页标题两侧小 Tab（约 y=4.5%）
  const tabs = [
    { k: '概览', left: 32.1 },
    { k: '生产', left: 34.4 },
    { k: '交通', left: 36.7 },
    { k: '设备', left: 54.0 },
    { k: '经营', left: 56.3 },
    { k: '调度', left: 58.6 }
  ];
  box.innerHTML = tabs
    .map(({ k, left }) => {
      const label = FIGMA_THEME_LABEL[k] || k;
      if (k === activeKey) {
        return `<button type="button" class="hot on" style="left:${left}%;top:4.6%;width:2.1%;height:1.7%" title="${label}"></button>`;
      }
      let href = THEME_PAGES[k];
      if (k === '概览' && activeKey !== '概览') href += `?from=${encodeURIComponent(activeKey)}`;
      return `<a class="hot" style="left:${left}%;top:4.6%;width:2.1%;height:1.7%" href="${href}" title="${label}"></a>`;
    })
    .join('');
}

function initFigmaScreen(activeKey, options) {
  const opts = options || {};
  if (typeof initWallTheme === 'function') initWallTheme(activeKey);
  if (opts.topTabs) mountFigmaTopTabs(activeKey);
  if (opts.bottomNav !== false) mountFigmaBottomNav(activeKey, opts.bottom);
  const present = document.getElementById('btnPresent');
  if (present) {
    present.onclick = () => {
      document.body.classList.add('present');
      figmaToast('汇报全屏 · Esc 退出');
    };
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.body.classList.remove('present');
  });
}
