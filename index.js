const express = require('express');
const { connectdb } = require('./Config/database');
const connectCloudinary = require('./Config/cloudinary');
const cookieParser = require('cookie-parser');
const fileUploader = require('express-fileupload');
const userRoutes = require('./Routes/User')
require('dotenv').config();
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(fileUploader());


connectdb();
connectCloudinary()

app.use('/api/v1/auth',userRoutes);

const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send("Home Route")
})

app.listen(PORT, () => (
    console.log(`Server Started at Port ${PORT} Successfully!`)
))