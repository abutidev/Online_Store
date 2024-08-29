import React, { createContext, useState } from "react";
import all_product from "../Components/Assets/all_product";



/**
 * ShopContext is a React context that will be used to share the shop's product data 
 * across different components in the application.
 */
export const ShopContext = createContext(null);


const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < all_product.length+1; index++) {
        cart[index] = 0;
    }
    return cart;
};


/**
 * ShopContextProvider is a component that wraps its children with the ShopContext.Provider.
 * It provides the value of the context, which in this case includes the list of all products.
 */

const ShopContextProvider = (props) => {

    const [cartItems,setCartItems] = useState(getDefaultCart()); 
   
    const addToCart = (itemId)=>{
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]+1}));
        // console.log(cartItems);
    }    
   
    const removeFromCart = (itemId)=>{
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}));
    }  

    const contextValue = {all_product,cartItems,addToCart,removeFromCart};


    return (
        <ShopContext.Provider value={contextValue}>
            {props.children} {/* Render any children passed to this provider */}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
