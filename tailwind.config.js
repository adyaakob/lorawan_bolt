/** @type {import('tailwindcss').Config} */
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{html,js}"
    ],
    darkMode: 'class',
    theme: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif'],
        'display': ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif']
      },
      extend: {
        colors: {
          primary: {
            DEFAULT: '#2c5282',
            50: '#f0f5ff',
            100: '#e6f2ff',
            200: '#c4e0ff',
            300: '#a2cdff',
            400: '#5ea8ff',
            500: '#2c5282',
            600: '#274b75',
            700: '#1e3a5f',
            800: '#162b47',
            900: '#0d1b30'
          },
          secondary: {
            DEFAULT: '#3182ce',
            50: '#f0f9ff',
            100: '#e6f2ff',
            200: '#c4e0ff',
            300: '#a2cdff',
            400: '#5ea8ff',
            500: '#3182ce',
            600: '#2c75ba',
            700: '#235a91',
            800: '#1a4269',
            900: '#112b40'
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827'
          }
        },
        boxShadow: {
          'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        },
        borderRadius: {
          'xl': '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem'
        },
        transitionProperty: {
          'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
          'shadow': 'box-shadow'
        },
        transitionDuration: {
          '250': '250ms',
          '350': '350ms'
        }
      }
    },
    plugins: []
  }
