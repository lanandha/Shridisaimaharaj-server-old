var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/gratitude", { useNewUrlParser: true,useUnifiedTopology: true });


var messageSchema = new mongoose.Schema({
Userid:{type:Number,required:true},
 Message: {type:String,required:true}
});

var Gratitude = mongoose.model("Gratitude", messageSchema);
// exports module
module.exports={Gratitude}
