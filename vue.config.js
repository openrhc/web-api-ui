module.exports = {
    publicPath: '.',
    devServer: {
        proxy: {
            '/xray': {
                target: 'http://192.168.0.10:7788/',
                changeOrigin: true
            }
        }
    }
}