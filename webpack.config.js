const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  optimization: {
    minimize: false
  },
  mode: 'development',
  entry: slsw.lib.entries,
  externals: [],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  devtool: 'nosources-source-map',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
};
