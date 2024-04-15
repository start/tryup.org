const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const Up = require('@xcvz/up')
const upSettings = require('./src/upSettings')
const path = require('path')

const documentationMarkup =
  fs.readFileSync(fromSourceDir('content/documentation.up'), 'utf-8')

const renderedUp =
  Up.parseAndRenderWithTableOfContents(documentationMarkup, upSettings)

const outputDir = path.resolve('./docs');

module.exports = {
  entry: fromSourceDir('app.js'),
  output: {
    path: outputDir,
    filename: 'bundle-[hash].js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
      },
      {
        test: /\.hbs$/,
        use: 'handlebars-loader'
      },
      {
        test: /\.up$/,
        use: 'raw-loader',
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: fromSourceDir('layout/index.hbs'),
      documentationHtml: renderedUp.documentHtml,
      tableOfContentsHtml: renderedUp.tableOfContentsHtml,
      inject: 'head'
    })
  ],
  devServer: {
    contentBase: outputDir,
    compress: true,
    port: 9000,
    open: true
  }
}


function fromSourceDir(pathAndFilename) {
  return path.resolve('src', pathAndFilename)
}
