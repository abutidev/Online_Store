import React from "react";
import './ListProduct.css'
import { useEffect } from "react";
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

  const [allproducts, setAllProducts] = React.useState([]); 

   const fetchInfo = async () => {
    await fetch("http://localhost:4000/allproducts")
      .then((res) => res.json())
      .then((data) => setAllProducts(data.data.Products));
    };

    useEffect(() => {
        fetchInfo();
     },[])

    const removeProduct = async (id) => {
        await fetch("http://localhost:4000/removeproduct", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
        }).then((response) => response.json()).then((data) => {
            if(data.success){
                alert('Product removed successfully')
            }else{
                alert('Failed to removed product')
            }
        });
        await fetchInfo();
    };

   return (
    <div className="list-product">
        <h1>All products</h1>
        <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old Price</p>
            <p>New Price</p>
            <p>Category</p>
            <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
            <hr className="listproduct-hr" />
            {allproducts.map((product) => {
                return <>
                <div key={product.id} data-product-id={product.id}  className="listproduct-format-main listproduct-format">
                        <img src={product.image} alt="product-image" className="listproduct-product-img" />
                        <p>{product.name}</p>
                        <p>${product.old_price}</p>
                        <p>${product.new_price}</p>
                        <p>{product.category}</p>
                        <img onClick={() => {removeProduct(product.id)}} className= "listproduct-remove-icon" src={cross_icon} alt="" />
                </div>
                <hr className="listproduct-hr"/>
                </>    
                })}

        </div>
    </div>
  );
};

export default ListProduct