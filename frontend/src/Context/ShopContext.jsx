import { useEffect } from 'react';
import React, { createContext, useState } from "react";
// import all_product from "../Components/Assets/all_product";



/**
 * ShopContext is a React context that will be used to share the shop's product data 
 * across different components in the application.
 */
export const ShopContext = createContext(null);


const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
};


/**
 * ShopContextProvider is a component that wraps its children with the ShopContext.Provider.
 * It provides the value of the context, which in this case includes the list of all products.
 */

const ShopContextProvider = (props) => {

    const [all_product,setAllProduct] = useState([]);
    const [cartItems,setCartItems] = useState(getDefaultCart());
    const authToken = localStorage.getItem('auth_token');
    
    useEffect( () =>{
        fetch('http://localhost:4000/allproducts')
        .then((res) => res.json())
        .then((data) => setAllProduct(data));


        if(authToken){
            fetch('http://localhost:4000/getcart',{
                method: 'POST',
                headers:{
                    'Accept' :'application/json',
                    'auth_token': `${authToken}`,
                
                    'Content-Type': 'application/json',
                },
                body:"",   
                }).then((res) => res.json()).then((data)=>{
                    setCartItems(data);
                })
            }
    },[]);
   
    const addToCart = (itemId)=>{
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]+1}));

        // if(localStorage.getItem('auth_token')){
        //     fetch('http://localhost:4000/addtocart',{
        //         method: 'POST',
        //         headers:{
        //             Accept :'application/json',
        //             // `${localStorage.getItem('auth_token')}`,

        //             'auth_token': `${localStorage.getItem('auth_token')}`,
        //             'Content-Type': 'application/json',
        //         },


        if(authToken){
            fetch('http://localhost:4000/addtocart',{
                method: 'POST',
                headers:{
                    Accept :'application/form-data',
                    'auth_token': `${authToken}`,
                
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"itemId":itemId}),

                    
                })
                .then((res) => res.json())
                .then((data) => console.log(data));
            }
        }
        
   
    const removeFromCart = (itemId)=>{

        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}));

        if(authToken){
            fetch('http://localhost:4000/removefromcart',{
                method: 'POST',
                headers:{
                    Accept :'application/form-data',
                    'auth_token': `${authToken}`,
                
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"itemId":itemId})

                    
            })
            .then((res) => res.json())
            .then((data) => console.log(data));
            
            }
        }  

    const getTotalCartAmount = ()=>{
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product)=>product.id===Number(item));
                totalAmount += itemInfo.new_price * cartItems[item];
                console.log(itemInfo.new_price * cartItems[item]);
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = ()=>{
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children} {/* Render any children passed to this provider */}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
