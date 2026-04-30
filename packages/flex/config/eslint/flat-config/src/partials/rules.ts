const rulesBase = {
  'arrow-spacing': 2,
  'block-spacing': 1,
  'brace-style': 1,
  camelcase: ['warn', { properties: 'always', allow: [
    // Stripe API
    'payment_method_types', 'line_items', 'price_data', 'product_data', 'unit_amount', 'success_url', 'cancel_url', 'customer_email',
    // Google Calendar API
    'calendar_v3', 'access_token', 'refresh_token', 'access_type',
    // Google Routes API
    'place_ID', 'formatted_address', 'administrative_area_level_1', 'administrative_area_level_2', 'postal_code', 'street_number',
    // Standard zod schema validation
    'required_error', 'invalid_type_error',
    // Standard amplify auth attributes
    'given_name', 'family_name', 'phone_number', 'confirm_password',
    // csv-parse
    'skip_empty_lines',
  ]}],
  'comma-dangle': [0, 'only-multiline'],
  'comma-spacing': 1,
  'comma-style': ['warn', 'last'],
  'default-case': 'warn',
  'dot-location': ['warn', 'property'],
  'dot-notation': 0,
  'eol-last': 2,
  'func-call-spacing': 2,
  indent: ['warn', 2, { SwitchCase: 1, VariableDeclarator: 1, flatTernaryExpressions: false, offsetTernaryExpressions: false }],
  'jsx-quotes': ['warn', 'prefer-single'],
  'key-spacing': 1,
  'keyword-spacing': 1,
  'lines-between-class-members': 1,
  'max-len': ['warn', { code: 150 }],
  'new-cap': 0,
  'no-alert': 1,
  'no-async-promise-executor': 1,
  'no-case-declarations': 1,
  'no-confusing-arrow': 1,
  'no-console': 1,
  'no-const-assign': 2,
  'no-duplicate-imports': 1,
  'no-eval': 2,
  'no-extend-native': 2,
  'no-prototype-builtins': 1,
  'no-misleading-character-class': 0,
  'no-multiple-empty-lines': [1, { max: 1 }],
  'no-trailing-spaces': 1,
  'no-unneeded-ternary': 1,
  // https://typescript-eslint.io/rules/no-unused-expressions/ Note: you must disable the base rule as it can report incorrect errors
  'no-unused-expressions': 0,
  'no-useless-catch': 1,
  'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
  'no-useless-constructor': 1,
  'no-var': 1,
  'object-curly-spacing': [1, 'always'],
  'object-curly-newline': 1,
  'prefer-const': 1,
  'prefer-destructuring': ['warn', { array: false, object: true }],
  'prefer-rest-params': 1,
  'prefer-spread': 1,
  'prefer-template': 1,
  quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
  'quote-props': ['warn', 'as-needed'],
  'rest-spread-spacing': 2,
  'spaced-comment': ['warn', 'always'],
  'space-before-function-paren': 'off',
  'switch-colon-spacing': 1,

  'jsx-a11y/click-events-have-key-events': 'off',
  'jsx-a11y/no-static-element-interactions': 'off',
}

const rulesReact = {
  'react/display-name': 2,
  'react/jsx-key': 2,
  'react/jsx-no-duplicate-props': 2,
  'react/jsx-no-useless-fragment': 1,
  'react/jsx-no-target-blank': 2,
  'react-hooks/rules-of-hooks': 'warn',
  'react-hooks/exhaustive-deps': 'warn',
  'react/prop-types': 0,
}

const rulesTS = {
  '@typescript-eslint/no-explicit-any': 1,
  '@typescript-eslint/no-unused-expressions': ['error', { 'allowShortCircuit': true, 'allowTernary': true }],
  '@typescript-eslint/no-unused-vars': ['error', {
    args: 'all',
    argsIgnorePattern: '^_',
    caughtErrors: 'all',
    caughtErrorsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    ignoreRestSiblings: true,
  }],
}

export { rulesBase, rulesReact, rulesTS }
