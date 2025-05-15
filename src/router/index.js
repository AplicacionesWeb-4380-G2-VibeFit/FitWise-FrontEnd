import {createRouter, createWebHistory} from "vue-router";
const PurchasedPlanDetailComponent = () => import("../selling/pages/purchased-plan-details.component.vue");
const PurchasedPlanListComponent = () => import("../selling/components/purchased-plan-list.component.vue");
const PurchasedPlanManagementComponent = () => import("../selling/pages/purchased-plan-management.component.vue");
const HomeComponent = () => import('../public/pages/home.component.vue');
const AboutComponent = () => import('../public/pages/about.component.vue');
const PageNotFoundComponent = () => import('../public/pages/page-not-found.component.vue');

const SellingViewComponent = () => import('../selling/pages/selling-view.vue')

const routes = [
    { path: '/home', name: 'home', component: HomeComponent, meta: { title: 'Home' } },

    { path: '/selling', name: 'selling', component: SellingViewComponent, meta: { title: 'Selling' } },
    { path: '/selling/create', name: 'selling create', component: SellingViewComponent, meta: { title: 'Selling Create' } },
    { path: '/selling/:id', name: 'selling details', component: SellingViewComponent, meta: { title: 'Selling Details' } },
    { path: '/selling/:id/edit', name: 'selling edit', component: SellingViewComponent, meta: { title: 'Selling Edit' } },

    { path: '/about', name: 'about', component: AboutComponent, meta: { title: 'About us' } },
    { path: '/', name: 'default', redirect: { name: 'home' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundComponent, meta: { title: 'Page not found' } },
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