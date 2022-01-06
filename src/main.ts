import './style/index.scss';
import { createApp, Directive } from 'vue';
import App from './App.vue';
import router from './router';
import { vBodyOverflow, vClickOutside } from './directive';

createApp(App)
  .directive('bodyoverflow', vBodyOverflow as Directive)
  .directive('clickoutside', vClickOutside as Directive)
  .use(router)
  .mount('#app');
