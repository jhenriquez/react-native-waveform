// jest.config.js
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
    // 1) Start with ts-jest’s defaults, so .ts/.tsx files compile via TypeScript.
    ...tsjPreset,

    // 2) Let Jest also apply the React Native preset (module mappings, mocks, etc.)
    preset: 'react-native',

    // 3) Whitelist React Native’s own packages so they get transpiled
    transformIgnorePatterns: [],

    // 4) Split JS vs TS transforms so you don’t accidentally apply both babel-jest and ts-jest
    transform: {
        // • All .js/.jsx files → babel-jest (which reads babel.config.js)
        '^.+\\.(js|jsx)$': [
            'babel-jest',
            {
                presets: [
                    '@babel/preset-env'
                ],

            }
        ],

        // • All .ts/.tsx files → ts-jest, and allow ts-jest to delegate JSX → Babel using babel.config.js
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.jest.json',
                babelConfig: true
            },
        ],
    },

    // 5) These extensions are “importable” during tests
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    // 6) After the environment is set up, load jest-native’s custom matchers
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

    // 7) Tell Jest where your test files live
    roots: ['<rootDir>/specs'],
    testMatch: ['**/*.spec.tsx', '**/*.test.tsx'],

    // 8) (Optional) If you ever need to ignore certain paths explicitly:
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
