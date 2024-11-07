import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListProduct from '../ListProducts/ListProduct';




// Simple mock for CSS import
jest.mock('../ListProducts/ListProduct.css', () => ({}));


// Mock the image import directly in the test file
jest.mock('../../assets/cross_icon.png', () => 'test-file-stub');


const mockProducts = [
  {
    id: 1,
    name: "Test Product 1",
    old_price: "100",
    new_price: "80",
    category: "men",
    image: "test-image-1.jpg"
  },
  {
    id: 2,
    name: "Test Product 2",
    old_price: "200",
    new_price: "150",
    category: "women",
    image: "test-image-2.jpg"
  }
];

// Mock fetch globally
global.fetch = jest.fn();
global.alert = jest.fn();   



describe('ListProduct Component', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        alert.mockClear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
      });

    describe('Positive test cases', () => {
    
    
        test('successfully loads and displays products', async () => {
            // Mock the fetch for getting all products
            fetch.mockImplementationOnce(() => 
                Promise.resolve({
                    json: () => Promise.resolve(mockProducts)
                })
            );
        
            render(<ListProduct />);
        
            // Wait for products to load
            await waitFor(() => {
                // Check if the title is rendered
                expect(screen.getByText('All products')).toBeInTheDocument();
                
                // Check if products are rendered
                expect(screen.getByText('Test Product 1')).toBeInTheDocument();
                expect(screen.getByText('Test Product 2')).toBeInTheDocument();
                
                // Check if prices are rendered correctly
                expect(screen.getByText('$100')).toBeInTheDocument();
                expect(screen.getByText('$80')).toBeInTheDocument();
                
                // Check if categories are rendered
                expect(screen.getByText('men')).toBeInTheDocument();
                expect(screen.getByText('women')).toBeInTheDocument();
            
            });
        
            // Verify images are rendered
            const productImages = screen.getAllByAltText('product-image')
            expect(productImages.length).toBe(2);
            
            // Verify fetch was called correctly
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith('http://localhost:4000/allproducts');
        });
        
          test('successfully removes a product', async () => {
            // Mock the initial products fetch
            fetch
                .mockImplementationOnce(() => 
                    Promise.resolve({
                        json: () => Promise.resolve(mockProducts)
                    })
                )
              // Mock the remove product API call
                .mockImplementationOnce(() => 
                    Promise.resolve({
                        json: () => Promise.resolve({ success: true })
                    })
                )
              // Mock the refresh products fetch
                .mockImplementationOnce(() => 
                    Promise.resolve({
                        json: () => Promise.resolve(mockProducts.filter(p => p.id !== 1))
                    })
                );
        
            render(<ListProduct />);
        
            // Wait for initial products to load
            await waitFor(() => {
                expect(screen.getByText('Test Product 1')).toBeInTheDocument();
            });
        
            // Find and click the remove icon for the first product
            const removeIcons = document.querySelectorAll('.listproduct-remove-icon');
            fireEvent.click(removeIcons[0]);
        
            // Wait for the removal and refresh
            await waitFor(() => {
                // Verify the API calls
                expect(fetch).toHaveBeenCalledTimes(3);
                expect(fetch).toHaveBeenCalledWith('http://localhost:4000/removeproduct', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: 1 }),
                });
            });
        });
    });


    describe('Negative test cases', () => {
        
        test('handles failed product fetch', async () => {
            

            fetch.mockImplementationOnce(() => 
                Promise.resolve({
                    json: () => Promise.resolve([]) // Return empty array on failure
                })
            );
          
            render(<ListProduct />);
        
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith('http://localhost:4000/allproducts');
                expect(screen.queryByText('Test Product 1')).not.toBeInTheDocument();
            });
        
        });
        
        test('handles failed product removal', async () => {
            fetch
                .mockImplementationOnce(() => 
                    Promise.resolve({
                        json: () => Promise.resolve(mockProducts)
                    })
                )
                // Mock failed product removal
                .mockImplementationOnce(() => 
                    Promise.resolve({
                        json: () => Promise.resolve({ success: false })
                    })
                )
                // Mock successful refresh fetch
                .mockImplementationOnce(() => 
                    Promise.resolve({
                        json: () => Promise.resolve(mockProducts)
                    })
                );

            render(<ListProduct />);

            // Wait for initial products to load
            await waitFor(() => {
                expect(screen.getByText('Test Product 1')).toBeInTheDocument();
            });

            // Trigger product removal
            const removeIcons = document.querySelectorAll('.listproduct-remove-icon');
            fireEvent.click(removeIcons[0]);

            // Verify failure alert
            await waitFor(() => {
                expect(alert).toHaveBeenCalledWith('Failed to removed product');
            });

            // Verify product list remains unchanged
            await waitFor(() => {
                expect(screen.getByText('Test Product 1')).toBeInTheDocument();
                expect(fetch).toHaveBeenCalledTimes(3);
            });

        });

    })
});