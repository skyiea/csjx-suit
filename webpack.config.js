var output_options = {
    chunks      : false,
    chunkModules: false,
    colors      : true,
    timings     : true
};
// Custom CJSX loader (cloned from coffee-jsx-loader) used to provide features released in coffee-react 4.0.0
// (original loader uses v3.2). Could be removed when original loader will use updated version of coffee-react
var cjsx_loader = __dirname + '/loaders/cjsx-loader';

module.exports = {
    entry: {
        app: __dirname + '/app/app.cjsx'
    },
    output: {
        path        : 'public/',
        publicPath  : 'public/',
        filename    : '[name].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.cjsx$/,
                exclude: /node_modules/,
                loader: 'react-hot!' + cjsx_loader
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
    },
    resolve: {
        extensions: [ '', '.js', '.cjsx' ]
    },
    stats: output_options,
    devServer: {
        proxy: {
            '*': 'http://localhost:1234/'
        },
        stats: output_options
    }
};