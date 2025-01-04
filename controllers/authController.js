const Parse = require('parse/node');

exports.showLoginPage = (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Faz login no Parse
        const user = await Parse.User.logIn(username, password);
        
        // Salva os dados importantes na sessão
        req.session.user = {
            id: user.id,
            username: user.get('username'),
            email: user.get('email'),
            sessionToken: user.getSessionToken() // Importante: salvar o token de sessão
        };

        // Força o salvamento da sessão antes do redirect
        req.session.save((err) => {
            if (err) {
                console.error('Erro ao salvar sessão:', err);
                return res.render('login', { 
                    error: 'Erro ao criar sessão. Tente novamente.'
                });
            }
            res.redirect('/');
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('login', { 
            error: 'Usuário ou senha incorretos'
        });
    }
};

exports.logout = async (req, res) => {
    try {
        if (req.session.user) {
            // Fazer logout no Parse
            await Parse.User.logOut();
            
            // Destruir a sessão
            req.session.destroy((err) => {
                if (err) {
                    console.error('Erro ao destruir sessão:', err);
                }
                res.redirect('/login');
            });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Erro no logout:', error);
        res.redirect('/login');
    }
};

// Middleware para verificar autenticação
exports.requireAuth = async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        // Restaura a sessão do Parse usando o token salvo
        const sessionToken = req.session.user.sessionToken;
        if (sessionToken) {
            await Parse.User.become(sessionToken);
        }
        next();
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        res.redirect('/login');
    }
};