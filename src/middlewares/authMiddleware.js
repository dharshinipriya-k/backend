const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authMiddleware =  asyncHandler(
    async(req,res,next)=>{
        let token;
        if(req?.headers?.authorization?.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
            try {
                if(token){
                    const decoded = jwt.verify(token,process.env.JWT_SECRET)
                    // console.log(decoded.id.id);
                    const user = await User.findById(decoded?.id?.id)
                    // console.log(user);
                    
                    req.user = user
                    
                    next()
                }
            } catch (error) {
                
                res.status(500).send({
                    message:'Internal server error',
                    error: error.message
                })
            }
        }
        else{
            throw new Error('No token attached')
        }
    }
)

const decodeToken = async(token)=>{
    // console.log(token);
    return await jwt.decode(token)
}

// checking whether admin or user

const isAdmin = async(req,res,next)=>{
    // const token = req?.headers?.authorization?.split(' ')[1]
    const token = req?.headers?.authorization?.split(' ')[1]
    
    if(token)
    {
        const payload = await decodeToken(token)
        console.log(payload.id.role);
        if(payload.id.role === 'admin'){
            next()
        }

        else{
            res.status(402).send({
                message: "Only admins are allowed"
            })
        }
    }


}

module.exports = {
    authMiddleware,
    isAdmin,
    decodeToken
}
