const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@resources': path.resolve(__dirname, 'src/resources/'),
      '@scenes': path.resolve(__dirname, 'src/scenes/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@components(.*)$': '<rootDir>/src/components$1',
        '^@resources(.*)$': '<rootDir>/src/resources$1',
        '^@scenes(.*)$': '<rootDir>/src/scenes$1',
        '^@utils(.*)$': '<rootDir>/src/utils$1',
      },
    },
  },
};
