const jwt = require('jsonwebtoken')

const generateRefreshToken = async(id)=>{
    return await jwt.sign({id},process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_REFRESH_EXPIRY})
}

module.exports = {generateRefreshToken}