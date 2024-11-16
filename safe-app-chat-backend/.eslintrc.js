module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // Enforce camelCase naming convention
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variableLike', // Includes variables, functions, and parameters
        format: ['camelCase'],
      },
      {
        selector: 'property', // For object properties
        format: ['camelCase', 'PascalCase'], // Allow PascalCase for certain properties
        leadingUnderscore: 'allow', // Allow _privateProperty
      },
      {
        selector: 'typeLike', // For class, interface, enum, and type alias names
        format: ['PascalCase'],
      },
    ],
  },
};
