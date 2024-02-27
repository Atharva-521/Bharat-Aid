const jwt = require("jsonwebtoken");

exports.auth = async(req, res, next) => {
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");

        if(!token){
            return res.status(404).json({
                success: false,
                message: "JWT Token Missing"
            })
        }

        //Verify Token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error){
            return res.status(500).json({
                success: false,
                message: "Could Not Verify JWT Token"
            })
        }
        next();

    }catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}