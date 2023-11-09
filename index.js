import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import mysql from 'mysql';
import morgan from 'morgan'
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoute.js'
import productRoutes from './routes/productRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'  
import couponRoute from './routes/couponRoute.js' 
import wishlistRoute from './routes/wishlistRoute.js'
import adminDashboardRoute from './routes/adminDashboardRoute.js'
import cors from 'cors'
import path from 'path'
const __dirname = path.resolve();


dotenv.config();
const DB_HOST = process.env.DB_HOST; 

const app = express(); 

// Middlewares   
app.use(express.json());                      
app.use(morgan('dev'));      
app.use(cors())

// Routes
app.use('/api/v1/auth', authRoutes);    

app.use('/api/v1/category',categoryRoutes)          

app.use('/api/v1/product',productRoutes)   

app.use('/api/v1/payment',paymentRoutes) 

app.use('/api/v1/coupon',couponRoute)  

app.use('/api/v1/wishlist',wishlistRoute)

app.use('/api/v1/adminDashboardRoute',adminDashboardRoute)

app.use(express.static(path.join(__dirname,'./client/build')))

app.use('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'))
})


const PORT = process.env.PORT || 8000;     

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,   
  database: process.env.DB_NAME,    
};
 
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);     
    return;
  }
  console.log(`Connected to MySQL database in ${DB_HOST}`.bgMagenta.white);   
});

app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.DEV_MODE} port ${PORT}`.bgCyan.white);                  
});   
