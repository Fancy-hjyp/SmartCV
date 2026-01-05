import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            // Catch all unmatched routes and redirect to home
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
})

export default router
