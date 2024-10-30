import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import Product from "../Product"; 





// Mock components
jest.mock('../../Components/Breadcrumbs/Breadcrumb', () => {
    return function MockBreadcrumb() {
      return <div data-testid="mock-breadcrumb">Breadcrumb</div>;
    };
  });
  
jest.mock('../../Components/ProductDisplay/ProductDisplay', () => {
    return function MockProductDisplay({ product }) {
      return <div data-testid="mock-product-display">Product Display: {product?.name}</div>;
    };
  });
  
jest.mock('../../Components/DescriptionBox/DescriptionBox', () => {
    return function MockDescriptionBox() {
      return <div data-testid="mock-description-box">Description Box</div>;
    };
  });
  
jest.mock('../../Components/RelatedProducts/RelatedProudcts', () => {
    return function MockRelatedProducts() {
      return <div data-testid="mock-related-products">Related Products</div>;
    };
  });



const  mockProducts = [
    { 
        id: 1,
        name: "Product 1",
        description: "Description 1",
        price: 10
        // category: "Category 1" 
    },
    { 
        id: 2, 
        name: "Product 2", 
        description: "Description 2", 
        price: 20 
        // category: "Category 2" 
    },
];


// Helper function to render the Product component with necessary providers and router
const renderProduct = (productId, contextValue = { all_product: mockProducts }) => {
    return render(
        <ShopContext.Provider value={contextValue}>
            <MemoryRouter initialEntries={[`/product/${productId}`]}>
                <Routes>
                    <Route path="/product/:productId" element={<Product />} />
                </Routes>
            </MemoryRouter>
        </ShopContext.Provider>
    );
  };


describe("Product Component", () => {
    describe('Positive Cases', () => {
        test('renders all child components when valid product ID is provided', () => {
            renderProduct('1');
        
            expect(screen.getByTestId('mock-breadcrumb')).toBeInTheDocument();
            expect(screen.getByTestId('mock-product-display')).toBeInTheDocument();
            expect(screen.getByTestId('mock-description-box')).toBeInTheDocument();
            expect(screen.getByTestId('mock-related-products')).toBeInTheDocument();
        });
    
        test('displays correct product information for valid product ID', () => {
            renderProduct('1');
        
            expect(screen.getByText('Product Display: Product 1')).toBeInTheDocument();
        });
    
        test('handles different valid product IDs correctly', () => {
            renderProduct('2');
        
            expect(screen.getByText('Product Display: Product 2')).toBeInTheDocument();
        });
    });
    
    describe('Negative Cases', () => {
        test('handles non-existent product ID gracefully', () => {
            renderProduct('999');
        
            expect(screen.getByTestId('mock-product-display')).toHaveTextContent('Product Display:');
        });
    
        test('handles invalid product ID (non-numeric) appropriately', () => {
            renderProduct('abc');
        
            expect(screen.getByTestId('mock-product-display')).toHaveTextContent('Product Display:');
        });
    
        test('handles empty product list in context', () => {
            renderProduct('1', { all_product: [] });
        
            expect(screen.getByTestId('mock-product-display')).toHaveTextContent('Product Display:');
        });
        
    });

})