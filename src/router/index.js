// router/index.js
import { createRouter, createWebHistory } from "vue-router";

const PurchasedPlanDetailComponent = () => import("../selling/pages/purchased-plan-details.component.vue");
const PurchasedPlanListComponent = () => import("../selling/components/purchased-plan-list.component.vue");
const PurchasedPlanManagementComponent = () => import("../selling/pages/purchased-plan-management.component.vue");
const SellingViewComponent = () => import('../selling/pages/selling-view.vue');

const HomeComponent = () => import('../public/pages/home.component.vue');
const AboutComponent = () => import('../public/pages/about.component.vue');
const PageNotFoundComponent = () => import('../public/pages/page-not-found.component.vue');
const HealthPlanManagementComponent = () => import('../publishing/pages/health-plan-management.component.vue');
const HealthPlanDetailsComponent = () => import('../publishing/pages/health-plan-details.component.vue');
const ReviewManagementComponent = () => import('../reviewing/pages/review-management.component.vue');
// PRESENTING routes
const ProfileAndCertificateManagementComponent = () => import('../presenting/pages/profile-and-certificate-management.component.vue');
const FollowersManagementComponent = () => import('../presenting/pages/followers-management.component.vue');

const ScheduleManagementComponent = () => import('../organizing/pages/schedule-management.component.vue');
const ReviewCommentsPage = () => import('../reviewing/pages/review-comments-page.component.vue');
const routes = [
    { path: '/home', name: 'home', component: HomeComponent, meta: { title: 'Home' } },

    // Selling routes using unified view
    { path: '/selling', name: 'selling', component: SellingViewComponent, meta: { title: 'Selling' } },
    { path: '/selling/create', name: 'selling-create', component: SellingViewComponent, meta: { title: 'Selling Create' } },
    { path: '/selling/:id', name: 'selling-details', component: SellingViewComponent, meta: { title: 'Selling Details' } },
    { path: '/selling/:id/edit', name: 'selling-edit', component: SellingViewComponent, meta: { title: 'Selling Edit' } },
    { path: '/selling/payments/pending',  name: 'payment-pending', component: () => import('/src/selling/pages/PendingPayments.vue') },

    {
        path: '/selling/payments',
        name: 'payment-history',
        component: () => import('/src/selling/components/payment-history.vue'),
        meta: { title: 'Historial de pagos' }
    },

    //PRESENTING routes
    { path: '/presenting/profile', name: 'profile-view-and-edit', component: ProfileAndCertificateManagementComponent, meta: { title: 'Profile' } },
    { path: '/presenting/followers', name: 'followers-management', component: FollowersManagementComponent, meta: { title: 'Followers' }},


    { path: '/organizing', name: 'organizing', component: ScheduleManagementComponent, meta: { title: 'Schedule' } },

    { path: '/about', name: 'about', component: AboutComponent, meta: { title: 'About us' } },
    { path: '/publishing', name: 'publishing', component: HealthPlanManagementComponent, meta: { title: 'Health Plans' } },
    { path: '/publishing/details/:id', name: 'details', component: HealthPlanDetailsComponent, meta: { title: 'Health Plan Details' } },
    { path: '/reviewing', name: 'reviewing', component: ReviewManagementComponent, meta: { title: 'Reviews' } },

    { path: '/', name: 'default', redirect: { name: 'home' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundComponent, meta: { title: 'Page not found' } },
    { path: '/reviewing/comments', name: 'review-comments', component: ReviewCommentsPage, meta: { title: 'Review Comments' } },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'FitWise';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});

export default router;
