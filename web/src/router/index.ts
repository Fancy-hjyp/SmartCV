import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ResumeOptimization from '../views/ResumeOptimization.vue';

const routes = [
  {
    path: '/',
    name: 'ResumeOptimization',
    component: Home,
  },
  {
    path: '/resume-optimization',
    name: 'ResumeOptimization',
    component: ResumeOptimization,
  },
  {
    // Catch all unmatched routes and redirect to home
    path: '/:pathMatch(.*)*',
    redirect: '/resume-optimization',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
