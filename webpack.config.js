const path = require('path');

module.exports = {
  entry: './src/js/index.js',  // Alvo para o código JS do front-end (ex: 'filter.js' ou 'index.js')
  output: {
    filename: 'bundle.js',  // Nome do arquivo JavaScript empacotado
    path: path.resolve(__dirname, 'public/js'),  // Pasta para onde o bundle será enviado
  },
  mode: 'production',  // Modo de produção
  resolve: {
    fallback: {
      "fs": false,  // Para evitar erro de módulos do Node.js não encontrados
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "url": require.resolve("url/"),
      "buffer": require.resolve("buffer/"),
    }
  }
};
