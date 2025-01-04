const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Parse = require('parse/node');
const session = require('express-session');

// Configuração do Parse
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;

const cultRoutes = require(path.join(__dirname, 'routes', 'cultRoutes'));
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));
const { requireAuth } = require('./controllers/authController');

const app = express();

// Configuração otimizada da sessão
const sessionConfig = {
    name: 'congregar.sid',
    secret: process.env.SESSION_SECRET || 'sua_chave_secreta_aqui',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'lax'
    },
    proxy: process.env.NODE_ENV === 'production' // Importante para o Render
};

// Ajusta configuração de cookie seguro baseado no proxy
app.set('trust proxy', 1);

app.use(session(sessionConfig));

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

// Rotas
app.use('/', authRoutes);
app.use('/', requireAuth, cultRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Parse inicializado com sucesso');
});