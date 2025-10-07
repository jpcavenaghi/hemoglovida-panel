/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#f7f7f7",
                primaryRed: "#E53935",
                primaryRedDark: "#B71C1C",
                textPrimary: "#212121",
                textSecondary: "#757575",
            },
        },
    },
    plugins: [],
}