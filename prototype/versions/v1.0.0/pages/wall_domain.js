/** 金牌港大屏演示口径。目标、容量、限值均为模拟，正式值走独立后台。 */
const PORT = {
  name: '海南金牌港',
  berths: 2,
  berthMode: '通用泊位',
  cargoPrimary: '散货与件杂',
  cargoNote: '水泥熟料、河砂、石英砂、钢铁件杂',
  cargoList: ['水泥熟料', '河砂', '石英砂', '钢铁件杂'],
  yearTarget: 700,
  quarterTarget: 175,
  monthTarget: 58.3,
  dayTarget: 1.9,
  yearActual: 186,
  quarterActual: 48.5,
  monthActual: 15.2,
  dayActual: 1.26,
  safeDays: 1292,
  shipHour: 1829,
  machineHour: 700,
  scope: '数字孪生平台 · 演示数据 · 不含收入成本',
  coord: '模拟统一坐标系',
  systems: ['生产', '设备物资', '安全', '视频', '卡口', '地磅', '海关']
};

const YARDS = [
  { id: '散货堆场A', name: '散货堆场', cap: 80, rate: 76 },
  { id: '件杂堆场', name: '件杂堆场', cap: 15, rate: 54 },
  { id: '仓库', name: '仓库', cap: 10, rate: 38 }
];

const BELTS = [
  { name: 'BM1', status: '运行', flow: 860 },
  { name: 'BM2', status: '运行', flow: 640 },
  { name: 'BM3', status: '预留', flow: null }
];

const BERTHS = [
  { id: '1#', name: '1号泊位', ship: '海建68', cargo: '水泥熟料', mode: '卸', progress: 82, status: '作业中', route: '皮带直送', order: 'ZY-1042', customs: '放行' },
  { id: '2#', name: '2号泊位', ship: '金港5', cargo: '河砂', mode: '卸', progress: 46, status: '作业中', route: '皮带直送', order: 'ZY-1048', customs: '查验' }
];

const WAIT_SHIPS = [
  { name: '远航11', cargo: '石英砂', eta: '18:20', status: '待靠', route: '汽车', order: 'ZY-1051', customs: '已申报' },
  { name: '琼海9', cargo: '钢铁件杂', eta: '预报', status: '锚地', route: '汽车', order: 'ZY-1056', customs: '异常' }
];

const VIDEOS = ['1#泊位前沿', '2#泊位前沿', '皮带廊道', '卡口'];

const ZONE_PEOPLE = [
  { name: '前沿', count: 12 },
  { name: '廊道', count: 6 },
  { name: '堆场', count: 9 },
  { name: '卡口', count: 4 },
  { name: '综合楼', count: 18 }
];

const BROADCAST = [
  { name: '前沿', status: '空闲' },
  { name: '廊道', status: '播报中' },
  { name: '堆场', status: '空闲' },
  { name: '卡口', status: '空闲' },
  { name: '综合楼', status: '空闲' }
];

function yardLevel(rate) {
  if (rate >= 90) return { text: '预警', cls: 'r' };
  if (rate >= 70) return { text: '关注', cls: 'y' };
  return { text: '正常', cls: 'g' };
}

function progressClass(p) {
  if (p >= 100) return 'full';
  if (p >= 70) return 'high';
  if (p >= 30) return 'mid';
  return 'low';
}

function pct(actual, target) {
  if (!target) return null;
  return Math.min(999.9, Math.round((actual / target) * 1000) / 10);
}

function berthCaption() {
  return `2个7万吨级通用泊位 · ${PORT.berthMode} · ${PORT.cargoNote}`;
}

/** 货类占比。类数增减只改这份数据，环形图高度不变。 */
const CARGO_SHARE = [
  { name: '水泥熟料', value: 36 },
  { name: '河砂', value: 28 },
  { name: '石英砂', value: 18 },
  { name: '钢铁件杂', value: 18 }
];

/** 当年货类分布：标准货类 · 占比 · 吞吐量（万吨） */
const CARGO_YEAR = [
  { name: '水泥熟料', share: 36, tons: 67.0 },
  { name: '河砂', share: 28, tons: 52.1 },
  { name: '石英砂', share: 18, tons: 33.5 },
  { name: '钢铁件杂', share: 18, tons: 33.4 }
];

/** 当年客户吞吐量排行 Top5（万吨） */
const CUSTOMER_RANK = [
  { name: '临高建材', tons: 42.6 },
  { name: '海南砂业', tons: 35.2 },
  { name: '海口钢贸', tons: 28.8 },
  { name: '琼北物流', tons: 22.1 },
  { name: '金港贸易', tons: 18.4 }
];

/** 资源占用整合口径 */
const RESOURCE_NOW = {
  carWait: 18,
  carIn: 186,
  shipWait: 1,
  shipAnchor: 1
};

/** 设备分类状态（演示） */
const EQUIP_BOARD = [
  { name: '卸船机', total: 2, run: 1, warn: 1, stop: 0 },
  { name: '门机', total: 4, run: 3, warn: 1, stop: 0 },
  { name: '皮带机', total: 6, run: 4, warn: 1, stop: 1 },
  { name: '轮胎吊', total: 3, run: 2, warn: 0, stop: 1 }
];

/** 环境监测精简：泊位水位 + 多门机风速 */
const HYDRO_WIND = {
  tides: [
    { berth: '1#', level: 2.36, status: '正常' },
    { berth: '2#', level: 2.28, status: '正常' }
  ],
  winds: [
    { name: '门机#1风速', target: '门机风速#1', value: 6.8, unit: 'm/s', max: 13.8, status: '可作业' },
    { name: '门机#2风速', target: '门机#2', value: 7.4, unit: 'm/s', max: 13.8, status: '可作业' }
  ]
};

/** 安全告警：连续安全天数 + 分类处置率 */
const SAFE_BOARD = {
  days: 1292,
  note: '无一般及以上事故',
  rates: [
    { name: '作业', rate: 96, done: 24, total: 25 },
    { name: '设备', rate: 92, done: 23, total: 25 },
    { name: '环境', rate: 88, done: 22, total: 25 },
    { name: '消防', rate: 100, done: 12, total: 12 }
  ]
};

const CARGO_COLORS = ['#0E74F0', '#36BFFA', '#7EB6FF', '#8FCBB8', '#C4B48A', '#64748B'];

const POI_ICON = {
  泊位: 'fa-anchor',
  船舶: 'fa-ship',
  设备: 'fa-gears',
  皮带: 'fa-arrows-left-right',
  堆场: 'fa-cubes',
  仓库: 'fa-warehouse',
  卡口: 'fa-road-barrier',
  地磅: 'fa-scale-balanced',
  海关: 'fa-stamp',
  人员: 'fa-user',
  车辆: 'fa-truck',
  告警: 'fa-triangle-exclamation',
  分区: 'fa-shield-halved',
  岸电: 'fa-plug',
  变电: 'fa-bolt',
  环境: 'fa-leaf'
};

const MAP_FEATURES = [
  { name: '1号泊位', type: '泊位', layer: '泊位', x: 16, y: 72, tone: 'ok', status: '作业中', groups: [
    { title: '在泊作业', rows: [['泊位', '1#'], ['状态', '作业中'], ['船名', '海建68'], ['货种', '水泥熟料'], ['装卸', '卸'], ['进度', '82%'], ['疏运', '皮带直送'], ['作业指令', 'ZY-1042'], ['通关', '放行']] }
  ]},
  { name: '2号泊位', type: '泊位', layer: '泊位', x: 30, y: 73, tone: 'ok', status: '作业中', groups: [
    { title: '在泊作业', rows: [['泊位', '2#'], ['状态', '作业中'], ['船名', '金港5'], ['货种', '河砂'], ['装卸', '卸'], ['进度', '46%'], ['疏运', '皮带直送'], ['作业指令', 'ZY-1048'], ['通关', '查验']] },
    { title: '通关', rows: [['状态', '查验'], ['是否告警', '否'], ['说明', '查验未超时，不进告警']] }
  ]},
  { name: '远航11', type: '船舶', layer: '泊位', x: 10, y: 80, tone: '', status: '待靠', groups: [
    { title: '待泊', rows: [['状态', '待靠'], ['货种', '石英砂'], ['预计靠泊', '18:20'], ['疏运', '汽车'], ['作业指令', 'ZY-1051'], ['通关', '已申报']] }
  ]},
  { name: '琼海9', type: '船舶', layer: '泊位', x: 8, y: 86, tone: 'warn', status: '锚地', groups: [
    { title: '待泊', rows: [['状态', '锚地'], ['货种', '钢铁件杂'], ['预计靠泊', '预报'], ['疏运', '汽车'], ['作业指令', 'ZY-1056']] },
    { title: '通关', rows: [['状态', '异常'], ['告警', '二级'], ['说明', '退单、布控未解除或查验超时']] }
  ]},
  { name: '卸船机#1', type: '设备', layer: '设备', x: 20, y: 64, tone: 'warn', status: '预警', groups: [
    { title: '设备', rows: [['类型', '螺旋卸船机'], ['服务', '1# 水泥熟料'], ['运行', '运行'], ['负载', '71%'], ['今日台时', '920吨/时'], ['告警', '振动偏高 · 二级']] }
  ]},
  { name: '门机#2', type: '设备', layer: '设备', x: 34, y: 64, tone: 'ok', status: '运行', groups: [
    { title: '设备', rows: [['类型', '门机'], ['服务', '2# 河砂抓斗'], ['运行', '运行'], ['负载', '88%'], ['今日台时', '480吨/时'], ['告警', '无']] }
  ]},
  { name: 'BM1', type: '皮带', layer: '设备', x: 26, y: 56, tone: 'ok', status: '运行', groups: [
    { title: '皮带', rows: [['编号', 'BM1'], ['状态', '运行'], ['流量', '860吨/时'], ['来源', '生产系统'], ['计入可用', '是']] }
  ]},
  { name: 'BM2', type: '皮带', layer: '设备', x: 38, y: 54, tone: 'ok', status: '运行', groups: [
    { title: '皮带', rows: [['编号', 'BM2'], ['状态', '运行'], ['流量', '640吨/时'], ['来源', '生产系统'], ['计入可用', '是']] }
  ]},
  { name: 'BM3', type: '皮带', layer: '设备', x: 46, y: 52, tone: 'muted', status: '预留', groups: [
    { title: '皮带', rows: [['编号', 'BM3'], ['状态', '预留'], ['流量', '—'], ['来源', '生产系统'], ['计入可用', '否']] }
  ]},
  { name: '2#变电所', type: '变电', layer: '设备', x: 14, y: 58, tone: 'ok', status: '运行', groups: [
    { title: '供电', rows: [['名称', '2# 码头变电所'], ['容量', '2×315kVA'], ['状态', '运行'], ['服务', '卸船机 / 门机']] }
  ]},
  { name: '1#变电所', type: '变电', layer: '设备', x: 40, y: 26, tone: 'ok', status: '运行', groups: [
    { title: '供电', rows: [['名称', '1# 陆域变电所'], ['容量', '2×1250kVA'], ['状态', '运行'], ['服务', '堆场 / 廊道 / 综合楼']] }
  ]},
  { name: '岸电', type: '岸电', layer: '设备', x: 12, y: 76, tone: 'ok', status: '待机', groups: [
    { title: '岸电', rows: [['位置', '1# / 2# 泊位前沿'], ['状态', '待机'], ['在用船', '无'], ['说明', '箱体在线，未接船']] }
  ]},
  { name: '散货堆场A', type: '堆场', yardKind: 'bulk', layer: '堆场', x: 50, y: 40, tone: 'warn', status: '关注', camera: '散货堆场监控', alert: '堆垛越界 · 一级 · 处置中',
    event: { level: '一级', title: '堆垛越界', owner: '陈磊', status: '处置中', time: '09:40', impact: 'A-03 禁新增', note: 'A-03 垛脚越界约 1.2 米；仅该垛禁新增，其余货位可继续收尾入库' },
    stocks: [
      { cargo: '水泥熟料', owner: '临高建材', order: 'WT-202611-1042', bl: 'HNJG6811042', ship: '海建68', work: 'ZY-1042', slot: 'A-03', tons: '36.5万吨', plan: '45.0万吨', done: '36.5万吨', remain: '8.5万吨', days: 6, state: '收尾中', route: '皮带直送', restrict: true, flag: '禁新增' },
      { cargo: '河砂', owner: '琼州矿建', order: 'WT-202611-1048', bl: 'QZKY51048', ship: '金港5', work: 'ZY-1048', slot: 'A-07', tons: '24.3万吨', plan: '28.0万吨', done: '24.3万吨', remain: '3.7万吨', days: 2, state: '入库中', route: '皮带直送' }
    ], groups: [
      { title: '堆存', rows: [['名称', '散货堆场'], ['货种', '水泥熟料 / 河砂'], ['库存', '60.8万吨'], ['容量', '80万吨'], ['空闲', '19.2万吨'], ['利用率', '76%'], ['阈值', '70% 关注 / 90% 预警'], ['等级', '关注'], ['计划量', '73.0万吨'], ['累计入库', '60.8万吨'], ['剩余量', '12.2万吨'], ['疏运', '皮带直送为主'], ['进度说明', '当前无出库，在场库存≈累计入库']] }
    ]},
  { name: '件杂堆场', type: '堆场', yardKind: 'breakbulk', layer: '堆场', x: 64, y: 38, tone: 'ok', status: '正常', camera: '件杂堆场监控',
    event: { level: '三级', title: '垛位临近关注线', owner: '陈磊', status: '已关注', time: '10:15', impact: 'J-12 预排转堆', note: 'J-12 占用偏高，预排转堆腾位，不限制入库' },
    stocks: [
      { cargo: '钢铁件杂', owner: '海口钢贸', order: 'WT-202610-0988', bl: 'HKGM16988', ship: '华远16', work: 'ZY-0988', slot: 'J-12', tons: '5.6万吨', pieces: '1860件', plan: '6.0万吨', done: '5.6万吨', remain: '0.4万吨', days: 18, state: '在场', direction: '卸', flag: '关注' },
      { cargo: '钢材卷板', owner: '琼北物流', order: 'WT-202611-1102', bl: 'QBWL17102', ship: '远航11', work: 'ZY-1102', slot: 'J-08', tons: '2.5万吨', pieces: '420件', plan: '2.5万吨', done: '1.1万吨', remain: '1.4万吨', days: 1, state: '入库中', direction: '卸' }
    ], groups: [
      { title: '堆存', rows: [['名称', '件杂堆场'], ['货种', '钢铁件杂 / 钢材卷板'], ['库存', '8.1万吨'], ['容量', '15万吨'], ['空闲', '6.9万吨'], ['利用率', '54%'], ['阈值', '70% 关注 / 90% 预警'], ['等级', '正常'], ['计划量', '8.5万吨'], ['累计入库', '6.7万吨'], ['剩余量', '1.8万吨'], ['装卸方向', '卸为主'], ['件数合计', '2280件'], ['进度说明', '在场库存含历史留存，与累计入库不完全相等']] }
    ]},
  { name: '仓库', type: '仓库', yardKind: 'warehouse', layer: '堆场', x: 72, y: 32, tone: 'ok', status: '正常', camera: '仓库监控', stocks: [
    { cargo: '袋装熟料', owner: '临高建材', order: 'WT-202611-1010', bl: 'HNJG681010', ship: '海建68', work: 'ZY-1010', slot: 'K-02', tons: '2.4万吨', days: 9, state: '在库' },
    { cargo: '件杂', owner: '海口钢贸', order: 'WT-202610-0991', bl: 'HKGM16991', ship: '华远16', work: 'ZY-0991', slot: 'K-06', tons: '1.4万吨', days: 21, state: '在库' }
  ], groups: [
    { title: '仓储', rows: [['名称', '仓库'], ['货种', '袋装 / 件杂'], ['库存', '3.8万吨'], ['容量', '10万吨'], ['空闲', '6.2万吨'], ['利用率', '38%'], ['等级', '正常']] }
  ]},
  { name: '散货堆场越界', type: '告警', layer: '告警', x: 54, y: 46, tone: 'bad', status: '未闭环', groups: [
    { title: '告警', rows: [['等级', '一级'], ['分类', '安全'], ['对象', '散货堆场'], ['现象', '堆垛越界'], ['处置', '处置中'], ['发生', '09:40'], ['闭环', '否']] }
  ]},
  { name: '廊道火灾告警', type: '告警', layer: '告警', x: 36, y: 48, tone: 'bad', status: '未闭环', camera: '皮带廊道监控',
    event: { level: '一级', title: '火灾告警', owner: '应急值班', status: '处置中', time: '10:41', impact: '廊道停机避让', note: '烟感触发 · 演示数据 · 消防已出动确认中' },
    groups: [{ title: '告警', rows: [['等级', '一级'], ['分类', '安全'], ['对象', '皮带廊道'], ['现象', '火灾/烟感'], ['处置', '处置中'], ['发生', '10:41'], ['闭环', '否']] }]},
  { name: '危险品区', type: '分区', layer: '堆场', x: 80, y: 48, tone: 'warn', status: '封闭', groups: [
    { title: '分区', rows: [['名称', '危险品区'], ['管理', '封闭'], ['当前作业', '无'], ['说明', '无危货作业时保持封闭']] }
  ]},
  { name: '卡口1', type: '卡口', layer: '卡口', x: 84, y: 28, tone: 'ok', status: '通行', groups: [
    { title: '卡口', rows: [['名称', '卡口1'], ['通行', '正常'], ['今日进港', '326辆'], ['拥堵预警', '待接入'], ['关联', '地磅#1']] }
  ]},
  { name: '地磅#1', type: '地磅', layer: '卡口', x: 76, y: 24, tone: 'ok', status: '在线', groups: [
    { title: '地磅', rows: [['名称', '地磅#1'], ['状态', '在线'], ['今日过磅', '88票'], ['最近货种', '石英砂'], ['最近车辆', '粤E·1122']] }
  ]},
  { name: '海关查验点', type: '海关', layer: '海关', x: 60, y: 50, tone: 'customs', status: '在线', groups: [
    { title: '在港船通关', rows: [['海建68', '放行'], ['金港5', '查验'], ['远航11', '已申报'], ['琼海9', '异常 · 二级']] },
    { title: '规则', rows: [['查验', '正常环节，不告警'], ['异常', '退单、未解除布控、查验超时'], ['超时阈值', '4小时']] }
  ]},
  { name: '前沿在岗', type: '人员', layer: '人员', x: 24, y: 60, tone: 'person', status: '在岗', track: [
    { time: '08:02', place: '综合楼', x: 44, y: 24 },
    { time: '08:16', place: '卡口', x: 84, y: 28 },
    { time: '08:28', place: '前沿', x: 24, y: 60 }
  ], groups: [
    { title: '基本信息', rows: [['姓名', '周成'], ['工号', 'QG-014'], ['岗位', '卸船指挥'], ['所在区域', '前沿'], ['区域在岗', '12人']] },
    { title: '工班信息', rows: [['班组', '前沿甲班'], ['班次', '白班'], ['时段', '08:00–16:00'], ['当班负责人', '周成']] }
  ]},
  { name: '廊道在岗', type: '人员', layer: '人员', x: 32, y: 48, tone: 'person', status: '在岗', track: [
    { time: '08:05', place: '综合楼', x: 44, y: 24 },
    { time: '08:20', place: 'T1转接', x: 36, y: 40 },
    { time: '08:34', place: '廊道', x: 32, y: 48 }
  ], groups: [
    { title: '基本信息', rows: [['姓名', '林海'], ['工号', 'QG-028'], ['岗位', '皮带巡检'], ['所在区域', '廊道'], ['区域在岗', '6人']] },
    { title: '工班信息', rows: [['班组', '廊道甲班'], ['班次', '白班'], ['时段', '08:00–16:00'], ['当班负责人', '林海']] }
  ]},
  { name: '堆场在岗', type: '人员', layer: '人员', x: 58, y: 34, tone: 'person', status: '在岗', track: [
    { time: '08:10', place: '卡口', x: 84, y: 28 },
    { time: '08:22', place: '件杂堆场', x: 64, y: 38 },
    { time: '08:40', place: '散货堆场', x: 58, y: 34 }
  ], groups: [
    { title: '基本信息', rows: [['姓名', '陈磊'], ['工号', 'QG-033'], ['岗位', '堆场管理'], ['所在区域', '堆场'], ['区域在岗', '9人']] },
    { title: '工班信息', rows: [['班组', '堆场乙班'], ['班次', '白班'], ['时段', '08:00–16:00'], ['当班负责人', '陈磊']] }
  ]},
  { name: '卡口在岗', type: '人员', layer: '人员', x: 80, y: 34, tone: 'person', status: '在岗', track: [
    { time: '07:55', place: '综合楼', x: 44, y: 24 },
    { time: '08:08', place: '地磅', x: 76, y: 24 },
    { time: '08:12', place: '卡口', x: 80, y: 34 }
  ], groups: [
    { title: '基本信息', rows: [['姓名', '吴敏'], ['工号', 'QG-041'], ['岗位', '卡口值班'], ['所在区域', '卡口'], ['区域在岗', '4人']] },
    { title: '工班信息', rows: [['班组', '卡口白班'], ['班次', '白班'], ['时段', '08:00–16:00'], ['当班负责人', '吴敏']] }
  ]},
  { name: '综合楼在岗', type: '人员', layer: '人员', x: 44, y: 24, tone: 'person', status: '在岗', camera: '综合楼监控', groups: [
    { title: '基本信息', rows: [['姓名', '赵宁'], ['工号', 'QG-006'], ['岗位', '调度值班'], ['所在区域', '综合楼'], ['区域在岗', '18人']] },
    { title: '工班信息', rows: [['班组', '调度值班'], ['班次', '白班'], ['时段', '08:00–20:00'], ['当班负责人', '赵宁']] }
  ], track: [
    { time: '07:50', place: '综合楼大厅', x: 42, y: 28 },
    { time: '08:00', place: '调度室', x: 44, y: 24 }
  ]},
  { name: '粤A·D1234', type: '车辆', layer: '车辆', x: 46, y: 46, tone: 'ok', status: '行驶', camera: '集疏运通道监控', track: [
    { time: '09:10', place: '东门卡口', x: 84, y: 28 },
    { time: '09:18', place: '地磅#1', x: 76, y: 24 },
    { time: '09:26', place: '散货堆场A', x: 52, y: 42 },
    { time: '09:40', place: '1#泊位前沿', x: 20, y: 68 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '粤A·D1234'], ['车型', '自卸车'], ['货种', '水泥熟料'], ['状态', '行驶'], ['目的地', '1#泊位'], ['关联指令', 'ZY-1042']] }
  ]},
  { name: '琼B·C8801', type: '车辆', layer: '车辆', x: 52, y: 52, tone: 'ok', status: '作业', camera: '件杂外运通道监控', track: [
    { time: '09:05', place: '件杂堆场', x: 64, y: 38 },
    { time: '09:20', place: '海关查验点', x: 60, y: 50 },
    { time: '09:32', place: '地磅#1', x: 76, y: 24 },
    { time: '09:45', place: '东门卡口', x: 84, y: 28 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '琼B·C8801'], ['车型', '平板车'], ['货种', '钢铁件杂'], ['状态', '作业'], ['目的地', '外运出港'], ['关联指令', 'ZY-0988']] }
  ]},
  { name: '粤E·1122', type: '车辆', layer: '车辆', x: 72, y: 30, tone: 'warn', status: '过磅', camera: '地磅通道监控', track: [
    { time: '09:30', place: '石英砂货区', x: 56, y: 44 },
    { time: '09:42', place: '地磅排队', x: 78, y: 26 },
    { time: '09:50', place: '地磅#1', x: 76, y: 24 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '粤E·1122'], ['车型', '自卸车'], ['货种', '石英砂'], ['状态', '过磅'], ['目的地', '出港'], ['关联指令', 'ZY-1051']] }
  ]},
  { name: '前沿粉尘#1', type: '环境', envKind: '粉尘', layer: '环境', x: 22, y: 68, tone: 'ok', status: '达标', camera: '前沿环保监控',
    groups: [{ title: '监测', rows: [['设备', '粉尘仪'], ['分区', '前沿'], ['TSP', '0.62 mg/m³'], ['PM10', '0.41 mg/m³'], ['限值', '1.0 / 1.5'], ['作业影响', '前沿卸船正常'], ['等级', '达标'], ['采样', '1分钟'], ['优先级', 'P0']] }]},
  { name: '堆场粉尘#1', type: '环境', envKind: '粉尘', layer: '环境', x: 54, y: 42, tone: 'warn', status: '关注', camera: '散货堆场环保监控', alert: '粉尘关注 · 二级 · 监测中',
    event: { level: '二级', title: '粉尘关注', owner: '环保值班', status: '监测中', time: '10:28', impact: '建议启雾炮', note: '堆场粉尘 1.18，介于关注带；建议开启雾炮并核查裸土覆盖' },
    groups: [{ title: '监测', rows: [['设备', '粉尘仪'], ['分区', '散货堆场'], ['TSP', '1.18 mg/m³'], ['PM10', '0.86 mg/m³'], ['限值', '1.0 / 1.5'], ['作业影响', '建议启雾炮抑尘'], ['等级', '关注'], ['采样', '1分钟'], ['优先级', 'P0']] }]},
  { name: '廊道粉尘#1', type: '环境', envKind: '粉尘', layer: '环境', x: 34, y: 52, tone: 'ok', status: '达标', camera: '皮带廊道监控',
    groups: [{ title: '监测', rows: [['设备', '粉尘仪'], ['分区', '廊道'], ['TSP', '0.54 mg/m³'], ['PM10', '0.33 mg/m³'], ['限值', '1.0 / 1.5'], ['作业影响', '皮带转运正常'], ['等级', '达标'], ['采样', '1分钟'], ['优先级', 'P1']] }]},
  { name: '卡口噪声#1', type: '环境', envKind: '噪声', layer: '环境', x: 82, y: 30, tone: 'ok', status: '达标', camera: '卡口监控',
    groups: [{ title: '监测', rows: [['设备', '噪声仪'], ['分区', '卡口'], ['当前', '66.4 dB(A)'], ['昼限', '70'], ['夜限', '55'], ['时段', '昼间'], ['等级', '达标'], ['作业影响', '集疏运通行正常'], ['优先级', 'P1']] }]},
  { name: '港区气象站', type: '环境', envKind: '气象', layer: '环境', x: 40, y: 20, tone: 'ok', status: '在线', camera: '陆域气象监控',
    groups: [{ title: '监测', rows: [['设备', '气象站'], ['分区', '陆域'], ['气温', '28.6℃'], ['湿度', '76%'], ['雨量', '0 mm/h'], ['风向', 'NE'], ['风速', '4.2 m/s'], ['能见度', '12 km'], ['作业影响', '露天装卸正常'], ['等级', '正常'], ['优先级', 'P0']] }]},
  { name: '门机风速#1', type: '环境', envKind: '风速', layer: '环境', x: 28, y: 62, tone: 'ok', status: '可作业', camera: '2#泊位前沿',
    groups: [{ title: '监测', rows: [['设备', '风速仪'], ['分区', '门机区'], ['瞬时风速', '6.8 m/s'], ['1分钟均风', '5.9 m/s'], ['禁作业阈', '13.8 m/s'], ['作业影响', '门机/卸船可作业'], ['等级', '可作业'], ['关联', '门机#2'], ['优先级', 'P0']] }]},
  { name: '潮位仪#1', type: '环境', envKind: '潮位', layer: '环境', x: 12, y: 78, tone: 'ok', status: '正常', camera: '港池潮位监控',
    groups: [{ title: '监测', rows: [['设备', '潮位仪'], ['分区', '港池'], ['潮高', '2.36 m'], ['趋势', '涨潮'], ['高潮预报', '3.1 m / 21:40'], ['作业影响', '靠离泊窗口正常'], ['等级', '正常'], ['优先级', 'P1']] }]},
  { name: '堆场雾炮#1', type: '环境', envKind: '抑尘', layer: '环境', x: 50, y: 46, tone: 'warn', status: '待机', camera: '散货堆场环保监控',
    groups: [{ title: '监测', rows: [['设备', '雾炮'], ['分区', '散货堆场'], ['状态', '待机'], ['最近启动', '09:50'], ['关联粉尘', '堆场粉尘#1'], ['作业影响', '联动粉尘关注'], ['建议', '粉尘关注时可启'], ['优先级', 'P1']] }]},
  { name: '堆场喷淋#1', type: '环境', envKind: '抑尘', layer: '环境', x: 48, y: 38, tone: 'ok', status: '运行', camera: '散货堆场环保监控',
    groups: [{ title: '监测', rows: [['设备', '喷淋阀组'], ['分区', 'A区货位'], ['状态', '运行'], ['压力', '0.32 MPa'], ['覆盖货位', 'A-03 / A-07'], ['作业影响', 'A区货位抑尘中'], ['优先级', 'P1']] }]},
];

function findMapFeature(name) {
  if (!name || typeof MAP_FEATURES === 'undefined') return null;
  return MAP_FEATURES.find((f) => f.name === name) || null;
}

/** 顶栏天气（港区气象站同源演示） */
const WEATHER = {
  sky: '多云',
  icon: 'fa-cloud-sun',
  temp: '28.6℃',
  windDir: '东北风',
  wind: '4.2 m/s',
  humidity: '76%',
  rain: '无雨',
  vis: '12 km',
  work: '可作业',
  tip: '风力未超门机限值'
};

/** 通航气象 · 未来7日（演示） */
const WEATHER_7D = [
  { icon: 'fa-cloud-sun', desc: '多云转晴', high: 26, low: 18, wind: '东南风3级' },
  { icon: 'fa-cloud', desc: '阴', high: 24, low: 17, wind: '东北风3级' },
  { icon: 'fa-cloud-rain', desc: '小雨', high: 22, low: 16, wind: '北风4级' },
  { icon: 'fa-cloud-sun', desc: '多云', high: 25, low: 17, wind: '东风2级' },
  { icon: 'fa-sun', desc: '晴', high: 28, low: 19, wind: '南风2级' },
  { icon: 'fa-cloud-sun', desc: '多云', high: 27, low: 20, wind: '东南风3级' },
  { icon: 'fa-cloud', desc: '阴', high: 26, low: 19, wind: '东风3级' }
];

/** 作业环境看板：只保留影响生产作业的核心点位 */
const ENV_BOARD = [
  { name: '门机风速#1', kind: '风速', value: 6.8, unit: 'm/s', max: 13.8, mark: 13.8, status: '可作业', icon: 'fa-wind', impact: '门机/卸船可作业' },
  { name: '港区气象站', kind: '气象', value: 4.2, unit: 'm/s', max: 13.8, mark: 10, status: '在线', icon: 'fa-cloud-sun', impact: '露天装卸正常' },
  { name: '堆场粉尘#1', kind: '粉尘', value: 1.18, unit: 'mg/m³', max: 1.5, mark: 1.0, status: '关注', icon: 'fa-smog', impact: '建议启雾炮抑尘' },
  { name: '前沿粉尘#1', kind: '粉尘', value: 0.62, unit: 'mg/m³', max: 1.5, mark: 1.0, status: '达标', icon: 'fa-smog', impact: '前沿卸船正常' },
  { name: '堆场雾炮#1', kind: '抑尘', value: 0, unit: '', max: 1, mark: 1, status: '待机', icon: 'fa-fan', pct: 18, impact: '联动粉尘关注' },
  { name: '潮位仪#1', kind: '潮位', value: 2.36, unit: 'm', max: 3.5, mark: 3.1, status: '正常', icon: 'fa-water', impact: '靠离泊窗口正常' }
];

function envBoardPct(item) {
  if (item.reserved) return 0;
  if (item.pct != null) return item.pct;
  if (item.value == null || !item.max) return 0;
  return Math.max(0, Math.min(100, Math.round((Number(item.value) / Number(item.max)) * 100)));
}

function envBoardTone(status) {
  if (/超标|一级|禁作业/.test(status)) return 'r';
  if (/关注|待机|可启|二级/.test(status)) return 'y';
  if (/预留/.test(status)) return 'm';
  return 'g';
}

function renderEnvBoardHtml(mode) {
  const list = ENV_BOARD;
  const ok = list.filter((item) => /达标|正常|在线|可作业|运行/.test(item.status)).length;
  const warn = list.filter((item) => /关注|待机/.test(item.status)).length;
  const risk = list.filter((item) => /超标|禁作业/.test(item.status)).length;
  const cards = list.map((item) => {
    const tone = envBoardTone(item.status);
    const reading = item.value == null || (item.value === 0 && !item.unit)
      ? escHtml(item.status)
      : `${item.value}<small>${escHtml(item.unit || '')}</small>`;
    const stCls = tone === 'y' ? 'warn' : tone === 'r' ? 'alarm' : 'ok';
    return `<div class="env-cell ${tone}" role="button" tabindex="0" data-n="${escHtml(item.name)}">
      <div class="env-cell-hd"><span class="en"><i class="fa-solid ${item.icon || 'fa-leaf'}"></i>${escHtml(item.kind)}</span><span class="es ${stCls}">${escHtml(item.status)}</span></div>
      <div class="ev">${reading}</div>
      <div class="ef">${escHtml(item.impact || '')}</div>
    </div>`;
  }).join('');
  return `<div class="env-board ${mode || 'full'}">
    <div class="env-pri">
      <div class="env-pri-item ok"><span class="pv">${ok}</span><span class="pl">正常</span></div>
      <div class="env-pri-item warn"><span class="pv">${warn}</span><span class="pl">干预</span></div>
      <div class="env-pri-item urgent"><span class="pv">${risk}</span><span class="pl">限制</span></div>
    </div>
    <div class="env-grid">${cards}</div>
  </div>`;
}

function renderWeatherHtml() {
  const w = WEATHER;
  const workTone = /禁|停|限制/.test(w.work) ? 'r' : /关注|警戒/.test(w.work) ? 'y' : 'g';
  const week = ['日', '一', '二', '三', '四', '五', '六'];
  const base = new Date();
  const days = (WEATHER_7D || []).map((slot, i) => {
    const lbl = i === 0 ? '今天' : i === 1 ? '明天' : `周${week[(base.getDay() + i) % 7]}`;
    const tip = `${slot.desc} · ${slot.wind} · ${slot.high}°/${slot.low}°`;
    return `<div class="wx7-day${i === 0 ? ' today' : ''}" title="${escHtml(tip)}">
      <span class="d">${lbl}</span>
      <i class="fa-solid ${slot.icon} i" aria-hidden="true"></i>
      <span class="w">${escHtml(slot.wind)}</span>
      <span class="t"><span class="hi">${slot.high}°</span><span class="lo">/${slot.low}°</span></span>
    </div>`;
  }).join('');
  return `<div class="wx wx7" title="${escHtml(w.tip)}">
    <div class="wx7-hd">
      <span class="wx7-title"><i class="fa-solid fa-cloud-sun-rain"></i> 通航气象·7日</span>
      <span class="wx-work ${workTone}">${escHtml(w.work)}</span>
    </div>
    <div class="wx7-grid">${days}</div>
  </div>`;
}

function mountWeather() {
  document.querySelectorAll('[data-weather]').forEach((el) => {
    el.innerHTML = renderWeatherHtml();
  });
}

/** 领导巡视：告警汇总为主，例外最多 Top3 */
const ALERT_TOP_N = 3;
const ALERT_BOARD = [
  { id: 'A01', name: '廊道火灾告警', title: '廊道火灾/烟感', category: '安全', level: '一级', status: '未闭环', time: '10:41', owner: '应急值班', target: '廊道火灾告警', score: 100 },
  { id: 'A02', name: '散货堆场越界', title: '散货堆场堆垛越界', category: '安全', level: '一级', status: '未闭环', time: '09:40', owner: '堆场班', target: '散货堆场越界', score: 92 },
  { id: 'A03', name: '堆场粉尘#1', title: '堆场粉尘关注', category: '作业环境', level: '二级', status: '监测中', time: '10:28', owner: '环保值班', target: '堆场粉尘#1', score: 70 },
  { id: 'A04', name: '琼海9', title: '琼海9通关异常', category: '通关/卡口', level: '二级', status: '未闭环', time: '09:15', owner: '商务关务', target: '琼海9', score: 68 },
  { id: 'A05', name: '卸船机#1', title: '卸船机#1振动偏高', category: '设备', level: '二级', status: '处置中', time: '08:50', owner: '设备班', target: '卸船机#1', score: 60 },
  { id: 'A06', name: '皮带机BM2温度', title: '皮带机BM2温度偏高', category: '设备', level: '二级', status: '已闭环', time: '07:20', owner: '设备班', target: '皮带机BM2', score: 40, closed: true },
  { id: 'A07', name: '门机风速#1', title: '门机风速接近限值', category: '作业环境', level: '作业限制', status: '监测中', time: '10:35', owner: '调度', target: '门机风速#1', score: 72 }
];

function alertLevelTone(level) {
  if (/一级|火灾|禁作业|作业限制/.test(level)) return 'r';
  if (/二级|关注/.test(level)) return 'y';
  return 'g';
}

function alertOpenList() {
  return ALERT_BOARD.filter((item) => !item.closed && item.status !== '已闭环');
}

function alertTopList() {
  return alertOpenList()
    .slice()
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, ALERT_TOP_N);
}

function renderAlertBoardHtml() {
  const s = SAFE_BOARD;
  const open = alertOpenList();
  const unclosed = open.filter((i) => /未闭环/.test(i.status)).length;
  const icons = { 作业: 'fa-ship', 设备: 'fa-gears', 环境: 'fa-leaf', 消防: 'fa-fire-extinguisher' };
  const rates = (s.rates || []).map((item) => {
    const tone = item.rate >= 95 ? 'ok' : item.rate >= 90 ? '' : 'warn';
    const ico = icons[item.name] || 'fa-shield-halved';
    return `<div class="safe-card ${tone}">
      <div class="sc-top"><span class="sc-name"><i class="fa-solid ${ico}"></i>${escHtml(item.name)}</span><span class="sc-tag">处置率</span></div>
      <div class="sc-val">${item.rate}<small>%</small></div>
      <div class="sc-bar"><i style="width:${Math.min(100, item.rate)}%"></i></div>
      <div class="sc-sub">已处置 ${item.done}/${item.total}</div>
    </div>`;
  }).join('');
  const top = alertTopList().slice(0, 2);
  const listHtml = top.map((item) => {
    const tone = alertLevelTone(item.level);
    return `<div class="al-row lv-${tone}" role="button" tabindex="0" data-n="${escHtml(item.target || item.name)}">
      <span class="lv-tag ${tone}">${escHtml(item.level === '作业限制' ? '限制' : item.level)}</span>
      <span class="al-txt">${escHtml(item.title)}</span>
      <span class="al-tm">${escHtml(item.time)}</span>
    </div>`;
  }).join('');
  return `<div class="al-board">
    <div class="al-banner">
      <span class="safe-lbl"><i class="fa-solid fa-shield-halved"></i> 连续安全运营</span>
      <span class="safe-val"><b>${s.days.toLocaleString('zh-CN')}</b> 天</span>
      <span class="safe-note">${escHtml(s.note)} · 未闭环 ${unclosed}</span>
    </div>
    <div class="safe-cards">${rates}</div>
    <div class="al-list-hd"><span>在办危险告警</span><span class="cnt">${top.length}条</span></div>
    <div class="al-list">${listHtml || '<div class="al-empty"><i class="fa-solid fa-shield-halved"></i>暂无高优告警</div>'}</div>
  </div>`;
}

function renderEquipBoardHtml() {
  const list = EQUIP_BOARD;
  const total = list.reduce((n, i) => n + i.total, 0);
  const run = list.reduce((n, i) => n + i.run, 0);
  const warn = list.reduce((n, i) => n + i.warn, 0);
  const stop = list.reduce((n, i) => n + i.stop, 0);
  const rows = list.map((item) => {
    const runPct = Math.round((item.run / item.total) * 100);
    return `<div class="eq-row" data-n="${escHtml(item.name)}">
      <div class="eq-hd"><b>${escHtml(item.name)}</b><span>共 ${item.total}</span></div>
      <div class="eq-bar"><i class="g" style="width:${runPct}%"></i></div>
      <div class="eq-meta"><span class="g">运行 ${item.run}</span><span class="y">关注 ${item.warn}</span><span class="r">停机 ${item.stop}</span></div>
    </div>`;
  }).join('');
  return `<div class="eq-board">
    <div class="eq-pri">
      <div class="eq-kpi"><span class="pv">${total}</span><span class="pl">设备总数</span></div>
      <div class="eq-kpi ok"><span class="pv">${run}</span><span class="pl">运行</span></div>
      <div class="eq-kpi warn"><span class="pv">${warn}</span><span class="pl">关注</span></div>
      <div class="eq-kpi urgent"><span class="pv">${stop}</span><span class="pl">停机</span></div>
    </div>
    <div class="eq-list">${rows}</div>
  </div>`;
}

function renderHydroWindHtml() {
  const h = HYDRO_WIND;
  const tides = (h.tides || []).map((item) => {
    const ok = item.status === '正常';
    return `<div class="hw-cell ${ok ? 'ok' : 'warn'}" data-n="${escHtml(item.berth)}号泊位">
      <span class="en">${escHtml(item.berth)} 水位</span>
      <span class="ev">${item.level}<small>m</small></span>
      <span class="es ${ok ? 'ok' : 'warn'}">${escHtml(item.status)}</span>
    </div>`;
  }).join('');
  const winds = (h.winds || []).map((w) => {
    const wOk = /可作业|正常/.test(w.status || '');
    return `<div class="hw-cell hw-wind-card ${wOk ? 'ok' : 'warn'}" data-n="${escHtml(w.target || w.name)}">
      <span class="en"><i class="fa-solid fa-wind"></i>${escHtml(w.name)}</span>
      <span class="ev">${w.value}<small>${escHtml(w.unit || 'm/s')}</small></span>
      <span class="es ${wOk ? 'ok' : 'warn'}">${escHtml(w.status || '')}</span>
      <span class="ef">阈 ${w.max} m/s</span>
    </div>`;
  }).join('');
  return `<div class="hw-board">
    <div class="hw-sec">泊位水位</div>
    <div class="hw-grid">${tides}</div>
    <div class="hw-sec">门机风速</div>
    <div class="hw-grid">${winds}</div>
  </div>`;
}

function mountAlertBoards(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-alert-board]').forEach((el) => {
    el.innerHTML = renderAlertBoardHtml();
    el.querySelectorAll('.al-row').forEach((item) => {
      item.addEventListener('click', () => {
        const name = item.getAttribute('data-n');
        if (typeof focusPoiByName === 'function') focusPoiByName(name);
        else if (typeof openDrill === 'function') openDrill(name, '告警', '');
      });
    });
  });
}

function mountEquipBoards(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-equip-board]').forEach((el) => {
    el.innerHTML = renderEquipBoardHtml();
  });
}

function mountHydroWind(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-hydro-wind]').forEach((el) => {
    el.innerHTML = renderHydroWindHtml();
    el.querySelectorAll('[data-n]').forEach((item) => {
      item.addEventListener('click', () => {
        const name = item.getAttribute('data-n');
        if (typeof focusPoiByName === 'function') focusPoiByName(name);
      });
    });
  });
}

function mountEnvBoards(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-env-board]').forEach((el) => {
    const mode = el.getAttribute('data-env-board') || 'full';
    el.innerHTML = renderEnvBoardHtml(mode);
    el.querySelectorAll('.env-cell').forEach((card) => {
      card.addEventListener('click', () => {
        const name = card.getAttribute('data-n');
        if (typeof focusPoiByName === 'function') focusPoiByName(name);
        else if (typeof openDrill === 'function') openDrill(name, '环境', '');
      });
    });
  });
}

function escHtml(value) {
  return String(value).replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
}

function renderFeatureDims(feat) {
  const draw = {
    泊位: vizBerth,
    船舶: vizShip,
    设备: vizEquip,
    皮带: vizBelt,
    堆场: vizYard,
    仓库: vizYard,
    卡口: vizGate,
    地磅: vizScale,
    海关: vizCustoms,
    人员: vizPerson,
    车辆: vizVehicle,
    告警: vizAlert,
    变电: vizPower,
    岸电: vizShore,
    分区: vizZone,
    环境: vizEnv
  }[feat.type];
  return draw ? draw(feat) : vizFallback(feat);
}

function rowMap(feat) {
  const map = {};
  (feat.groups || []).forEach((group) => {
    group.rows.forEach(([key, val]) => {
      if (map[key] === undefined) map[key] = val;
      else map[group.title + '·' + key] = val;
    });
  });
  return map;
}

function numOf(text) {
  const matched = String(text || '').match(/-?\d+(?:\.\d+)?/);
  return matched ? Number(matched[0]) : 0;
}

function toneOf(text) {
  const value = String(text || '');
  if (/异常|一级|预警|故障|停机|越界|未闭环|超标/.test(value)) return 'r';
  if (/查验|关注|二级|三级|待靠|锚地|待机|封闭|待接入|禁作业/.test(value)) return 'y';
  if (/预留|未接入/.test(value)) return 'm';
  if (/已申报/.test(value)) return 'b';
  if (/放行|正常|运行|作业|在线|在岗|通行|达标|可作业/.test(value)) return 'g';
  return 'm';
}

function pillOf(text) {
  return `<span class="ypill ${toneOf(text)}">${escHtml(text == null || text === '' ? '—' : text)}</span>`;
}

function vsheet(items) {
  const statusKey = /状态|通关|等级|告警|运行|通行|管理|闭环|计入|拥堵/;
  const codeKey = /作业指令|工号|编号|提单|委托|车辆/;
  const body = items.map(([key, val]) => {
    const raw = val == null || val === '' ? '—' : String(val);
    let inner = escHtml(raw);
    if (/计入/.test(key)) inner = `<span class="ypill ${raw === '是' ? 'g' : 'm'}">${escHtml(raw)}</span>`;
    else if (statusKey.test(key) && raw.length <= 16) inner = pillOf(raw);
    else if (codeKey.test(key)) inner = `<span class="code">${escHtml(raw)}</span>`;
    else if (/货位|泊位/.test(key) && raw.length <= 8) inner = `<span class="yslot">${escHtml(raw)}</span>`;
    return `<tr><th>${escHtml(key)}</th><td>${inner}</td></tr>`;
  }).join('');
  return `<div class="yg-scroll sheet"><table class="yg-table spec"><tbody>${body}</tbody></table></div>`;
}

function vring(percent, caption) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return `<div class="vring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(226,232,240,.14)" stroke-width="2.2"/><circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" stroke-width="2.2" pathLength="100" stroke-dasharray="${p} 100" stroke-linecap="round" transform="rotate(-90 18 18)"/></svg><div class="vring-val">${p}<small>%</small><em>${escHtml(caption || '')}</em></div></div>`;
}

function vtiles(items) {
  return `<div class="vtiles">${items.map(([key, val]) => {
    const tone = /状态|通关|等级|告警|运行|通行|管理|闭环|计入/.test(key) ? toneOf(val) : '';
    return `<div class="vtile"><span>${escHtml(key)}</span><b class="${tone}">${escHtml(val)}</b></div>`;
  }).join('')}</div>`;
}

function vsteps(items) {
  return `<div class="vsteps">${items.map((item) => `<div class="vstep ${item.cls || ''}"><i></i><b>${escHtml(item.name)}</b><span>${escHtml(item.sub || '')}</span></div>`).join('')}</div>`;
}

function camSrcOf(feat) {
  const kind = yardKindOf(feat);
  const type = feat.type || '';
  if (type === '堆场' || type === '仓库') {
    if (kind === 'breakbulk' || kind === 'warehouse') return '../assets/yard-breakbulk-cam.jpg';
    return '../assets/yard-bulk-cam.jpg';
  }
  if (type === '设备') return '../assets/cam-equip.jpg';
  if (type === '皮带') return '../assets/cam-belt.jpg';
  if (type === '变电') return '../assets/cam-power.jpg';
  if (/卡口|地磅|海关|人员|车辆/.test(type)) return '../assets/cam-gate.jpg';
  if (/泊位|船舶|岸电/.test(type)) return '../assets/cam-berth.jpg';
  if (type === '分区') return '../assets/yard-breakbulk-cam.jpg';
  if (type === '告警') return '../assets/yard-bulk-cam.jpg';
  if (type === '环境') return '../assets/cam-env.jpg';
  return '../assets/cam-berth.jpg';
}

function camNameOf(feat, fallback) {
  if (feat.camera) return feat.camera;
  return (fallback || feat.name || '现场') + '监控';
}

function camPanel(feat, kindLabel, level) {
  const name = camNameOf(feat, kindLabel);
  const src = camSrcOf(feat);
  const status = level || feat.status || '在线';
  const online = /离线|中断|故障停机/.test(String(status)) ? 'r' : 'g';
  const onlineText = online === 'g' ? '在线' : '异常';
  return `<div class="vpanel vcam-panel">
    <div class="ycam-stage has-photo" role="img" aria-label="${escHtml(name)}" onclick="if(!wallCan('video')){toast('未登录操控席，不能放大视频');return;}toast('放大视频：${escHtml(name)}')">
      <img class="ycam-photo" src="${src}" alt="${escHtml(name)}">
      <span class="rec">LIVE</span>
      <span class="st tag ${online}">${onlineText}</span>
      <div class="ycam-scan"></div>
      <div class="ycam-caption">
        <b>${escHtml(name)}</b>
        <span>${escHtml(kindLabel || feat.type || '')} · ${escHtml(status)}</span>
      </div>
    </div>
  </div>`;
}

function compactTable(headers, rowsHtml) {
  if (!rowsHtml) return '<div class="yg-empty">暂无明细</div>';
  return `<div class="yg-scroll"><table class="yg-table compact"><thead><tr>${headers.map((name) => `<th>${name}</th>`).join('')}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
}

function detailLayout(opts) {
  const meter = opts.meterHtml || '';
  const eventHtml = opts.eventHtml || '';
  const progressHtml = opts.progressHtml || '';
  const list = opts.listHtml
    ? `<div class="yard-list"><div class="yg-head"><div class="vnote">${escHtml(opts.listTitle || '明细 · 演示')}</div></div>${opts.listHtml}</div>`
    : '';
  return `<div class="viz">
    <div class="viz-grid">
      ${opts.camHtml}
      <div class="vpanel">
        <div class="yg-head">
          <div class="vnote">${escHtml(opts.note || '关键指标')}</div>
          <div class="vstatus ${toneOf(opts.status)}">${escHtml(opts.status || '—')}</div>
        </div>
        ${meter}
        ${opts.tilesHtml || ''}
        ${eventHtml}
      </div>
    </div>
    ${progressHtml}
    ${list}
  </div>`;
}

function progressBlock(title, pct, tiles, tip) {
  const p = Math.max(0, Math.min(100, Math.round(pct || 0)));
  return `<div class="yard-list yg-progress">
    <div class="yg-head"><div class="vnote">${escHtml(title)}</div><div class="vnote yg-pct">${p}%</div></div>
    <div class="yg-progbar"><i style="width:${p}%"></i></div>
    ${vtiles(tiles || [])}
    ${tip ? `<div class="yg-tip">${escHtml(tip)}</div>` : ''}
  </div>`;
}

function vizBerth(feat) {
  const rows = rowMap(feat);
  const progress = numOf(rows['进度']);
  const status = rows['状态'] || feat.status;
  const customs = rows['通关'] || '—';
  const list = compactTable(['环节', '说明', '状态'], [
    ['靠泊', rows['船名'] || '—', '已靠'],
    ['卸船', progress + '%', status],
    ['疏运', rows['疏运'] || '—', '进行中'],
    ['通关', customs, customs]
  ].map((row) => `<tr><td class="cargo">${escHtml(row[0])}</td><td>${escHtml(row[1])}</td><td>${pillOf(row[2])}</td></tr>`).join(''));
  return detailLayout({
    camHtml: camPanel(feat, '泊位', status),
    status,
    note: '在泊作业 · 进度与通关',
    meterHtml: `<div class="vmeter"><div class="vmeter-fill ${toneOf(status)}" style="width:${progress}%"></div><i class="vtick" style="left:70%"><b>70</b></i><i class="vtick hot" style="left:90%"><b>90</b></i></div>`,
    tilesHtml: vtiles([['泊位', rows['泊位'] || feat.name], ['船名', rows['船名'] || '—'], ['货种', rows['货种'] || '—'], ['装卸', rows['装卸'] || '—'], ['作业指令', rows['作业指令'] || '—'], ['通关', customs]]),
    progressHtml: progressBlock('本期卸船进度 · 已完成 ÷ 计划', progress, [['进度', progress + '%'], ['疏运', rows['疏运'] || '—'], ['作业指令', rows['作业指令'] || '—']]),
    listTitle: '作业链路 · 泊位 · 演示',
    listHtml: list
  });
}

function vizShip(feat) {
  const rows = rowMap(feat);
  const status = rows['状态'] || feat.status;
  const stages = ['预报', '锚地', '待靠', '已排泊'];
  const idx = Math.max(0, stages.indexOf(status));
  const pctVal = Math.round(((idx + 1) / stages.length) * 100);
  const customs = rows['通关'] || rows['通关·状态'] || '—';
  const list = compactTable(['节点', '状态'], stages.map((name, i) => {
    const mark = i < idx ? '已经过' : (i === idx ? '当前' : '未到');
    return `<tr class="${i === idx ? 'on' : ''}"><td class="cargo">${escHtml(name)}</td><td>${pillOf(mark)}</td></tr>`;
  }).join(''));
  return detailLayout({
    camHtml: camPanel(feat, '待泊船舶', status),
    status,
    note: '待泊进程 · 船期节点',
    meterHtml: `<div class="vmeter"><div class="vmeter-fill ${toneOf(status)}" style="width:${pctVal}%"></div></div>`,
    tilesHtml: vtiles([['货种', rows['货种'] || '—'], ['预计靠泊', rows['预计靠泊'] || '—'], ['疏运', rows['疏运'] || '—'], ['作业指令', rows['作业指令'] || '—'], ['通关', customs]]),
    listTitle: '待泊节点 · 演示',
    listHtml: list
  });
}

function vizEquip(feat) {
  const rows = rowMap(feat);
  const load = numOf(rows['负载']);
  const status = rows['运行'] || feat.status;
  const alert = rows['告警'] && rows['告警'] !== '无'
    ? { level: /一级/.test(rows['告警']) ? '一级' : '二级', title: rows['告警'], owner: '设备班', status: '监测中', time: '今日', note: rows['告警'], impact: rows['服务'] || '' }
    : null;
  const shape = [0.62, 0.74, 0.81, 0.9, 1, 0.88, 0.76];
  const list = compactTable(['时段', '负载', '状态'], shape.map((rate, index) => {
    const value = Math.round(load * rate);
    return `<tr><td class="code">${8 + index}:00</td><td class="num">${value}%</td><td>${pillOf(status)}</td></tr>`;
  }).join(''));
  const eventHtml = alert ? yardEventBlock({ event: alert, alert: rows['告警'] }) : '';
  return detailLayout({
    camHtml: camPanel(feat, rows['类型'] || '设备', status),
    status,
    note: '设备运行 · 负载与告警',
    meterHtml: `<div class="vmeter"><div class="vmeter-fill ${toneOf(rows['告警'] || status)}" style="width:${load}%"></div><i class="vtick" style="left:70%"><b>70</b></i><i class="vtick hot" style="left:90%"><b>90</b></i></div>`,
    tilesHtml: vtiles([['类型', rows['类型'] || '—'], ['服务', rows['服务'] || '—'], ['负载', load + '%'], ['今日台时', rows['今日台时'] || '—'], ['告警', rows['告警'] || '无']]),
    eventHtml,
    progressHtml: progressBlock('今日负载水平', load, [['当前负载', load + '%'], ['运行', status], ['告警', rows['告警'] || '无']]),
    listTitle: '负载抽样 · 演示',
    listHtml: list
  });
}

function vizBelt(feat) {
  const rows = rowMap(feat);
  const flow = numOf(rows['流量']);
  const status = rows['状态'] || feat.status;
  const scale = 1000;
  const pctVal = rows['流量'] === '—' || rows['流量'] == null ? 0 : Math.round((flow / scale) * 100);
  const list = compactTable(['皮带', '流量', '相对高低', '状态'], BELTS.map((belt) => {
    const width = belt.flow ? Math.round((belt.flow / scale) * 100) : 0;
    const flowText = belt.flow == null ? '—' : `${belt.flow}吨/时`;
    const bar = belt.flow == null ? '<span class="code">—</span>' : `<div class="vbar"><i style="width:${width}%"></i></div>`;
    return `<tr class="${belt.name === feat.name ? 'on' : ''}"><td class="cargo">${escHtml(belt.name)}</td><td class="num">${escHtml(flowText)}</td><td><div class="vbar-cell">${bar}</div></td><td>${pillOf(belt.status)}</td></tr>`;
  }).join(''));
  return detailLayout({
    camHtml: camPanel(feat, '皮带', status),
    status,
    note: '皮带流量 · 刻度 1000 吨/时',
    meterHtml: `<div class="vmeter"><div class="vmeter-fill ${toneOf(status)}" style="width:${pctVal}%"></div></div>`,
    tilesHtml: vtiles([['编号', rows['编号'] || feat.name], ['流量', rows['流量'] || '—'], ['来源', rows['来源'] || '生产系统'], ['计入可用', rows['计入可用'] || '—']]),
    listTitle: '三条皮带对照 · 演示',
    listHtml: list
  });
}

function yardKindOf(feat) {
  if (feat.yardKind) return feat.yardKind;
  if (feat.type === '仓库') return 'warehouse';
  if (/件杂/.test(feat.name || '')) return 'breakbulk';
  if (/散货/.test(feat.name || '')) return 'bulk';
  return 'bulk';
}

function statePillClass(state) {
  const value = String(state || '');
  if (/禁新增|冻结|异常|越界/.test(value)) return 'r';
  if (/入库|出库|作业|收尾/.test(value)) return 'b';
  if (/在场|在库|正常/.test(value)) return 'g';
  if (/关注/.test(value)) return 'y';
  return 'm';
}

function yardFreeText(rows) {
  if (rows['空闲']) return rows['空闲'];
  const cap = numOf(rows['容量']);
  const stock = numOf(rows['库存']);
  if (!cap) return '—';
  const free = Math.max(0, Math.round((cap - stock) * 10) / 10);
  return `${free}万吨`;
}

function yardTable(stocks, kind) {
  const list = stocks || [];
  if (!list.length) {
    return '<div class="yg-empty">暂无在场货物</div>';
  }
  const isBreak = kind === 'breakbulk';
  const isBulk = kind === 'bulk';
  const head = isBreak
    ? ['货种', '货主', '关联船舶', '货位', '库存', '件数', '剩余量', '装卸', '堆存天数', '状态']
    : isBulk
      ? ['货种', '货主', '关联船舶', '货位', '库存', '剩余量', '堆存天数', '状态']
      : ['货种', '货主', '关联船舶', '货位', '库存', '堆存天数', '状态'];
  const body = list.map((item) => {
    const rowCls = item.restrict || item.flag === '禁新增' ? 'hit' : item.flag === '关注' ? 'watch' : '';
    const slot = item.flag
      ? `<span class="yslot">${escHtml(item.slot)}</span> <span class="ypill ${statePillClass(item.flag)}">${escHtml(item.flag)}</span>`
      : `<span class="yslot">${escHtml(item.slot)}</span>`;
    const stateText = item.state;
    const pill = statePillClass(item.flag === '禁新增' ? '禁新增' : stateText);
    if (isBreak) {
      return `<tr class="${rowCls}"><td class="cargo">${escHtml(item.cargo)}</td><td>${escHtml(item.owner)}</td><td>${escHtml(item.ship)}</td><td>${slot}</td><td class="num">${escHtml(item.tons)}</td><td class="num">${escHtml(item.pieces || '—')}</td><td class="num">${escHtml(item.remain || '—')}</td><td>${pillOf(item.direction || '—')}</td><td class="days"><b>${escHtml(item.days)}</b><span>天</span></td><td><span class="ypill ${pill}">${escHtml(stateText)}</span></td></tr>`;
    }
    if (isBulk) {
      return `<tr class="${rowCls}"><td class="cargo">${escHtml(item.cargo)}</td><td>${escHtml(item.owner)}</td><td>${escHtml(item.ship)}</td><td>${slot}</td><td class="num">${escHtml(item.tons)}</td><td class="num">${escHtml(item.remain || '—')}</td><td class="days"><b>${escHtml(item.days)}</b><span>天</span></td><td><span class="ypill ${pill}">${escHtml(stateText)}</span></td></tr>`;
    }
    return `<tr class="${rowCls}"><td class="cargo">${escHtml(item.cargo)}</td><td>${escHtml(item.owner)}</td><td>${escHtml(item.ship)}</td><td>${slot}</td><td class="num">${escHtml(item.tons)}</td><td class="days"><b>${escHtml(item.days)}</b><span>天</span></td><td><span class="ypill ${pill}">${escHtml(item.state)}</span></td></tr>`;
  }).join('');
  return compactTable(head, body);
}

function yardProgressBlock(rows, kind) {
  const plan = rows['计划量'];
  const done = rows['累计入库'] || rows['已完成'];
  const remain = rows['剩余量'];
  if (!plan && !done && !remain) return '';
  const pctVal = Math.max(0, Math.min(100, plan ? Math.round((numOf(done) / numOf(plan)) * 100) : 0));
  const extra = kind === 'breakbulk'
    ? [['装卸方向', rows['装卸方向'] || '—'], ['件数合计', rows['件数合计'] || '—']]
    : kind === 'bulk'
      ? [['疏运', rows['疏运'] || '—']]
      : [];
  return progressBlock('本期入库进度 · 累计入库 ÷ 计划', pctVal, [['计划量', plan || '—'], ['累计入库', done || '—'], ['剩余量', remain || '—'], ...extra], rows['进度说明'] || '');
}

function yardEventBlock(feat) {
  const ev = feat.event;
  if (!ev && !feat.alert) return '';
  if (!ev) return `<div class="yg-alert">${escHtml(feat.alert)}</div>`;
  const impact = ev.impact ? `<span class="ypill ${toneOf(ev.impact)}">${escHtml(ev.impact)}</span>` : '';
  return `<div class="yg-event ${toneOf(ev.level || ev.status)}">
    <div class="yg-event-top">
      <span class="ypill ${toneOf(ev.level)}">${escHtml(ev.level || '事件')}</span>
      <b>${escHtml(ev.title || feat.alert || '现场事件')}</b>
      <span class="ypill ${toneOf(ev.status)}">${escHtml(ev.status || '—')}</span>
      ${impact}
    </div>
    <div class="yg-event-meta">
      <span>处置人 ${escHtml(ev.owner || '—')}</span>
      <span>发生 ${escHtml(ev.time || '—')}</span>
    </div>
    <div class="yg-event-note">${escHtml(ev.note || feat.alert || '')}</div>
  </div>`;
}

function vizYard(feat) {
  const rows = rowMap(feat);
  const kind = yardKindOf(feat);
  const rate = numOf(rows['利用率']);
  const level = rows['等级'] || feat.status;
  const free = yardFreeText(rows);
  const kindLabel = kind === 'breakbulk' ? '件杂堆场' : kind === 'warehouse' ? '仓库' : '散货堆场';
  return detailLayout({
    camHtml: camPanel(feat, kindLabel, level),
    status: level,
    note: '库场占用 · 70% 关注线 · 90% 预警线',
    meterHtml: `<div class="vmeter"><div class="vmeter-fill ${toneOf(level)}" style="width:${rate}%"></div><i class="vtick" style="left:70%"><b>70</b></i><i class="vtick hot" style="left:90%"><b>90</b></i></div>`,
    tilesHtml: vtiles([['库存', rows['库存'] || '—'], ['容量', rows['容量'] || '—'], ['空闲', free], ['占用', rate + '%']]),
    eventHtml: yardEventBlock(feat),
    progressHtml: yardProgressBlock(rows, kind),
    listTitle: `在场货物 · ${kindLabel} · 演示`,
    listHtml: yardTable(feat.stocks, kind)
  });
}

function vizGate(feat) {
  const rows = rowMap(feat);
  const status = rows['通行'] || feat.status || '通行';
  const hours = [18, 26, 34, 42, 38, 30, 22];
  const list = compactTable(['时段', '车流', '状态'], hours.map((value, index) => `<tr><td class="code">${8 + index * 2}:00</td><td class="num">${value}</td><td>${pillOf(status)}</td></tr>`).join(''));
  return detailLayout({
    camHtml: camPanel(feat, '卡口', status),
    status,
    note: '卡口通行 · 车流监测',
    meterHtml: `<div class="vmeter"><div class="vmeter-fill ${toneOf(status)}" style="width:72%"></div></div>`,
    tilesHtml: vtiles([['今日进港', '326辆'], ['通行', status], ['拥堵预警', rows['拥堵预警'] || '待接入'], ['关联', rows['关联'] || '—']]),
    listTitle: '分时车流 · 演示',
    listHtml: list
  });
}

function vizScale(feat) {
  const rows = rowMap(feat);
  const status = rows['状态'] || feat.status || '在线';
  const tickets = numOf(rows['今日过磅']);
  const list = compactTable(['项目', '数值'], [
    ['名称', rows['名称'] || feat.name],
    ['最近车辆', rows['最近车辆'] || '—'],
    ['最近货种', rows['最近货种'] || '—'],
    ['今日过磅', tickets + '票']
  ].map((row) => `<tr><td class="cargo">${escHtml(row[0])}</td><td class="num">${escHtml(row[1])}</td></tr>`).join(''));
  return detailLayout({
    camHtml: camPanel(feat, '地磅', status),
    status,
    note: '地磅过磅 · 当日统计',
    meterHtml: `<div class="vmeter"><div class="vmeter-fill g" style="width:${Math.min(100, tickets)}%"></div></div>`,
    tilesHtml: vtiles([['今日过磅', tickets + '票'], ['状态', status], ['最近车辆', rows['最近车辆'] || '—'], ['最近货种', rows['最近货种'] || '—']]),
    listTitle: '过磅摘要 · 演示',
    listHtml: list
  });
}

function vizCustoms(feat) {
  const ships = [
    ['海建68', '放行', '在泊'],
    ['金港5', '查验', '在泊'],
    ['远航11', '已申报', '待靠'],
    ['琼海9', '异常', '锚地']
  ];
  const bad = ships.filter((item) => item[1] === '异常').length;
  const status = bad ? '异常' : '在线';
  const list = compactTable(['船舶', '船位', '通关'], ships.map(([name, state, where]) => `<tr class="${state === '异常' ? 'hit' : ''}"><td class="cargo">${escHtml(name)}</td><td>${pillOf(where)}</td><td>${pillOf(state)}</td></tr>`).join(''));
  return detailLayout({
    camHtml: camPanel(feat || { type: '海关', name: '海关查验点', status }, '海关', status),
    status,
    note: '在港船通关 · 查验超时/退单才告警',
    meterHtml: `<div class="vmeter"><div class="vmeter-fill ${toneOf(status)}" style="width:${Math.round(((ships.length - bad) / ships.length) * 100)}%"></div></div>`,
    tilesHtml: vtiles([['在港船', String(ships.length)], ['异常船', String(bad)], ['超时阈值', '4小时'], ['规则', '查验本身不告警']]),
    listTitle: '通关清单 · 演示',
    listHtml: list
  });
}

function vizPerson(feat) {
  const rows = rowMap(feat);
  const name = rows['姓名'] || '—';
  const status = feat.status || '在岗';
  const count = String(rows['区域在岗'] || '—').replace('人', '');
  return detailLayout({
    camHtml: camPanel(Object.assign({}, feat, { camera: feat.camera || ((rows['所在区域'] || '现场') + '监控') }), rows['岗位'] || '人员', status),
    status,
    note: '在岗态势 · 轨迹回放',
    tilesHtml: vtiles([['姓名', name], ['工号', rows['工号'] || '—'], ['岗位', rows['岗位'] || '—'], ['区域在岗', count + '人'], ['班组', rows['班组'] || '—'], ['班次', rows['班次'] || '—']]),
    listTitle: '轨迹回放 · 人员 · 演示',
    listHtml: trackReplayPanel(feat, '人员')
  });
}

function vizVehicle(feat) {
  const rows = rowMap(feat);
  const status = rows['状态'] || feat.status || '行驶';
  return detailLayout({
    camHtml: camPanel(feat, rows['车型'] || '车辆', status),
    status,
    note: '在港车辆 · 轨迹回放',
    tilesHtml: vtiles([['车牌', rows['车牌'] || feat.name], ['车型', rows['车型'] || '—'], ['货种', rows['货种'] || '—'], ['目的地', rows['目的地'] || '—'], ['关联指令', rows['关联指令'] || '—']]),
    listTitle: '轨迹回放 · 车辆 · 演示',
    listHtml: trackReplayPanel(feat, '车辆')
  });
}

function vizAlert(feat) {
  const rows = rowMap(feat);
  const level = rows['等级'] || '告警';
  const status = rows['处置'] || feat.status || '处置中';
  const closed = rows['闭环'] === '是';
  const list = compactTable(['环节', '状态'], [
    ['发生', rows['发生'] || '—'],
    ['处置', rows['处置'] || '处置中'],
    ['闭环', closed ? '已关闭' : '未关闭']
  ].map((row) => `<tr><td class="cargo">${escHtml(row[0])}</td><td>${pillOf(row[1])}</td></tr>`).join(''));
  return detailLayout({
    camHtml: camPanel(feat, '告警现场', level),
    status: level,
    note: '告警处置 · 闭环跟踪',
    tilesHtml: vtiles([['对象', rows['对象'] || '—'], ['现象', rows['现象'] || '—'], ['发生', rows['发生'] || '—'], ['处置', status], ['闭环', rows['闭环'] || '否']]),
    eventHtml: yardEventBlock({
      event: {
        level,
        title: rows['现象'] || feat.name,
        owner: '值班长',
        status,
        time: rows['发生'] || '—',
        impact: rows['对象'] || '',
        note: `${rows['对象'] || ''} · ${rows['现象'] || ''} · ${closed ? '已闭环' : '未闭环'}`
      }
    }),
    listTitle: '处置链路 · 演示',
    listHtml: list
  });
}

function vizPower(feat) {
  const rows = rowMap(feat);
  const status = rows['状态'] || feat.status;
  const list = compactTable(['机组', '容量', '状态'], [
    `<tr><td class="cargo">1# 机组</td><td class="code">${escHtml(rows['容量'] || '—')}</td><td>${pillOf('运行')}</td></tr>`,
    `<tr><td class="cargo">2# 机组</td><td>互为备用</td><td>${pillOf('运行')}</td></tr>`
  ].join(''));
  return detailLayout({
    camHtml: camPanel(feat, '变电所', status),
    status,
    note: '供电运行 · 机组状态',
    tilesHtml: vtiles([['名称', rows['名称'] || feat.name], ['容量', rows['容量'] || '—'], ['状态', status], ['服务', rows['服务'] || '—']]),
    listTitle: '机组明细 · 演示',
    listHtml: list
  });
}

function vizShore(feat) {
  const rows = rowMap(feat);
  const status = rows['状态'] || feat.status;
  const list = compactTable(['环节', '状态'], [
    ['岸电箱', '在线'],
    ['电缆', '未接船'],
    ['船舶', rows['在用船'] || '无']
  ].map((row) => `<tr><td class="cargo">${escHtml(row[0])}</td><td>${pillOf(row[1])}</td></tr>`).join(''));
  return detailLayout({
    camHtml: camPanel(feat, '岸电', status),
    status,
    note: '岸电接电 · 箱体状态',
    tilesHtml: vtiles([['位置', rows['位置'] || '—'], ['状态', status], ['在用船', rows['在用船'] || '无'], ['说明', rows['说明'] || '—']]),
    listTitle: '接电链路 · 演示',
    listHtml: list
  });
}

function vizZone(feat) {
  const rows = rowMap(feat);
  const status = rows['管理'] || feat.status;
  const list = compactTable(['项目', '内容'], [
    ['名称', rows['名称'] || feat.name],
    ['管理', status],
    ['当前作业', rows['当前作业'] || '无'],
    ['说明', rows['说明'] || '—']
  ].map((row) => `<tr><td class="cargo">${escHtml(row[0])}</td><td>${escHtml(row[1])}</td></tr>`).join(''));
  return detailLayout({
    camHtml: camPanel(feat, '分区', status),
    status,
    note: '分区管控 · 作业约束',
    tilesHtml: vtiles([['名称', rows['名称'] || feat.name], ['管理', status], ['当前作业', rows['当前作业'] || '无']]),
    listTitle: '分区说明 · 演示',
    listHtml: list
  });
}


function vizEnv(feat) {
  const rows = rowMap(feat);
  const kind = feat.envKind || rows['设备'] || '环境监测';
  const level = rows['等级'] || feat.status || '—';
  const reserved = level === '预留' || feat.status === '预留';
  const tiles = Object.keys(rows)
    .filter((key) => !['设备', '分区', '优先级', '说明'].includes(key))
    .slice(0, 6)
    .map((key) => [key, rows[key]]);
  if (rows['设备']) tiles.unshift(['设备', rows['设备']]);
  if (rows['分区']) tiles.splice(1, 0, ['分区', rows['分区']]);
  const uniq = [];
  const seen = new Set();
  tiles.forEach((item) => {
    if (seen.has(item[0])) return;
    seen.add(item[0]);
    uniq.push(item);
  });
  const meterVal = reserved ? 0 : (
    kind === '粉尘' ? Math.min(100, Math.round((numOf(rows['TSP']) / 1.5) * 100)) :
    kind === '噪声' ? Math.min(100, Math.round((numOf(rows['当前']) / numOf(rows['昼限'] || '70')) * 100)) :
    kind === '风速' ? Math.min(100, Math.round((numOf(rows['瞬时风速']) / numOf(rows['禁作业阈'] || '13.8')) * 100)) :
    level === '关注' ? 78 : level === '超标' ? 96 : 42
  );
  const listRows = [
    ['设备类型', kind],
    ['作业影响', rows['作业影响'] || rows['建议'] || '—'],
    ['优先级', rows['优先级'] || '—'],
    ['采样', rows['采样'] || '—'],
    ['说明', rows['说明'] || (reserved ? '灰态预留，未接入生产' : '模拟监测')]
  ];
  const list = compactTable(['项目', '内容'], listRows.map((row) => `<tr class="${reserved ? 'watch' : ''}"><td class="cargo">${escHtml(row[0])}</td><td>${escHtml(row[1])}</td></tr>`).join(''));
  return detailLayout({
    camHtml: camPanel(feat, kind + '监测', level),
    status: level,
    note: reserved ? '作业环境 · 预留点位（灰态）' : `作业环境 · ${kind} · 对生产影响`,
    meterHtml: reserved
      ? '<div class="yg-tip">本期未启用，仅展示点位与接入预留</div>'
      : `<div class="vmeter"><div class="vmeter-fill ${toneOf(level)}" style="width:${meterVal}%"></div><i class="vtick" style="left:70%"><b>关注</b></i><i class="vtick hot" style="left:90%"><b>超标</b></i></div>`,
    tilesHtml: vtiles(uniq.slice(0, 8)),
    eventHtml: yardEventBlock(feat),
    listTitle: `作业影响 · ${kind} · 演示`,
    listHtml: list
  });
}

function vizFallback(feat) {
  const rows = [];
  (feat.groups || []).forEach((group) => {
    (group.rows || []).forEach(([key, val]) => rows.push([key, val]));
  });
  const list = compactTable(['字段', '值'], rows.map(([key, val]) => `<tr><td class="cargo">${escHtml(key)}</td><td>${escHtml(val)}</td></tr>`).join(''));
  return detailLayout({
    camHtml: camPanel(feat, feat.type || '对象', feat.status),
    status: feat.status || '—',
    note: (feat.type || '对象') + ' · 详情',
    tilesHtml: vtiles(rows.slice(0, 4)),
    listTitle: '明细 · 演示',
    listHtml: list
  });
}

function mountMapFeatures(root) {
  if (!root || root.dataset.featured === '1') return;
  root.dataset.featured = '1';
  MAP_FEATURES.forEach((feat) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'poi' + (feat.tone ? ' ' + feat.tone : '');
    button.style.left = feat.x + '%';
    button.style.top = feat.y + '%';
    button.dataset.n = feat.name;
    button.dataset.name = feat.name;
    button.dataset.t = feat.type;
    button.dataset.type = feat.type;
    button.dataset.layer = feat.layer;
    button.dataset.s = feat.status;
    button.title = feat.name;
    button.innerHTML = `<i class="fa-solid ${POI_ICON[feat.type] || 'fa-location-dot'}"></i>`;
    root.appendChild(button);
  });
}

function trackBounds(track) {
  const xs = track.map((p) => Number(p.x));
  const ys = track.map((p) => Number(p.y));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = 8;
  return {
    minX: minX - pad,
    minY: minY - pad,
    w: Math.max(maxX - minX + pad * 2, 24),
    h: Math.max(maxY - minY + pad * 2, 24)
  };
}

function trackReplayPanel(feat, kind) {
  const track = feat.track || [];
  if (!track.length) return '<div class="yg-empty">暂无轨迹点</div>';
  const id = 'tr-' + String(feat.name || 'obj').replace(/[^\w\u4e00-\u9fa5]/g, '');
  const bounds = trackBounds(track);
  const points = track.map((p) => `${p.x},${p.y}`).join(' ');
  const nodes = track.map((p, i) => `<circle class="tr-node" data-i="${i}" cx="${p.x}" cy="${p.y}" r="1.4"></circle>`).join('');
  const labels = track.map((p, i) => `<text class="tr-lab" x="${p.x}" y="${Math.max(bounds.minY + 3, p.y - 2.2)}" text-anchor="middle">${i + 1}</text>`).join('');
  const first = track[0];
  const last = track[track.length - 1];
  const tone = kind === '车辆' ? 'car' : 'person';
  return `<div class="tr-panel ${tone}" id="${id}" data-feat="${escHtml(feat.name)}" data-kind="${escHtml(kind)}">
    <div class="tr-map">
      <svg class="tr-svg" viewBox="${bounds.minX} ${bounds.minY} ${bounds.w} ${bounds.h}" preserveAspectRatio="xMidYMid meet">
        <polyline class="tr-path-bg" points="${points}"></polyline>
        <polyline class="tr-path" points="${points}"></polyline>
        ${nodes}${labels}
        <g class="tr-mover" transform="translate(${first.x},${first.y})">
          <circle class="tr-halo" r="3.2"></circle>
          <circle class="tr-dot" r="1.8"></circle>
        </g>
      </svg>
      <div class="tr-hud">
        <span class="tr-place" data-role="place">${escHtml(first.place)}</span>
        <span class="tr-clock" data-role="clock">${escHtml(first.time)} → ${escHtml(last.time)}</span>
      </div>
    </div>
    <div class="tr-controls">
      <button type="button" class="tr-btn" data-role="toggle" title="播放/暂停"><i class="fa-solid fa-play"></i></button>
      <input class="tr-range" data-role="range" type="range" min="0" max="1000" value="0">
      <select class="tr-speed" data-role="speed" title="倍速">
        <option value="0.5">0.5x</option>
        <option value="1" selected>1x</option>
        <option value="2">2x</option>
      </select>
      <span class="tr-pct" data-role="pct">0%</span>
    </div>
    <div class="tr-steps">${track.map((p, i) => `<button type="button" class="tr-step ${i === 0 ? 'on' : ''}" data-role="step" data-i="${i}"><b>${i + 1}</b><span>${escHtml(p.time)}</span><em>${escHtml(p.place)}</em></button>`).join('')}</div>
  </div>`;
}

const TrackReplay = {
  active: null,
  timer: null,
  stop() {
    if (this.timer) cancelAnimationFrame(this.timer);
    this.timer = null;
    if (this.active) {
      const btn = this.active.root.querySelector('[data-role="toggle"] i');
      if (btn) btn.className = 'fa-solid fa-play';
      this.active.playing = false;
    }
  },
  bindAll(scope) {
    (scope || document).querySelectorAll('.tr-panel').forEach((panel) => this.bind(panel));
  },
  bind(root) {
    if (!root || root.dataset.bound === '1') return;
    root.dataset.bound = '1';
    const feat = findMapFeature(root.dataset.feat);
    const track = (feat && feat.track) || [];
    if (!track.length) return;
    const state = {
      root,
      feat,
      track,
      playing: false,
      speed: 1,
      t: 0,
      duration: Math.max(4, track.length * 1.6) * 1000
    };
    const toggle = root.querySelector('[data-role="toggle"]');
    const range = root.querySelector('[data-role="range"]');
    const speed = root.querySelector('[data-role="speed"]');
    toggle.addEventListener('click', () => {
      if (state.playing) this.pause(state);
      else this.play(state);
    });
    range.addEventListener('input', () => {
      state.t = Number(range.value) / 1000;
      this.render(state);
    });
    speed.addEventListener('change', () => {
      state.speed = Number(speed.value) || 1;
    });
    root.querySelectorAll('[data-role="step"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.i) || 0;
        state.t = track.length <= 1 ? 1 : i / (track.length - 1);
        this.render(state);
        this.pause(state);
      });
    });
    this.render(state);
    this.play(state);
  },
  play(state) {
    this.stop();
    this.active = state;
    state.playing = true;
    const btn = state.root.querySelector('[data-role="toggle"] i');
    if (btn) btn.className = 'fa-solid fa-pause';
    if (state.t >= 0.999) state.t = 0;
    let last = performance.now();
    const tick = (now) => {
      if (!state.playing) return;
      const dt = now - last;
      last = now;
      state.t = Math.min(1, state.t + (dt * state.speed) / state.duration);
      this.render(state);
      if (state.t >= 1) {
        this.pause(state);
        return;
      }
      this.timer = requestAnimationFrame(tick);
    };
    this.timer = requestAnimationFrame(tick);
  },
  pause(state) {
    state.playing = false;
    if (this.active === state) {
      if (this.timer) cancelAnimationFrame(this.timer);
      this.timer = null;
    }
    const btn = state.root.querySelector('[data-role="toggle"] i');
    if (btn) btn.className = 'fa-solid fa-play';
  },
  sample(track, t) {
    if (track.length === 1) return { x: track[0].x, y: track[0].y, place: track[0].place, time: track[0].time, index: 0 };
    const max = track.length - 1;
    const pos = t * max;
    const i = Math.min(max - 1, Math.floor(pos));
    const f = pos - i;
    const a = track[i];
    const b = track[i + 1];
    return {
      x: a.x + (b.x - a.x) * f,
      y: a.y + (b.y - a.y) * f,
      place: f < 0.5 ? a.place : b.place,
      time: f < 0.5 ? a.time : b.time,
      index: f < 0.5 ? i : i + 1
    };
  },
  render(state) {
    const sample = this.sample(state.track, state.t);
    const mover = state.root.querySelector('.tr-mover');
    if (mover) mover.setAttribute('transform', `translate(${sample.x},${sample.y})`);
    const place = state.root.querySelector('[data-role="place"]');
    const clock = state.root.querySelector('[data-role="clock"]');
    const range = state.root.querySelector('[data-role="range"]');
    const pctEl = state.root.querySelector('[data-role="pct"]');
    if (place) place.textContent = sample.place;
    if (clock) clock.textContent = sample.time;
    if (range) range.value = String(Math.round(state.t * 1000));
    if (pctEl) pctEl.textContent = Math.round(state.t * 100) + '%';
    state.root.querySelectorAll('[data-role="step"]').forEach((btn, i) => {
      btn.classList.toggle('on', i === sample.index);
      btn.classList.toggle('done', i < sample.index);
    });
    showPoiTrack(state.feat, sample);
  }
};

function showPoiTrack(feat, sample) {
  const map = document.getElementById('map');
  if (!map) return;
  let svg = document.getElementById('poi-track');
  if (!feat || !feat.track || !feat.track.length) {
    if (svg) svg.remove();
    TrackReplay.stop();
    return;
  }
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'poi-track';
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    map.appendChild(svg);
  }
  const points = feat.track.map((point) => `${point.x},${point.y}`).join(' ');
  const dots = feat.track.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="1.05" fill="#00E4FF" fill-opacity=".85" vector-effect="non-scaling-stroke"></circle>`).join('');
  const cur = sample || feat.track[feat.track.length - 1];
  const label = feat.type === '车辆' ? (feat.name || '车') : '人';
  svg.innerHTML = `<polyline points="${points}" fill="none" stroke="rgba(0,228,255,.35)" stroke-width="2.2" vector-effect="non-scaling-stroke"></polyline>
    <polyline points="${points}" fill="none" stroke="#00E4FF" stroke-width="1.4" vector-effect="non-scaling-stroke" stroke-dasharray="3 2"></polyline>
    ${dots}
    <g transform="translate(${cur.x},${cur.y})">
      <circle r="2.8" fill="rgba(0,228,255,.2)" stroke="#00E4FF" stroke-width=".5" vector-effect="non-scaling-stroke">
        <animate attributeName="r" values="2.4;3.6;2.4" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      <circle r="1.5" fill="#00E4FF" vector-effect="non-scaling-stroke"></circle>
      <text y="-3.2" text-anchor="middle" fill="#E7F7FF" font-size="2.4">${escHtml(label)}</text>
    </g>`;
}

function bindTrackReplayInDrill() {
  const dims = document.getElementById('d-dims');
  if (!dims) return;
  TrackReplay.bindAll(dims);
}
