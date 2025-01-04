const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Parse = require('parse/node');
const cookieSession = require('cookie-session');

// Configuração do Parse
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;

const cultRoutes = require(path.join(__dirname, 'routes', 'cultRoutes'));
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));
const { requireAuth } = require('./controllers/authController');

const app = express();

// Configuração da sessão com cookie-session
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'sua_chave_secreta_aqui'],
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração dos arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'public', 'dist')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para disponibilizar o usuário para todas as views
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Se estiver em produção, confie no proxy
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Rotas
app.use('/', authRoutes);
app.use('/', requireAuth, cultRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Parse inicializado com sucesso');
});