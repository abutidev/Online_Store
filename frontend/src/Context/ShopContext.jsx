/**
 * This file sets up a context for managing the state of a shop application.
 * It uses React's Context API to provide a global state that can be accessed
 * by any component within the application.

 * @module ShopContext
 */

import React, { createContext } from "react";
import all_product from "../Components/Assets/all_product";

/**
 * ShopContext is a React context that will be used to share the shop's product data 
 * across different components in the application.
 */
export const ShopContext = createContext(null);

/**
 * ShopContextProvider is a component that wraps its children with the ShopContext.Provider.
 * It provides the value of the context, which in this case includes the list of all products.
 *
 * @param {Object} props - The properties passed to the component, including children.
 * @returns {JSX.Element} - A component that provides the shop context to its children.
 */
const ShopContextProvider = (props) => {

    // The value that will be provided to any component subscribed to this context
    const contextValue = {
        all_product // This can be expanded to include more state or actions as needed
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children} {/* Render any children passed to this provider */}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
