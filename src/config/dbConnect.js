const { default: mongoose } = require("mongoose")

const dbConnect = async ()=>{
    try {
        const connect = mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
        console.log('Database connected Succesfully');
    } catch (error) {
        console.log('Database Error!');
    }
    
}

module.exports = dbConnect