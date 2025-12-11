/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  // relative: true,
  content: [
    path.join(__dirname, '../../../apps/gateway/src/**/*.{js,ts,jsx,tsx}'),
  ],
  // theme: {
  //   extend: {},
  // },
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }

        'md': '768px',
        // => @media (min-width: 768px) { ... }

        // mf = mobile first
        'mf': '900px',
        // => @media (min-width: 900px) { ... }

        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }

        '3xl': '1800px',
      },
    },
  },
  plugins: [],
}
