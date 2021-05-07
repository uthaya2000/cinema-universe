var mongoose=require("mongoose")

var TheatreSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    city:{
        type: String,
        required: true
    },
    movie:{
        type: String,
        required: true
    },
    seats: {
        type: Array
    },
    address:{
        type: String
    },
    tposter:{
        type: String
    },
    mposter:{
        type: String
    },
    price:{
        type: Number
    }
})

module.exports = mongoose.model("Theatre", TheatreSchema);
