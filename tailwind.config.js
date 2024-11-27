/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF2E63',
        secondary: '#FF2E63',
        background: '#1A1A1A',
        surface: '#FF2E63',
        accent: '#FF2E63',
        'accent-light': '#FF71A2',
        'accent-dark': '#590D22',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 46, 99, 0.5), 0 0 20px rgba(255, 46, 99, 0.3), 0 0 30px rgba(255, 46, 99, 0.2)',
        'glow': '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--accent-dark) 0%, var(--background) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: 1,
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px currentColor'
          },
          '50%': {
            opacity: .7,
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.8), 0 0 50px currentColor'
          },
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('daisyui')
  ],
  daisyui: {
    themes: ["dark"]
  }
}
