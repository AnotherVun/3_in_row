module.exports = {
  theme: {
    extend: {
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'bounce-y': {
          '0%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-20px)' },
          '60%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0)' }
        },
        'fall-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0.8' },
          '70%': { transform: 'translateY(5%)', opacity: '1' },
          '85%': { transform: 'translateY(-2%)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'pop-in': 'pop-in 0.2s ease-out forwards',
        'fade-out': 'fade-out 0.25s ease-in forwards',
        'bounce-y': 'bounce-y 1.2s ease-in-out infinite',
        'fall-down': 'fall-down 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      }
    }
  }
}