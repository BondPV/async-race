import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

interface IDev {
  [index: string]: string;
}

const devServer = (isDev: string) => !isDev ? {} : {
  devServer: {
    open: true,
    port: 'auto',
    watchFiles: path.join(__dirname, 'src'),
  },
};

module.exports = ({ development }:IDev) => ({
  mode: development ? 'development' : 'production',
  devtool: development ? 'inline-source-map' : false,
  entry: path.resolve(__dirname, './src/index.ts'),
  context: path.resolve(__dirname, 'src'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: '[file]',
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [{loader: MiniCssExtractPlugin.loader, options: { publicPath: './' }}, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [{loader: MiniCssExtractPlugin.loader, options: { publicPath: './' }}, 'css-loader', 'sass-loader']
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ 
      filename: 'style.css' 
    }),
    new HtmlWebpackPlugin({ 
      template: './index.html' 
    }),
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.resolve(__dirname, './src'),
          globOptions: {
            ignore: [
              '**/*.js',
              '**/*.ts',
              '**/*.scss',
              '**/*.html',
              '**/*.json',
            ],
          },
          noErrorOnMissing: true,
          force: true,
        }
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
  },
  ...devServer(development)
});
