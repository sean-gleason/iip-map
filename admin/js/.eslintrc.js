module.exports = {
  extends: ['airbnb'],
  rules: {
    'array-bracket-newline': ['warn', { multiline: true, minItems: 3 }],
    'comma-dangle': ['warn', 'never'],
    'consistent-return': 0,
    'import/first': 0,
    'import/no-extraneous-dependencies': [
      'warn',
      {
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true
      }
    ],
    'import/no-unresolved': [2, { ignore: ['.css$'] }],
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton']
      }
    ],
    'max-len': [1, 120, 2, { ignoreComments: true }],
    'no-console': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': ['warn', { vars: 'local', args: 'none' }],
    'react/forbid-prop-types': 0,
    'react/jsx-curly-spacing': [2, { when: 'always', children: true }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/require-default-props': 0,
    'space-in-parens': ['warn', 'always']
  },
  env: {
    browser: true,
    jest: true,
    es6: true,
    node: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  overrides: [
    {
      files: '*.test.js',
      rules: {
        'no-unused-expressions': 'off',
        'import/no-unresolved': 'off'
      }
    }
  ]
};
