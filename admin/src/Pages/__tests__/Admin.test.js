import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Admin from '../Admin/Admin';



// Mock the child components
jest.mock('../../Components/Sidebar/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="mock-sidebar">Sidebar</div>;
  }
});

jest.mock('../../Components/AddProduct/AddProduct', () => {
  return function MockAddProduct() {
    return <div data-testid="mock-add-product">Add Product Page</div>;
  }
});

jest.mock('../../Components/ListProducts/ListProduct', () => {
  return function MockListProduct() {
    return <div data-testid="mock-list-product">List Product Page</div>;
  }
});

const AdminWithRouter = () => (
    <BrowserRouter>
      <Admin />
    </BrowserRouter>
  );

describe('Admin Component', () => {
    test('renders admin panel with sidebar and default route', () => {
        
        render(<AdminWithRouter />);
        
        
        // Verify admin container exists
        const adminContainer = screen.getByTestId('admin');
        expect(adminContainer).toBeInTheDocument();
        
        // Verify sidebar is rendered
        const sidebar = screen.getByTestId('mock-sidebar');
        expect(sidebar).toBeInTheDocument();
        
        // Initially, no route content should be visible
        expect(screen.queryByTestId('mock-add-product')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-list-product')).not.toBeInTheDocument();
    });

    test('renders correct components for different routes', () => {
        // Test Add Product Route
        render(
        <MemoryRouter initialEntries={['/addproduct']}>
            <Admin />
        </MemoryRouter>
        );
        
        // Verify Add Product component is rendered
        expect(screen.getByTestId('mock-add-product')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-list-product')).not.toBeInTheDocument();
        
    
        // Test List Product Route
        render(
        <MemoryRouter initialEntries={['/listproduct']}>
            <Admin />
        </MemoryRouter>
        );
        
        // Verify List Product component is rendered
        expect(screen.getByTestId('mock-list-product')).toBeInTheDocument();
       
    });
});