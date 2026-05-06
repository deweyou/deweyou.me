export interface PortfolioItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  year?: string;
  desc: string;
  meta: string;
  accent: 'mint' | 'plain';
  href?: string;
  cover?: string;
  stars?: number;
}

export const PORTFOLIO = {
  eyebrow: 'PORTFOLIO',
  heading: '作品集',
  description: 'GitHub 项目、设计稿、摄影作品。',
} as const;

export const PORTFOLIO_TAGS = ['全部', 'GitHub', '设计', '摄影'];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: 'gh-deweyou-design', tag: 'GitHub',  title: 'Deweyou Design',    subtitle: '我的个人设计系统',      year: '2026', desc: '一套写给自己的 React 组件库 + 设计 token。强调宋体、留白与 mint 高亮三件套。',         meta: 'TypeScript · React · CSS', stars: 128, accent: 'mint',  href: 'https://github.com/deweyou/design' },
  { id: 'gh-claude-coder',   tag: 'GitHub',  title: 'claude-coder',      subtitle: 'AI 协作的命令行工具',   year: '2025', desc: '一个把 Claude 接入本地代码库的 CLI——支持上下文索引、任务拆分、增量 diff review。',    meta: 'TypeScript · Node',        stars: 412, accent: 'plain', href: '#' },
  { id: 'gh-cube-timer',     tag: 'GitHub',  title: 'cube-timer',        subtitle: '魔方计时器（PWA）',     year: '2024', desc: '为速拧爱好者写的极简计时器，支持 Stackmat 协议、平均值统计、CSV 导出。',              meta: 'TypeScript · PWA',         stars: 56,  accent: 'plain', href: '#' },
  { id: 'de-personal-site',  tag: '设计',    title: '个人主页 v3',       subtitle: '从模板到有审美',        year: '2026', desc: '为自己写的网站。用宋体做主字体，用一抹 mint 做高亮，用等高线做背景纹理。',              meta: 'Figma · React',            accent: 'mint' },
  { id: 'de-bytedance-form', tag: '设计',    title: 'B 端表单引擎',      subtitle: '设计稿 + 组件落地',    year: '2025', desc: '抽象 30+ 个内部表单的共性，重新设计了一套从 schema 到组件的渲染流水线。',              meta: 'Internal · ByteDance',     accent: 'plain' },
  { id: 'de-poster-2024',    tag: '设计',    title: '2024 海报合集',     subtitle: '一年一张周回',          year: '2024', desc: '52 张周报海报。从极简版式到实验排版，记录我那一年对字体的执着。',                        meta: 'Figma · 印刷',             accent: 'plain' },
  { id: 'ph-shenzhen-night', tag: '摄影',    title: '深圳夜',            subtitle: '城市与人',              year: '2026', desc: '富士 X-T5 + XF23 F2，加班晚归路上的杂记。',                                         meta: 'Fujifilm · 28 张',         accent: 'plain', href: '/photos/shenzhen-night', cover: 'https://cdn.deweyou.me/photos/shenzhen-night/cover.jpg' },
  { id: 'ph-kyoto',          tag: '摄影',    title: '京都八日',          subtitle: '游记 · 银盐',           year: '2025', desc: '一台胶片机 + 八卷柯达 Gold 200，关于光、阴影与寺庙的午后。',                          meta: 'Canonet · 36 张',          accent: 'mint',  href: '/photos/kyoto',          cover: 'https://cdn.deweyou.me/photos/kyoto/cover.jpg' },
  { id: 'ph-cube-moments',   tag: '摄影',    title: '魔方时刻',          subtitle: '微距系列',              year: '2024', desc: '90mm 微距镜头下的 26 个色块，关于秩序与混乱的小宇宙。',                              meta: 'Fujifilm · 12 张',         accent: 'plain', href: '/photos/cube-moments',   cover: 'https://cdn.deweyou.me/photos/cube-moments/cover.jpg' },
  { id: 'ph-20230408-珠海', tag: '摄影', title: '珠海', subtitle: '', year: '2023', desc: '珠海。', meta: '5 张', accent: 'plain', href: '/photos/20230408-珠海', cover: 'https://cdn.deweyou.me/photos/2023/20230408-珠海/cover.JPG' },
  { id: 'ph-20230409-澳门', tag: '摄影', title: '澳门', subtitle: '', year: '2023', desc: '澳门。', meta: '16 张', accent: 'plain', href: '/photos/20230409-澳门', cover: 'https://cdn.deweyou.me/photos/2023/20230409-澳门/cover.JPG' },
  { id: 'ph-20230526-武汉', tag: '摄影', title: '武汉', subtitle: '', year: '2023', desc: '武汉。', meta: '5 张', accent: 'plain', href: '/photos/20230526-武汉', cover: 'https://cdn.deweyou.me/photos/2023/20230526-武汉/cover.JPG' },
  { id: 'ph-20230610-前门|王府井|什刹海', tag: '摄影', title: '前门|王府井|什刹海', subtitle: '', year: '2023', desc: '前门|王府井|什刹海。', meta: '6 张', accent: 'plain', href: '/photos/20230610-前门|王府井|什刹海', cover: 'https://cdn.deweyou.me/photos/2023/20230610-前门|王府井|什刹海/cover.JPG' },
  { id: 'ph-20230709-798艺术中心', tag: '摄影', title: '798艺术中心', subtitle: '', year: '2023', desc: '798艺术中心。', meta: '6 张', accent: 'plain', href: '/photos/20230709-798艺术中心', cover: 'https://cdn.deweyou.me/photos/2023/20230709-798艺术中心/cover.JPG' },
  { id: 'ph-20230715-三里屯太古里', tag: '摄影', title: '三里屯太古里', subtitle: '', year: '2023', desc: '三里屯太古里。', meta: '7 张', accent: 'plain', href: '/photos/20230715-三里屯太古里', cover: 'https://cdn.deweyou.me/photos/2023/20230715-三里屯太古里/cover.JPG' },
  { id: 'ph-20230805-深业上城', tag: '摄影', title: '深业上城', subtitle: '', year: '2023', desc: '深业上城。', meta: '11 张', accent: 'plain', href: '/photos/20230805-深业上城', cover: 'https://cdn.deweyou.me/photos/2023/20230805-深业上城/cover.JPG' },
  { id: 'ph-20230819-海上世界', tag: '摄影', title: '海上世界', subtitle: '', year: '2023', desc: '海上世界。', meta: '8 张', accent: 'plain', href: '/photos/20230819-海上世界', cover: 'https://cdn.deweyou.me/photos/2023/20230819-海上世界/cover.JPG' },
  { id: 'ph-20230930-汕头老城', tag: '摄影', title: '汕头老城', subtitle: '', year: '2023', desc: '汕头老城。', meta: '15 张', accent: 'plain', href: '/photos/20230930-汕头老城', cover: 'https://cdn.deweyou.me/photos/2023/20230930-汕头老城/cover.JPG' },
  { id: 'ph-20231014-深圳万象城猫猫公园', tag: '摄影', title: '深圳万象城猫猫公园', subtitle: '', year: '2023', desc: '深圳万象城猫猫公园。', meta: '6 张', accent: 'plain', href: '/photos/20231014-深圳万象城猫猫公园', cover: 'https://cdn.deweyou.me/photos/2023/20231014-深圳万象城猫猫公园/cover.JPG' },
  { id: 'ph-20231105-深圳华侨城创意文化园', tag: '摄影', title: '深圳华侨城创意文化园', subtitle: '', year: '2023', desc: '深圳华侨城创意文化园。', meta: '8 张', accent: 'plain', href: '/photos/20231105-深圳华侨城创意文化园', cover: 'https://cdn.deweyou.me/photos/2023/20231105-深圳华侨城创意文化园/cover.JPG' },
  { id: 'ph-20231112-北京圆明园', tag: '摄影', title: '北京圆明园', subtitle: '', year: '2023', desc: '北京圆明园。', meta: '23 张', accent: 'plain', href: '/photos/20231112-北京圆明园', cover: 'https://cdn.deweyou.me/photos/2023/20231112-北京圆明园/cover.JPG' },
  { id: 'ph-20231129-HK', tag: '摄影', title: 'HK', subtitle: '', year: '2023', desc: 'HK。', meta: '8 张', accent: 'plain', href: '/photos/20231129-HK', cover: 'https://cdn.deweyou.me/photos/2023/20231129-HK/cover.JPG' },
  { id: 'ph-20231224-长沙', tag: '摄影', title: '长沙', subtitle: '', year: '2023', desc: '长沙。', meta: '17 张', accent: 'plain', href: '/photos/20231224-长沙', cover: 'https://cdn.deweyou.me/photos/2023/20231224-长沙/cover.JPG' },
  { id: 'ph-20240217-HK', tag: '摄影', title: 'HK', subtitle: '', year: '2024', desc: 'HK。', meta: '9 张', accent: 'plain', href: '/photos/20240217-HK', cover: 'https://cdn.deweyou.me/photos/2024/20240217-HK/cover.JPG' },
  { id: 'ph-20240319-南京', tag: '摄影', title: '南京', subtitle: '', year: '2024', desc: '南京。', meta: '19 张', accent: 'plain', href: '/photos/20240319-南京', cover: 'https://cdn.deweyou.me/photos/2024/20240319-南京/cover.JPG' },
  { id: 'ph-20240405-深圳华侨城创意文化园', tag: '摄影', title: '深圳华侨城创意文化园', subtitle: '', year: '2024', desc: '深圳华侨城创意文化园。', meta: '7 张', accent: 'plain', href: '/photos/20240405-深圳华侨城创意文化园', cover: 'https://cdn.deweyou.me/photos/2024/20240405-深圳华侨城创意文化园/cover.JPG' },
  { id: 'ph-20240610-深圳F518 | 梧桐岛', tag: '摄影', title: '深圳F518 | 梧桐岛', subtitle: '', year: '2024', desc: '深圳F518 | 梧桐岛。', meta: '16 张', accent: 'plain', href: '/photos/20240610-深圳F518 | 梧桐岛', cover: 'https://cdn.deweyou.me/photos/2024/20240610-深圳F518 | 梧桐岛/cover.JPG' },
  { id: 'ph-20240928-杭州', tag: '摄影', title: '杭州', subtitle: '', year: '2024', desc: '杭州。', meta: '13 张', accent: 'plain', href: '/photos/20240928-杭州', cover: 'https://cdn.deweyou.me/photos/2024/20240928-杭州/cover.JPG' },
  { id: 'ph-20240929-嘉兴', tag: '摄影', title: '嘉兴', subtitle: '', year: '2024', desc: '嘉兴。', meta: '19 张', accent: 'plain', href: '/photos/20240929-嘉兴', cover: 'https://cdn.deweyou.me/photos/2024/20240929-嘉兴/cover.JPG' },
  { id: 'ph-20240930-苏州', tag: '摄影', title: '苏州', subtitle: '', year: '2024', desc: '苏州。', meta: 'FUJIFILM X-S20 · 9 张', accent: 'plain', href: '/photos/20240930-苏州', cover: 'https://cdn.deweyou.me/photos/2024/20240930-苏州/cover.JPG' },
  { id: 'ph-20241002-上海', tag: '摄影', title: '上海', subtitle: '', year: '2024', desc: '上海。', meta: 'FUJIFILM X-S20 · 21 张', accent: 'plain', href: '/photos/20241002-上海', cover: 'https://cdn.deweyou.me/photos/2024/20241002-上海/cover.JPG' },
  { id: 'ph-20241215-广州', tag: '摄影', title: '广州', subtitle: '', year: '2024', desc: '广州。', meta: '10 张', accent: 'plain', href: '/photos/20241215-广州', cover: 'https://cdn.deweyou.me/photos/2024/20241215-广州/cover.JPG' },
  { id: 'ph-20250125-HK', tag: '摄影', title: 'HK', subtitle: '', year: '2025', desc: 'HK。', meta: 'FUJIFILM X-S20 · 8 张', accent: 'plain', href: '/photos/20250125-HK', cover: 'https://cdn.deweyou.me/photos/2025/20250125-HK/cover.JPG' },
  { id: 'ph-20250504-南山公园', tag: '摄影', title: '南山公园', subtitle: '', year: '2025', desc: '南山公园。', meta: 'FUJIFILM X-S20 · 7 张', accent: 'plain', href: '/photos/20250504-南山公园', cover: 'https://cdn.deweyou.me/photos/2025/20250504-南山公园/cover.JPG' },
  { id: 'ph-20250824-江门', tag: '摄影', title: '江门', subtitle: '', year: '2025', desc: '江门。', meta: 'FUJIFILM X-S20 · 7 张', accent: 'plain', href: '/photos/20250824-江门', cover: 'https://cdn.deweyou.me/photos/2025/20250824-江门/cover.JPG' },
  { id: 'ph-20251015-深业上城', tag: '摄影', title: '深业上城', subtitle: '', year: '2025', desc: '深业上城。', meta: 'FUJIFILM X-S20 · 11 张', accent: 'plain', href: '/photos/20251015-深业上城', cover: 'https://cdn.deweyou.me/photos/2025/20251015-深业上城/cover.JPG' },
  { id: 'ph-20251101-虹桥公园', tag: '摄影', title: '虹桥公园', subtitle: '', year: '2025', desc: '虹桥公园。', meta: 'FUJIFILM X-S20 · 15 张', accent: 'plain', href: '/photos/20251101-虹桥公园', cover: 'https://cdn.deweyou.me/photos/2025/20251101-虹桥公园/cover.JPG' },
  { id: 'ph-20260322-南头古城', tag: '摄影', title: '南头古城', subtitle: '', year: '2026', desc: '南头古城。', meta: 'FUJIFILM X-S20 · 14 张', accent: 'plain', href: '/photos/20260322-南头古城', cover: 'https://cdn.deweyou.me/photos/2026/20260322-南头古城/cover.JPG' },
  { id: 'ph-20260228-平峦山', tag: '摄影', title: '平峦山', subtitle: '', year: '2026', desc: '平峦山。', meta: '9 张', accent: 'plain', href: '/photos/20260228-平峦山', cover: 'https://cdn.deweyou.me/photos/2026/20260228-平峦山/cover.JPG' },
];
