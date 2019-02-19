module.exports = {
  root: true,
  extends: ['airbnb', 'prettier'],
  plugins: ['jest', 'graphql', 'import'],
  env: {
    node: true,
    jest: true,
    mocha: true
  },
  rules: {
    'graphql/template-strings': [
        'error',
        {
            env: 'apollo'
        }
    ],
    "class-methods-use-this": [
      'error', {
        exceptMethods: ['baseURL', 'willSendRequest']
      }
    ]
  },
  parserOptions: {
    ecmaVersion: 2019
  }
};
