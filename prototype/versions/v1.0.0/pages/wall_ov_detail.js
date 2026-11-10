/** 港区概览详情弹窗 · 复用 wall_domain 各类型 viz*，外壳对齐设备弹窗固定高度 */
(function (global) {
  const ALIAS = {
    '1#泊位': '1号泊位',
    '1# 泊位': '1号泊位',
    '1号泊位': '1号泊位',
    '2#泊位': '2号泊位',
    '2# 泊位': '2号泊位',
    '2号泊位': '2号泊位',
    '散货堆场': '散货堆场A',
    '散货堆场 76%': '散货堆场A',
    '北卡口': '卡口1',
    '卡口': '卡口1',
    'T2 输送': '卸船机#1',
    'T2输送': '卸船机#1',
    'T2 驱动': '卸船机#1',
    '海建68': '1号泊位',
    '金港5': '2号泊位',
    'A001': '卸船机#1',
    'A002': '卸船机#1',
    'A003': '散货堆场越界',
    'CAM-03 离线': '散货堆场越界',
    'CAM-01': '前沿摄像头',
    'CAM-02': '堆场摄像头',
    'CAM-03': 'CAM-03',
    'CAM-04': '卡口摄像头',
    'CAM-05': '仓库摄像头',
    'CAM-06': '码头摄像头',
    'G01': '卡口摄像头',
    'G02': '卡口摄像头',
    'W01': '地磅摄像头',
    'R01': '主干道摄像头',
    'R02': '主干道摄像头',
    'R03': '主干道摄像头'
  };

  const EQ_ALIAS = {
    '卸船机': 'SC-01',
    '卸船机#1': 'SC-01',
    'SC-01': 'SC-01',
    'SC-02': 'SC-02',
    'SC-02驱动故障': 'SC-02',
    'T2 输送': 'T2-DRV',
    'T2输送': 'T2-DRV',
    'T2输送驱动轴承温升': 'T2-DRV',
    'T2 驱动': 'T2-DRV',
    'T2-DRV': 'T2-DRV',
    'BM1': 'BM-01',
    'BM2': 'BM-01',
    'BM3': 'BM-01',
    'BM-01': 'BM-01',
    'CAM-03': 'CAM-03',
    'CAM-03离线': 'CAM-03',
    'CAM-03 离线': 'CAM-03',
    '2#泊位摄像头': 'CAM-03',
    '2#泊位视频': 'CAM-03',
    'A001': 'T2-DRV',
    'A002': 'SC-02',
    'A003': 'CAM-03',
    '输送系统': 'BM-01',
    '岸电与闸口': 'AD-01',
    '1#变电所': 'PD-01',
    '2#变电所': 'PD-01',
    '岸电': 'AD-01'
  };

  let activeName = '';
  let onLocate = null;

  function resolveName(raw) {
    if (!raw) return '';
    if (typeof findMapFeature === 'function' && findMapFeature(raw)) return raw;
    if (ALIAS[raw] && findMapFeature(ALIAS[raw])) return ALIAS[raw];
    return '';
  }

  function paint(feat) {
    const root = document.getElementById('ov-modal');
    if (!root || !feat) return;
    root.querySelector('#ovm-title').textContent = feat.name + ' · 详情';
    const st = root.querySelector('#ovm-status');
    st.className = 'pill ' + (typeof toneOf === 'function' ? toneOf(feat.status) : 'm');
    st.textContent = feat.status || '—';
    root.querySelector('#ovm-type').textContent = feat.type || '对象';
    const histBtn = root.querySelector('#ovm-history');
    if (histBtn) {
      const showHist = feat.type === '人员' || feat.type === '车辆';
      histBtn.hidden = !showHist;
      histBtn.disabled = !showHist;
    }
    const isCam = feat.type === '摄像头';
    ['live', 'hist', 'ai', 'info'].forEach((key) => {
      const btn = root.querySelector('#ovm-cam-' + key);
      if (btn) {
        btn.hidden = !isCam;
        btn.disabled = !isCam;
      }
    });
    if (typeof JobArchive !== 'undefined' && JobArchive.setFeature) {
      JobArchive.setFeature(feat);
    }
    const body = root.querySelector('#ovm-body');
    body.innerHTML = typeof renderFeatureDims === 'function' ? renderFeatureDims(feat) : '<div class="yg-empty">暂无详情</div>';
    if (typeof TrackReplay !== 'undefined' && TrackReplay.bindAll) {
      TrackReplay.stop();
      TrackReplay.bindAll(body);
    }
    if (isCam && typeof CamView !== 'undefined') {
      CamView.setMode('live');
      CamView.bind(body);
      root.classList.add('cam-mode');
    } else {
      root.classList.remove('cam-mode', 'cam-ai-scroll');
      const ft = root.querySelector('.ovm-ft');
      if (ft) {
        ft.textContent = feat.type === '环境'
          ? '环境监测：基础信息 / 视频 / 当前与历史指标 / 历史报警（带图）。整窗滚动。Esc 关闭。'
          : '港区概览详情复用演示档案；堆场/泊位/船舶/卡口/告警等按对象类型展示。Esc 关闭。';
      }
    }
  }

  function openFeature(feat) {
    if (!feat) return false;
    activeName = feat.name;
    const root = document.getElementById('ov-modal');
    if (!root) return false;
    root.classList.add('show');
    paint(feat);
    return true;
  }

  function open(raw) {
    const name = resolveName(raw) || (typeof findMapFeature === 'function' && findMapFeature(raw) ? raw : '');
    const feat = name && typeof findMapFeature === 'function' ? findMapFeature(name) : null;
    /* 摄像头 / 环境监测不走设备详情弹窗 */
    if (feat && (feat.type === '摄像头' || feat.type === '环境')) return openFeature(feat);
    const eqKey = EQ_ALIAS[raw] || (global.EqDetail && EqDetail.resolveId(raw));
    if (eqKey && global.EqDetail && EqDetail.resolveId(eqKey)) {
      if (/^CAM-/i.test(String(eqKey))) {
        const camFeat = typeof findMapFeature === 'function'
          ? (findMapFeature(eqKey) || findMapFeature(ALIAS[eqKey]))
          : null;
        if (camFeat && camFeat.type === '摄像头') return openFeature(camFeat);
      }
      return EqDetail.open(eqKey, /A00|告警|故障|离线|温升/.test(String(raw)) ? 'alarm' : 'bim');
    }
    if (!feat) {
      if (typeof toast === 'function') toast((raw || '对象') + ' · 暂无详情');
      return false;
    }
    return openFeature(feat);
  }

  function close() {
    const root = document.getElementById('ov-modal');
    if (typeof JobArchive !== 'undefined') {
      if (JobArchive.closeDetail) JobArchive.closeDetail(true);
      if (JobArchive.closeList) JobArchive.closeList();
    }
    if (root) {
      root.classList.remove('show', 'cam-mode', 'cam-ai-scroll');
    }
    const histBtn = root && root.querySelector('#ovm-history');
    if (histBtn) histBtn.hidden = true;
    ['live', 'hist', 'ai', 'info'].forEach((key) => {
      const btn = root && root.querySelector('#ovm-cam-' + key);
      if (btn) btn.hidden = true;
    });
    if (typeof TrackReplay !== 'undefined' && TrackReplay.stop) TrackReplay.stop();
  }

  function bind() {
    const root = document.getElementById('ov-modal');
    if (!root || root._bound) return;
    root._bound = true;
    root.addEventListener('click', (e) => {
      if (e.target.id === 'ov-modal') close();
      if (e.target.closest('#ovm-close')) { close(); return; }
      if (e.target.closest('#ovm-history')) {
        if (typeof JobArchive !== 'undefined' && JobArchive.openList) {
          const feat = typeof findMapFeature === 'function' ? findMapFeature(activeName) : null;
          JobArchive.openList(feat);
        }
        return;
      }
      if (e.target.closest('#ovm-cam-live')) {
        if (typeof CamView !== 'undefined') CamView.setMode('live');
        return;
      }
      if (e.target.closest('#ovm-cam-hist')) {
        if (typeof CamView !== 'undefined') CamView.setMode('hist');
        return;
      }
      if (e.target.closest('#ovm-cam-ai')) {
        if (typeof CamView !== 'undefined') CamView.setMode('ai');
        return;
      }
      if (e.target.closest('#ovm-cam-info')) {
        if (typeof CamView !== 'undefined') CamView.setMode('info');
        return;
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('show')) close();
    });
  }

  function mountPois(box, opts) {
    if (!box || typeof MAP_FEATURES === 'undefined') return;
    const allowTypes = opts && Array.isArray(opts.types) ? opts.types : null;
    box.querySelectorAll('.poi[data-n]').forEach((n) => n.remove());
    MAP_FEATURES.forEach((feat) => {
      if (allowTypes && allowTypes.length && !allowTypes.includes(feat.type)) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'poi' + (feat.tone ? ' ' + feat.tone : '');
      btn.style.left = feat.x + '%';
      btn.style.top = feat.y + '%';
      btn.dataset.n = feat.name;
      btn.dataset.k = feat.layer || feat.type || '';
      btn.dataset.t = feat.type || '';
      btn.dataset.s = feat.status || '';
      btn.title = feat.name + ' · ' + (feat.status || '');
      const icon = (typeof POI_ICON !== 'undefined' && POI_ICON[feat.type]) || 'fa-location-dot';
      btn.innerHTML = `<i class="fa-solid ${icon}"></i><span>${feat.name}</span>`;
      box.appendChild(btn);
    });
  }

  global.OvDetail = {
    ALIAS,
    EQ_ALIAS,
    resolveName,
    open,
    close,
    bind,
    mountPois,
    setLocateHandler(fn) { onLocate = fn; }
  };
})(window);
