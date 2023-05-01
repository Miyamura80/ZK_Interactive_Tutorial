/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  theme: {
    extend: {
      minWidth: {
        'button': '180px',
      },
      minHeight: {
        'button': '42px',
      },
      backgroundColor: {
        'main-bg': '#814fd1',
        'gradient-bg-color-1': 'rgb(222, 203, 226)',
        'gradient-bg-color-2': 'rgb(79, 131, 209)',
      },
      borderColor: {
        'ring': '#6f00ff',
      },
      textColor: {
        'main-fg': '#313133',
        'hover-fg': 'rgb(38, 11, 53)',
      },
      boxShadow: {
        'shadow-color': '12px 2px 24px rgba(79, 99, 209, 0.64)',
      },
    },
  },
  variants: {},
  plugins: [],
}
