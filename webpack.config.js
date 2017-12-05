const path = require('path')
const webpack = require('webpack')
const MinifyPlugin = require('babel-minify-webpack-plugin')

module.exports = {
  entry: [ 'babel-polyfill', './src/main.js' ],
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]?[hash]'
        }
      },
      {
        test: require.resolve('snapsvg/dist/snap.svg.js'),
        use: 'imports-loader?this=>window,fix=>module.exports=0'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      snapsvg: 'snapsvg/dist/snap.svg.js'
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`
      }
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#cheap-source-map' // See https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68
  module.exports.plugins = module.exports.plugins.concat([
    new MinifyPlugin({}, { sourceMap: true }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
