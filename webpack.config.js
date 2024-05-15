const path = require('path');
module.exports = (env) => {
    const isProduction = env.production; 
    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'public/build'),
            filename: 'bundle.js'
        },
        optimization: isProduction ? {
            minimize: true
        } : {},
    };
};
