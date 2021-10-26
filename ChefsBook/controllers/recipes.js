const Recipe = require('../models/recipes');

module.exports.index = async (req, res) => {
    const recipes = await Recipe.find({}); // find all recipes
    res.render('recipes/index', { recipes, title: '' })
};
module.exports.searchRecipe = async (req, res) => {
    const keyword = req.query.keyword;
    const recipes = await Recipe.find({ $or: [{ name: keyword }, { ingredients: keyword }] }); // find all recipes in which either name, or an ingredient matches the query. (not so efficient, but good for now)
    res.render('recipes/index', { recipes, title: 'Search Results' })
};

module.exports.renderNewForm = (req, res) => {
    res.render('recipes/new');
};

module.exports.createRecipe = async (req, res) => {
    const recipe = req.body;
    const newRecipe = new Recipe(recipe);
    // saving cloudinary data to Mongo
    newRecipe.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newRecipe.author = req.user._id; // saving the user id as the recipe author
    await newRecipe.save();
    res.redirect(`/recipes/${newRecipe._id}`);
};

module.exports.displayRecipe = async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate('author');
    if (!recipe) {
        return res.redirect('/recipes');
    }
    res.render('recipes/display', { recipe });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
        return res.redirect('/recipes');
    }
    res.render('recipes/edit', { recipe })
};

module.exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const newRecipe = req.body;
    const recipe = await Recipe.findByIdAndUpdate(id, newRecipe);
    await recipe.save();
    res.redirect(`/recipes/${recipe._id}`);
};

module.exports.destroyRecipe = async (req, res) => {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id)
    res.redirect('/recipes');
};
