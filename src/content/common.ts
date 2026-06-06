export const NAV_LINKS = [
  { href: '/',      label: '主页' },
  { href: '/blog',  label: '文章' },
  { href: '/daily', label: '笔记' },
  // { href: '/portfolio', label: '作品集' },
  // { href: '/about',     label: '关于' },
] as const;

export const PROFILE = {
  name: '欧怼怼',
  nameEn: 'Dewey Ou',
  title: '前端工程师 · 字节跳动',
  location: '深圳',
  socials: [
    { label: 'GitHub',  handle: '@deweyou',      href: 'https://github.com/deweyou',  icon: 'ti-brand-github' },
    { label: 'Email',   handle: 'hi@deweyou.me', href: 'mailto:oushihao97@gmail.com', icon: 'ti-mail' },
    { label: '小红书',  handle: '欧怼怼',         href: 'https://www.xiaohongshu.com/user/profile/5c99a44d000000001600c92d',                           iconSrc: '/icons/xiaohongshu.svg' },
  ],
} as const;

export const FOOTER = {
  copyright: `'© ${new Date().getFullYear()} · DEWEY OU'`,
} as const;
