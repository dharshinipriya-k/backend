
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt')    
const crypto = require('crypto')
const Product = require('../models/ProductModel')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        unique: false
     
    },
    lastName:{
        type:String,
        required:true,
        unique: false
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: 'user'
    },
    isBlocked:{
        type:Boolean,
        default: false
    },
    cart:{
        type:Array,
        default: []
    },
    address:{
        type: String
    },
    wishlist: [{type: mongoose.Schema.ObjectId, ref: "Product"}],
    refreshToken:{

        type:String
    },
    passwordChangedAt: Date,

    passwordResetToken: String,

    passwordResetExpires: Date
},
 {
    timestamps:true, 
    collection:'user',
    versionKey:false
 }   
);

// Password encryption

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
    
})

// Password match when logging in

userSchema.methods.isPasswordMatched = async function (enteredPassword){
    const isMatch =  await bcrypt.compare(enteredPassword, this.password)
    // console.log(isMatch);
    return isMatch

}

// Password reset token
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256')
                                .update(resetToken)
                                .digest('hex')
    this.passwordResetExpires = Date.now()+30*60*1000  //10 minutes

    return resetToken
}

module.exports = mongoose.model('User', userSchema);