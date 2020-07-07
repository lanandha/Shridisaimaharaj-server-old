var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/passport-google", { useNewUrlParser: true,useUnifiedTopology: true });

var UserSchema = new mongoose.Schema({
  name: String,
  userid: String,
  email:String,
  image:String,
  updated_at: { type: Date, default: Date.now },
});

UserSchema.statics.findOrCreate = require("find-or-create");
module.exports=mongoose.model('Google', UserSchema);

