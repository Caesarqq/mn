module.exports = {
  presets: [
    'module:metro-react-native-babel-preset'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    ['module-resolver', {
      root: ['./'],
      alias: {
        '@screens': './screens',
        '@components': './components',
      }
    }]
  ]
};
