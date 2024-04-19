const express = require('express');
const { connectdb } = require('./Config/database');
const connectCloudinary = require('./Config/cloudinary');
const cookieParser = require('cookie-parser');
const fileUploader = require('express-fileupload');
const userRoutes = require('./Routes/User')
const profileRoutes = require('./Routes/Profile');
const predictionRoutes = require('./Routes/Prediction');
const resetRoutes = require('./Routes/ResetPassword');
const cors = require("cors");
require('dotenv').config();
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)
app.use(fileUploader({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


connectdb();
connectCloudinary()

app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/profile',profileRoutes);
app.use('/api/v1/prediction',predictionRoutes);
app.use('/api/v1/reset', resetRoutes);

const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send("Home Route")
})

app.listen(PORT, () => (
    console.log(`Server Started at Port ${PORT} Successfully!`)
))