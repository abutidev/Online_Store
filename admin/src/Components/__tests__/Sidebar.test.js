import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../Sidebar/Sidebar';
import { BrowserRouter } from 'react-router-dom';


jest.mock('../Sidebar/Sidebar.css', () => ({}));

  
jest.mock('../../assets/Product_Cart.svg', () => 'test-file-stub');
jest.mock('../../assets/Product_list_icon.svg', () => 'test-file-stub');


// Wrapper component for Router
const SidebarWithRouter = () => (
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>
  );

describe('Sidebar Component', () => {

    test('renders sidebar with all elements and correct navigation links', () => {
        
        render(<SidebarWithRouter />);
        
        // Verify sidebar container exists
        const sidebar = screen.getByTestId('Sidebar');
        expect(sidebar).toHaveClass('sidebar');
        
        // Check 'Add Product' section
        const addProductLink = screen.getByRole('link', { name: /add product/i });
        expect(addProductLink).toHaveAttribute('href', '/addproduct');
        
        const addProductImage = screen.getByAltText('add_product');
        expect(addProductImage).toHaveClass('add-product');
        
        const addProductText = screen.getByText('Add Product');
        expect(addProductText).toBeInTheDocument();
        
        // Check 'Product List' section
        const listProductLink = screen.getByRole('link', { name: /product list/i });
        expect(listProductLink).toHaveAttribute('href', '/listproduct');
        
        const listProductImage = screen.getByAltText('list_product');
        expect(listProductImage).toHaveClass('list-product');
        
        const listProductText = screen.getByText('Product List');
        expect(listProductText).toBeInTheDocument();
    });
    
});