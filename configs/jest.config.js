module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,jsx,mjs,ts,tsx}'],
  setupFiles: [
    '<rootDir>/node_modules/regenerator-runtime/runtime',
    '<rootDir>/configs/polyfills.js',
    '<rootDir>/configs/jest/setup.js',
  ],
  testMatch: ['<rootDir>/src/**/*(*.)@(spec|test).{js,jsx,mjs,ts,tsx}'],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx|mjs|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/configs/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|ts|tsx|css|json)$)':
      '<rootDir>/configs/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx|mjs)$',
  ],
  moduleNameMapper: {
    '@(components|contexts|containers|globals|pages|utils)/(.*)$':
      '<rootDir>/src/$1/$2',
    '@logger': '<rootDir>/src/utils/logger.js',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs', 'ts', 'tsx'],
}
