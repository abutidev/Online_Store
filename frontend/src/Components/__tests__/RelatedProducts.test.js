import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RelatedProducts from '../RelatedProducts/RelatedProudcts';
import data_product from '../Assets/data';


// Mock the Item component
jest.mock('../Item/Item', () => {
  return function MockItem({ name }) {
    return <div data-testid="mock-item">{name}</div>;
  };
});

// Mock the module that exports data_product
jest.mock('../Assets/data', () => ([
    {
      id: 1,
      name: "Product 1",
      image: 'p1_img',
      new_price: 50.00,
      old_price: 80.50
    },
    {
      id: 2,
      name: "Product 2",
      image: 'p2_img',
      new_price: 85.00,
      old_price: 120.50
    }
  ]));

describe('RelatedProducts Component', () => {


    test('renders Related Products successfully crashing', () => {
        // data_product = mockProducts;

        // Render the component
        render(<RelatedProducts />);
    
        // Check that the title is rendered
        expect(screen.getByText('Related Products')).toBeInTheDocument();
    
        // Check if products are rendered correctly
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
    });


     


    test('renders Related Products with NO products', () => {
       
        data_product.pop();
        data_product.pop();
        

        // Render the component
        render(<RelatedProducts />);
    
        // Check that the title is rendered
        expect(screen.getByText('Related Products')).toBeInTheDocument();
    
        
        // Verify no items are rendered
        const productItems = screen.queryAllByTestId('mock-item');

        expect(productItems).toHaveLength(0);  // No products should be rendered
    });
   
   
})
