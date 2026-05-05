export const PORTFOLIO = {
  eyebrow: 'PORTFOLIO',
  heading: '作品集',
  description: 'GitHub 项目、设计稿、摄影作品。',
} as const;

export const PORTFOLIO_TAGS = ['全部', 'GitHub', '设计', '摄影'] as const;

export const PORTFOLIO_ITEMS = [
  { id: 'gh-deweyou-design', tag: 'GitHub',  title: 'Deweyou Design',    subtitle: '我的个人设计系统',      year: '2026', desc: '一套写给自己的 React 组件库 + 设计 token。强调宋体、留白与 mint 高亮三件套。',         meta: 'TypeScript · React · CSS', stars: 128, accent: 'mint',  href: 'https://github.com/deweyou/design' },
  { id: 'gh-claude-coder',   tag: 'GitHub',  title: 'claude-coder',      subtitle: 'AI 协作的命令行工具',   year: '2025', desc: '一个把 Claude 接入本地代码库的 CLI——支持上下文索引、任务拆分、增量 diff review。',    meta: 'TypeScript · Node',        stars: 412, accent: 'plain', href: '#' },
  { id: 'gh-cube-timer',     tag: 'GitHub',  title: 'cube-timer',        subtitle: '魔方计时器（PWA）',     year: '2024', desc: '为速拧爱好者写的极简计时器，支持 Stackmat 协议、平均值统计、CSV 导出。',              meta: 'TypeScript · PWA',         stars: 56,  accent: 'plain', href: '#' },
  { id: 'de-personal-site',  tag: '设计',    title: '个人主页 v3',       subtitle: '从模板到有审美',        year: '2026', desc: '为自己写的网站。用宋体做主字体，用一抹 mint 做高亮，用等高线做背景纹理。',              meta: 'Figma · React',            accent: 'mint' },
  { id: 'de-bytedance-form', tag: '设计',    title: 'B 端表单引擎',      subtitle: '设计稿 + 组件落地',    year: '2025', desc: '抽象 30+ 个内部表单的共性，重新设计了一套从 schema 到组件的渲染流水线。',              meta: 'Internal · ByteDance',     accent: 'plain' },
  { id: 'de-poster-2024',    tag: '设计',    title: '2024 海报合集',     subtitle: '一年一张周回',          year: '2024', desc: '52 张周报海报。从极简版式到实验排版，记录我那一年对字体的执着。',                        meta: 'Figma · 印刷',             accent: 'plain' },
  { id: 'ph-shenzhen-night', tag: '摄影',    title: '深圳夜',            subtitle: '城市与人',              year: '2026', desc: '富士 X-T5 + XF23 F2，加班晚归路上的杂记。',                                         meta: 'Fujifilm · 28 张',         accent: 'plain', href: '/photos/shenzhen-night', cover: 'https://cdn.deweyou.me/photos/shenzhen-night/cover.jpg' },
  { id: 'ph-kyoto',          tag: '摄影',    title: '京都八日',          subtitle: '游记 · 银盐',           year: '2025', desc: '一台胶片机 + 八卷柯达 Gold 200，关于光、阴影与寺庙的午后。',                          meta: 'Canonet · 36 张',          accent: 'mint',  href: '/photos/kyoto',          cover: 'https://cdn.deweyou.me/photos/kyoto/cover.jpg' },
  { id: 'ph-cube-moments',   tag: '摄影',    title: '魔方时刻',          subtitle: '微距系列',              year: '2024', desc: '90mm 微距镜头下的 26 个色块，关于秩序与混乱的小宇宙。',                              meta: 'Fujifilm · 12 张',         accent: 'plain', href: '/photos/cube-moments',   cover: 'https://cdn.deweyou.me/photos/cube-moments/cover.jpg' },
];
