module.exports = {
    preset: 'jest-puppeteer',
    testRegex: './*\\.test\\.js$',
    testPathIgnorePatterns: ['/node_modules/'],
    testTimeout: 30000,
};