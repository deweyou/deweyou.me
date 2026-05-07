export const ABOUT = {
  eyebrow: 'ABOUT · 关于',
  headingLine1: '一份不那么严肃的',
  headingLine2: '「自我说明」',
  tocLabel: '目录',
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
] as const;
