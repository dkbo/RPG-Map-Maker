const path = require('path');
const loaders = require('./webpack.loaders');
const plugins = require('./webpack.productionPlugins');

const enterFile = 'src/index.jsx';
const outerPath = 'public';
module.exports = {
	entry: {
		// polyfill: ['babel-polyfill'],
		react: ['react', 'react-dom', 'react-redux'],
		app: path.join(__dirname, enterFile),
	},
	output: {
		path: path.join(__dirname, outerPath),
		// filename: './js/[name]_[chunkhash].js'
		filename: './js/[name].js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.sass']
	},
	module: {
		loaders
	},
	plugins: plugins
};
