import { createApp } from "vue"
import { createI18n } from "vue-i18n"
import App from "./App.vue"

createApp(App)
	.use(
		createI18n({
			fallbackLocale: "ja",
		})
	)
	.mount("#app")
