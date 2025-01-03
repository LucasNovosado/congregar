const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Parse = require('parse/node');

// Configuração do Parse
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;

const cultRoutes = require(path.join(__dirname, 'routes', 'cultRoutes'));

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/', cultRoutes);
app.use('/dist', express.static('dist'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Parse inicializado com sucesso');
});