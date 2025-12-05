const express= require('express')
require('dotenv/config') 
const mongoDb=require('./config/mongodb')
const userRoute=require('./routes/userRoute')
const productroute=require('./routes/productroute')
const cartroute=require('./routes/cartroutes')
const stockroute=require('./routes/stockroutes')
const orderRoute=require('./routes/orderroutes')
const adminroute=require('./routes/adminroutes')


const cors = require('cors');

// App Config
const app = express()
const port = process.env.PORT

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({ origin: "*", credentials: true })); // Allows requests from any origin
app.use('/auth',userRoute)
app.use('/admin',adminroute)
app.use('/product',productroute)
app.use('/cart',cartroute)
app.use('/stock',stockroute)
app.use('/orders',orderRoute)


app.use('/uploads', express.static('uploads'));



mongoDb()

app.get('/',(req,res)=>{
    res.send("API login")
})


app.listen(port, ()=> console.log('Server started on PORT : '+ port))
