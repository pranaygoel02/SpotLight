/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(30,70,102)',
        accent: 'rgb(247,164,39)',
        secondary: 'rgb(15,144,137)'
      },
      fontFamily: {
        poppins: ['Poppins' ,'sans-sarif'],
        grostek: ['Space Grotesk', 'sans-sarif'],
        dmsans: ['DM Sans', 'sans-sarif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}