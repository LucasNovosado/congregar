const express = require('express');
const bodyParser = require('body-parser');
const cultRoutes = require('./routes/cultRoutes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));  // Diretório público para arquivos estáticos (CSS, JS)

app.set('view engine', 'ejs');  // Configuração do motor de templates (EJS)

app.use('/', cultRoutes);  // Definindo rotas

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
