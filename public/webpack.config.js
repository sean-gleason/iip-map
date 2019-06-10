const dev = process.env.NODE_ENV !== 'production';
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

const entries = {};
let files = glob.sync('./src/js/*.js');
files.forEach(function (file) {
  const basename = path.basename(file).replace('.js', '');
  entries['/dist/js/' + basename] = file;
});

files = glob.sync('./src/sass/*.scss');
files.forEach(function (file) {
  const basename = path.basename(file).replace('.scss', '');
  entries['/dist/css/' + basename] = file;
});

const browserslist = [
  "> 1%",
  "last 2 versions"
];

module.exports = {
  context: __dirname,
  entry: entries,
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js'
  },
  mode: dev ? 'development' : 'production',
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer( browserslist )],
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ // define where to save the file
      filename: '[name].css',
      allChunks: true
    }),
    new FixStyleOnlyEntriesPlugin( { silent: true } ),
    new webpack.LoaderOptionsPlugin({
      options: {
        browserslist: browserslist
      }
    })
  ]
};