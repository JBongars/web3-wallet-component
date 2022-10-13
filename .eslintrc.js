// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    // "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest'
    },
    // "plugins": ["@typescript-eslint"],
    plugins: ['prettier', 'eslint-plugin-tsdoc'],
    rules: {
        'prettier/prettier': ['error'],
        '@typescript-eslint/ban-types': ['warn'],
        '@typescript-eslint/no-empty-function': ['warn'],
        '@typescript-eslint/no-unused-vars': [
            'warn', // or "error"
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_'
            }
        ],
        'tsdoc/syntax': ['error']
    }
};
