var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = new Schema({
    title:String,
    album:String,
    artist:[String],
    image:String,
    filepath:String
});

SongSchema
.virtual('url')
.get(function(){
    return '/music/songs/'+this._id;
});

module.exports = mongoose.model('Song',SongSchema);