const express = require('express');
const router = express.Router();

// route dependencies
const catchAsync = require('../utils/catchAsync');
const recipes = require('../controllers/recipes');
const multer = require('multer');
const { storage } = require('../cloudinary'); // importing the configured CloudinaryStorage instance
const upload = multer({ storage }); // setting multer to use the cloudinary storage
const { isLoggedIn, isAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(recipes.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(recipes.createRecipe))

router.route('/search')
    .get(catchAsync(recipes.searchRecipe)); //search route

router.get('/new', isLoggedIn, recipes.renderNewForm)

router.route('/:id')
    .get(catchAsync(recipes.displayRecipe))
    .put(isLoggedIn, isAuthor, catchAsync(recipes.updateRecipe))
    .delete(isLoggedIn, isAuthor, catchAsync(recipes.destroyRecipe))

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(recipes.renderEditForm))

module.exports = router;