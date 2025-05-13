import {createRouter, createWebHistory} from "vue-router";

const HomeComponent = () => import('../public/pages/home.component.vue');
const AboutComponent = () => import('../public/pages/about.component.vue');
const PageNotFoundComponent = () => import('../public/pages/page-not-found.component.vue');

const routes = [
    {   path: '/home',                  name: 'home',       component: HomeComponent,               meta: {title: 'Home'}},
    {   path: '/about',                 name: 'about',      component: AboutComponent,              meta: {title: 'About us'}},
    {   path: '/',                      name: 'default',    redirect: {name: 'home'}},
    {   path: '/:pathMatch(.*)*',       name: 'not-found',  component: PageNotFoundComponent,       meta: {title: 'Page not found'}},
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,

});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    // Set the page title
    let baseTitle = 'FitWise';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});

export default router;