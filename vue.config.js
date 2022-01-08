module.exports = {
    publicPath: '.',
    devServer: {
        proxy: {
            '/proxy': {
                target: 'http://192.168.0.10:7788/',
                changeOrigin: true
            }
        }
    }
}