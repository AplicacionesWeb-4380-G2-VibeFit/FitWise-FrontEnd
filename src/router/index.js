import {createRouter, createWebHistory} from "vue-router";


const HomeComponent = () => import('../public/pages/home.component.vue');
const AboutComponent = () => import('../public/pages/about.component.vue');
const PageNotFoundComponent = () => import('../public/pages/page-not-found.component.vue');
const HealthPlanManagementComponent = () => import('../publishing/pages/health-plan-management.component.vue');
const HealthPlanDetailsComponent = () => import('../publishing/pages/health-plan-details.component.vue');
const ReviewManagementComponent = () => import('../reviewing/pages/review-management.component.vue');

const routes = [
    {   path: '/home',                  name: 'home',       component: HomeComponent,                   meta: {title: 'Home'}},
    {   path: '/about',                 name: 'about',      component: AboutComponent,                  meta: {title: 'About us'}},
    {   path: '/publishing',            name: 'publishing', component: HealthPlanManagementComponent,   meta: {title: 'Health Plans'}},
    {   path: '/publishing/details/:id',    name: 'details',    component: HealthPlanDetailsComponent,      meta: {title: 'Health Plans Details'}},
    {   path: '/',                      name: 'default',    redirect: {name: 'home'}},
    {   path: '/:pathMatch(.*)*',       name: 'not-found',  component: PageNotFoundComponent,           meta: {title: 'Page not found'}},
    {   path: '/reviewing',            name: 'reviewing', component: ReviewManagementComponent,   meta: {title: 'Reviews'}},

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