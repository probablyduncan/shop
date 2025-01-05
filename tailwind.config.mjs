/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'selector',
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Inter, Inter-Fallback',],// { fontFeatureSettings: '"cv11", "ss01"' }],
				'serif': ['Junicode, Junicode-Fallback'],
				'mono': ['PT Mono, Consolas, monospace'],
			}
		},
		colors: {
			...colors,
			'c': {
				DEFAULT: "#00ffff",
			},
			'm': {
				DEFAULT: "#ff00ff",
			},
			'y': {
				DEFAULT: "#ffff00",
			},
			'k': {
				DEFAULT: "#000000",
			},
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
