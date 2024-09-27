import React from "react";
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useState } from "react";


const AddProduct = () => {

    const [image,setImage] = useState(false);
    const [productDetails,setProductDetails] = useState({
        name:"",
        image: "",
        category:"women",
        old_price:"",
        new_price:""
        
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) => {
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    const addProductHandler = async () => {
        console.log(productDetails);
        let responseData;
        let product = productDetails

        let formData = new FormData();
        formData.append('product',image);

        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'application/json'
            },
            body:formData,
        }).then((response) => response.json()).then((data) => {responseData = data})

        if(responseData.success){
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(product)
            }).then((response) => response.json()).then((data) => {
                if(data.success){
                    alert('Product Added Successfully')
                }else{
                    alert('Failed to add product')
                }
            })  
        }
        
    } 

  return (
    <div className="add-product">
        <div className="addproduct-itemfield">
            <p>Product title</p>
            <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder="Type here" />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder="Type here" />
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder="Type here" />
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className="addproduct-selector">
                <option value="women">Womens</option>
                <option value="men">Mens</option>
                <option value="kid">Kids</option>
           </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):upload_area} alt="" className="addproduct-thumbnail-img" />
            </label>
            <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/>
        </div>
        <button onClick={() => {addProductHandler()}} className="addproduct-btn">Add</button>
     
    </div>
  );
};

export default AddProduct