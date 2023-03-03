const mongoose = require('mongoose');
const song_schema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    artist:{
        type:String,
        required:true
    },
    album:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    }
})

const song = mongoose.model('song',song_schema)
module.exports = song;