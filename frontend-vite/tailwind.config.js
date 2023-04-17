/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      minWidth: (theme) => ({
        ...theme('spacing'),
      }),
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        garden: {
          ...require('daisyui/src/colors/themes')['[data-theme=garden]'],
          // primary: 'blue',
          // 'primary-focus': 'mediumblue',
        },
      },
    ],
  },
};
