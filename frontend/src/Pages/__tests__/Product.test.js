import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import Product from "../Product"; 



const  mockProducts = [
    { id: 1, name: "Product 1", description: "Description 1", price: 10, category: "Category 1" },
    { id: 2, name: "Product 2", description: "Description 2", price: 20, category: "Category 2" },
];

describe("Product Component", () => {
    const mockShopContextValue = {
        all_product:  mockProducts,
    };

    // test("renders product details correctly", () => {
    //     render(
    //         <MemoryRouter initialEntries={['/product/1']}>
    //             <ShopContext.Provider value={{ all_product: mockProducts }}>
    //                 <Product />
    //             </ShopContext.Provider>
    //         </MemoryRouter>
    //     );

    //     expect(screen.getByText("Product 1")).toBeInTheDocument(); 
    //     expect(screen.getByText("Product 2")).toBeInTheDocument();
    //     expect(screen.getByText("Description 1")).toBeInTheDocument();
    });

    // test("renders fallback when product is not found", () => {
    //     render(
    //         <MemoryRouter initialEntries={['/product/999']}> {/* A productId that doesn't exist */}
    //             <ShopContext.Provider value={mockShopContextValue}>
    //                 <Product />
    //             </ShopContext.Provider>
    //         </MemoryRouter>
    //     );

    //     expect(screen.getByText("Product not found")).toBeInTheDocument(); // Check for fallback UI
    // });

