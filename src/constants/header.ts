export interface IHeaderMenu {
  name: string,
  logoUrl: string,
  url: string,
  logoName: string,
  slug: boolean,
  menu: boolean,
}

export const headerMenuArr: IHeaderMenu[] = [
  {
    name: '블로그',
    logoUrl: '/',
    url: '/',
    logoName: 'BLOG',
    slug: false,
    menu: true,
  },
  {
    name: '블로그',
    logoUrl: '/',
    url: '/post',
    logoName: 'BLOG',
    slug: true,
    menu: false,
  },
  {
    name: 'AI CHAT',
    logoUrl: '/chat',
    url: '/chat',
    logoName: 'AI CHAT',
    slug: false,
    menu: true,
  },
  {
    name: '방명록',
    logoUrl: '/guest',
    url: '/guest',
    logoName: 'GuestBook',
    slug: false,
    menu: true,
  },
]