const mongoose = require('mongoose');


const saucesSchema = mongoose.Schema({
    userId: {type: String, require: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0, min: 0, max: 10},
    dislikes: {type: Number, default: 0, min: 0, max: 10},
    usersLiked: {type: Array, default: []},
    usersDisliked: {type: Array, default: []},
});

module.exports = mongoose.model('sauces', saucesSchema);