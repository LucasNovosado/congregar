const Parse = require('parse/node');

exports.showLoginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Tenta fazer login no Parse
        const user = await Parse.User.logIn(username, password);
        
        // Se o login for bem-sucedido, salva a sessão
        req.session.user = {
            id: user.id,
            username: user.get('username'),
            email: user.get('email')
        };
        
        // Redireciona para a página principal
        res.redirect('/');
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('login', { 
            error: 'Usuário ou senha incorretos'
        });
    }
};

exports.logout = async (req, res) => {
    try {
        await Parse.User.logOut();
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.error('Erro no logout:', error);
        res.redirect('/');
    }
};

// Middleware para verificar se o usuário está autenticado
exports.requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};