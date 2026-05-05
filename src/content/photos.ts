export interface PhotoItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface PhotoSeries {
  id: string;
  title: string;
  subtitle?: string;
  year: number;
  location: string;
  camera?: string;
  lens?: string;
  film?: string;
  desc: string;
  cover: string;
  photos: PhotoItem[];
}

export const PHOTO_SERIES: PhotoSeries[] = [
  {
    id: 'shenzhen-night',
    title: '深圳夜',
    subtitle: '城市与人',
    year: 2026,
    location: '深圳',
    camera: 'Fujifilm X-T5',
    lens: 'XF 23mm F2',
    desc: '富士 X-T5 + XF23 F2，加班晚归路上的杂记。霓虹灯的轮廓、马路上的影子、便利店的白光。',
    cover: 'https://cdn.deweyou.me/photos/shenzhen-night/cover.jpg',
    photos: [
      { src: 'https://cdn.deweyou.me/photos/shenzhen-night/001.jpg', alt: '深圳夜 001', width: 1200, height: 800 },
      { src: 'https://cdn.deweyou.me/photos/shenzhen-night/002.jpg', alt: '深圳夜 002', width: 800, height: 1200 },
      { src: 'https://cdn.deweyou.me/photos/shenzhen-night/003.jpg', alt: '深圳夜 003', width: 1200, height: 900 },
      { src: 'https://cdn.deweyou.me/photos/shenzhen-night/004.jpg', alt: '深圳夜 004', width: 900, height: 1200 },
    ],
  },
  {
    id: 'kyoto',
    title: '京都八日',
    subtitle: '游记 · 银盐',
    year: 2025,
    location: '京都',
    camera: 'Canonet QL17',
    film: 'Kodak Gold 200',
    desc: '一台胶片机 + 八卷柯达 Gold 200，关于光、阴影与寺庙的午后。',
    cover: 'https://cdn.deweyou.me/photos/kyoto/cover.jpg',
    photos: [
      { src: 'https://cdn.deweyou.me/photos/kyoto/001.jpg', alt: '京都八日 001', width: 1200, height: 800 },
      { src: 'https://cdn.deweyou.me/photos/kyoto/002.jpg', alt: '京都八日 002', width: 800, height: 1200 },
      { src: 'https://cdn.deweyou.me/photos/kyoto/003.jpg', alt: '京都八日 003', width: 1200, height: 1200 },
      { src: 'https://cdn.deweyou.me/photos/kyoto/004.jpg', alt: '京都八日 004', width: 1200, height: 900 },
    ],
  },
  {
    id: 'cube-moments',
    title: '魔方时刻',
    subtitle: '微距系列',
    year: 2024,
    location: '深圳',
    camera: 'Fujifilm X-T5',
    lens: 'XF 80mm Macro',
    desc: '90mm 微距镜头下的 26 个色块，关于秩序与混乱的小宇宙。',
    cover: 'https://cdn.deweyou.me/photos/cube-moments/cover.jpg',
    photos: [
      { src: 'https://cdn.deweyou.me/photos/cube-moments/001.jpg', alt: '魔方时刻 001', width: 1200, height: 1200 },
      { src: 'https://cdn.deweyou.me/photos/cube-moments/002.jpg', alt: '魔方时刻 002', width: 1200, height: 800 },
      { src: 'https://cdn.deweyou.me/photos/cube-moments/003.jpg', alt: '魔方时刻 003', width: 800, height: 1200 },
    ],
  },
] as const satisfies PhotoSeries[];
