/**
 * name: 0xgen Widget
 * author: tony@0xgen.io
 * date: 2022/5/5
 * desc: 
 */
import genWidget from "./index.vue";
import './assets/iconfont.css';
import './styles/index.scss';

const install = function (Vue, options) {
    Vue.component("genWidget", genWidget);
};

export { install, genWidget };
export default { install, genWidget };
