const jwt = require('jsonwebtoken')

const generateToken = async (id)=>{

    let token = await jwt.sign({id},process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRY})
    
    return  token
}

module.exports = {generateToken}