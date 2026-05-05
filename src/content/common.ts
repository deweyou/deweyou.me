export const NAV_LINKS = [
  { href: '/',          label: '主页' },
  { href: '/blog',      label: '文章' },
  { href: '/portfolio', label: '作品集' },
  { href: '/about',     label: '关于' },
] as const;

export const PROFILE = {
  name: '欧怼怼',
  nameEn: 'Dewey Ou',
  title: '前端工程师 · 字节跳动',
  location: '深圳',
  socials: [
    { label: 'GitHub',  handle: '@deweyou',      href: 'https://github.com/deweyou',  icon: 'ti-brand-github' },
    { label: '小红书',  handle: '欧怼怼',         href: '#',                           iconSrc: '/icons/xiaohongshu.svg' },
    { label: 'Email',   handle: 'hi@deweyou.me', href: 'mailto:hi@deweyou.me',        icon: 'ti-mail' },
  ],
} as const;

export const FOOTER = {
  copyright: '© 2026 · DEWEY OU',
} as const;
