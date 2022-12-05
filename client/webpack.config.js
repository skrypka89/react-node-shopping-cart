const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const isDevelopment = process.env.NODE_ENV !== 'production';
const plugins = [
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({ template: './index.html' })
];
let mode = 'development';

if (isDevelopment) {
  // @ts-ignore
  plugins.push(new ReactRefreshWebpackPlugin());
} else {
  mode = 'production';
}

module.exports = {
  mode,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    assetModuleFilename: 'images/[hash][ext][query]',
    publicPath: '',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              presets: ['postcss-preset-env']
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            getCustomTransformers: () => ({
              // @ts-ignore
              before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
            }),
            transpileOnly: isDevelopment,
          },
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
            plugins: [isDevelopment && 'react-refresh/babel'].filter(Boolean)
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: 'file-loader',
      },
    ]
  },
  plugins,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: './dist'
  }
};
