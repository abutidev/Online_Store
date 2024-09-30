const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");  
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
const multer = require("multer");


app.use(express.json());
app.use(cors());

// Databse connection with MongoDB
mongoose.connect("mongodb+srv://tothulo:Tothulo022@cluster0.ldlpv.mongodb.net/e-com")

// API creation

app.get("/",(req,res)=>{
    res.send("Express App is running")
})

//Image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})

//Creating upload endpoint for images

app.use('/images',express.static('upload/images'))

app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

//MOngoDB schema for creating products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    },
})

//To add or create new products

app.post('/addproduct',async (req,res)=>{

    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    } else{
        id = 1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Product is saved!");
    res.json({
        success: true,
        name: req.body.name,
    });
})

//To delete or remove products

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Product is removed!");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//To get all products

app.get('/allproducts',async (req, res)=>{
    let products = await Product.find({});
    console.log("Here's a list of All products!");
    res.send(products);
})

//Schema for creating user
const Users = mongoose.model('Users',{
    name:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

//Creating endpoint for registering a user
app.post('/signup', async(req,res) => {

    //checking if user already exits
    let check = await Users.findOne({email: req.body.email});
    if(check){
        return res.status(400).json({success:false,errors: "User already exists"});
    }

    //creating a new empty cart
    let cart = {};
    for(let i = 0; i < 300; i++){
        cart[i] = 0;
    }

    //creating a new user with an empty cart created above
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save();

    
    const data = {
        user:{
            id: user.id
        }
    }
    //generating a token for the new user 
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//creating endpoint for user login
app.post('/login', async(req, res) => {
    let user = await Users.findOne({email: req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true, token})
        }else{
            res.json({success:false, errors: "Wrong password"});
        }
    }else{
        res.json({success:false, errors: "User not found"});
    }
})


app.listen(port,(error)=>{
    if(!error){
        console.log("Server is running on port " + port);
    }else{
        console.log("Error : " + error);
    }
})
