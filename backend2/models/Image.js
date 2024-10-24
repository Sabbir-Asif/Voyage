const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    url: String,
    description: String,
    album: String,
    llmResponse: String // Field to store the model's response
});


const Image = mongoose.model('Image', imageSchema);


module.exports = Image;