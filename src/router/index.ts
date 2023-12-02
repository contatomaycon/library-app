import { canNavigate } from '@/@layouts/plugins/casl';
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isLoggedIn } from '@/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach((to, from, next) => {
  if (canNavigate(to)) {
    if (to.name !== 'index' && to.meta.redirectIfLoggedIn && isLoggedIn()) {
      return next({ name: 'index' });
    }
  } else {
    if (!isLoggedIn()) {
      return next({ name: 'login' });
    }
  }

  next();
});

export default router
