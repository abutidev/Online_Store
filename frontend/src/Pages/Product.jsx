import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../Components/Breadcrumbs/Breadcrumb";
import { ShopContext } from "../Context/ShopContext";

const Product = () => {
    const {all_product} = useContext(ShopContext);
    const {productId} = useParams();
    const product = all_product.find((e) => e.id === Number(productId));
    
    return (
        <div>
            <Breadcrumb product={product}/>
        </div>
    )
}

export default Product