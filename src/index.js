const express = require('express')
const dbConnect = require('./config/dbConnect')
const dotenv = require('dotenv').config()
const authRouter = require('./routes/authRoutes')
const productRouter = require('./routes/productRoute')
const blogRouter = require('./routes/blogRoutes')
const categoryRouter = require('./routes/productCategoryRoute')
const blogCategoryRouter = require('./routes/blogCatRoutes')
const couponRouter = require('./routes/couponRoutes')
const enquiryRouter = require('./routes/enquiryRoutes')
const paymentRouter = require('./routes/paymentRoutes')
const uploadRouter = require('./routes/uploadRoutes.js')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')

const morgan = require('morgan')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
dbConnect()
app.use(cookieParser())


app.use('/api/user',authRouter)
app.use('/api/product',productRouter)
app.use('/api/blogs',blogRouter)
app.use('/api/category', categoryRouter)
app.use('/api/blog-category', blogCategoryRouter)
app.use('/api/coupon',couponRouter)
app.use('/api/enquiry', enquiryRouter)
app.use('/api/orders',paymentRouter)
app.use('/api/upload', uploadRouter)

app.use(notFound)
app.use(errorHandler)

app.get("/", (req, res) => {
    res.sendFile(path.resolve("./client/checkout.html"));
  });

app.listen(PORT,()=>console.log(`App listening to port ${PORT}`))