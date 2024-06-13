const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
        index:true,
    },
    description:{
        type:String,
        required:true,
        
    },
    category:{
        type:String,
        required:true,
        
    },
    noOfViews:{
        type: Number,
        default: 0,
    },
    isLiked:{
        type: Boolean,
        default: false
    },
    isDisliked:{
        type: Boolean,
        default: false
    },

    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    image:{
        type: String,
        default: "https://png.pngtree.com/thumb_back/fw800/background/20220904/pngtree-blog-paper-nature-blog-photo-image_1119018.jpg"
    },

    author:{
        type: String,
        default: "Admin"
    }
},
{
    toJSON:{
        virtuals: true,  
    },

    toObject:{
        virtuals: true,
    },

    timestamps: true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);