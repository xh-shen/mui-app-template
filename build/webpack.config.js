/*
 * @Author: shen
 * @Date: 2021-01-10 11:20:18
 * @LastEditors: shen
 * @LastEditTime: 2021-01-19 12:15:25
 * @Description:
 */
'use strict';

const os = require('os')
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');//多进程打包
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const postcssNormalize = require('postcss-normalize');

const paths = require('../config/paths');

const getClientEnvironment = require('../config/env');

const addEntries = require('./addEntries');
const addAssets = require('./addAssets');

const appPackageJson = require(paths.appPackageJson);

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '1000');

const cssRegex = /\.css$/;
const sassRegex = /\.scss$/;

module.exports = async function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  const env = getClientEnvironment(paths.publicPath.slice(0, -1));
  const { entries, htmlPlugin} = await addEntries(env);
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      {
        loader: MiniCssExtractPlugin.loader,
        options: paths.publicPath.startsWith('.') ? { publicPath: '../../' } : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              "postcss-flexbugs-fixes",
              [
                "postcss-preset-env",
                {
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                },
              ],
              postcssNormalize(),
            ],
          },
          sourceMap: isEnvDevelopment,
        },
      }
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      });
    }
    return loaders;
  };
  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    bail: isEnvProduction,
    devtool: isEnvDevelopment ? 'cheap-module-source-map' : false,
    entry: entries,
    output: {
      path: paths.appBuild,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : isEnvDevelopment && 'static/js/[name].js',
      chunkFilename: isEnvProduction ? 'static/js/[name].[contenthash:8].chunk.js' : isEnvDevelopment && 'static/js/[name].chunk.js',
      publicPath: paths.publicPath,
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : isEnvDevelopment && ((info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      // globalObject: 'this',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      },
    },
    resolve: {
      modules: ['node_modules', paths.appNodeModules],
      extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
      alias: {
        '@': paths.appSrc,
        '@img': paths.appSrc + '/assets/images',
      },
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            {
              test: /\.(html)$/,
              use: {
                loader: 'html-loader',
                options: {
                  attributes: {
                    root: paths.publicPath,
                  },
                }
              },
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                outputPath: 'static/img',
                name: isEnvProduction ? '[name].[hash:8].[ext]' : '[name].[ext]',
              },
            },
            {
              test: /\.js$/,
              include: paths.appSrc,
              use: 'happypack/loader?id=babel',
            },
            {
              test: cssRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvDevelopment,
              }),
              sideEffects: true,
            },
            {
              test: sassRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  sourceMap: isEnvDevelopment,
                },
                'sass-loader'
              ),
              sideEffects: true,
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                outputPath: 'static/media',
                name: isEnvProduction ? '[name].[hash:8].[ext]' : '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      isEnvProduction && new CleanWebpackPlugin(),
      ...htmlPlugin,
      ...addAssets(),
      new MiniCssExtractPlugin({
        filename: isEnvProduction ? 'static/css/[name].[contenthash:8].css' : 'static/css/[name].css',
        chunkFilename: isEnvProduction ? 'static/css/[name].[contenthash:8].chunk.css' : 'static/css/[name].chunk.css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: paths.appStatic,
            to: paths.appBuild + '/static',
            filter: async (resourcePath) => {
              const extname = path.extname(resourcePath);
              if(extname === '.ico') {
                return false
              }
              return true;
            },
          },
          {
            from: paths.appManifestJson,
            to: paths.appBuildManifestJson,
          },
        ],
      }),
      new HappyPack({
        id: 'babel',
        loaders: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              compact: isEnvProduction,
            }
          }
        ],
        threadPool:happyThreadPool
      }),
      isEnvDevelopment && new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicPath,
      }),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      new webpack.DefinePlugin(env.stringified),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ESLintPlugin({
        // Plugin options
        extensions: ['js'],
        formatter: require.resolve('eslint-friendly-formatter'),
        eslintPath: require.resolve('eslint'),
        context: paths.appSrc,
        cache: true,
        cacheLocation: path.resolve(
          paths.appNodeModules,
          '.cache/.eslintcache'
        ),
        // ESLint class options
        cwd: paths.appPath,
        resolvePluginsRelativeTo: __dirname,
      }),
    ].filter(Boolean),
  };
};
