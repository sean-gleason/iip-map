const webpack = require( 'webpack' );
const { BundleAnalyzerPlugin } = require( 'webpack-bundle-analyzer' );
const paths = require( './paths' );

module.exports = {
  entry: {
    map: './src/draw-map.js',
    table: './src/table.js',
    tableToggle: './src/table-button.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '*', '.js', '.jsx'
    ]
  },
  output: {
    path: paths.appDist,
    publicPath: '/',
    filename: '[name].js'
  },
  stats: {
    all: false,
    modules: true,
    maxModules: 15,
    errors: true,
    errorDetails: true,
    warnings: true
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin( {
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsFilename: './stats.json'
    } )
  ],
  devServer: {
    contentBase: paths.appPublic,
    hot: true
  }
};
