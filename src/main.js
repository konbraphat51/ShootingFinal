import { createApp } from "vue"
import { createI18n } from "vue-i18n"
import App from "./App.vue"

createApp(App)
	.use(
		createI18n({
			fallbackLocale: "en",
			messages: {
				en: {
					message: {
						hello: "hello world",
					},
				},
				ja: {
					message: {
						hello: "こんにちは、世界",
					},
				},
			},
		})
	)
	.mount("#app")
