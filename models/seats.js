var mongoose = require('mongoose');

var seatSchema = new mongoose.Schema({
    theatre: {
        type: String,
    },
    seatNo: {
        type: Array,
        default: []
    },
   
    user:{
        type:mongoose.Schema.Types.ObjectId,
		ref:"users"
    },
    city: String,
    qr: String,
    movie: String,
    date:{
        type: Date
    },
    price: {
        type: Number
    }
})

module.exports = mongoose.model('BookedSeat', seatSchema);