module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-stub'
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testEnvironmentOptions: {
        html: '<html lang="en"></html>',
    },
};
