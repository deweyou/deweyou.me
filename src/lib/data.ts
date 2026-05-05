export const PROFILE = {
  name: '欧怼怼',
  nameEn: 'Dewey Ou',
  title: '前端工程师 · 字节跳动',
  location: '深圳',
  socials: [
    { label: 'GitHub',  handle: '@deweyou',       href: 'https://github.com/deweyou',  icon: 'ti-brand-github' },
    { label: '小红书',  handle: '欧怼怼',          href: '#',                           icon: 'ti-message-circle-2' },
    { label: 'Email',   handle: 'hi@deweyou.me',  href: 'mailto:hi@deweyou.me',        icon: 'ti-mail' },
  ],
} as const;

export const ABOUT_SECTIONS = [
  {
    id: 'intro', label: '简介', kind: 'prose' as const,
    body: [
      '我是欧怼怼，英文名 Dewey Ou，目前在深圳，是字节跳动的一名前端工程师。',
      '工作之外，我把自己当成产品的"作者"——喜欢有设计感、人性化、新颖、有意思的东西，也希望成为做这类产品的人。最近一段时间，我在和 AI 交朋友，让它陪我学习、陪我做有意思的小工具。',
      '这个网站记录我写的文章、做的项目，以及生活里那些不那么严肃的瞬间。',
    ],
  },
  {
    id: 'now', label: '近况', kind: 'list' as const,
    items: [
      { k: '正在做', v: '把工作中的设计沉淀整理成 Deweyou Design 系统' },
      { k: '正在写', v: '一篇关于 AI Coding 协作方式的长文' },
      { k: '正在读', v: '原研哉《设计中的设计》' },
      { k: '正在练', v: '三阶魔方平均 28 秒' },
      { k: '想去',   v: '京都 · 直岛 · 冰岛' },
    ],
  },
  {
    id: 'work', label: '工作经历', kind: 'timeline' as const,
    items: [
      { from: '2022', to: '至今', org: '字节跳动 ByteDance', role: '前端工程师', detail: 'B 端业务前端，负责设计系统沉淀、复杂表单引擎、AI 辅助开发工具链。' },
      { from: '2020', to: '2022', org: '某初创公司', role: '高级前端', detail: '参与 0→1 移动端业务，搭建组件库与设计协作流程。' },
      { from: '2018', to: '2020', org: '广州某互联网公司', role: '前端工程师', detail: '电商业务前端，负责 H5 营销活动、性能优化。' },
    ],
  },
  {
    id: 'skills', label: '能力', kind: 'tags' as const,
    groups: [
      { name: '前端', items: ['React', 'TypeScript', 'CSS / Less', '动画 / 交互', '设计系统'] },
      { name: '设计', items: ['Figma', '排版与字体', '色彩系统', '产品 sense'] },
      { name: 'AI',   items: ['Prompt 工程', 'Claude / GPT', 'Agent 开发', 'AI Coding'] },
      { name: '兴趣', items: ['摄影', '魔方', '近景魔术', '阅读'] },
    ],
  },
  {
    id: 'philosophy', label: '一些想法', kind: 'quotes' as const,
    items: [
      '做有意思的产品，过有意思的生活。',
      '所谓 sense，不是直觉，而是被无数次验证过的判断。',
      '人最值钱的部分，是品味。',
      '对自己温柔一点，对作品狠一点。',
    ],
  },
  {
    id: 'contact', label: '联系', kind: 'prose' as const,
    body: [
      '想聊聊产品、设计、AI 协作或者只是说一声 hi——任何渠道都欢迎，我会回复每一封像样的来信。',
    ],
  },
];

export const PORTFOLIO_TAGS = ['全部', 'GitHub', '设计', '摄影'] as const;

export const PORTFOLIO_ITEMS = [
  { id: 'gh-deweyou-design', tag: 'GitHub',  title: 'Deweyou Design',    subtitle: '我的个人设计系统',      year: '2026', desc: '一套写给自己的 React 组件库 + 设计 token。强调宋体、留白与 mint 高亮三件套。',         meta: 'TypeScript · React · CSS', stars: 128, accent: 'mint',  href: 'https://github.com/deweyou/design' },
  { id: 'gh-claude-coder',   tag: 'GitHub',  title: 'claude-coder',      subtitle: 'AI 协作的命令行工具',   year: '2025', desc: '一个把 Claude 接入本地代码库的 CLI——支持上下文索引、任务拆分、增量 diff review。',    meta: 'TypeScript · Node',        stars: 412, accent: 'plain', href: '#' },
  { id: 'gh-cube-timer',     tag: 'GitHub',  title: 'cube-timer',        subtitle: '魔方计时器（PWA）',     year: '2024', desc: '为速拧爱好者写的极简计时器，支持 Stackmat 协议、平均值统计、CSV 导出。',              meta: 'TypeScript · PWA',         stars: 56,  accent: 'plain', href: '#' },
  { id: 'de-personal-site',  tag: '设计',    title: '个人主页 v3',       subtitle: '从模板到有审美',        year: '2026', desc: '为自己写的网站。用宋体做主字体，用一抹 mint 做高亮，用等高线做背景纹理。',              meta: 'Figma · React',            accent: 'mint' },
  { id: 'de-bytedance-form', tag: '设计',    title: 'B 端表单引擎',      subtitle: '设计稿 + 组件落地',    year: '2025', desc: '抽象 30+ 个内部表单的共性，重新设计了一套从 schema 到组件的渲染流水线。',              meta: 'Internal · ByteDance',     accent: 'plain' },
  { id: 'de-poster-2024',    tag: '设计',    title: '2024 海报合集',     subtitle: '一年一张周回',          year: '2024', desc: '52 张周报海报。从极简版式到实验排版，记录我那一年对字体的执着。',                        meta: 'Figma · 印刷',             accent: 'plain' },
  { id: 'ph-shenzhen-night', tag: '摄影',    title: '深圳夜',            subtitle: '城市与人',              year: '2026', desc: '富士 X-T5 + XF23 F2，加班晚归路上的杂记。',                                         meta: 'Fujifilm · 28 张',         accent: 'plain' },
  { id: 'ph-kyoto',          tag: '摄影',    title: '京都八日',          subtitle: '游记 · 银盐',           year: '2025', desc: '一台胶片机 + 八卷柯达 Gold 200，关于光、阴影与寺庙的午后。',                          meta: 'Canonet · 36 张',          accent: 'mint' },
  { id: 'ph-cube-moments',   tag: '摄影',    title: '魔方时刻',          subtitle: '微距系列',              year: '2024', desc: '90mm 微距镜头下的 26 个色块，关于秩序与混乱的小宇宙。',                              meta: 'Fujifilm · 12 张',         accent: 'plain' },
];

export const TAGS = ['全部', 'AI', '前端设计', '产品思考', '生活随笔', '读书笔记'] as const;
