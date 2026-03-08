
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				saffron: 'hsl(var(--saffron))',
				vermillion: 'hsl(var(--vermillion))',
				gold: 'hsl(var(--gold))',
				lotus: 'hsl(var(--lotus))',
				sandalwood: 'hsl(var(--sandalwood))',
			},
			fontFamily: {
				sans: ['DM Sans', 'system-ui', 'sans-serif'],
				display: ['Playfair Display', 'serif'],
			},
			borderRadius: {
				lg: '1rem',
				md: 'calc(1rem - 2px)',
				sm: 'calc(1rem - 4px)',
				'2xl': '1.5rem',
				'3xl': '2rem',
			},
			animation: {
				'fade-in': 'fade-in 0.6s ease-out forwards',
				'slide-up': 'slide-up 0.6s ease-out forwards',
				'scale-in': 'scale-in 0.4s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
				'ken-burns': 'ken-burns 20s ease-out infinite alternate',
				'liquid-float': 'liquid-float 6s ease-in-out infinite',
				'liquid-morph': 'liquid-morph 8s ease-in-out infinite',
				'sacred-pulse': 'sacred-pulse 3s ease-in-out infinite',
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.92)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				'ken-burns': {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.08)' },
				},
				'liquid-float': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'33%': { transform: 'translateY(-8px) rotate(1deg)' },
					'66%': { transform: 'translateY(4px) rotate(-0.5deg)' },
				},
				'liquid-morph': {
					'0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
					'50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
				},
				'sacred-pulse': {
					'0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' },
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
