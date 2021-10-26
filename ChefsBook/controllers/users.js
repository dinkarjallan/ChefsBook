const User = require('../models/users');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {  // logging in as soon as user registers
            if (err) {
                return next(err); // catch error
            } else { // execute other code if no error
                res.redirect('/');
            }
        });
    } catch (error) {
        res.redirect('/register')
    }
}
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/recipes'; // saving the url to return back after logging in OR redirecting to /recipes
    delete req.session.returnTo; // clearing out the 'returnTo'(not redirectUrl) to avoid Url conflicts
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res) => {
    req.logout(); // logout by passport
    res.redirect('/')
}