const Recipe = require('./models/recipes');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {  // using Passport's "isAuthenticated" method 
        req.session.returnTo = req.originalUrl; // storing the url onto the session to redirect the user back after logging in
        res.redirect('/login');
    } else {
        next();
    }
}; // checkes whether they are already logged in or not!

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe.author.equals(req.user._id)) {
        return res.redirect(`/recipes/${id}`);
    }
    next();
}; // author confirmation middleware, checking if the author of the campground is the same guy that is loggedin right now