/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#007AFF',
                secondary: '#FF9500',
                background: '#F2F2F7',
                'text-primary': '#1C1C1E',
                'text-secondary': '#636366',
                tint: '#0A4D8C',
                accent: '#5AC8FA',
                success: '#34C759',
                warning: '#FFCC00',
                error: '#FF3B30',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
