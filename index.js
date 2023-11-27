const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDatabase = require('./database');
const bodyParser = require('body-parser')
const userSchema = require('./models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');



connectDatabase


const isAuthenticated = async(req,res,next) =>{
    const token = req.cookies.token;
    if(token){
        const decoded = jwt.verify(token,"ASKJFDJSDFHKSDKJH")
        req.user = await userSchema.findById(decoded._id)
        next();
    }
    else{
        res.render('login');
    }

}
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

app.set('views', path.join(__dirname, 'views'));

app.get('/', isAuthenticated,(req, res) => {
   res.render("logout",{username:req.user.username,password:req.user.password})
   
});

app.post("/login",async (req,res)=>{

    const {username,password} = req.body;
const hashedPassword = await bcrypt.hash(password,10)
    
    const user =    await userSchema.create({
        username,
        password:hashedPassword
    })
    const token = jwt.sign({_id:user._id},"ASKJFDJSDFHKSDKJH")

    res.cookie("token",token);

    res.redirect("/")
})

app.get("/logout",async (req,res)=>{
    res.cookie("token",null,{httpOnly:true,expires:new Date(Date.now())});

    res.redirect("/")
})

app.listen(2000, () => {
    console.log(`Server running on port 2000`);
});
