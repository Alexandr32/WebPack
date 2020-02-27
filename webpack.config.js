const path = require('path');
/** плагины подключаются через npm для шаблонов html */
const HTMLWebpackPlugin = require('html-webpack-plugin');
/** очистка ненужных файлов */
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const WebpackCopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/** Оптимизаиция css */
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
    const loaders = [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: isDev,
          reloadAll: true
        },
      },
      'css-loader'
    ]
  
    if (extra) {
      loaders.push(extra)
    }
  
    return loaders
  }

/** Оптимизация финального bundel */
const optimization = () => {
    const config = { splitChunks: { chunks: 'all' } };

    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

/** Указывает что мы находимся в режиме разработки
 * для работы лучше использовать cross-env он сам определяет в какой ос ведется
 * разработка с создает переменную
 * см. packege.json -> scripts -> "dev"
 */
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('Is Dev', isDev);

module.exports = {
    /** говорит где лежат все исходники приложения */
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    /** Точек входа может быть несколько */
    entry: {
        main: ['@babel/polyfill', './index.js'],
        analytics: './analitytics.ts',
    },
    output: {
        /** [name] паттерн, имя с которым будет создаваься bundle
         * [contenthash] уникальное название файла
        */
        //filename: '[name].[contenthash].js',
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        /** Какие расширения искать если при импорте не указано расширение */
        extensions: ['.js', '.json', '.png', '.ts'],
        /** сокращенные пути */
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'scr')
        }
    },
    /** позволяет не обновлять страницу для просмотра изменений, хранит все в оперативке, 
     * папка с контентом заполняется после остановки */
    devServer: {
        port: 4200,
        /** Если нужно использовать только в режиме разработки */
        hot: isDev
    },
    /** оптимизация финального bundel */
    optimization: optimization(),
    /** подключается через npm */
    plugins: [
        new HTMLWebpackPlugin({
            //title: 'by Alex',
            /** шаблон по умолчанию */
            template: './index.html',
            /** минифицирование файлов */
            minify: {
                collapseWhitespace: isProd
            }
        }),
        /**  очищает лишние файлы */
        new CleanWebpackPlugin(),
        /** мнифицирует css файл */
        new MiniCssExtractPlugin({
            //filename: '[name].[contenthash].css'
            filename: filename('css')
        }),
        /** плагин для копировния данных из паки разработки в папку продакшен */
        new WebpackCopyPlugin([
            {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }
        ])
    ],
    /** позволяет работать с другими типами данных css итд */
    module: {
        rules: [
            {
                test: /\.css$/,
                /** webpack идет слева на право css-loader позволяет работать с импортами, style-loader 
                * добавляет стили в header в сам html  */
                //use: ['style-loader','css-loader']
                /** MiniCssExtractPlugin.loader - создает css в отдельном файле для коректой работы нужно
                 *  добавить сам плаин */
                //use: [MiniCssExtractPlugin.loader,'css-loader']
                //use: cssLoaders()
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            /** можно исправлять некоторые сущности без перезагрузки страницы необходима 
                             * только в режиме разработки */
                            hmr: isDev,
                            reloadAll: true
                         },
                  },
                  'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.less$/,
                /*use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            /** можно исправлять некоторые сущности без перезагрузки страницы необходима 
                             * только в режиме разработки */
                            /*hmr: isDev,
                            reloadAll: true
                         },
                  },
                  'css-loader',
                  'less-loader'
                ]*/
                use: cssLoaders('less-loader')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            },
            /** Подключение ts */
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            }
        ]
    }
}