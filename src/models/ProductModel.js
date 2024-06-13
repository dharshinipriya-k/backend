const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    slug:{
        type:String,
        
        lowercase:true
    },
    description:{
        type:String,
        required:true,
        
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: String,
        required:true
    },

    quantity: {
        type: String,
        required: true
    },

    stock:{
        type: Number,
        default: 0,
    },


    images: {
        type: String,
        required: true
    },
    
    ratings: [{
        star: Number,
        comment: String,
        postedBy : {type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }
    }],
    
    totalrating:{
        type: String,
        default: 0
    },

    tags: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true
    }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);