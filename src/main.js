// main.js (o main entry)
import { createApp } from 'vue'

import {useSessionStore} from "@/shared/stores/sessionStore.js";

import App from './App.vue'
import pinia from "@/pinia.js";
import router from "./router/index.js";
import Tooltip from 'primevue/tooltip';

import { PrimeVue } from "@primevue/core";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Material from '@primeuix/themes/material';

import {
    Accordion, AccordionContent, AccordionHeader, AccordionPanel,
    Button,
    Card,
    Checkbox, Chip,
    Column,
    ConfirmationService,
    ConfirmDialog,
    DataTable,
    DataView,
    Dialog,
    DialogService,
    Divider,
    Drawer,
    FileUpload,
    FloatLabel,
    IconField, Image,
    InputIcon,
    InputNumber,
    InputText,
    Menu, Panel,
    Rating,
    Row,
    Select,
    SelectButton,
    Tag,
    Textarea, Timeline,
    Toast,
    ToastService,
    Toolbar,
    Fluid,
    DatePicker,
    RadioButton,
    Message,
    Paginator, ProgressSpinner, IftaLabel, TabView, TabPanel
} from "primevue";

import i18n from "@/i18n.js";
import Dropdown from "primevue/dropdown";

const app = createApp(App);

app
    .use(i18n)
    .use(pinia)
    .use(PrimeVue, { theme: { preset: Material }, ripple: true })
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)

    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-checkbox', Checkbox)
    .component('pv-data-table', DataTable)
    .component('pv-data-view', DataView)
    .component('pv-dialog', Dialog)
    .component('pv-select', Select)
    .component('pv-select-button', SelectButton)
    .component('pv-file-upload', FileUpload)
    .component('pv-float-label', FloatLabel)
    .component('pv-icon-field', IconField)
    .component('pv-image', Image)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-text', InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-menu', Menu)
    .component('pv-panel', Panel)
    .component('pv-rating', Rating)
    .component('pv-row', Row)
    .component('pv-drawer', Drawer)
    .component('pv-tag', Tag)
    .component('pv-textarea', Textarea)
    .component('pv-timeline', Timeline)
    .component('pv-toast', Toast)
    .component('pv-toolbar', Toolbar)
    .component('pv-chip', Chip)
    .component('pv-accordion', Accordion)
    .component('pv-accordion-panel', AccordionPanel)
    .component('pv-accordion-header', AccordionHeader)
    .component('pv-accordion-content', AccordionContent)
    .component('pv-divider', Divider)
    .component('pv-fluid', Fluid)
    .component('pv-date-picker', DatePicker)
    .component('pv-radio-button', RadioButton)
    .component('pv-message', Message)
    .component('pv-paginator', Paginator)

    .component('pv-drop-down', Dropdown)
    .component('pv-progress-spinner', ProgressSpinner)
    .component('pv-ifta-label', IftaLabel)

    .component('pv-tab-view', TabView)
    .component('pv-tab-panel', TabPanel)



    .use(router)
    .directive('tooltip', Tooltip)
    .mount('#app')

const sessionStore = useSessionStore();
sessionStore.initializeSession();