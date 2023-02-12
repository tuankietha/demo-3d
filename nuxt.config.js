import colors from "vuetify/es5/util/colors"

export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: "%s - demo-3d",
		title: "demo-3d",
		htmlAttrs: {
			lang: "en",
		},
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: "" },
			{ name: "format-detection", content: "telephone=no" },
		],
		link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
	},

	target: 'static',
    router: {
        base: '/demo-3d/'
    },

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/vuetify
		"@nuxtjs/vuetify",
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		"@nuxtjs/axios",
		"@nuxtjs/i18n",
	],

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		// Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
		baseURL: "/",
	},

	i18n: {
		vueI18nLoader: true,
		locales: ["en", "fr", "ja", "vn"],
		defaultLocale: "en",
		vueI18n: {
			fallbackLocale: "en",
			messages: {},
		},
	},

	// Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		customVariables: ["~/assets/variables.scss"],
		treeShake: true,
		theme: {
			options: {
				customProperties: true,
			},
			dark: false,
			themes: {
				light: {
					primary: colors.blue.darken2,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3,
					darkblue: "#25254A",
					Caribbeangreen: "#06D6A0",
					Manatee: "#9391A6",
					CatalinaBlue: "#283754",
					WhiteSmoke: "#F7F5F4",
				},
			},
		},
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {},
}