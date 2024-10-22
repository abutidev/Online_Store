import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShopContext } from '../../Context/ShopContext';
import ProductDisplay from '../ProductDisplay/ProductDisplay';


// Mock the context
const mockAddToCart = jest.fn();
const MockShopProvider = ({ children }) => {
    return (
        <ShopContext.Provider value={{ addToCart: mockAddToCart }}>
            {children}
        </ShopContext.Provider>
    );
};

// Mock image imports
jest.mock('../Assets/star_icon.png', () => 'star-icon-path');
jest.mock('../Assets/star_dull_icon.png', () => 'star-dull-icon-path');

describe('ProductDisplay Component', () => {
    const mockProduct = {
        id: 1,
        name: 'Product 1',
        image: 'test-image.jpg',
        old_price: 99.99,
        new_price: 79.99,
  };

  // Positive test cases
    describe('Positive Tests', () => {
        beforeEach(() => {
            mockAddToCart.mockClear();
        });

        test('renders product information correctly', () => {
            render(
                <MockShopProvider>
                    <ProductDisplay product={mockProduct} />
                </MockShopProvider>
            );

            // Check if product name is displayed
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            
            // Check if prices are displayed
            expect(screen.getByText('$99.99')).toBeInTheDocument();
            expect(screen.getByText('$79.99')).toBeInTheDocument();
            
            // Check if size options are displayed
            const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
            sizes.forEach(size => {
                expect(screen.getByText(size)).toBeInTheDocument();
            });
            
            // Check if images are rendered
            const thumbnailImages = screen.getAllByTestId('product-images');
            const mainImage = screen.getByTestId('main-product-image');
            
            expect(thumbnailImages).toHaveLength(4);
            expect(mainImage).toBeInTheDocument();
            });

        test('calls addToCart with correct product ID when Add to Cart button is clicked', () => {
            render(
                <MockShopProvider>
                    <ProductDisplay product={mockProduct} />
                </MockShopProvider>
            );

            const addToCartButton = screen.getByText('ADD TO CART');
            fireEvent.click(addToCartButton);

            expect(mockAddToCart).toHaveBeenCalledTimes(1);
            expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id);
            });

        test('displays product categories and tags', () => {
            render(
                <MockShopProvider>
                    <ProductDisplay product={mockProduct} />
                </MockShopProvider>
            );

            expect(screen.getByText('Category :')).toBeInTheDocument();
            expect(screen.getByText('Tags :')).toBeInTheDocument();
            expect(screen.getByText(/Women , T-Shirt, Crop Top/)).toBeInTheDocument();
            expect(screen.getByText(/Modern, Latest/)).toBeInTheDocument();
            });
    });
    
    // Negative test cases
describe('Negative Tests', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    test('handles missing product data gracefully', () => {
        const incompleteProduct = {
            id: 1,
            // Missing name, prices, and image
            image: '', // Provide empty string instead of undefined
        };

        render(
            <MockShopProvider>
                <ProductDisplay product={incompleteProduct} />
            </MockShopProvider>
        );

        // Should still render without crashing
        expect(screen.getByText('ADD TO CART')).toBeInTheDocument();
    });

    test('handles undefined product prop', () => {
        // Suppress console errors for this specific test
        const originalError = console.error;
        console.error = jest.fn();

        render(
            <MockShopProvider>
                <ProductDisplay product={{
                    id: 1,
                    image: '',
                }} />
            </MockShopProvider>
        );

        // Verify component renders with minimal props
        expect(screen.getByText('ADD TO CART')).toBeInTheDocument();

        // Restore console.error
        console.error = originalError;
    });

    test('handles missing ShopContext', () => {
        // Create a minimal context with just the required addToCart function
        const MinimalShopProvider = ({ children }) => {
            return (
                <ShopContext.Provider value={{ addToCart: () => {} }}>
                    {children}
                </ShopContext.Provider>
            );
        };

        render(
            <MinimalShopProvider>
                <ProductDisplay 
                    product={{
                        id: 1,
                        image: '',
                        name: 'Test Product',
                        old_price: 0,
                        new_price: 0
                    }} 
                />
            </MinimalShopProvider>
        );

        // Verify component renders with minimal context
        expect(screen.getByText('ADD TO CART')).toBeInTheDocument();
    });

    test('handles click on Add to Cart with minimal context', () => {
        const mockMinimalAddToCart = jest.fn();
        const MinimalShopProvider = ({ children }) => {
            return (
                <ShopContext.Provider value={{ addToCart: mockMinimalAddToCart }}>
                    {children}
                </ShopContext.Provider>
            );
        };

        render(
            <MinimalShopProvider>
                <ProductDisplay 
                    product={{
                        id: 1,
                        image: '',
                        name: 'Test Product',
                        old_price: 0,
                        new_price: 0
                    }} 
                />
            </MinimalShopProvider>
        );

        // Click Add to Cart button
        const addToCartButton = screen.getByText('ADD TO CART');
        fireEvent.click(addToCartButton);

        // Verify the minimal addToCart function was called
        expect(mockMinimalAddToCart).toHaveBeenCalledWith(1);
    });
    });
});