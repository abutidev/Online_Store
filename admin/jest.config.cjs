module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], 
  moduleNameMapper: {
      '\\.css$': '<rootDir>/__mocks__/styleMock.js',
      '\\.svg$': '<rootDir>/__mocks__/fileMock.js'
   
  },
};

