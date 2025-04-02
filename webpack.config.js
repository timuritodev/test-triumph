const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/test-triumph/', // соответствует homepage
	},
	mode: 'production',
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
				// Ресурсы TinyMCE будут доступны по адресу /test-triumph/tinymce/...
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
