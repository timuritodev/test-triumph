const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '',
	},
	mode: 'development',
	devServer: {
		static: {
			directory: path.join(__dirname, '/'),
		},
		compress: true,
		port: 9000,
		open: true,
		hot: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: { presets: ['@babel/preset-env'] },
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './index.html' }),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'node_modules/tinymce/skins', to: 'tinymce/skins' },
				{ from: 'node_modules/tinymce/models', to: 'tinymce/models' },
			],
		}),
	],
	resolve: {
		alias: {
			tinymce: path.resolve(__dirname, 'node_modules/tinymce'),
		},
	},
};
