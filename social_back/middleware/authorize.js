var jwt = require('jsonwebtoken');
const jwtSecret = process.env.JSON_SECRET


//middleware function to check if the users jwt is valid or not
const fetchUser=(req,res,next)=>{
    const authToken=req.header('auth-token')
    
    if(!authToken){
        res.status(401).send('Please authenticate using a valid token')
    }
    
    try {
        const data = jwt.verify(authToken,jwtSecret)
        req.user = data.user
        next()
    } catch (err) {
        res.status(401).send('Please authenticate Using a valid token')
    }
}

module.exports = fetchUser;