import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/display.css";
import scui from "./scui";
import xtui from "./xtui";
import i18n from "./locales";
import router from "./router";
import store from "./store";
import App from "./App.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import preventReClick from "./utils/preventReClick";
import Print from "./utils/print2";
import Xlsx from "./utils/xlsx";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus);
app.use(i18n);
app.use(scui);
app.use(xtui);
app.use(preventReClick);
app.use(Print);
app.use(Xlsx);

//挂载app
app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}

const debounce = (fn, delay) => {
	let timer = null;

	return function () {
		let context = this;

		let args = arguments;

		clearTimeout(timer);

		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
};

const _ResizeObserver = window.ResizeObserver;

window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
	constructor(callback) {
		callback = debounce(callback, 16);
		super(callback);
	}
};
