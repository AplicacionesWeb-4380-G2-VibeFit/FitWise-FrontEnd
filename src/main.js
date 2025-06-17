// main.js (o main entry)
import { createApp } from 'vue'
import App from '../../../../../aux folder/FitWise-FrontEnd-develop/FitWise-FrontEnd-develop/src/App.vue'
import pinia from "../../../../../aux folder/FitWise-FrontEnd-develop/FitWise-FrontEnd-develop/src/pinia.js";
import router from "../../../../../aux folder/FitWise-FrontEnd-develop/FitWise-FrontEnd-develop/src/router/index.js";
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
    Toolbar
} from "primevue";

import i18n from "../../../../../aux folder/FitWise-FrontEnd-develop/FitWise-FrontEnd-develop/src/i18n.js";

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

    .use(router)
    .directive('tooltip', Tooltip)
    .mount('#app')
