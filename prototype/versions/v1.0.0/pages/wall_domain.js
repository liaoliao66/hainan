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
  摄像头: 'fa-video',
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
    { time: '08:10', place: '地磅', x: 76, y: 24 },
    { time: '08:16', place: '卡口', x: 84, y: 28 },
    { time: '08:22', place: '廊道口', x: 30, y: 52 },
    { time: '08:28', place: '前沿', x: 24, y: 60 },
    { time: '09:05', place: '1#泊位', x: 20, y: 66 }
  ], groups: [
    { title: '基本信息', rows: [['姓名', '周成'], ['工号', 'QG-014'], ['岗位', '卸船指挥'], ['所在区域', '前沿'], ['区域在岗', '12人']] },
    { title: '工班信息', rows: [['班组', '前沿甲班'], ['班次', '白班'], ['时段', '08:00–16:00'], ['当班负责人', '周成']] }
  ]},
  { name: '廊道在岗', type: '人员', layer: '人员', x: 32, y: 48, tone: 'person', status: '在岗', track: [
    { time: '08:05', place: '综合楼', x: 44, y: 24 },
    { time: '08:12', place: '堆场路口', x: 48, y: 36 },
    { time: '08:20', place: 'T1转接', x: 36, y: 40 },
    { time: '08:28', place: '皮带中段', x: 34, y: 46 },
    { time: '08:34', place: '廊道', x: 32, y: 48 },
    { time: '09:15', place: '转接点复核', x: 36, y: 42 }
  ], groups: [
    { title: '基本信息', rows: [['姓名', '林海'], ['工号', 'QG-028'], ['岗位', '皮带巡检'], ['所在区域', '廊道'], ['区域在岗', '6人']] },
    { title: '工班信息', rows: [['班组', '廊道甲班'], ['班次', '白班'], ['时段', '08:00–16:00'], ['当班负责人', '林海']] }
  ]},
  { name: '堆场在岗', type: '人员', layer: '人员', x: 58, y: 34, tone: 'person', status: '在岗', track: [
    { time: '08:10', place: '卡口', x: 84, y: 28 },
    { time: '08:16', place: '地磅', x: 76, y: 24 },
    { time: '08:22', place: '件杂堆场', x: 64, y: 38 },
    { time: '08:30', place: '货位巡查', x: 60, y: 36 },
    { time: '08:40', place: '散货堆场', x: 58, y: 34 },
    { time: '09:20', place: '装车位', x: 54, y: 40 }
  ], groups: [
    { title: '基本信息', rows: [['姓名', '陈磊'], ['工号', 'QG-033'], ['岗位', '堆场管理'], ['所在区域', '堆场'], ['区域在岗', '9人']] },
    { title: '工班信息', rows: [['班组', '堆场乙班'], ['班次', '白班'], ['时段', '08:00–16:00'], ['当班负责人', '陈磊']] }
  ]},
  { name: '卡口在岗', type: '人员', layer: '人员', x: 80, y: 34, tone: 'person', status: '在岗', track: [
    { time: '07:55', place: '综合楼', x: 44, y: 24 },
    { time: '08:02', place: '东门通道', x: 82, y: 30 },
    { time: '08:08', place: '地磅', x: 76, y: 24 },
    { time: '08:12', place: '卡口', x: 80, y: 34 },
    { time: '08:40', place: '通行复核', x: 86, y: 28 },
    { time: '09:12', place: '异常车核验', x: 80, y: 34 }
  ], groups: [
    { title: '基本信息', rows: [['姓名', '吴敏'], ['工号', 'QG-041'], ['岗位', '卡口值班'], ['所在区域', '卡口'], ['区域在岗', '4人']] },
    { title: '工班信息', rows: [['班组', '卡口白班'], ['班次', '白班'], ['时段', '08:00–16:00'], ['当班负责人', '吴敏']] }
  ]},
  { name: '综合楼在岗', type: '人员', layer: '人员', x: 44, y: 24, tone: 'person', status: '在岗', groups: [
    { title: '基本信息', rows: [['姓名', '赵宁'], ['工号', 'QG-006'], ['岗位', '调度值班'], ['所在区域', '综合楼'], ['区域在岗', '18人']] },
    { title: '工班信息', rows: [['班组', '调度值班'], ['班次', '白班'], ['时段', '08:00–20:00'], ['当班负责人', '赵宁']] }
  ], track: [
    { time: '07:50', place: '综合楼大厅', x: 42, y: 28 },
    { time: '08:00', place: '调度室', x: 44, y: 24 },
    { time: '08:30', place: '调度台', x: 45, y: 23 },
    { time: '09:05', place: '值班室门口', x: 43, y: 26 },
    { time: '09:40', place: '调度室', x: 44, y: 24 }
  ]},
  { name: '粤A·D1234', type: '车辆', layer: '车辆', x: 46, y: 46, tone: 'ok', status: '行驶', track: [
    { time: '09:10', place: '东门卡口', x: 84, y: 28 },
    { time: '09:14', place: '卡口内通道', x: 80, y: 32 },
    { time: '09:18', place: '地磅#1', x: 76, y: 24 },
    { time: '09:26', place: '散货堆场A', x: 52, y: 42 },
    { time: '09:32', place: '廊道口', x: 36, y: 50 },
    { time: '09:40', place: '1#泊位前沿', x: 20, y: 68 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '粤A·D1234'], ['车型', '自卸车'], ['轴数', '6轴'], ['载重', '49吨'], ['状态', '行驶'], ['所属车队', '金港集疏运']] },
    { title: '司机', rows: [['姓名', '黄强'], ['工号', 'SJ-118'], ['手机', '138****6210'], ['承运商', '金港物流']] },
    { title: '本次作业', rows: [['指令', 'ZY-1042'], ['货种', '水泥熟料'], ['起讫', '东门→1#泊位'], ['进港', '09:10'], ['状态', '行驶中']] }
  ]},
  { name: '琼B·C8801', type: '车辆', layer: '车辆', x: 52, y: 52, tone: 'ok', status: '作业', track: [
    { time: '09:05', place: '件杂堆场', x: 64, y: 38 },
    { time: '09:12', place: '装车位', x: 58, y: 44 },
    { time: '09:20', place: '海关查验点', x: 60, y: 50 },
    { time: '09:28', place: '查验后通道', x: 68, y: 40 },
    { time: '09:32', place: '地磅#1', x: 76, y: 24 },
    { time: '09:45', place: '东门卡口', x: 84, y: 28 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '琼B·C8801'], ['车型', '平板车'], ['轴数', '4轴'], ['载重', '32吨'], ['状态', '作业'], ['所属车队', '港投外运']] },
    { title: '司机', rows: [['姓名', '李伟'], ['工号', 'SJ-206'], ['手机', '139****0845'], ['承运商', '港投物流']] },
    { title: '本次作业', rows: [['指令', 'ZY-0988'], ['货种', '钢铁件杂'], ['起讫', '件杂堆场→外运出港'], ['进港', '08:52'], ['状态', '作业中']] }
  ]},
  { name: '粤E·1122', type: '车辆', layer: '车辆', x: 72, y: 30, tone: 'warn', status: '过磅', track: [
    { time: '09:30', place: '石英砂货区', x: 56, y: 44 },
    { time: '09:36', place: '堆场出口', x: 66, y: 36 },
    { time: '09:42', place: '地磅排队', x: 78, y: 26 },
    { time: '09:46', place: '过磅准备', x: 77, y: 25 },
    { time: '09:50', place: '地磅#1', x: 76, y: 24 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '粤E·1122'], ['车型', '自卸车'], ['轴数', '6轴'], ['载重', '49吨'], ['状态', '过磅'], ['所属车队', '海砂专线']] },
    { title: '司机', rows: [['姓名', '王磊'], ['工号', 'SJ-331'], ['手机', '137****5592'], ['承运商', '海砂运输']] },
    { title: '本次作业', rows: [['指令', 'ZY-1051'], ['货种', '石英砂'], ['起讫', '石英砂货区→出港'], ['进港', '09:28'], ['状态', '过磅中']] }
  ]},
  { name: '琼C·6688', type: '车辆', layer: '车辆', x: 40, y: 50, tone: 'ok', status: '行驶', track: [
    { time: '09:20', place: '东门卡口', x: 84, y: 28 },
    { time: '09:28', place: '港区主干道', x: 60, y: 40 },
    { time: '09:36', place: '1#散货仓库', x: 36, y: 58 },
    { time: '09:48', place: '仓库装卸位', x: 30, y: 62 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '琼C·6688'], ['车型', '自卸车'], ['轴数', '6轴'], ['载重', '49吨'], ['状态', '行驶'], ['所属车队', '金港集疏运']] },
    { title: '司机', rows: [['姓名', '陈峰'], ['工号', 'SJ-142'], ['手机', '136****7731'], ['承运商', '金港物流']] },
    { title: '本次作业', rows: [['指令', 'ZY-1060'], ['货种', '河砂'], ['起讫', '东门→1#仓库'], ['进港', '09:18'], ['状态', '行驶中']] }
  ]},
  { name: '粤B·9056', type: '车辆', layer: '车辆', x: 58, y: 56, tone: 'warn', status: '排队', track: [
    { time: '09:40', place: '地磅通道', x: 70, y: 34 },
    { time: '09:48', place: '地磅排队区', x: 74, y: 30 },
    { time: '09:55', place: '地磅#1前', x: 75, y: 28 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '粤B·9056'], ['车型', '自卸车'], ['轴数', '6轴'], ['载重', '49吨'], ['状态', '排队'], ['所属车队', '海砂专线']] },
    { title: '司机', rows: [['姓名', '赵敏'], ['工号', 'SJ-258'], ['手机', '135****9022'], ['承运商', '海砂运输']] },
    { title: '本次作业', rows: [['指令', 'ZY-1066'], ['货种', '石英砂'], ['起讫', '堆场→地磅'], ['进港', '09:35'], ['状态', '排队中']] }
  ]},
  { name: '琼A·3310', type: '车辆', layer: '车辆', x: 48, y: 60, tone: 'warn', status: '待核', track: [
    { time: '09:15', place: '进港闸口', x: 78, y: 36 },
    { time: '09:25', place: '仓库道路', x: 50, y: 58 },
    { time: '09:40', place: '受限通道口', x: 46, y: 62 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '琼A·3310'], ['车型', '平板车'], ['轴数', '4轴'], ['载重', '32吨'], ['状态', '待核'], ['所属车队', '港投外运']] },
    { title: '司机', rows: [['姓名', '刘洋'], ['工号', 'SJ-277'], ['手机', '138****4410'], ['承运商', '港投物流']] },
    { title: '本次作业', rows: [['指令', 'ZY-1033'], ['货种', '钢铁件杂'], ['起讫', '闸口→仓库道路'], ['进港', '09:12'], ['状态', '路线待核']] }
  ]},
  { name: '粤D·7721', type: '车辆', layer: '车辆', x: 68, y: 52, tone: 'ok', status: '待离港', track: [
    { time: '08:50', place: '2#仓库', x: 42, y: 64 },
    { time: '09:10', place: '出港通道', x: 62, y: 50 },
    { time: '09:30', place: '出港闸口外场', x: 74, y: 48 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '粤D·7721'], ['车型', '集装箱拖挂'], ['轴数', '6轴'], ['载重', '40吨'], ['状态', '待离港'], ['所属车队', '金港集疏运']] },
    { title: '司机', rows: [['姓名', '周凯'], ['工号', 'SJ-190'], ['手机', '139****2288'], ['承运商', '金港物流']] },
    { title: '本次作业', rows: [['指令', 'ZY-1018'], ['货种', '件杂'], ['起讫', '2#仓库→出港'], ['进港', '08:40'], ['状态', '待离港']] }
  ]},
  { name: '琼D·1208', type: '车辆', layer: '车辆', x: 34, y: 44, tone: 'ok', status: '行驶', track: [
    { time: '09:22', place: '引桥通道', x: 28, y: 52 },
    { time: '09:30', place: '2#泊位前沿', x: 32, y: 68 },
    { time: '09:42', place: '泊位回程道', x: 38, y: 50 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '琼D·1208'], ['车型', '自卸车'], ['轴数', '6轴'], ['载重', '49吨'], ['状态', '行驶'], ['所属车队', '港作辅助']] },
    { title: '司机', rows: [['姓名', '吴斌'], ['工号', 'SJ-088'], ['手机', '137****6650'], ['承运商', '港内车队']] },
    { title: '本次作业', rows: [['指令', 'ZY-1071'], ['货种', '水泥熟料'], ['起讫', '引桥→2#泊位'], ['进港', '09:20'], ['状态', '行驶中']] }
  ]},
  { name: '粤F·4419', type: '车辆', layer: '车辆', x: 56, y: 42, tone: 'ok', status: '作业', track: [
    { time: '09:00', place: '散货堆场A', x: 52, y: 42 },
    { time: '09:18', place: '装车位', x: 54, y: 40 },
    { time: '09:40', place: '堆场出口', x: 60, y: 38 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '粤F·4419'], ['车型', '自卸车'], ['轴数', '6轴'], ['载重', '49吨'], ['状态', '作业'], ['所属车队', '金港集疏运']] },
    { title: '司机', rows: [['姓名', '孙浩'], ['工号', 'SJ-215'], ['手机', '136****1190'], ['承运商', '金港物流']] },
    { title: '本次作业', rows: [['指令', 'ZY-1048'], ['货种', '水泥熟料'], ['起讫', '堆场装车'], ['进港', '08:55'], ['状态', '作业中']] }
  ]},
  { name: '琼E·8833', type: '车辆', layer: '车辆', x: 62, y: 38, tone: 'warn', status: '排队', track: [
    { time: '09:35', place: '进港外场', x: 80, y: 34 },
    { time: '09:45', place: 'G01排队', x: 70, y: 38 },
    { time: '09:55', place: '闸口待放行', x: 66, y: 40 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '琼E·8833'], ['车型', '自卸车'], ['轴数', '6轴'], ['载重', '49吨'], ['状态', '排队'], ['所属车队', '海砂专线']] },
    { title: '司机', rows: [['姓名', '郑涛'], ['工号', 'SJ-304'], ['手机', '135****7801'], ['承运商', '海砂运输']] },
    { title: '本次作业', rows: [['指令', 'ZY-1078'], ['货种', '河砂'], ['起讫', '外场→进港'], ['进港', '待放行'], ['状态', '闸口排队']] }
  ]},
  { name: '粤G·5560', type: '车辆', layer: '车辆', x: 44, y: 36, tone: 'ok', status: '行驶', track: [
    { time: '09:25', place: '港区主干道', x: 55, y: 42 },
    { time: '09:33', place: '3#杂货仓库', x: 50, y: 58 },
    { time: '09:45', place: '仓库回程', x: 46, y: 40 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '粤G·5560'], ['车型', '平板车'], ['轴数', '4轴'], ['载重', '32吨'], ['状态', '行驶'], ['所属车队', '港投外运']] },
    { title: '司机', rows: [['姓名', '何军'], ['工号', 'SJ-166'], ['手机', '138****9033'], ['承运商', '港投物流']] },
    { title: '本次作业', rows: [['指令', 'ZY-1055'], ['货种', '钢铁件杂'], ['起讫', '主干道→3#仓库'], ['进港', '09:22'], ['状态', '行驶中']] }
  ]},
  { name: '琼F·2199', type: '车辆', layer: '车辆', x: 70, y: 28, tone: 'warn', status: '过磅', track: [
    { time: '09:38', place: '堆场出口', x: 64, y: 36 },
    { time: '09:46', place: '地磅通道', x: 72, y: 30 },
    { time: '09:52', place: '地磅#1', x: 76, y: 24 }
  ], groups: [
    { title: '车辆', rows: [['车牌', '琼F·2199'], ['车型', '自卸车'], ['轴数', '6轴'], ['载重', '49吨'], ['状态', '过磅'], ['所属车队', '海砂专线']] },
    { title: '司机', rows: [['姓名', '马超'], ['工号', 'SJ-349'], ['手机', '137****5518'], ['承运商', '海砂运输']] },
    { title: '本次作业', rows: [['指令', 'ZY-1082'], ['货种', '石英砂'], ['起讫', '堆场→过磅'], ['进港', '09:30'], ['状态', '过磅中']] }
  ]},
  { name: '前沿摄像头', type: '摄像头', layer: '摄像头', x: 18, y: 70, tone: 'ok', status: '在线', camera: '前沿监控', groups: [
    { title: '机位', rows: [['编号', 'CAM-01'], ['区域', '1#泊位前沿'], ['状态', '在线'], ['分辨率', '1080P'], ['用途', '卸船作业盯梢']] }
  ]},
  { name: '堆场摄像头', type: '摄像头', layer: '摄像头', x: 56, y: 36, tone: 'ok', status: '在线', camera: '散货堆场监控', groups: [
    { title: '机位', rows: [['编号', 'CAM-02'], ['区域', '散货堆场'], ['状态', '在线'], ['分辨率', '1080P'], ['用途', '堆垛与越界']] }
  ]},
  { name: 'CAM-03', type: '摄像头', layer: '摄像头', x: 33, y: 71, tone: 'bad', status: '离线', camera: '2#泊位视频', groups: [
    { title: '机位', rows: [['编号', 'CAM-03'], ['区域', '2#泊位'], ['状态', '离线'], ['分辨率', '1080P'], ['用途', '泊位作业'], ['说明', '未闭环 · 可开设备详情']] }
  ]},
  { name: '卡口摄像头', type: '摄像头', layer: '摄像头', x: 86, y: 26, tone: 'ok', status: '在线', camera: '卡口监控', groups: [
    { title: '机位', rows: [['编号', 'CAM-04'], ['区域', '东门卡口'], ['状态', '在线'], ['分辨率', '1080P'], ['用途', '过车抓拍']] }
  ]},
  { name: '仓库摄像头', type: '摄像头', layer: '摄像头', x: 42, y: 62, tone: 'ok', status: '在线', camera: '1#仓库监控', groups: [
    { title: '机位', rows: [['编号', 'CAM-05'], ['区域', '1#仓库'], ['状态', '在线'], ['分辨率', '1080P'], ['用途', '库内作业盯梢']] }
  ]},
  { name: '码头摄像头', type: '摄像头', layer: '摄像头', x: 26, y: 74, tone: 'ok', status: '在线', camera: '码头前沿监控', groups: [
    { title: '机位', rows: [['编号', 'CAM-06'], ['区域', '码头前沿'], ['状态', '在线'], ['分辨率', '1080P'], ['用途', '前沿通行与作业']] }
  ]},
  { name: '地磅摄像头', type: '摄像头', layer: '摄像头', x: 74, y: 28, tone: 'ok', status: '在线', camera: '地磅前区监控', groups: [
    { title: '机位', rows: [['编号', 'CAM-W01'], ['区域', '地磅前区'], ['状态', '在线'], ['分辨率', '1080P'], ['用途', '过磅排队盯梢']] }
  ]},
  { name: '主干道摄像头', type: '摄像头', layer: '摄像头', x: 60, y: 46, tone: 'ok', status: '在线', camera: '港区主干道监控', groups: [
    { title: '机位', rows: [['编号', 'CAM-R01'], ['区域', '港区主干道'], ['状态', '在线'], ['分辨率', '1080P'], ['用途', '主干道通行']] }
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

function weatherWorkTone(work) {
  return /禁|停|限制/.test(work) ? 'r' : /关注|警戒/.test(work) ? 'y' : 'g';
}

function renderTodayWeatherHtml() {
  const w = WEATHER;
  const slot = (WEATHER_7D && WEATHER_7D[0]) || {
    icon: w.icon || 'fa-cloud-sun',
    desc: w.sky || '多云',
    high: String(w.temp || '').replace(/[^\d.]/g, '') || '--',
    low: '--',
    wind: [w.windDir, w.wind].filter(Boolean).join(' ')
  };
  const workTone = weatherWorkTone(w.work);
  const tip = `${slot.desc} · ${slot.wind} · ${slot.high}°/${slot.low}° · ${w.work}`;
  return `<div class="wx-today" title="${escHtml(tip)}">
    <i class="fa-solid ${slot.icon} wx-today-icon" aria-hidden="true"></i>
    <div class="wx-today-meta">
      <div class="wx-today-desc">${escHtml(slot.desc)} · ${escHtml(slot.wind)}</div>
      <div class="wx-today-temp"><b>${escHtml(String(slot.high))}°</b><span>/${escHtml(String(slot.low))}°</span></div>
    </div>
    <span class="wx-work ${workTone}">${escHtml(w.work)}</span>
  </div>`;
}

function renderWeatherHtml() {
  const w = WEATHER;
  const workTone = weatherWorkTone(w.work);
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

function ensureTodayWeatherStyles() {
  if (document.getElementById('wx-today-css')) return;
  const s = document.createElement('style');
  s.id = 'wx-today-css';
  s.textContent = `
.wx-today{display:inline-flex;align-items:center;gap:10px;min-width:0;height:42px;padding:0 12px;border-radius:6px;border:1px solid rgba(0,228,255,.32);background:linear-gradient(180deg,rgba(0,228,255,.12),rgba(14,116,240,.06));box-sizing:border-box}
.wx-today-icon{font-size:18px;color:#dff6ff;line-height:1;flex-shrink:0}
.wx-today-meta{display:flex;flex-direction:column;justify-content:center;gap:2px;min-width:0;line-height:1.15}
.wx-today-desc{font-size:12px;color:#b4c7e7;white-space:nowrap}
.wx-today-temp{font-size:14px;font-variant-numeric:tabular-nums;line-height:1.1}
.wx-today-temp b{color:#00e4ff;font-weight:700}
.wx-today-temp span{color:rgba(180,199,231,.7)}
.wx-work{flex-shrink:0;padding:3px 8px;border-radius:3px;font-size:11px;font-weight:700;border:1px solid transparent;line-height:1.2}
.wx-work.g{color:#00c48c;background:rgba(0,196,140,.1);border-color:rgba(0,196,140,.35)}
.wx-work.y{color:#fa0;background:rgba(255,170,0,.12);border-color:rgba(255,170,0,.35)}
.wx-work.r{color:#ff9a9a;background:rgba(245,63,63,.12);border-color:rgba(245,63,63,.35)}
[data-weather]{display:flex;align-items:center;justify-content:flex-end;height:100%}
`;
  document.head.appendChild(s);
}

function mountWeather() {
  ensureTodayWeatherStyles();
  document.querySelectorAll('[data-weather]').forEach((el) => {
    const mode = (el.getAttribute('data-weather') || 'today').toLowerCase();
    el.innerHTML = mode === '7' || mode === '7d' ? renderWeatherHtml() : renderTodayWeatherHtml();
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
    摄像头: vizCamera,
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
  if (/查验|关注|二级|三级|待靠|锚地|待机|封闭|待接入|禁作业|过磅|行驶|待办|进行中|排队|待核|称重/.test(value)) return 'y';
  if (/预留|未接入|待离港/.test(value)) return 'm';
  if (/已申报/.test(value)) return 'b';
  if (/放行|正常|运行|作业|在线|在岗|通行|达标|可作业|已完成/.test(value)) return 'g';
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
  /* 演示机位：复用本地 figma 监控帧，避免缺失 jpg 破图 */
  const CAM_YARD = '../assets/figma/eq-cam1.png';
  const CAM_EQUIP = '../assets/figma/eq-cam2.png';
  const CAM_GATE = '../assets/figma/eq-cam3.png';
  if (type === '堆场' || type === '仓库' || type === '分区' || type === '告警') return CAM_YARD;
  if (type === '设备' || type === '皮带' || type === '变电') return CAM_EQUIP;
  if (/卡口|地磅|海关|人员|车辆|环境|摄像头/.test(type)) return CAM_GATE;
  if (/泊位|船舶|岸电/.test(type)) return CAM_YARD;
  if (kind === 'breakbulk' || kind === 'warehouse') return CAM_YARD;
  return CAM_EQUIP;
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

function photoCard(title, icon) {
  return `<div class="pv-photo" role="img" aria-label="${escHtml(title)}">
    <span class="pv-photo-badge">演示</span>
    <i class="fa-solid ${icon}"></i>
    <span>${escHtml(title)}</span>
  </div>`;
}

function pvHead(title, extra) {
  return `<div class="pv-head">${extra || ''}<b>${escHtml(title)}</b></div>`;
}

function kvGrid(items) {
  return `<div class="pv-kv">${items.map(([key, val]) => {
    const tone = /状态|通关|等级|告警|运行|通行|管理|闭环|计入/.test(key) ? toneOf(val) : '';
    return `<div class="pv-kv-item"><span>${escHtml(key)}</span><b class="${tone}">${escHtml(val == null || val === '' ? '—' : val)}</b></div>`;
  }).join('')}</div>`;
}

function personJobRecords(feat) {
  const rows = rowMap(feat);
  const role = rows['岗位'] || '人员';
  const person = {
    name: rows['姓名'] || '—',
    code: rows['工号'] || '—',
    role,
    team: rows['班组'] || '—',
    shift: rows['班次'] || '—',
    area: rows['所在区域'] || '—'
  };
  const track = feat.track || [];
  const trackRange = track.length
    ? { start: track[0].time, end: track[track.length - 1].time, points: track.map((p) => p.place).join(' → ') }
    : { start: '—', end: '—', points: '—' };
  const pack = (order, title, result, start, end, steps, extra) => Object.assign({
    kind: 'person',
    order,
    title,
    result,
    start,
    end,
    cargo: extra && extra.cargo || '—',
    route: extra && extra.route || (person.area + '岗位'),
    planTon: extra && extra.planTon || '—',
    actualTon: extra && extra.actualTon || '—',
    person,
    steps,
    weigh: extra && extra.weigh || { ticket: '—', gross: '—', net: '—', gateIn: '—', gateOut: '—' },
    track: extra && extra.track || trackRange
  }, extra || {});
  if (/调度/.test(role)) {
    return [
      pack('ZY-1042', '盯控前沿卸船', '进行中', '08:02', '进行中', [
        ['08:02', '接令确认', '已完成'], ['08:18', '盯控前沿卸船', '进行中']
      ], { cargo: '水泥熟料', route: '调度室→前沿', planTon: '1.2 万t', actualTon: '0.46 万t', weigh: { ticket: '—', gross: '—', net: '—', gateIn: '—', gateOut: '—' }, track: { start: '08:02', end: '09:05', points: '综合楼 → 调度室 → 前沿复核' } }),
      pack('ZY-1048', '协调疏运计划', '进行中', '09:05', '进行中', [
        ['09:05', '协调疏运计划', '进行中']
      ], { cargo: '石英砂', route: '调度室→卡口', planTon: '0.8 万t', actualTon: '0.22 万t', track: { start: '09:05', end: '09:40', points: '调度室 → 值班室门口' } }),
      pack('ZB-006', '班中交底', '待办', '09:40', '—', [
        ['09:40', '班中交底', '待办']
      ], { cargo: '—', route: '调度室', track: { start: '09:40', end: '09:40', points: '调度室' } })
    ];
  }
  if (/卸船|指挥/.test(role)) {
    return [
      pack('ZY-1042', '卸船指挥', '进行中', '08:16', '进行中', [
        ['08:16', '到岗签到', '已完成'], ['08:30', '卸船指挥', '进行中'], ['09:20', '班组协同', '进行中']
      ], { cargo: '水泥熟料', route: '前沿→1#泊位', planTon: '1.2 万t', actualTon: '0.51 万t', track: { start: '08:16', end: '09:05', points: '卡口 → 廊道口 → 前沿 → 1#泊位' } })
    ];
  }
  if (/巡检|皮带/.test(role)) {
    return [
      pack('XJ-031', '廊道巡检', '已完成', '08:20', '08:48', [
        ['08:20', '廊道巡检', '已完成'], ['08:48', '转接点检查', '已完成']
      ], { cargo: '—', route: '廊道全线', track: { start: '08:20', end: '08:34', points: 'T1转接 → 皮带中段 → 廊道' } }),
      pack('XJ-032', '异响复核', '进行中', '09:15', '进行中', [
        ['09:15', '异响复核', '进行中']
      ], { cargo: '—', route: '转接点', track: { start: '09:15', end: '09:15', points: '转接点复核' } })
    ];
  }
  if (/堆场/.test(role)) {
    return [
      pack('DC-019', '货位盘点', '已完成', '08:22', '08:40', [
        ['08:22', '货位盘点', '已完成']
      ], { cargo: '件杂/散货', route: '件杂堆场→散货堆场', track: { start: '08:22', end: '08:40', points: '件杂堆场 → 货位巡查 → 散货堆场' } }),
      pack('ZY-0988', '装车盯控', '进行中', '08:55', '进行中', [
        ['08:55', '装车盯控', '进行中']
      ], { cargo: '钢铁件杂', route: '装车位', planTon: '320 t', actualTon: '180 t', track: { start: '08:55', end: '09:20', points: '散货堆场 → 装车位' } }),
      pack('DC-020', '货位调整', '待办', '09:30', '—', [
        ['09:30', '货位调整', '待办']
      ], { cargo: '散货', route: '散货堆场', track: { start: '09:30', end: '09:30', points: '散货堆场' } })
    ];
  }
  if (/卡口/.test(role)) {
    return [
      pack('KK-011', '通行放行', '进行中', '08:08', '进行中', [
        ['08:08', '开班核验', '已完成'], ['08:35', '通行放行', '进行中']
      ], { cargo: '过车核验', route: '东门卡口', weigh: { ticket: 'KK-2218', gross: '—', net: '—', gateIn: '08:12', gateOut: '持续' }, track: { start: '08:08', end: '08:40', points: '地磅 → 卡口 → 通行复核' } }),
      pack('KK-012', '异常车核验', '进行中', '09:12', '进行中', [
        ['09:12', '异常车核验', '进行中']
      ], { cargo: '异常车', route: '卡口核验区', track: { start: '09:12', end: '09:12', points: '异常车核验' } })
    ];
  }
  return [
    pack(rows['关联指令'] || 'ZY-1042', '岗位作业', '进行中', '08:10', '进行中', [
      ['08:10', '到岗签到', '已完成'], ['08:40', '岗位作业', '进行中'], ['09:20', '班中交接', '待办']
    ], { track: trackRange })
  ];
}

function vehicleJobRecords(feat) {
  const rows = rowMap(feat);
  const plate = rows['车牌'] || feat.name;
  const vehicle = {
    plate,
    type: rows['车型'] || '—',
    axles: rows['轴数'] || '—',
    load: rows['载重'] || '—',
    fleet: rows['所属车队'] || '—'
  };
  const driver = {
    name: rows['姓名'] || '—',
    code: rows['工号'] || '—',
    phone: rows['手机'] || '—',
    carrier: rows['承运商'] || '—'
  };
  const currentOrder = rows['指令'] || rows['关联指令'] || 'ZY-1042';
  const currentCargo = rows['货种'] || '散货';
  const currentRoute = rows['起讫'] || (rows['目的地'] ? ('港内→' + rows['目的地']) : '—');
  const track = feat.track || [];
  const liveTrack = track.length
    ? { start: track[0].time, end: track[track.length - 1].time, points: track.map((p) => p.place).join(' → ') }
    : { start: '—', end: '—', points: '—' };
  const mk = (order, cargo, route, enter, finish, result, planTon, actualTon, weigh, trackInfo) => ({
    kind: 'vehicle',
    order,
    title: cargo + '运输',
    cargo,
    route,
    start: enter,
    end: finish,
    result,
    planTon,
    actualTon,
    vehicle,
    driver,
    weigh: weigh || { ticket: '—', gross: '—', net: '—', gateIn: enter, gateOut: finish },
    track: trackInfo || liveTrack
  });
  return [
    mk(currentOrder, currentCargo, currentRoute, rows['进港'] || '今天 09:10', '进行中', rows['本次作业·状态'] || rows['状态'] || '进行中', '49 t', '—', {
      ticket: 'WB-' + currentOrder.slice(-4),
      gross: '62.4 t',
      net: '48.6 t',
      gateIn: rows['进港'] || '09:10',
      gateOut: '—'
    }, liveTrack),
    mk('ZY-0971', currentCargo, '堆场→出港', '昨天 14:40', '昨天 16:20', '已完成', '49 t', '48.2 t', {
      ticket: 'WB-0971', gross: '61.8 t', net: '48.2 t', gateIn: '14:40', gateOut: '16:18'
    }, { start: '14:40', end: '16:20', points: '东门卡口 → 地磅 → 堆场 → 出港' }),
    mk('ZY-0958', '河砂', '河砂货区→出港', '昨天 09:20', '昨天 11:05', '已完成', '49 t', '47.9 t', {
      ticket: 'WB-0958', gross: '61.1 t', net: '47.9 t', gateIn: '09:20', gateOut: '11:02'
    }, { start: '09:20', end: '11:05', points: '河砂货区 → 地磅排队 → 地磅 → 卡口' }),
    mk('ZY-0933', '水泥熟料', '散货堆场→1#泊位', '11/08 13:10', '11/08 15:40', '已完成', '49 t', '48.8 t', {
      ticket: 'WB-0933', gross: '62.0 t', net: '48.8 t', gateIn: '13:10', gateOut: '15:36'
    }, { start: '13:10', end: '15:40', points: '卡口 → 地磅 → 散货堆场 → 前沿' }),
    mk('ZY-0910', plate.includes('8801') ? '钢铁件杂' : '石英砂', '货区→出港', '11/08 07:50', '11/08 09:18', '已完成', '32 t', '31.5 t', {
      ticket: 'WB-0910', gross: '44.2 t', net: '31.5 t', gateIn: '07:50', gateOut: '09:15'
    }, { start: '07:50', end: '09:18', points: '货区 → 查验点 → 地磅 → 卡口' })
  ];
}

const JOB_PLACE_XY = {
  '综合楼': [44, 24], '综合楼大厅': [42, 28], '调度室': [44, 24], '调度台': [45, 23], '值班室门口': [43, 26],
  '卡口': [80, 34], '东门卡口': [84, 28], '东门通道': [82, 30], '卡口内通道': [80, 32], '通行复核': [86, 28], '异常车核验': [80, 34],
  '地磅': [76, 24], '地磅#1': [76, 24], '地磅排队': [78, 26], '过磅准备': [77, 25],
  '前沿': [24, 60], '1#泊位': [20, 66], '1#泊位前沿': [20, 68], '廊道': [32, 48], '廊道口': [30, 52], '皮带中段': [34, 46],
  'T1转接': [36, 40], '转接点复核': [36, 42], '转接点': [36, 42],
  '件杂堆场': [64, 38], '散货堆场': [58, 34], '散货堆场A': [52, 42], '货位巡查': [60, 36], '装车位': [54, 40],
  '堆场路口': [48, 36], '堆场出口': [66, 36], '石英砂货区': [56, 44], '河砂货区': [50, 46], '货区': [56, 44],
  '海关查验点': [60, 50], '查验点': [60, 50], '查验后通道': [68, 40], '出港': [88, 30]
};

function buildJobTrackPoints(trackInfo, fallbackTrack) {
  if (fallbackTrack && fallbackTrack.length) {
    const start = trackInfo && trackInfo.start;
    const end = trackInfo && trackInfo.end;
    if (!start && !end) return fallbackTrack.slice();
    const filtered = filterTrackByTime(fallbackTrack, start === '进行中' ? '' : start, (end === '进行中' || end === '—') ? '' : end);
    if (filtered.length) return filtered;
  }
  const places = String((trackInfo && trackInfo.points) || '').split(/\s*→\s*/).map((s) => s.trim()).filter(Boolean);
  if (!places.length) return fallbackTrack && fallbackTrack.length ? fallbackTrack.slice() : [];
  const startMin = timeToMin((trackInfo && trackInfo.start) || '08:00');
  const endRaw = trackInfo && trackInfo.end;
  const endMin = (!endRaw || endRaw === '进行中' || endRaw === '—') ? startMin + Math.max(places.length - 1, 1) * 8 : timeToMin(endRaw);
  const span = Math.max(endMin - startMin, places.length - 1);
  return places.map((place, i) => {
    const xy = JOB_PLACE_XY[place] || [40 + i * 6, 36 + (i % 3) * 4];
    const t = startMin + Math.round((span * i) / Math.max(places.length - 1, 1));
    const hh = String(Math.floor(t / 60) % 24).padStart(2, '0');
    const mm = String(t % 60).padStart(2, '0');
    return { time: hh + ':' + mm, place, x: xy[0], y: xy[1] };
  });
}

function jobDetailIdentity(rec, feat) {
  const status = rec.result || '—';
  let sub = '';
  if (rec.kind === 'vehicle') {
    sub = [(rec.vehicle && rec.vehicle.plate) || (feat && feat.name) || '—', rec.cargo || rec.title || '—'].join(' · ');
  } else {
    sub = [(rec.person && rec.person.name) || (feat && feat.name) || '—', rec.title || (rec.person && rec.person.role) || '—'].join(' · ');
  }
  return {
    order: rec.order || '—',
    sub,
    status,
    statusTone: toneOf(status)
  };
}

function jobDetailPageHtml(rec, feat) {
  if (!rec) return '<div class="yg-empty">暂无详情</div>';
  const trackPoints = buildJobTrackPoints(rec.track, feat && feat.track);
  const trackFeat = {
    name: (feat && feat.name ? feat.name + ' · ' : '') + rec.order,
    type: (feat && feat.type) || (rec.kind === 'person' ? '人员' : '车辆'),
    track: trackPoints
  };
  return `<div class="job-detail-page">
    ${jobDetailBodyHtml(rec)}
    <div class="pv-track-row job-detail-track">
      <div class="pv-block pv-track-main">
        ${pvHead('本指令轨迹回放')}
        ${trackReplayPanel(trackFeat, trackFeat.type, { split: true, filter: true })}
      </div>
      <div class="pv-track-side">
        <div class="pv-block fill">
          ${pvHead('轨迹点记录')}
          <div class="tr-steps-host" data-role="steps-host"></div>
        </div>
      </div>
    </div>
  </div>`;
}

function jobListRowsHtml(records) {
  if (!records || !records.length) return '<div class="yg-empty">暂无历史作业</div>';
  const isPerson = records[0].kind === 'person';
  const headers = isPerson
    ? ['指令号', '环节', '开始', '结束', '结果', '关联区域', '操作']
    : ['指令号', '货种', '起讫', '进港', '完成', '结果', '净重', '承运商', '操作'];
  const body = records.map((rec, i) => {
    if (isPerson) {
      return `<tr>
        <td class="code">${escHtml(rec.order)}</td>
        <td class="cargo">${escHtml(rec.title || '—')}</td>
        <td class="code">${escHtml(rec.start || '—')}</td>
        <td class="code">${escHtml(rec.end || '—')}</td>
        <td>${pillOf(rec.result || '—')}</td>
        <td>${escHtml((rec.person && rec.person.area) || rec.route || '—')}</td>
        <td><button type="button" class="pv-link-btn compact" data-role="job-hist-detail" data-i="${i}"><i class="fa-solid fa-eye"></i> 详情</button></td>
      </tr>`;
    }
    return `<tr>
      <td class="code">${escHtml(rec.order)}</td>
      <td class="cargo">${escHtml(rec.cargo || '—')}</td>
      <td>${escHtml(rec.route || '—')}</td>
      <td class="code">${escHtml(rec.start || '—')}</td>
      <td class="code">${escHtml(rec.end || '—')}</td>
      <td>${pillOf(rec.result || '—')}</td>
      <td class="code">${escHtml((rec.weigh && rec.weigh.net) || rec.actualTon || '—')}</td>
      <td>${escHtml((rec.driver && rec.driver.carrier) || '—')}</td>
      <td><button type="button" class="pv-link-btn compact" data-role="job-hist-detail" data-i="${i}"><i class="fa-solid fa-eye"></i> 详情</button></td>
    </tr>`;
  }).join('');
  return compactTable(headers, body);
}

function jobDetailBodyHtml(rec) {
  if (!rec) return '<div class="yg-empty">暂无详情</div>';
  const main = `<div class="pv-ov-sec">${pvHead('作业主档')}${kvGrid([
    ['货种', rec.cargo || '—'],
    ['起讫', rec.route || '—'],
    ['计划量', rec.planTon || '—'],
    ['实绩', rec.actualTon || '—'],
    ['开始', rec.start || '—'],
    ['结束', rec.end || '—']
  ])}</div>`;

  let objectCard = '';
  if (rec.kind === 'vehicle') {
    const v = rec.vehicle || {};
    const d = rec.driver || {};
    objectCard = `<div class="pv-ov-sec">
      ${pvHead('运力对象')}
      <div class="pv-ov-split">
        <div>
          <div class="pv-ov-sub">车辆</div>
          ${kvGrid([
            ['车牌', v.plate || '—'],
            ['车型', v.type || '—'],
            ['轴数', v.axles || '—'],
            ['载重', v.load || '—'],
            ['车队', v.fleet || '—']
          ])}
        </div>
        <div>
          <div class="pv-ov-sub">司机</div>
          ${kvGrid([
            ['姓名', d.name || '—'],
            ['工号', d.code || '—'],
            ['手机', d.phone || '—'],
            ['承运商', d.carrier || '—']
          ])}
        </div>
      </div>
    </div>`;
  } else {
    const p = rec.person || {};
    const stepsHtml = (rec.steps && rec.steps.length)
      ? compactTable(['时间', '环节', '状态'], rec.steps.map(([t, step, st]) =>
        `<tr><td class="code">${escHtml(t)}</td><td class="cargo">${escHtml(step)}</td><td>${pillOf(st)}</td></tr>`
      ).join(''))
      : '<div class="yg-empty soft">暂无环节明细</div>';
    objectCard = `<div class="pv-ov-sec">
      ${pvHead('人员岗位')}
      ${kvGrid([
        ['姓名', p.name || '—'],
        ['工号', p.code || '—'],
        ['岗位', p.role || '—'],
        ['班组', p.team || '—'],
        ['班次', p.shift || '—'],
        ['区域', p.area || '—']
      ])}
      <div class="pv-ov-sub mt">作业环节</div>
      ${stepsHtml}
    </div>`;
  }

  const weigh = rec.weigh || {};
  const hasWeigh = ['ticket', 'gross', 'net', 'gateIn', 'gateOut'].some((k) => weigh[k] && weigh[k] !== '—');
  const weighCard = `<div class="pv-ov-sec">
    ${pvHead('过磅 / 卡口')}
    ${hasWeigh ? kvGrid([
      ['过磅票', weigh.ticket || '—'],
      ['毛重', weigh.gross || '—'],
      ['净重', weigh.net || '—'],
      ['进卡', weigh.gateIn || '—'],
      ['出卡', weigh.gateOut || '—']
    ]) : '<div class="yg-empty soft">本指令暂无过磅/卡口数据</div>'}
  </div>`;

  return `<div class="job-detail-top">${main}${objectCard}${weighCard}</div>`;
}

const JobArchive = {
  feat: null,
  records: [],
  active: 0,
  detailOpen: false,
  listOpen: false,
  bindAll() { /* 兼容旧调用；历史作业改由顶栏入口打开 */ },
  setFeature(feat) {
    this.feat = feat || null;
    if (!feat) {
      this.records = [];
      return;
    }
    if (feat.type === '人员') this.records = personJobRecords(feat);
    else if (feat.type === '车辆') this.records = vehicleJobRecords(feat);
    else this.records = [];
  },
  ensureListModal() {
    let mask = document.getElementById('job-hist-modal');
    if (mask) return mask;
    mask = document.createElement('div');
    mask.id = 'job-hist-modal';
    mask.className = 'job-hist-mask';
    mask.setAttribute('role', 'dialog');
    mask.setAttribute('aria-modal', 'true');
    mask.innerHTML = `<div class="job-hist-modal" data-role="job-hist-shell">
      <div class="job-hist-hd">
        <div>
          <div class="job-hist-kicker">历史作业记录 · 大窗</div>
          <h4 data-role="job-hist-title">历史作业</h4>
        </div>
        <button type="button" class="job-hist-x" data-role="job-hist-close" aria-label="关闭">×</button>
      </div>
      <div class="job-hist-bd" data-role="job-hist-body"></div>
      <div class="job-hist-ft">居中大窗展示近5条记录；点「详情」打开指令详情大窗（全量字段 + 轨迹）。关闭详情即返回本列表。</div>
    </div>`;
    document.body.appendChild(mask);
    mask.addEventListener('click', (e) => {
      if (e.target === mask || e.target.closest('[data-role="job-hist-close"]')) this.closeList();
      const detailBtn = e.target.closest('[data-role="job-hist-detail"]');
      if (detailBtn) this.openDetail(Number(detailBtn.dataset.i) || 0);
    });
    return mask;
  },
  ensureDetailModal() {
    let mask = document.getElementById('job-detail-modal');
    if (mask) return mask;
    mask = document.createElement('div');
    mask.id = 'job-detail-modal';
    mask.className = 'job-hist-mask job-detail-mask';
    mask.setAttribute('role', 'dialog');
    mask.setAttribute('aria-modal', 'true');
    mask.innerHTML = `<div class="job-hist-modal job-detail-modal">
      <div class="job-hist-hd job-detail-hd">
        <div class="job-detail-id">
          <div class="job-hist-kicker">指令详情 · 全量关联 + 轨迹</div>
          <div class="job-detail-id-row">
            <h4 data-role="job-detail-title">指令详情</h4>
            <span class="job-detail-status" data-role="job-detail-status">—</span>
          </div>
          <div class="job-detail-sub" data-role="job-detail-sub">—</div>
        </div>
        <button type="button" class="job-hist-x" data-role="job-detail-close" aria-label="关闭">×</button>
      </div>
      <div class="job-hist-bd" data-role="job-detail-body"></div>
      <div class="job-hist-ft">关闭本窗即返回历史作业列表。Esc 同效。</div>
    </div>`;
    document.body.appendChild(mask);
    mask.addEventListener('click', (e) => {
      if (e.target === mask || e.target.closest('[data-role="job-detail-close"]')) this.closeDetail();
    });
    return mask;
  },
  openList(feat) {
    if (feat) this.setFeature(feat);
    if (!this.feat || (this.feat.type !== '人员' && this.feat.type !== '车辆')) {
      if (typeof toast === 'function') toast('仅人员/车辆支持历史作业');
      return;
    }
    this.closeDetail(true);
    const mask = this.ensureListModal();
    const title = mask.querySelector('[data-role="job-hist-title"]');
    const body = mask.querySelector('[data-role="job-hist-body"]');
    if (title) title.textContent = this.feat.name + ' · 历史作业';
    if (body) body.innerHTML = jobListRowsHtml(this.records);
    mask.classList.add('show');
    mask.classList.remove('is-hidden');
    this.listOpen = true;
  },
  hideList() {
    const mask = document.getElementById('job-hist-modal');
    if (mask) {
      mask.classList.remove('show');
      mask.classList.add('is-hidden');
    }
  },
  showList() {
    const mask = this.ensureListModal();
    mask.classList.add('show');
    mask.classList.remove('is-hidden');
    this.listOpen = true;
  },
  closeList() {
    this.closeDetail(true);
    const mask = document.getElementById('job-hist-modal');
    if (mask) {
      mask.classList.remove('show');
      mask.classList.remove('is-hidden');
    }
    this.listOpen = false;
    return true;
  },
  openDetail(index) {
    this.active = index;
    const rec = this.records[index];
    if (!rec) return;
    this.hideList();
    let mask = this.ensureDetailModal();
    if (!mask.querySelector('[data-role="job-detail-sub"]')) {
      mask.remove();
      mask = this.ensureDetailModal();
    }
    const id = jobDetailIdentity(rec, this.feat);
    const title = mask.querySelector('[data-role="job-detail-title"]');
    const sub = mask.querySelector('[data-role="job-detail-sub"]');
    const status = mask.querySelector('[data-role="job-detail-status"]');
    const body = mask.querySelector('[data-role="job-detail-body"]');
    if (title) title.textContent = id.order;
    if (sub) sub.textContent = id.sub;
    if (status) {
      status.textContent = id.status;
      status.className = 'job-detail-status ' + id.statusTone;
    }
    if (body) {
      body.innerHTML = jobDetailPageHtml(rec, this.feat);
      if (typeof TrackReplay !== 'undefined' && TrackReplay.bindAll) {
        TrackReplay.stop();
        TrackReplay.bindAll(body);
      }
    }
    mask.classList.add('show');
    this.detailOpen = true;
  },
  closeDetail(skipRestore) {
    const mask = document.getElementById('job-detail-modal');
    if (!mask || !this.detailOpen) {
      if (!skipRestore && this.listOpen) this.showList();
      return false;
    }
    if (typeof TrackReplay !== 'undefined' && TrackReplay.stop) TrackReplay.stop();
    mask.classList.remove('show');
    const body = mask.querySelector('[data-role="job-detail-body"]');
    if (body) body.innerHTML = '';
    this.detailOpen = false;
    if (!skipRestore) this.showList();
    return true;
  },
  closeTop() {
    if (this.detailOpen) return this.closeDetail();
    if (this.listOpen) return this.closeList();
    return false;
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && JobArchive.closeTop()) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

function vizPerson(feat) {
  const rows = rowMap(feat);
  const name = rows['姓名'] || '—';
  const count = String(rows['区域在岗'] || '—').replace('人', '');
  return `<div class="viz pv-detail" data-job-kind="person">
    <div class="pv-identity person">
      <div class="pv-photos">
        ${photoCard('人员照片', 'fa-user')}
      </div>
      <div class="pv-id-main">
        <div class="pv-id-title">
          <strong>${escHtml(name)}</strong>
          <span class="pv-id-sub">${escHtml(rows['岗位'] || '人员')} · ${escHtml(rows['工号'] || '—')}</span>
        </div>
        ${kvGrid([
          ['班组', rows['班组'] || '—'],
          ['班次', rows['班次'] || '—'],
          ['时段', rows['时段'] || '—'],
          ['所在区域', rows['所在区域'] || '—'],
          ['区域在岗', count + '人'],
          ['当班负责人', rows['当班负责人'] || name]
        ])}
      </div>
    </div>
    <div class="pv-track-row">
      <div class="pv-block pv-track-main">
        ${pvHead('轨迹回放')}
        ${trackReplayPanel(feat, '人员', { split: true, filter: true })}
      </div>
      <div class="pv-track-side">
        <div class="pv-block fill">
          ${pvHead('轨迹点记录')}
          <div class="tr-steps-host" data-role="steps-host"></div>
        </div>
      </div>
    </div>
  </div>`;
}

function vizVehicle(feat) {
  const rows = rowMap(feat);
  const status = rows['状态'] || feat.status || '行驶';
  const plate = rows['车牌'] || feat.name;
  const jobStatus = rows['本次作业·状态'] || rows['状态'] || status;
  return `<div class="viz pv-detail" data-job-kind="vehicle">
    <div class="pv-identity">
      <div class="pv-photos row">
        ${photoCard('车辆照片', 'fa-truck')}
        ${photoCard('司机照片', 'fa-id-card')}
      </div>
      <div class="pv-id-main">
        <div class="pv-id-title">
          <strong>${escHtml(plate)}</strong>
          <span class="pv-id-sub">${escHtml(rows['车型'] || '车辆')} · ${escHtml(rows['所属车队'] || '—')}</span>
        </div>
        <div class="pv-id-cols">
          <div>
            ${pvHead('车辆信息')}
            ${kvGrid([
              ['轴数', rows['轴数'] || '—'],
              ['载重', rows['载重'] || '—'],
              ['车队', rows['所属车队'] || '—']
            ])}
          </div>
          <div>
            ${pvHead('司机信息')}
            ${kvGrid([
              ['姓名', rows['姓名'] || '—'],
              ['工号', rows['工号'] || '—'],
              ['手机', rows['手机'] || '—'],
              ['承运商', rows['承运商'] || '—']
            ])}
          </div>
        </div>
      </div>
    </div>
    <div class="pv-block">
      ${pvHead('本次作业')}
      ${kvGrid([
        ['指令', rows['指令'] || rows['关联指令'] || '—'],
        ['货种', rows['货种'] || '—'],
        ['起讫', rows['起讫'] || ((rows['目的地'] ? ('港内→' + rows['目的地']) : '—'))],
        ['进港', rows['进港'] || '—'],
        ['状态', jobStatus]
      ])}
    </div>
    <div class="pv-track-row">
      <div class="pv-block pv-track-main">
        ${pvHead('最新轨迹回放')}
        ${trackReplayPanel(feat, '车辆', { split: true, filter: true })}
      </div>
      <div class="pv-track-side">
        <div class="pv-block fill">
          ${pvHead('轨迹点记录')}
          <div class="tr-steps-host" data-role="steps-host"></div>
        </div>
      </div>
    </div>
  </div>`;
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

function camHistTimeOptions() {
  return [
    ['今天 09:10', '今天 09:25'],
    ['今天 08:30', '今天 08:45'],
    ['今天 07:50', '今天 08:05'],
    ['昨天 16:20', '昨天 16:35'],
    ['昨天 11:00', '昨天 11:15']
  ];
}

function camAiShotSrc(index) {
  const shots = [
    '../assets/figma/eq-cam1.png',
    '../assets/figma/eq-cam2.png',
    '../assets/figma/eq-cam3.png',
    '../assets/figma/cam01.png',
    '../assets/figma/cam02.png',
    '../assets/figma/traf-cam1.png',
    '../assets/dispatch/cam01.jpg'
  ];
  return shots[index % shots.length];
}

function camAiAlarmRows(feat) {
  const rows = rowMap(feat);
  const area = rows['区域'] || feat.name || '监控区';
  const code = rows['编号'] || feat.name || 'CAM';
  const offline = /离线|中断|故障/.test(String(rows['状态'] || feat.status || ''));
  const base = [
    ['今天 09:42:18', 'AI-INV-0918', '区域入侵', '一级', area + ' · 警戒线内侧', '行人', '未闭环', '待值班确认', '抓拍帧 #1842', code],
    ['今天 09:18:06', 'AI-HEL-0744', '未戴安全帽', '二级', area + ' · 作业面', '作业人员', '处置中', '已通知班组', '抓拍帧 #1760', code],
    ['今天 08:55:41', 'AI-REF-0612', '未穿反光衣', '二级', area + ' · 通道口', '过往人员', '已闭环', '现场已纠正', '抓拍帧 #1695', code],
    ['昨天 16:28:12', 'AI-INV-0588', '区域入侵', '二级', area + ' · 禁入区', '非授权进入', '已闭环', '驱离完成', '抓拍帧 #1520', code],
    ['昨天 14:05:33', 'AI-HEL-0491', '未戴安全帽', '二级', area + ' · 装卸点', '司机下车', '已闭环', '口头警告', '抓拍帧 #1408', code],
    ['昨天 11:22:07', 'AI-REF-0386', '未穿反光衣', '关注', area + ' · 巡检路径', '巡检人员', '已闭环', '补穿完成', '抓拍帧 #1333', code],
    ['11/08 17:40:25', 'AI-GAT-0270', '人员聚集', '关注', area + ' · 卡口外侧', '车辆排队', '已闭环', '疏导完成', '抓拍帧 #1210', code]
  ];
  if (offline) return base.slice(3);
  return base;
}

function camAiAlarmListHtml(feat) {
  const aiRows = camAiAlarmRows(feat);
  if (!aiRows.length) return '<div class="yg-empty">本机位暂无 AI 报警</div>';
  return `<div class="cam-ai-list">${aiRows.map((row, i) => {
    const [time, id, type, level, place, target, st, action, shot, cam] = row;
    return `<article class="cam-ai-row">
      <div class="cam-ai-shot-wrap">
        <img class="cam-ai-shot" src="${camAiShotSrc(i)}" alt="${escHtml(shot)}">
        <span class="cam-ai-shot-lab">${escHtml(shot)}</span>
      </div>
      <div class="cam-ai-fields">
        <div><b>时间</b><span class="code">${escHtml(time)}</span></div>
        <div><b>报警编号</b><span class="code">${escHtml(id)}</span></div>
        <div><b>类型</b><span>${escHtml(type)}</span></div>
        <div><b>等级</b>${pillOf(level)}</div>
        <div><b>位置</b><span>${escHtml(place)}</span></div>
        <div><b>目标</b><span>${escHtml(target)}</span></div>
        <div><b>状态</b>${pillOf(st)}</div>
        <div><b>处置</b><span>${escHtml(action)}</span></div>
        <div><b>机位</b><span class="code">${escHtml(cam)}</span></div>
      </div>
    </article>`;
  }).join('')}</div>`;
}

function vizCamera(feat) {
  const rows = rowMap(feat);
  const status = rows['状态'] || feat.status || '在线';
  const online = !/离线|中断|故障/.test(String(status));
  const name = camNameOf(feat, '摄像头');
  const src = camSrcOf(feat);
  const area = rows['区域'] || feat.name || '';
  const ranges = camHistTimeOptions();
  const startOpts = ranges.map((r, i) => `<option value="${escHtml(r[0])}" ${i === 0 ? 'selected' : ''}>${escHtml(r[0])}</option>`).join('');
  const endOpts = ranges.map((r, i) => `<option value="${escHtml(r[1])}" ${i === 0 ? 'selected' : ''}>${escHtml(r[1])}</option>`).join('');
  const infoHtml = kvGrid([
    ['编号', rows['编号'] || '—'],
    ['名称', feat.name || '—'],
    ['区域', rows['区域'] || '—'],
    ['状态', status],
    ['分辨率', rows['分辨率'] || '—'],
    ['用途', rows['用途'] || '—'],
    ['机位', name],
    ['说明', rows['说明'] || '港区概览叠加机位']
  ]);
  const aiHtml = camAiAlarmListHtml(feat);
  return `<div class="viz cam-view" data-cam-mode="live">
    <div class="cam-pane on" data-pane="live">
      <div class="cam-live-stage ${online ? '' : 'offline'}" role="img" aria-label="${escHtml(name)}">
        <img class="cam-live-photo" src="${src}" alt="${escHtml(name)}">
        <div class="cam-live-scan"></div>
        <span class="cam-live-rec">${online ? 'LIVE' : 'OFFLINE'}</span>
        <span class="cam-live-tag ${toneOf(status)}">${escHtml(status)}</span>
        <div class="cam-live-caption">
          <b>${escHtml(name)}</b>
          <span>${escHtml(area)} · 实时监控</span>
        </div>
      </div>
      <div class="cam-live-note">${online ? '点击右上角可查看历史视频、AI报警或基础信息' : '机位离线，仍可查看历史视频、AI报警与基础信息'}</div>
    </div>
    <div class="cam-pane" data-pane="hist">
      <div class="cam-hist-only">
        <div class="tr-filter cam-hist-filter">
          <span class="tr-filter-lab">时间范围</span>
          <label>起<select data-role="cam-hist-start">${startOpts}</select></label>
          <span class="tr-filter-sep">—</span>
          <label>止<select data-role="cam-hist-end">${endOpts}</select></label>
          <button type="button" class="tr-filter-btn" data-role="cam-hist-apply">筛选</button>
          <button type="button" class="tr-filter-btn ghost" data-role="cam-hist-reset">重置</button>
        </div>
        <div class="cam-live-stage hist fill" data-role="cam-hist-stage">
          <img class="cam-live-photo" src="${src}" alt="历史回放">
          <span class="cam-live-rec hist">REC</span>
          <div class="cam-live-caption">
            <b data-role="cam-hist-title">${escHtml(ranges[0][0])} → ${escHtml(ranges[0][1])}</b>
            <span>${escHtml(area)} · 演示录像 · 非实况</span>
          </div>
        </div>
      </div>
    </div>
    <div class="cam-pane" data-pane="ai">
      <div class="pv-block cam-ai-card">
        ${pvHead('AI报警 · 本机位')}
        ${aiHtml}
      </div>
    </div>
    <div class="cam-pane" data-pane="info">
      <div class="pv-block cam-info-card">
        ${pvHead('摄像头基础信息')}
        ${infoHtml}
      </div>
    </div>
  </div>`;
}

const CamView = {
  mode: 'live',
  setMode(mode) {
    const next = (mode === 'hist' || mode === 'info' || mode === 'ai') ? mode : 'live';
    this.mode = next;
    const root = document.getElementById('ov-modal');
    if (root) root.classList.toggle('cam-ai-scroll', next === 'ai');
    const view = root && root.querySelector('.cam-view');
    if (view) {
      view.dataset.camMode = next;
      view.querySelectorAll('.cam-pane').forEach((pane) => {
        pane.classList.toggle('on', pane.dataset.pane === next);
      });
    }
    ['live', 'hist', 'ai', 'info'].forEach((key) => {
      const btn = document.getElementById('ovm-cam-' + key);
      if (btn) btn.classList.toggle('on', key === next);
    });
    const body = document.getElementById('ovm-body');
    if (body && next === 'ai') body.scrollTop = 0;
    const ft = root && root.querySelector('.ovm-ft');
    if (ft) {
      ft.textContent = next === 'live'
        ? '默认实时监控；右上角可切换历史视频 / AI报警 / 基础信息。Esc 关闭。'
        : next === 'hist'
          ? '仅按时间筛选回放；无片段列表。Esc 关闭。'
          : next === 'ai'
            ? '本机位 AI 报警全量列表（含抓拍图）；整窗滚动浏览。Esc 关闭。'
            : '基础信息来自机位档案演示数据。Esc 关闭。';
    }
  },
  applyHistFilter(root) {
    const startSel = root.querySelector('[data-role="cam-hist-start"]');
    const endSel = root.querySelector('[data-role="cam-hist-end"]');
    const title = root.querySelector('[data-role="cam-hist-title"]');
    const start = startSel ? startSel.value : '';
    const end = endSel ? endSel.value : '';
    if (start && end) {
      const sKey = start.replace(/[^\d]/g, '');
      const eKey = end.replace(/[^\d]/g, '');
      if (sKey && eKey && sKey > eKey) {
        if (typeof toast === 'function') toast('起止时间颠倒，请重选');
        return;
      }
    }
    if (title) title.textContent = (start || '—') + ' → ' + (end || '—');
    if (typeof toast === 'function') toast('已按时间筛选历史视频');
  },
  bind(scope) {
    const root = scope || document.getElementById('ovm-body');
    if (!root) return;
    const applyBtn = root.querySelector('[data-role="cam-hist-apply"]');
    const resetBtn = root.querySelector('[data-role="cam-hist-reset"]');
    const startSel = root.querySelector('[data-role="cam-hist-start"]');
    const endSel = root.querySelector('[data-role="cam-hist-end"]');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this.applyHistFilter(root));
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (startSel && startSel.options.length) startSel.selectedIndex = 0;
        if (endSel && endSel.options.length) endSel.selectedIndex = 0;
        this.applyHistFilter(root);
      });
    }
  }
};

function envKindIcon(kind) {
  if (kind === '粉尘') return 'fa-smog';
  if (kind === '噪声') return 'fa-volume-high';
  if (kind === '气象') return 'fa-cloud-sun';
  if (kind === '风速') return 'fa-wind';
  if (kind === '潮位') return 'fa-water';
  if (kind === '抑尘') return 'fa-shower';
  return 'fa-leaf';
}

function envSplitVal(raw) {
  const text = String(raw == null || raw === '' ? '—' : raw);
  const matched = text.match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);
  if (!matched) return { value: text, unit: '' };
  return { value: matched[1], unit: matched[2] || '' };
}

function envCurrentMetrics(feat) {
  const rows = rowMap(feat);
  const kind = feat.envKind || '监测';
  const reserved = feat.status === '预留' || rows['等级'] === '预留';
  if (reserved) return [];
  if (kind === '粉尘') {
    return [
      { label: 'TSP', raw: rows['TSP'], limit: '预警 1.0 · 超标 1.5', tone: toneOf(rows['等级'] || feat.status) },
      { label: 'PM10', raw: rows['PM10'], limit: '限值见台账', tone: toneOf(rows['等级'] || feat.status) },
      { label: '等级', raw: rows['等级'] || feat.status, limit: '相对限值判定', tone: toneOf(rows['等级'] || feat.status) },
      { label: '采样周期', raw: rows['采样'] || '1分钟', limit: '实时采样', tone: 'm' }
    ];
  }
  if (kind === '噪声') {
    return [
      { label: '当前噪声', raw: rows['当前'], limit: `昼限 ${rows['昼限'] || '70'} · 夜限 ${rows['夜限'] || '55'}`, tone: toneOf(rows['等级'] || feat.status) },
      { label: '时段', raw: rows['时段'] || '昼间', limit: '按时段限值', tone: 'm' },
      { label: '等级', raw: rows['等级'] || feat.status, limit: '相对昼/夜限', tone: toneOf(rows['等级'] || feat.status) },
      { label: '作业影响', raw: rows['作业影响'] || '—', limit: '', tone: 'm' }
    ];
  }
  if (kind === '气象') {
    return [
      { label: '气温', raw: rows['气温'], limit: '', tone: 'm' },
      { label: '湿度', raw: rows['湿度'], limit: '', tone: 'm' },
      { label: '风速', raw: rows['风速'], limit: rows['风向'] || '', tone: 'm' },
      { label: '雨量', raw: rows['雨量'], limit: '', tone: 'm' },
      { label: '能见度', raw: rows['能见度'], limit: '', tone: 'm' },
      { label: '作业影响', raw: rows['作业影响'] || '—', limit: '', tone: toneOf(rows['等级'] || feat.status) }
    ];
  }
  if (kind === '风速') {
    return [
      { label: '瞬时风速', raw: rows['瞬时风速'], limit: `禁作业阈 ${rows['禁作业阈'] || '13.8 m/s'}`, tone: toneOf(rows['等级'] || feat.status) },
      { label: '1分钟均风', raw: rows['1分钟均风'], limit: '作业判定参考', tone: 'm' },
      { label: '等级', raw: rows['等级'] || feat.status, limit: '相对禁作业阈', tone: toneOf(rows['等级'] || feat.status) },
      { label: '关联设备', raw: rows['关联'] || '—', limit: '', tone: 'm' }
    ];
  }
  if (kind === '潮位') {
    return [
      { label: '潮高', raw: rows['潮高'], limit: rows['趋势'] || '', tone: toneOf(rows['等级'] || feat.status) },
      { label: '高潮预报', raw: rows['高潮预报'], limit: '', tone: 'm' },
      { label: '等级', raw: rows['等级'] || feat.status, limit: '靠离泊窗口', tone: toneOf(rows['等级'] || feat.status) },
      { label: '作业影响', raw: rows['作业影响'] || '—', limit: '', tone: 'm' }
    ];
  }
  if (kind === '抑尘') {
    return [
      { label: '运行状态', raw: rows['状态'] || feat.status, limit: '', tone: toneOf(rows['状态'] || feat.status) },
      { label: rows['压力'] ? '压力' : '最近启动', raw: rows['压力'] || rows['最近启动'] || '—', limit: '', tone: 'm' },
      { label: rows['覆盖货位'] ? '覆盖货位' : '关联粉尘', raw: rows['覆盖货位'] || rows['关联粉尘'] || '—', limit: '', tone: 'm' },
      { label: '作业影响', raw: rows['作业影响'] || rows['建议'] || '—', limit: '', tone: toneOf(feat.status) }
    ];
  }
  return Object.keys(rows)
    .filter((key) => !['设备', '分区', '优先级', '说明'].includes(key))
    .slice(0, 6)
    .map((key) => ({ label: key, raw: rows[key], limit: '', tone: /状态|等级/.test(key) ? toneOf(rows[key]) : 'm' }));
}

function envMetricsHtml(feat) {
  const items = envCurrentMetrics(feat);
  if (!items.length) return '<div class="yg-empty">当前点位未接入监测数据</div>';
  return `<div class="env-metrics">${items.map((item) => {
    const split = envSplitVal(item.raw);
    const isPlain = !/^-?\d/.test(String(item.raw || ''));
    return `<div class="env-metric ${item.tone || 'm'}">
      <span class="lab">${escHtml(item.label)}</span>
      <b class="val">${isPlain ? escHtml(String(item.raw || '—')) : `${escHtml(split.value)}${split.unit ? `<small>${escHtml(split.unit)}</small>` : ''}`}</b>
      ${item.limit ? `<em class="lim">${escHtml(item.limit)}</em>` : ''}
    </div>`;
  }).join('')}</div>`;
}

function envHistDataRows(feat) {
  const rows = rowMap(feat);
  const kind = feat.envKind || '监测';
  const reserved = feat.status === '预留' || rows['等级'] === '预留';
  if (reserved) return [];
  const zone = rows['分区'] || feat.name || '监测区';
  if (kind === '粉尘') {
    const base = numOf(rows['TSP']) || 0.8;
    const warn = /关注|超标/.test(String(rows['等级'] || feat.status || ''));
    return [
      ['今天 10:28', 'TSP', `${(base).toFixed(2)} mg/m³`, '1.0 / 1.5', warn ? '超预警' : '正常', zone],
      ['今天 09:40', 'TSP', `${Math.max(0.2, base - 0.12).toFixed(2)} mg/m³`, '1.0 / 1.5', base - 0.12 >= 1 ? '超预警' : '正常', zone],
      ['今天 08:15', 'PM10', rows['PM10'] || '0.50 mg/m³', '台账限值', '正常', zone],
      ['昨天 18:20', 'TSP', `${Math.max(0.2, base - 0.28).toFixed(2)} mg/m³`, '1.0 / 1.5', '正常', zone],
      ['昨天 14:05', 'TSP', `${(base + 0.08).toFixed(2)} mg/m³`, '1.0 / 1.5', (base + 0.08) >= 1 ? '超预警' : '正常', zone],
      ['昨天 09:30', 'PM10', '0.44 mg/m³', '台账限值', '正常', zone]
    ];
  }
  if (kind === '噪声') {
    const cur = numOf(rows['当前']) || 66;
    const day = numOf(rows['昼限'] || '70');
    return [
      ['今天 10:12', '噪声', `${cur.toFixed(1)} dB(A)`, `昼限 ${day}`, cur >= day ? '超预警' : '正常', zone],
      ['今天 08:40', '噪声', `${(cur - 2.1).toFixed(1)} dB(A)`, `昼限 ${day}`, '正常', zone],
      ['昨天 21:15', '噪声', '52.8 dB(A)', `夜限 ${rows['夜限'] || '55'}`, '正常', zone],
      ['昨天 16:30', '噪声', `${(cur + 1.2).toFixed(1)} dB(A)`, `昼限 ${day}`, (cur + 1.2) >= day ? '超预警' : '正常', zone],
      ['昨天 11:05', '噪声', '64.2 dB(A)', `昼限 ${day}`, '正常', zone]
    ];
  }
  if (kind === '风速') {
    const cur = numOf(rows['瞬时风速']) || 6.8;
    const lim = numOf(rows['禁作业阈'] || '13.8');
    return [
      ['今天 10:35', '瞬时风速', `${cur.toFixed(1)} m/s`, `${lim} m/s`, cur >= lim * 0.85 ? '接近限值' : '正常', zone],
      ['今天 09:20', '1分钟均风', rows['1分钟均风'] || '5.9 m/s', `${lim} m/s`, '正常', zone],
      ['昨天 17:40', '瞬时风速', `${(cur + 1.4).toFixed(1)} m/s`, `${lim} m/s`, '正常', zone],
      ['昨天 13:10', '瞬时风速', '8.2 m/s', `${lim} m/s`, '正常', zone],
      ['昨天 08:55', '瞬时风速', '5.1 m/s', `${lim} m/s`, '正常', zone]
    ];
  }
  if (kind === '潮位') {
    return [
      ['今天 10:00', '潮高', rows['潮高'] || '2.36 m', rows['高潮预报'] || '—', '正常', zone],
      ['今天 06:00', '潮高', '1.82 m', rows['高潮预报'] || '—', '正常', zone],
      ['昨天 21:40', '潮高', '3.05 m', '高潮窗口', '关注', zone],
      ['昨天 15:20', '潮高', '2.10 m', rows['高潮预报'] || '—', '正常', zone],
      ['昨天 09:00', '潮高', '1.65 m', rows['高潮预报'] || '—', '正常', zone]
    ];
  }
  if (kind === '气象') {
    return [
      ['今天 10:00', '风速', rows['风速'] || '4.2 m/s', '作业参考', '正常', zone],
      ['今天 10:00', '能见度', rows['能见度'] || '12 km', '作业参考', '正常', zone],
      ['今天 08:00', '气温', rows['气温'] || '28.6℃', '—', '正常', zone],
      ['昨天 18:00', '雨量', '0 mm/h', '露天作业', '正常', zone],
      ['昨天 12:00', '湿度', '74%', '—', '正常', zone]
    ];
  }
  if (kind === '抑尘') {
    const running = /运行/.test(String(rows['状态'] || feat.status || ''));
    return [
      ['今天 10:20', '运行状态', rows['状态'] || feat.status || '—', '联动粉尘', running ? '抑尘中' : '待机', zone],
      ['今天 09:50', '启停', running ? '启动' : '待机保持', rows['压力'] || rows['最近启动'] || '—', '正常', zone],
      ['今天 08:30', '运行状态', '待机', '联动粉尘', '正常', zone],
      ['昨天 16:40', '启停', '启动', rows['覆盖货位'] || rows['关联粉尘'] || '—', '抑尘中', zone],
      ['昨天 11:15', '运行状态', '待机', '—', '正常', zone]
    ];
  }
  return [
    ['今天 10:00', '监测值', '—', '—', '正常', zone],
    ['昨天 16:00', '监测值', '—', '—', '正常', zone]
  ];
}

function envHistDataHtml(feat) {
  const list = envHistDataRows(feat);
  if (!list.length) return '<div class="yg-empty">近 24 小时暂无历史监测数据</div>';
  return compactTable(
    ['时间', '指标', '数值', '阈值/参考', '判定', '分区'],
    list.map((row) => {
      const [time, metric, value, limit, judge, zone] = row;
      return `<tr>
        <td class="code">${escHtml(time)}</td>
        <td>${escHtml(metric)}</td>
        <td class="code">${escHtml(value)}</td>
        <td>${escHtml(limit)}</td>
        <td>${pillOf(judge)}</td>
        <td>${escHtml(zone)}</td>
      </tr>`;
    }).join('')
  );
}

function envHistAlarmRows(feat) {
  const rows = rowMap(feat);
  const kind = feat.envKind || '监测';
  const zone = rows['分区'] || feat.name || '监测区';
  const name = feat.name || '环境点位';
  const reserved = feat.status === '预留' || rows['等级'] === '预留';
  if (reserved) return [];
  if (kind === '粉尘') {
    const hot = /关注|超标/.test(String(rows['等级'] || feat.status || ''));
    return [
      ...(hot ? [['今天 10:28:06', 'ENV-DUST-1028', 'TSP超预警值', '二级', zone, `TSP ${rows['TSP'] || '1.18 mg/m³'}`, '监测中', '建议启雾炮', '抓拍帧 #3921', name]] : []),
      ['昨天 15:42:18', 'ENV-DUST-1542', 'TSP超预警值', '二级', zone, 'TSP 1.12 mg/m³', '已闭环', '启雾炮后回落', '抓拍帧 #3610', name],
      ['昨天 09:18:44', 'ENV-DUST-0918', 'PM10关注', '关注', zone, 'PM10 0.92 mg/m³', '已闭环', '覆盖核查完成', '抓拍帧 #3402', name],
      ['11/08 17:05:22', 'ENV-DUST-1705', 'TSP超预警值', '二级', zone, 'TSP 1.21 mg/m³', '已闭环', '喷淋联动', '抓拍帧 #3188', name]
    ];
  }
  if (kind === '噪声') {
    return [
      ['昨天 16:30:12', 'ENV-NOI-1630', '噪声超昼限', '关注', zone, `${rows['当前'] || '66.4 dB(A)'}`, '已闭环', '疏导车辆', '抓拍帧 #2811', name],
      ['11/08 22:18:40', 'ENV-NOI-2218', '噪声接近夜限', '关注', zone, '54.2 dB(A)', '已闭环', '夜间管控', '抓拍帧 #2604', name]
    ];
  }
  if (kind === '风速') {
    return [
      ['今天 10:35:08', 'ENV-WIND-1035', '风速接近限值', '作业限制', zone, `瞬时 ${rows['瞬时风速'] || '6.8 m/s'}`, '监测中', '调度关注', '抓拍帧 #4112', name],
      ['昨天 17:40:25', 'ENV-WIND-1740', '风速接近限值', '关注', zone, '瞬时 8.2 m/s', '已闭环', '窗口恢复', '抓拍帧 #3905', name]
    ];
  }
  if (kind === '潮位') {
    return [
      ['昨天 21:40:00', 'ENV-TIDE-2140', '高潮窗口关注', '关注', zone, rows['高潮预报'] || '3.1 m', '已闭环', '靠离泊提示', '抓拍帧 #2750', name]
    ];
  }
  if (kind === '气象') {
    return [
      ['11/08 14:20:16', 'ENV-WX-1420', '能见度下降关注', '关注', zone, '能见度 4 km', '已闭环', '露天作业提示', '抓拍帧 #2440', name]
    ];
  }
  if (kind === '抑尘') {
    const running = /运行/.test(String(rows['状态'] || feat.status || ''));
    return [
      ...(running ? [['今天 09:50:12', 'ENV-DUSTCTL-0950', '抑尘联动启动', '关注', zone, rows['关联粉尘'] || rows['覆盖货位'] || name, '处置中', '阀组运行中', '抓拍帧 #4028', name]] : []),
      ['昨天 16:40:33', 'ENV-DUSTCTL-1640', '抑尘联动启动', '关注', zone, rows['关联粉尘'] || '堆场粉尘#1', '已闭环', '粉尘回落后停机', '抓拍帧 #3780', name],
      ['11/08 11:22:09', 'ENV-DUSTCTL-1122', '喷淋压力偏低', '二级', zone, rows['压力'] || '0.28 MPa', '已闭环', '阀组检修', '抓拍帧 #3516', name]
    ];
  }
  return [];
}

function envHistAlarmHtml(feat) {
  const list = envHistAlarmRows(feat);
  if (!list.length) return '<div class="yg-empty">近周期暂无监测报警</div>';
  return `<div class="cam-ai-list env-alarm-list">${list.map((row, i) => {
    const [time, id, type, level, place, target, st, action, shot, device] = row;
    return `<article class="cam-ai-row">
      <div class="cam-ai-shot-wrap">
        <img class="cam-ai-shot" src="${camAiShotSrc(i + 2)}" alt="${escHtml(shot)}">
        <span class="cam-ai-shot-lab">${escHtml(shot)}</span>
      </div>
      <div class="cam-ai-fields">
        <div><b>时间</b><span class="code">${escHtml(time)}</span></div>
        <div><b>报警编号</b><span class="code">${escHtml(id)}</span></div>
        <div><b>类型</b><span>${escHtml(type)}</span></div>
        <div><b>等级</b>${pillOf(level)}</div>
        <div><b>位置</b><span>${escHtml(place)}</span></div>
        <div><b>监测值</b><span>${escHtml(target)}</span></div>
        <div><b>状态</b>${pillOf(st)}</div>
        <div><b>处置</b><span>${escHtml(action)}</span></div>
        <div><b>设备</b><span class="code">${escHtml(device)}</span></div>
      </div>
    </article>`;
  }).join('')}</div>`;
}

function vizEnv(feat) {
  const rows = rowMap(feat);
  const kind = feat.envKind || rows['设备'] || '环境监测';
  const level = rows['等级'] || feat.status || '—';
  const reserved = level === '预留' || feat.status === '预留';
  const status = feat.status || level;
  const name = camNameOf(feat, kind + '监控');
  const src = camSrcOf(feat);
  const online = !/离线|中断|故障|预留/.test(String(status));
  const baseKv = [
    ['设备名称', feat.name || '—'],
    ['设备类型', rows['设备'] || kind],
    ['监测类型', kind],
    ['分区', rows['分区'] || '—'],
    ['状态', status],
    ['关联机位', name],
    ['优先级', rows['优先级'] || '—'],
    ['作业影响', rows['作业影响'] || rows['建议'] || (reserved ? '未接入生产' : '—')]
  ];
  const histTable = envHistDataHtml(feat);
  const alarmList = envHistAlarmHtml(feat);
  return `<div class="viz pv-detail env-detail">
    <div class="pv-identity person">
      <div class="pv-photos">
        ${photoCard('监测设备', envKindIcon(kind))}
      </div>
      <div class="pv-id-main">
        <div class="pv-id-title">
          <strong>${escHtml(feat.name || '环境点位')}</strong>
          <span class="pv-id-sub">${escHtml(kind)} · ${escHtml(rows['分区'] || '港区')} · ${escHtml(status)}</span>
        </div>
        ${pvHead('设备基础信息')}
        ${kvGrid(baseKv)}
      </div>
    </div>
    <div class="pv-block env-video-block">
      ${pvHead('监控视频')}
      <div class="cam-live-stage env-video ${online ? '' : 'offline'}" role="img" aria-label="${escHtml(name)}">
        <img class="cam-live-photo" src="${src}" alt="${escHtml(name)}">
        <div class="cam-live-scan"></div>
        <span class="cam-live-rec">${online ? 'LIVE' : (reserved ? 'IDLE' : 'OFFLINE')}</span>
        <span class="cam-live-tag ${toneOf(status)}">${escHtml(status)}</span>
        <div class="cam-live-caption">
          <b>${escHtml(name)}</b>
          <span>${escHtml(kind)}监测 · ${escHtml(status)}</span>
        </div>
      </div>
      ${reserved ? '<div class="cam-live-note">预留点位，视频与测点待接入</div>' : ''}
    </div>
    <div class="pv-block">
      ${pvHead('当前监测数据')}
      ${envMetricsHtml(feat)}
    </div>
    <div class="pv-block">
      ${pvHead('历史监测数据 · 近24小时')}
      <div class="env-hist-table">${histTable}</div>
    </div>
    <div class="pv-block">
      ${pvHead('历史监测报警')}
      <div class="env-alarm-note">报警含现场抓拍；监测数据本身仅指标，不含图</div>
      ${alarmList}
    </div>
  </div>`;
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

function timeToMin(text) {
  const m = String(text || '').match(/(\d{1,2}):(\d{2})/);
  if (!m) return 0;
  return Number(m[1]) * 60 + Number(m[2]);
}

function filterTrackByTime(track, startTime, endTime) {
  if (!track || !track.length) return [];
  const start = startTime == null || startTime === '' ? null : timeToMin(startTime);
  const end = endTime == null || endTime === '' ? null : timeToMin(endTime);
  return track.filter((point) => {
    const t = timeToMin(point.time);
    if (start != null && t < start) return false;
    if (end != null && t > end) return false;
    return true;
  });
}

function trackStepsHtml(track) {
  if (!track.length) return '<div class="yg-empty">该时段无轨迹点</div>';
  return `<div class="tr-timeline">${track.map((p, i) =>
    `<button type="button" class="tr-step ${i === 0 ? 'on' : ''}" data-role="step" data-i="${i}">
      <i class="tr-dot-idx">${i + 1}</i>
      <span class="tr-step-body"><b>${escHtml(p.time)}</b><em>${escHtml(p.place)}</em></span>
    </button>`
  ).join('')}</div>`;
}

function trackFilterHtml(track) {
  const times = track.map((p) => p.time);
  const uniq = Array.from(new Set(times));
  const opts = (selected) => uniq.map((t) => `<option value="${escHtml(t)}" ${t === selected ? 'selected' : ''}>${escHtml(t)}</option>`).join('');
  return `<div class="tr-filter">
    <span class="tr-filter-lab">时间范围</span>
    <label>起<select data-role="t-start">${opts(uniq[0])}</select></label>
    <span class="tr-filter-sep">—</span>
    <label>止<select data-role="t-end">${opts(uniq[uniq.length - 1])}</select></label>
    <button type="button" class="tr-filter-btn" data-role="t-apply">筛选</button>
    <button type="button" class="tr-filter-btn ghost" data-role="t-reset">重置</button>
  </div>`;
}

function trackReplayPanel(feat, kind, opts) {
  const options = opts || {};
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
  const splitCls = options.split ? ' split' : '';
  const filterBlock = options.filter ? trackFilterHtml(track) : '';
  const stepsBlock = options.split
    ? ''
    : `<div class="tr-steps" data-role="steps">${trackStepsHtml(track)}</div>`;
  const trackJson = JSON.stringify(track).replace(/</g, '\\u003c');
  return `<div class="tr-panel ${tone}${splitCls}" id="${id}" data-feat="${escHtml(feat.name)}" data-kind="${escHtml(kind)}" data-split="${options.split ? '1' : '0'}" data-filter="${options.filter ? '1' : '0'}">
    <script type="application/json" data-role="tr-data">${trackJson}</script>
    ${filterBlock}
    <div class="tr-map">
      <svg class="tr-svg" viewBox="${bounds.minX} ${bounds.minY} ${bounds.w} ${bounds.h}" preserveAspectRatio="xMidYMid meet">
        <polyline class="tr-path-bg" data-role="path-bg" points="${points}"></polyline>
        <polyline class="tr-path" data-role="path" points="${points}"></polyline>
        <g data-role="nodes">${nodes}${labels}</g>
        <g class="tr-mover" data-role="mover" transform="translate(${first.x},${first.y})">
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
    ${stepsBlock}
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
  stepsHost(root) {
    if (root.dataset.split !== '1') return root.querySelector('[data-role="steps"]') || root.querySelector('.tr-steps');
    const wrap = root.closest('.pv-track-row') || root.parentElement || document;
    return wrap.querySelector('[data-role="steps-host"]');
  },
  bind(root) {
    if (!root || root.dataset.bound === '1') return;
    root.dataset.bound = '1';
    let inlineTrack = [];
    try {
      const raw = root.querySelector('[data-role="tr-data"]');
      inlineTrack = raw ? JSON.parse(raw.textContent || '[]') : [];
    } catch (err) {
      inlineTrack = [];
    }
    const mapFeat = typeof findMapFeature === 'function' ? findMapFeature(root.dataset.feat) : null;
    const fullTrack = (inlineTrack && inlineTrack.length) ? inlineTrack : ((mapFeat && mapFeat.track) || []);
    if (!fullTrack.length) return;
    const feat = mapFeat || {
      name: root.dataset.feat || '轨迹',
      type: root.dataset.kind || '车辆',
      track: fullTrack.slice()
    };
    const state = {
      root,
      feat,
      fullTrack,
      track: fullTrack.slice(),
      playing: false,
      speed: 1,
      t: 0,
      duration: Math.max(4, fullTrack.length * 1.6) * 1000
    };
    const toggle = root.querySelector('[data-role="toggle"]');
    const range = root.querySelector('[data-role="range"]');
    const speed = root.querySelector('[data-role="speed"]');
    const startSel = root.querySelector('[data-role="t-start"]');
    const endSel = root.querySelector('[data-role="t-end"]');
    const applyBtn = root.querySelector('[data-role="t-apply"]');
    const resetBtn = root.querySelector('[data-role="t-reset"]');
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
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const start = startSel ? startSel.value : '';
        const end = endSel ? endSel.value : '';
        if (start && end && timeToMin(start) > timeToMin(end)) {
          toast('起止时间颠倒，请重选');
          return;
        }
        this.applyFilter(state, start, end);
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (startSel) startSel.value = fullTrack[0].time;
        if (endSel) endSel.value = fullTrack[fullTrack.length - 1].time;
        this.applyFilter(state, '', '');
      });
    }
    this.mountSteps(state);
    this.paintPath(state);
    this.render(state);
    this.play(state);
  },
  applyFilter(state, start, end) {
    const next = (start || end) ? filterTrackByTime(state.fullTrack, start, end) : state.fullTrack.slice();
    if (!next.length) {
      toast('该时段无轨迹点');
      return;
    }
    this.pause(state);
    state.track = next;
    state.t = 0;
    state.duration = Math.max(4, next.length * 1.6) * 1000;
    this.mountSteps(state);
    this.paintPath(state);
    this.render(state);
  },
  mountSteps(state) {
    const host = this.stepsHost(state.root);
    if (!host) return;
    host.innerHTML = trackStepsHtml(state.track);
    host.querySelectorAll('[data-role="step"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.i) || 0;
        state.t = state.track.length <= 1 ? 1 : i / (state.track.length - 1);
        this.render(state);
        this.pause(state);
      });
    });
  },
  paintPath(state) {
    const track = state.track;
    const bounds = trackBounds(track);
    const svg = state.root.querySelector('.tr-svg');
    if (svg) svg.setAttribute('viewBox', `${bounds.minX} ${bounds.minY} ${bounds.w} ${bounds.h}`);
    const points = track.map((p) => `${p.x},${p.y}`).join(' ');
    const pathBg = state.root.querySelector('[data-role="path-bg"]');
    const path = state.root.querySelector('[data-role="path"]');
    if (pathBg) pathBg.setAttribute('points', points);
    if (path) path.setAttribute('points', points);
    const nodes = state.root.querySelector('[data-role="nodes"]');
    if (nodes) {
      nodes.innerHTML = track.map((p, i) =>
        `<circle class="tr-node" data-i="${i}" cx="${p.x}" cy="${p.y}" r="1.4"></circle><text class="tr-lab" x="${p.x}" y="${Math.max(bounds.minY + 3, p.y - 2.2)}" text-anchor="middle">${i + 1}</text>`
      ).join('');
    }
    const first = track[0];
    const last = track[track.length - 1];
    const clock = state.root.querySelector('[data-role="clock"]');
    if (clock) clock.textContent = `${first.time} → ${last.time}`;
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
    if (!track.length) return { x: 0, y: 0, place: '—', time: '—', index: 0 };
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
    const mover = state.root.querySelector('[data-role="mover"]') || state.root.querySelector('.tr-mover');
    if (mover) mover.setAttribute('transform', `translate(${sample.x},${sample.y})`);
    const place = state.root.querySelector('[data-role="place"]');
    const clock = state.root.querySelector('[data-role="clock"]');
    const range = state.root.querySelector('[data-role="range"]');
    const pctEl = state.root.querySelector('[data-role="pct"]');
    if (place) place.textContent = sample.place;
    if (clock) clock.textContent = sample.time;
    if (range) range.value = String(Math.round(state.t * 1000));
    if (pctEl) pctEl.textContent = Math.round(state.t * 100) + '%';
    const host = this.stepsHost(state.root) || state.root;
    host.querySelectorAll('[data-role="step"]').forEach((btn, i) => {
      btn.classList.toggle('on', i === sample.index);
      btn.classList.toggle('done', i < sample.index);
    });
    const filteredFeat = Object.assign({}, state.feat, { track: state.track });
    showPoiTrack(filteredFeat, sample);
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
  if (typeof JobArchive !== 'undefined' && JobArchive.bindAll) JobArchive.bindAll(dims);
}
