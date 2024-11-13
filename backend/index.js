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



//response handler utility
const createResponse = (success, message, data = null, statusCode = 200) => {
  return {
    success,
    statusCode,
    message,
    data,
  };
};


//To add new products into our inventory

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


    return res.status(201).json(
        createResponse(
            true,
            'Product successfully saved',
            {
                product:{
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    category: product.category,
                    new_price: product.new_price,
                    old_price: product.old_price,
                },
            },                    
            201
            
        )
    )
})

//To delete or remove products from our inventory
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
  


    return res.status(201).json(
        createResponse(
            true,
            'Product successfully removed',
            {
                product:{
                    id: req.body.id,
                    name: req.body.name

                },
            },                    
            201
            
        )
    )



})

//To get all products

app.get('/allproducts',async (req, res)=>{
    let products = await Product.find({});
    // res.send(products);
    return res.status(200).json(
        createResponse(
            true,
            'All products successfully retrieved',
            {
                Products: products
            },                    
            200
            
        )
    );
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
        
        return res.status(401).json(
            createResponse(
                false,
                'User already exists',
                {email : req.body.email},
                401
            )
        );
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
  


    return res.status(201).json(
        createResponse(
            true,
            'User registered successfully',
            {
                user: {
                    id: user.id,
                    username: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                },
                Token: token
            },
            201,
            
            
        )
    );
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
            return res.status(201).json(
                createResponse(
                    true,
                    'User logged in successfully',
                    {
                        user: {
                            id: user.id,
                            username: user.name,
                            email: user.email,
                        },
                        Token: token
                    },                    
                    201
                    
                )
            );
            
        }else{
           
            return res.status(401).json(
                createResponse(
                    false,
                    'Wrong password',
                    {password : req.body.password},
                    401
                )
            );
        }
    }else{

        return res.status(401).json(
            createResponse(
                false,
                'User not found',
                {email : req.body.email},
                401
            )
        );
        
    }
})

//creating endpoint for new collection data
app.get('/newcollections',async (req, res)=> {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    // console.log("New collection fetched!");
    res.send(newcollection);

})

//Creating endpoint for popular in women category
app.get('/popularinwomen',async (req, res)=> {
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    // console.log("Popular in women fetched!");
    res.send(popular_in_women);
})


//helper to fetch user info
const fetchUser = async(req, res, next) => {
    const token = req.header('auth_token');
    if(!token){
    
        return res.status(401).json(
            createResponse(
                false,
                'Please authenticate using a valid token',
                {Token : token},                    
                401     
            )
        );  

    }else{ 
        try{
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){

            return res.status(401).json(
                createResponse(
                    false,
                    'Please authenticate using a valid token',
                    {Token : token},                    
                    401     
                )

            );

        }
    }
}

//endpoint to add as well as update the database with cartData
app.post('/addtocart',fetchUser, async (req, res)=>{
   console.log("Added: ", req.body.itemId);
   let userData = await Users.findOne({_id:req.user.id});
   userData.cartData[req.body.itemId] += 1;
   await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});    
  
    return res.status(201).json(
        createResponse(
            true,
            'Added',
            {
                product:{
                    productId : req.body.itemId
                },
            },                    
            201
            
        )
    );

})

//endpoint to remove items from cartData
app.post('/removefromcart',fetchUser, async (req, res)=>{
    console.log("Removed: ", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0){
        userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});

    return res.status(200).json(
        createResponse(
            true,
            'Removed!',
            {
                product:{
                    productId : req.body.itemId
                },
            },                    
            200
            
        )
    );



})

//endpoint to get cartData whenever user logs in
app.post('/getcart',fetchUser,async (req, res) => {
    console.log("getCart");
    let userData = await Users.findOne({_id:req.user.id});
    return res.status(200).json(
        createResponse(
            true,
            'Cart data successfully retrieved',
            {
                User:{
                    cart : userData.cartData
                },
            },                    
            200
            
        )
    );
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server is running on port " + port);
    }else{
        console.log("Error : " + error);
    }
})
