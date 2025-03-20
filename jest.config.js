module.exports = {
    testPathIgnorePatterns: [
      "/node_modules/",
      "<rootDir>/tests/app.spec.js"
    ],
    testMatch: [
      '**/tests/**/*.spec.[jt]s?(x)',
      '**/__tests__/*.[jt]s?(x)'
    ],
    moduleFileExtensions: [
      "js",
      "json",
      "vue"
    ],
    transformIgnorePatterns: ['node_modules/(?!(nanoid)/)'],
    transform: {
      ".*\\.(vue)$": "@vue/vue3-jest",
      "^.+\\.js$": "babel-jest"
    },
    snapshotSerializers: [
      "jest-serializer-vue"
    ],
    collectCoverageFrom: [
      "src/**/*.{js,vue}"
    ],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
      customExportConditions: ["node", "node-addons"],
    setupFiles: ['jest.setup.js'],
    verbose: true
   },
   moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/tests/testMocks.js'
  }
}
