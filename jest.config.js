module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native'
    + '|@react-native'
    + '|@react-navigation'
    + '|expo(nent)?'
    + '|@expo(nent)?/.*'
    + '|expo-modules-core'
    + '|react-native-reanimated'
    + '|react-native-gesture-handler'
    + '|@unimodules'
    + '|unimodules-.*'
    + '|@sentry'
    + '|native-base'
    + '|react-clone-referenced-element'
    + ')/)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // TÄMÄ ON KORJATTU PAIKKA moduleNameMapper -asetukselle:
  moduleNameMapper: {
    // Polun ohjaus juuritasolla oleviin components-tiedostoihin
    '^\\.\\.\\/components\\/(.*)$': '<rootDir>/components/$1',
  },

  // TÄMÄ ON KORJATTU PAIKKA modulePaths -asetukselle:
  modulePaths: [
    '<rootDir>'
  ],

  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/tests/**/*.[jt]s?(x)',
  ],
};