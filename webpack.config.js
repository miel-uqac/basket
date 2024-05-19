const path = require('path');
module.exports = (env) => {
    const isProduction = env.production; 
    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
        entry: './javascript/index.js',
        watch:isProduction ? false : true,
        watchOptions: {
            aggregateTimeout: 200,
            ignored: ['**/*', '!**/public/**', '**/node_modules'],
          },
        output: {
            path: path.resolve(__dirname, 'public/build'),
            filename: 'bundle.js'
        },
        optimization: isProduction ? {
            minimize: true
        } : {},
    };
};
