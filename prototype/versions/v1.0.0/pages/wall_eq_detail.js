/** 设备详情弹窗 · 13 种模板演示档案（对齐《设备详情弹窗方案_V1》） */
(function (global) {
  const TABS = [
    { id: 'overview', name: '设备概览' },
    { id: 'base', name: '基础信息' },
    { id: 'monitor', name: '实时监测' },
    { id: 'video', name: '监控视频' },
    { id: 'maint', name: '维修保养' },
    { id: 'work', name: '作业信息' }
  ];

  const ALIAS = {
    'T2驱动': 'T2-DRV',
    'T2输送驱动': 'T2-DRV',
    '1#变电所': 'PD-01',
    '岸电箱': 'AD-01',
    '除尘系统': 'DC-01',
    '排水泵': 'DP-01',
    '卸船机': 'SC-01',
    '输送系统': 'BM-01',
    '供配电及岸电': 'PD-01',
    '闸口与地磅': 'GT-01',
    '监控与通信': 'CAM-03',
    '照明与充电': 'GL-07'
  };

  function kv(obj) {
    return Object.keys(obj).map((k) =>
      `<div class="eqm-kv"><span class="k">${k}</span><span class="v">${obj[k]}</span></div>`
    ).join('');
  }

  function metricsHtml(list, time) {
    return `<div class="eqm-metrics">${list.map((m) =>
      `<div class="eqm-metric ${m.tone || ''}"><div class="lab">${m.label}</div><div class="val">${m.value}${m.unit ? `<small>${m.unit}</small>` : ''}</div></div>`
    ).join('')}</div><div class="eqm-tip">采集时刻 ${time || '14:00:00'} · 演示</div>`;
  }

  function videoBox(v) {
    if (!v || v.none) {
      return `<div class="eqm-video none"><div class="ph">未关联监控视频</div><div class="cap">当前设备无绑定机位</div></div>`;
    }
    if (v.offline) {
      return `<div class="eqm-video offline"><div class="ph"><i class="fa-solid fa-video-slash"></i><br>视频中断</div>
        <div class="cap">${v.cam} · ${v.title || ''} · 末次 ${v.lastOnline || '--'}</div></div>`;
    }
    return `<div class="eqm-video"><span class="badge">模拟画面</span><span class="rec">● REC</span>
      <div class="ph"><i class="fa-solid fa-video"></i></div>
      <div class="cap">${v.cam} · ${v.title || ''}</div></div>`;
  }

  function maintBox(m) {
    const alert = m.alert
      ? `<div class="eqm-alert ${m.alertTone || 'y'}">${m.alert}</div>`
      : `<div class="eqm-alert ok">当前无未闭环维修工单</div>`;
    return `${alert}
      <div class="eqm-kv"><span class="k">最近保养</span><span class="v">${m.last || '待台账接入'}</span></div>
      <div class="eqm-kv"><span class="k">保养安排</span><span class="v">${m.plan || '待台账接入'}</span></div>
      ${m.eta ? `<div class="eqm-kv"><span class="k">预计完成</span><span class="v">${m.eta}</span></div>` : ''}
      <div class="eqm-btns">
        <button type="button" data-jump="maint">查看维修记录</button>
        <button type="button" data-jump="maint">查看保养计划</button>
      </div>`;
  }

  function workBox(w) {
    if (!w) return '<div class="eqm-tip">暂无作业/服务记录</div>';
    let html = '';
    if (w.task) html += `<div class="eqm-work-title">${w.task}</div>`;
    if (w.progress != null) {
      html += `<div class="eqm-prog"><div class="t"><span>${w.progressText || ''}</span><b>${w.progress}%</b></div>
        <div class="b"><i style="width:${w.progress}%"></i></div></div>`;
    }
    if (w.lines) html += w.lines.map((l) => `<div class="eqm-line">${l}</div>`).join('');
    return html || '<div class="eqm-tip">暂无作业/服务记录</div>';
  }

  function listTable(headers, rows) {
    return `<table class="eqm-tbl"><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  const DEVICES = {
    'SC-01': {
      id: 'SC-01', name: '卸船机', category: '卸船设备', area: '1#泊位', status: '运行', tone: 'g',
      base: { 设备编号: 'SC-01', 设备名称: '卸船机', 台账分类: '卸船设备', 安装区域: '1#泊位', 责任岗位: '装卸运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '运行负载', value: '72', unit: '%' },
        { label: '运行电流', value: '180', unit: 'A' },
        { label: '驱动温度', value: '56', unit: '℃' },
        { label: '振动', value: '1.8', unit: 'mm/s' }
      ],
      video: { cam: 'CAM-01', title: '1#泊位卸船机' },
      maint: { last: '2026-11-05 · 例行润滑', plan: '2026-11-10 · 计划保养' },
      work: { task: 'RW-001 / 卸船入仓', progress: 68, progressText: '计划 3.00 万吨 · 累计 2.04 万吨', lines: ['L01 → T1 → T2 → 1#散货仓库', '服务 1#泊位当前航次'] },
      extraBase: { 上级设备: '1#泊位装卸系统', 所属系统: '散货卸船工艺', BIM点位: 'SC-01', 投运日期: '待台账接入' },
      health: '良好', healthTime: '2026-11-08 14:00',
      trends: '负载/电流/温振近 2 小时趋势 · 演示平稳',
      maintRows: [['WO-无', '—', '无未闭环', '—'], ['BY-1105', '例行润滑', '已完成', '2026-11-05']],
      workRows: [['RW-001', '卸船入仓', '进行中', '2.04/3.00 万吨'], ['班次效率', '演示', '—', '待接入']]
    },
    'SC-02': {
      id: 'SC-02', name: '卸船机', category: '卸船设备', area: '2#泊位', status: '故障', tone: 'r',
      base: { 设备编号: 'SC-02', 设备名称: '卸船机', 台账分类: '卸船设备', 安装区域: '2#泊位', 责任岗位: '装卸运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '运行负载', value: '0', unit: '%', tone: 'r' },
        { label: '运行电流', value: '0', unit: 'A', tone: 'r' },
        { label: '驱动温度', value: '--', unit: '' },
        { label: '故障码', value: 'DRV', unit: '', tone: 'r' }
      ],
      video: { cam: 'CAM-03', title: '2#泊位关联点', offline: true, lastOnline: '13:59' },
      maint: { alert: '驱动故障 · 维修待备件', alertTone: 'r', last: '2026-10-28 · 巡检', plan: '故障维修', eta: '预计 16:30' },
      work: { task: 'L02 卸船环节受限', lines: ['当前无在执行航次任务', '关联报警 A002 · 待响应'] },
      extraBase: { 上级设备: '2#泊位装卸系统', 所属系统: '散货卸船工艺', BIM点位: 'SC-02', 投运日期: '待台账接入' },
      health: '故障', healthTime: '2026-11-08 12:18',
      trends: '故障后测点冻结 · 演示',
      maintRows: [['WO-1201', '驱动故障维修', '待备件', '预计 16:30'], ['BY-1028', '巡检', '已完成', '2026-10-28']],
      workRows: [['L02', '卸船环节', '受限', '等待设备恢复']]
    },
    'BM-01': {
      id: 'BM-01', name: '皮带输送机', category: '输送设备', area: 'T1 廊道', status: '运行', tone: 'g',
      base: { 设备编号: 'BM-01', 设备名称: '皮带输送机', 台账分类: '输送设备', 安装区域: 'T1 廊道', 责任岗位: '输送运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '带速', value: '2.5', unit: 'm/s' },
        { label: '瞬时输送率', value: '900', unit: 't/h' },
        { label: '负载', value: '68', unit: '%' },
        { label: '驱动温度', value: '55', unit: '℃' }
      ],
      video: { cam: 'CAM-T1', title: 'T1 机位（演示映射）' },
      maint: { last: '2026-11-04 · 托辊巡检', plan: '2026-11-11 · 皮带巡检' },
      work: { task: 'RW-001 / 协同输送', lines: ['上游 SC-01 · 下游 T2', '瞬时输送率用于判断供料节奏'] },
      extraBase: { 上级设备: 'L01 卸船入仓线', 所属系统: '皮带输送系统', BIM点位: 'BM-01', 线路方向: '泊位→仓库' },
      health: '良好', healthTime: '2026-11-08 14:00',
      trends: '带速/输送率近 2 小时趋势 · 演示',
      maintRows: [['BY-1104', '托辊巡检', '已完成', '2026-11-04']],
      workRows: [['RW-001', '协同输送', '进行中', '900 t/h']]
    },
    'T2-DRV': {
      id: 'T2-DRV', name: '输送驱动', category: '输送设备', area: 'T2 转运站', status: '运行 · 预警', tone: 'y',
      base: { 设备编号: 'T2-DRV', 设备名称: '输送驱动', 台账分类: '输送设备', 安装区域: 'T2 转运站', 责任岗位: '输送运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '轴承温度', value: '78', unit: '℃', tone: 'y' },
        { label: '振动', value: '3.2', unit: 'mm/s', tone: 'y' },
        { label: '运行电流', value: '186', unit: 'A' },
        { label: '运行负载', value: '68', unit: '%' }
      ],
      video: { cam: 'CAM-02', title: 'T2 转运站' },
      maint: { alert: 'E001 温升预警 · 处理中', alertTone: 'y', last: '2026-11-06 · 巡检', plan: '2026-11-12 · 计划保养' },
      work: { task: 'L01 / 输送链仍在运行', lines: ['任务 RW-001 · 协同转运', '轴承温升现场核查，解除时间待评估'] },
      extraBase: { 上级设备: 'T2 皮带机', 所属系统: '皮带输送系统', BIM点位: 'T2驱动', 资产粒度: '部件级（演示）' },
      health: '预警', healthTime: '2026-11-08 13:42',
      trends: '温振趋势抬升 · 演示',
      maintRows: [['E001', '轴承温升', '处理中', '解除待评估'], ['BY-1106', '巡检', '已完成', '2026-11-06']],
      workRows: [['RW-001', '协同转运', '运行中', 'L01 未停产']]
    },
    'PD-01': {
      id: 'PD-01', name: '1#变电所', category: '供配电及岸电', area: '陆域变电', status: '正常供电', tone: 'g',
      base: { 设备编号: 'PD-01', 设备名称: '1#变电所', 台账分类: '供配电及岸电', 安装区域: '陆域变电', 责任岗位: '供电运维班', 型号规格: '2×1250 kVA（演示）', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '进线电压', value: '10.1', unit: 'kV' },
        { label: '进线电流', value: '68', unit: 'A' },
        { label: '变压器温度', value: '56', unit: '℃' },
        { label: '主变负载率', value: '52', unit: '%' }
      ],
      video: { cam: 'CAM-PD', title: '配电室机位（演示映射）' },
      maint: { last: '2026-11-01 · 巡视', plan: '2026-11-15 · 计划巡检' },
      work: { task: '正常供电 / 无已确认停电作业', lines: ['按馈线查看保障对象与影响范围', '当前全馈线演示正常'] },
      extraBase: { 上级设备: '港区供配电系统', 所属系统: '10 kV 双回路', BIM点位: 'PD-01', 主变数量: '2' },
      health: '正常', healthTime: '2026-11-08 14:00',
      trends: '电压/负载率平稳 · 演示',
      maintRows: [['BY-1101', '巡视', '已完成', '2026-11-01']],
      workRows: [['馈线-A', '保障装卸区', '正常', '—'], ['馈线-B', '保障陆域', '正常', '—']]
    },
    'AD-01': {
      id: 'AD-01', name: '岸电装置', category: '供配电及岸电', area: '码头岸电', status: '待机 · 就绪', tone: 'g',
      base: { 设备编号: 'AD-01', 设备名称: '岸电装置', 台账分类: '供配电及岸电', 安装区域: '码头岸电', 责任岗位: '供电运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '进线', value: '10.1', unit: 'kV' },
        { label: '船端接电', value: '未接电', unit: '' },
        { label: '送电状态', value: '未送电', unit: '' },
        { label: '今日累计电量', value: '3.8', unit: 'MWh' }
      ],
      video: { cam: 'CAM-04', title: '岸电设备区' },
      maint: { last: '2026-11-03 · 功能检查', plan: '2026-11-17 · 计划保养' },
      work: { task: '就绪待机 / 当前无供电会话', lines: ['累计电量来自本日历史会话', '就绪 ≠ 正在供电'] },
      extraBase: { 上级设备: '岸电系统', 所属系统: '供配电及岸电', BIM点位: 'AD-01', 服务泊位: '1#/2#（演示）' },
      health: '正常', healthTime: '2026-11-08 14:00',
      trends: '会话电量统计 · 演示',
      maintRows: [['BY-1103', '功能检查', '已完成', '2026-11-03']],
      workRows: [['会话-历史', '已结束', '3.8 MWh', '今日累计'], ['当前会话', '无', '—', '—']]
    },
    'GT-01': {
      id: 'GT-01', name: '道闸', category: '闸口与地磅', area: 'G01 进港闸口', status: '服务中 · 栏杆关闭', tone: 'g',
      base: { 设备编号: 'GT-01', 设备名称: '道闸', 台账分类: '闸口与地磅', 安装区域: 'G01 进港闸口', 责任岗位: '闸口值班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '栏杆状态', value: '关闭', unit: '' },
        { label: '通道状态', value: '可用', unit: '' },
        { label: '近15分钟放行', value: '12', unit: '车次' },
        { label: '识别链路', value: '在线', unit: '' }
      ],
      video: { cam: 'CAM-G01', title: '闸口机位（演示映射）' },
      maint: { last: '2026-11-07 · 机构润滑', plan: '2026-11-14 · 计划巡检' },
      work: { task: '进港通道通行服务', lines: ['最近放行 14:00', '放行量按确认通过事件统计'] },
      extraBase: { 上级设备: '智能大门系统', 所属系统: '闸口通行', BIM点位: 'GT-01', 进出方向: '进港' },
      health: '正常', healthTime: '2026-11-08 14:00',
      trends: '放行事件统计 · 演示',
      maintRows: [['BY-1107', '机构润滑', '已完成', '2026-11-07']],
      workRows: [['14:00', '放行', '有效', '演示车牌脱敏'], ['13:55', '放行', '有效', '演示车牌脱敏']]
    },
    'WB-01': {
      id: 'WB-01', name: '地磅', category: '闸口与地磅', area: 'W01 地磅区', status: '称重中', tone: 'y',
      base: { 设备编号: 'WB-01', 设备名称: '地磅', 台账分类: '闸口与地磅', 安装区域: 'W01 地磅区', 责任岗位: '计量班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '实时毛重', value: '32.60', unit: 't' },
        { label: '仪表状态', value: '稳定', unit: '' },
        { label: '近15分钟称重', value: '9', unit: '车次' },
        { label: '车辆匹配', value: '已匹配', unit: '' }
      ],
      video: { cam: 'CAM-W01', title: '称重通道机位（演示映射）' },
      maint: { last: '2026-10-20 · 检定复核', plan: '下次检定待台账' },
      work: { task: 'YS-002 正在称重', lines: ['取得有效皮重并确认后形成净重', '毛重/皮重/净重分环节确认'] },
      extraBase: { 上级设备: '计量系统', 所属系统: '闸口与地磅', BIM点位: 'WB-01', 仪表编号: '演示-YB-01' },
      health: '正常', healthTime: '2026-11-08 14:00',
      trends: '称重事件统计 · 演示',
      maintRows: [['JD-1020', '检定复核', '有效', '2026-10-20']],
      workRows: [['YS-002', '称重中', '毛重 32.60 t', '净重待确认']]
    },
    'CAM-03': {
      id: 'CAM-03', name: '摄像机', category: '监控与通信', area: '2#泊位', status: '故障 · 离线', tone: 'r',
      base: { 设备编号: 'CAM-03', 设备名称: '摄像机', 台账分类: '监控与通信', 安装区域: '2#泊位', 责任岗位: '安防运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '离线' },
      metrics: [
        { label: '设备连接', value: '离线', unit: '', tone: 'r' },
        { label: '最后在线', value: '13:59', unit: '' },
        { label: '视频流', value: '中断', unit: '', tone: 'r' },
        { label: '录像状态', value: '待核验', unit: '' }
      ],
      video: { cam: 'CAM-03', title: '2#泊位视频点', offline: true, lastOnline: '13:59' },
      maint: { alert: 'E003 摄像机离线 · 待响应', alertTone: 'r', last: '待台账接入', plan: '故障排查', eta: '恢复待评估' },
      work: { task: '2#泊位 / CAM-03 点位受影响', lines: ['E003 / 待响应', '排查供电、网络与视频接入；影响限于当前点位'] },
      extraBase: { 上级设备: '视频监控平台', 所属系统: '监控与通信', BIM点位: 'CAM-03', 通道编号: '演示-CH-03' },
      health: '故障', healthTime: '2026-11-08 11:05',
      trends: '心跳中断后无新测点 · 演示',
      maintRows: [['E003', '摄像机离线', '待响应', '恢复待评估']],
      workRows: [['保障范围', '2#泊位该点', '中断', '不代表全港视频中断']]
    },
    'NET-01': {
      id: 'NET-01', name: '接入交换机', category: '监控与通信', area: '陆域机房', status: '服务中', tone: 'g',
      base: { 设备编号: 'NET-01', 设备名称: '接入交换机', 台账分类: '监控与通信', 安装区域: '陆域机房', 责任岗位: '通信运维班', 型号规格: '24 口（演示）', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '上联状态', value: '正常', unit: '' },
        { label: '在线端口', value: '12/24', unit: '' },
        { label: '上联利用率', value: '36', unit: '%' },
        { label: '设备温度', value: '42', unit: '℃' }
      ],
      video: { none: true },
      maint: { last: '2026-11-02 · 巡检', plan: '2026-11-16 · 计划巡检' },
      work: { task: '陆域接入节点服务正常', lines: ['可按权限查看所承载视频点与业务终端', '当前未关联监控视频'] },
      extraBase: { 上级设备: '核心交换', 所属系统: '监控与通信', BIM点位: 'NET-01', 上联节点: '演示-CORE-01' },
      health: '正常', healthTime: '2026-11-08 14:00',
      trends: '端口/利用率平稳 · 演示',
      maintRows: [['BY-1102', '巡检', '已完成', '2026-11-02']],
      workRows: [['下挂终端', '演示 12 台', '在线', '—']]
    },
    'GL-07': {
      id: 'GL-07', name: '高杆灯', category: '照明与充电', area: '陆域道路', status: '计划维护 · 离线', tone: 'm',
      base: { 设备编号: 'GL-07', 设备名称: '高杆灯', 台账分类: '照明与充电', 安装区域: '陆域道路', 责任岗位: '机电运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '离线' },
      metrics: [
        { label: '通信状态', value: '离线', unit: '', tone: 'y' },
        { label: '维保状态', value: '保养中', unit: '', tone: 'y' },
        { label: '末次采集', value: '13:40', unit: '' },
        { label: '灯组状态', value: '待核验', unit: '' }
      ],
      video: { cam: 'CAM-RD', title: '道路关联机位（演示）' },
      maint: { alert: '计划保养进行中', alertTone: 'y', last: '保养进行中', plan: '计划保养', eta: '预计 15:00' },
      work: { task: '陆域道路 GL-07 保养', lines: ['预计 15:00 完成', '结束后核验照明与通信恢复'] },
      extraBase: { 上级设备: '道路照明系统', 所属系统: '照明与充电', BIM点位: 'GL-07', 控制模式: '待核验' },
      health: '维护', healthTime: '2026-11-08 13:40',
      trends: '离线后无新测点 · 演示',
      maintRows: [['BY-1108', '计划保养', '进行中', '预计 15:00']],
      workRows: [['照明保障', '该杆', '维护中', '不影响全港照明结论']]
    },
    'CH-01': {
      id: 'CH-01', name: '充电桩', category: '照明与充电', area: '流动机械充电区', status: '充电中', tone: 'g',
      base: { 设备编号: 'CH-01', 设备名称: '充电桩', 台账分类: '照明与充电', 安装区域: '流动机械充电区', 责任岗位: '机电运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '输出电压', value: '600', unit: 'V' },
        { label: '输出电流', value: '80', unit: 'A' },
        { label: '输出功率', value: '48', unit: 'kW' },
        { label: '本次会话电量', value: '18.6', unit: 'kWh' }
      ],
      video: { cam: 'CAM-CH', title: '充电车位机位（演示映射）' },
      maint: { last: '2026-11-05 · 巡检', plan: '2026-11-19 · 计划保养' },
      work: { task: '会话 CD-001 / 港内车辆充电', lines: ['开始时间 13:35', '按会话统计电量'] },
      extraBase: { 上级设备: '充电箱变', 所属系统: '照明与充电', BIM点位: 'CH-01', 枪口编号: '演示-G1' },
      health: '正常', healthTime: '2026-11-08 14:00',
      trends: '功率曲线演示抬升后平稳',
      maintRows: [['BY-1105', '巡检', '已完成', '2026-11-05']],
      workRows: [['CD-001', '充电中', '18.6 kWh', '13:35 起']]
    },
    'DC-01': {
      id: 'DC-01', name: '除尘装置', category: '公辅保障', area: 'T2 转运点', status: '联动运行', tone: 'g',
      base: { 设备编号: 'DC-01', 设备名称: '除尘装置', 台账分类: '公辅保障', 安装区域: 'T2 转运点', 责任岗位: '环保运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '风机状态', value: '运行', unit: '' },
        { label: '滤器压差', value: '680', unit: 'Pa' },
        { label: '风机电流', value: '18', unit: 'A' },
        { label: '清灰系统', value: '正常', unit: '' }
      ],
      video: { cam: 'CAM-02', title: 'T2 关联机位' },
      maint: { last: '2026-11-06 · 滤材检查', plan: '2026-11-20 · 清灰保养' },
      work: { task: 'T2 转运点除尘联动 · 关联 L01', lines: ['异常时按已确认保障范围提示', '当前联动正常'] },
      extraBase: { 上级设备: 'T2 转运系统', 所属系统: '公辅保障', BIM点位: 'DC-01', 服务对象: 'T2 转运点' },
      health: '正常', healthTime: '2026-11-08 14:00',
      trends: '压差趋势演示',
      maintRows: [['BY-1106', '滤材检查', '已完成', '2026-11-06']],
      workRows: [['联动', 'L01', '运行', '正常']]
    },
    'DP-01': {
      id: 'DP-01', name: '排水泵', category: '公辅保障', area: '陆域集水井', status: '自动备用', tone: 'g',
      base: { 设备编号: 'DP-01', 设备名称: '排水泵', 台账分类: '公辅保障', 安装区域: '陆域集水井', 责任岗位: '机电运维班', 型号规格: '待台账接入', 厂家: '待台账接入', 通信状态: '在线' },
      metrics: [
        { label: '控制模式', value: '自动', unit: '' },
        { label: '集水井液位', value: '0.42', unit: 'm' },
        { label: '电机状态', value: '停止', unit: '' },
        { label: '启动条件', value: '未触发', unit: '' }
      ],
      video: { none: true },
      maint: { last: '2026-11-04 · 液位联动试验', plan: '2026-11-18 · 计划巡检' },
      work: { task: '自动待命 / 当前无排水事件', lines: ['备用 ≠ 正在排水', '启动条件未触发'] },
      extraBase: { 上级设备: '排水系统', 所属系统: '公辅保障', BIM点位: 'DP-01', 主备策略: '演示主泵' },
      health: '正常', healthTime: '2026-11-08 14:00',
      trends: '液位平稳低于启动阈值 · 演示',
      maintRows: [['SY-1104', '液位联动试验', '已完成', '2026-11-04']],
      workRows: [['排水事件', '无', '—', '今日']]
    }
  };

  let activeId = '';
  let activeTab = 'overview';
  let onLocate = null;

  function resolveId(raw) {
    if (!raw) return '';
    if (DEVICES[raw]) return raw;
    if (ALIAS[raw] && DEVICES[ALIAS[raw]]) return ALIAS[raw];
    return '';
  }

  function renderTabBody(d) {
    if (activeTab === 'overview') {
      return `<div class="eqm-grid">
        <div class="eqm-col">
          <div class="eqm-card"><h5>基础信息</h5>${kv(d.base)}</div>
          <div class="eqm-card"><h5>维修保养摘要</h5>${maintBox(d.maint)}</div>
        </div>
        <div class="eqm-col">
          <div class="eqm-card"><h5>实时监测</h5>${metricsHtml(d.metrics, '14:00:00')}</div>
          <div class="eqm-card"><h5>监控视频</h5>${videoBox(d.video)}</div>
          <div class="eqm-card"><h5>当前作业 / 服务信息</h5>${workBox(d.work)}</div>
        </div>
      </div>`;
    }
    if (activeTab === 'base') {
      return `<div class="eqm-card"><h5>完整台账</h5>${kv(Object.assign({}, d.base, d.extraBase || {}))}</div>`;
    }
    if (activeTab === 'monitor') {
      return `<div class="eqm-card"><h5>最新测点</h5>${metricsHtml(d.metrics, '14:00:00')}
        <div class="eqm-kv"><span class="k">健康等级</span><span class="v">${d.health || '待配置'}</span></div>
        <div class="eqm-kv"><span class="k">评估时间</span><span class="v">${d.healthTime || '--'}</span></div>
        <div class="eqm-line" style="margin-top:8px">${d.trends || '趋势待接入'}</div>
        <div class="eqm-tip">数据质量：演示有效 · 规则缺失时显示待配置</div>
      </div>`;
    }
    if (activeTab === 'video') {
      return `<div class="eqm-card"><h5>关联机位</h5>${videoBox(d.video)}
        <div class="eqm-tip">支持机位切换 / 放大 / 授权回看（演示占位）。无机位、中断、无权限分别提示。</div>
        <div class="eqm-btns"><button type="button">放大预览</button><button type="button">授权回看</button></div>
      </div>`;
    }
    if (activeTab === 'maint') {
      return `<div class="eqm-card"><h5>维修保养</h5>${maintBox(d.maint)}
        ${listTable(['单号', '内容', '状态', '时间'], d.maintRows || [['—', '—', '—', '—']])}
        <div class="eqm-tip">预计完成 ≠ 已恢复可用；恢复以验收/复核为准</div>
      </div>`;
    }
    return `<div class="eqm-card"><h5>作业 / 服务记录</h5>${workBox(d.work)}
      ${listTable(['对象', '内容', '状态', '说明'], d.workRows || [['—', '—', '—', '—']])}
      <div class="eqm-tip">按时间与任务查询能力演示占位</div>
    </div>`;
  }

  function paint() {
    const d = DEVICES[activeId];
    if (!d) return;
    const root = document.getElementById('eq-modal');
    if (!root) return;
    root.querySelector('#eqm-title').textContent = `${d.id} ${d.name} · 设备详情`;
    root.querySelector('#eqm-status').className = 'pill ' + d.tone;
    root.querySelector('#eqm-status').textContent = d.status;
    root.querySelector('#eqm-area').textContent = d.area;
    root.querySelector('#eqm-tabs').innerHTML = TABS.map((t) =>
      `<button type="button" class="${t.id === activeTab ? 'on' : ''}" data-tab="${t.id}">${t.name}</button>`
    ).join('');
    root.querySelector('#eqm-body').innerHTML = renderTabBody(d);
  }

  function open(rawId, entry) {
    const id = resolveId(rawId);
    if (!id) {
      if (typeof toast === 'function') toast((rawId || '对象') + ' · 暂无详情模板');
      return false;
    }
    activeId = id;
    activeTab = entry === 'alarm' ? 'monitor' : entry === 'maint' ? 'maint' : 'overview';
    const root = document.getElementById('eq-modal');
    if (!root) return false;
    root.classList.add('show');
    paint();
    return true;
  }

  function close() {
    const root = document.getElementById('eq-modal');
    if (root) root.classList.remove('show');
  }

  function bind() {
    const root = document.getElementById('eq-modal');
    if (!root || root._bound) return;
    root._bound = true;
    root.addEventListener('click', (e) => {
      if (e.target.id === 'eq-modal') close();
      const tab = e.target.closest('[data-tab]');
      if (tab) { activeTab = tab.getAttribute('data-tab'); paint(); return; }
      const jump = e.target.closest('[data-jump]');
      if (jump) { activeTab = jump.getAttribute('data-jump'); paint(); return; }
      if (e.target.closest('#eqm-close')) { close(); return; }
      if (e.target.closest('#eqm-locate')) {
        close();
        if (typeof onLocate === 'function') onLocate(activeId);
        else if (typeof toast === 'function') toast('已定位：' + activeId);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('show')) close();
    });
  }

  global.EqDetail = {
    DEVICES,
    ALIAS,
    resolveId,
    open,
    close,
    bind,
    setLocateHandler(fn) { onLocate = fn; }
  };
})(window);
