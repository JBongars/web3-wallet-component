const path = require('path');
const { createImportSpecifier } = require('typescript');

module.exports = {
    stories: ['./stories/**/*.stories.mdx', './stories/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-console'
    ],
    framework: '@storybook/react',
    webpackFinal: async (config, { configType }) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.

        // Make whatever fine-grained changes you need
        config.resolve = {
            ...config.resolve,
            alias: {
                ...config.resolve.alias,
                '~': path.resolve(__dirname, '../')
            }
        };
        // Return the altered config
        return config;
    }
};
