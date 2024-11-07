import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../Components/Breadcrumbs/Breadcrumb";
import { ShopContext } from "../Context/ShopContext";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProudcts";

const Product = () => {
    const {all_product} = useContext(ShopContext);
    const {productId} = useParams();
    const product = all_product.find((e) => e.id === Number(productId));
    
    // console.log(all_product);   
    // console.log(productId);
    // console.log(product);

   
    return (
        <div>
            <Breadcrumb product={product}/>
            <ProductDisplay product={product}/>
            <DescriptionBox/>
            <RelatedProducts/>
        </div>
    )
}

export default Product