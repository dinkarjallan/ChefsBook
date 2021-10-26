const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary');


const ImageSchema = new Schema({
    url: String,
    filename: String
}); // nested schema so use the virtual property on the images

// creating virtual 'thumbnail' property on CampgroundSchema
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_1000,ar_1:1,c_fill,g_auto'); // adding 'cloudinary image manipulation' properties inside of the 'url'
});

const opts = { toJSON: { virtuals: true } };
// defining schema
const RecipeSchema = new Schema({
    name: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    images: [ImageSchema],
    time: {
        prep: Number,
        cook: Number
    },
    cuisine: String,
    level: String,
    servings: Number,
    course: String,
    diet: String,
    ingredients: [String],
    steps: [String]
}, opts);

module.exports = mongoose.model('Recipe', RecipeSchema); // compiling and exporting model