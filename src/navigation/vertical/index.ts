import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Livros',
    to: { name: 'books' },
    icon: { icon: 'fa-book' },
  },
  {
    title: 'Clima',
    to: { name: 'climate' },
    icon: { icon: 'fa-thermometer-full' },
  },
] as VerticalNavItems
