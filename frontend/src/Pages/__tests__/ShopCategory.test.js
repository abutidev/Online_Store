import React from "react";
import { render, screen, fireEvent } from "@testing-library/react"; 
import ShopCategory from "../ShopCategory";
import { ShopContext } from "../../Context/ShopContext";


jest.mock('../../Components/Item/Item', () => {
    return function MockItem({ name }) {
      return <div data-testid="mock-item">{name}</div>;
    };
});
  
  
const mockProducts = [
    {
        id: 1,
        name: "Test Product 1",
        category: "mens",
        image: "test1.jpg",
        new_price: 99.99,
        old_price: 149.99
    },
    {
        id: 2,
        name: "Test Product 2",
        category: "mens",
        image: "test2.jpg",
        new_price: 79.99,
        old_price: 129.99
    },
    {
        id: 3,
        name: "Test Product 3",
        category: "womens",
        image: "test3.jpg",
        new_price: 89.99,
        old_price: 139.99
    }
];
  
// Helper function to render ShopCategory with necessary props and context
const renderShopCategory = (props = {}, contextValue = { all_product: mockProducts }) => {

    const defaultProps = {
        banner: "test-banner.jpg",
        category: "mens"
    };
  
    return render(
        <ShopContext.Provider value={contextValue}>
            <ShopCategory {...defaultProps} {...props} />
        </ShopContext.Provider>
    );
};
  
describe('ShopCategory Component', () => {
    describe('Positive Cases', () => {
        test('renders component with banner and correct category products', () => {
            renderShopCategory();
    
            // Check banner
            const banner = screen.getByAltText("shopcategory-banner-alt");
            expect(banner).toHaveClass('shopcategory-banner');
            expect(banner).toHaveAttribute('src', 'test-banner.jpg');
    
            // Check if correct number of products are rendered
            const items = screen.getAllByTestId('mock-item');
            expect(items).toHaveLength(2); // Should show only mens category items
        });
    
        test('displays correct product count message', () => {
            renderShopCategory();
    
            expect(screen.getByText(/Showing 1-12/)).toBeInTheDocument();
            expect(screen.getByText(/out of 36 products/)).toBeInTheDocument();
        });
    
        test('renders sort dropdown', () => {
            renderShopCategory();
    
            expect(screen.getByText(/Sort by/)).toBeInTheDocument();
            expect(screen.getByAltText("sort-dropdown")).toBeInTheDocument(); // dropdown icon
        });
    
        test('renders explore more button', () => {
            renderShopCategory();

            expect(screen.getByText('Explore More')).toBeInTheDocument();
        });
    });

    describe('Negative Cases', () => {
        test('handles empty product list', () => {
            renderShopCategory({}, { all_product: [] });
        
            expect(screen.queryByTestId('mock-item')).not.toBeInTheDocument();
        });
    
        test('handles missing category prop', () => {
            renderShopCategory({ category: undefined });
        
            expect(screen.queryByTestId('mock-item')).not.toBeInTheDocument();
        });
    
        test('handles non-existent category', () => {
            renderShopCategory({ category: 'non-existent' });
        
            expect(screen.queryByTestId('mock-item')).not.toBeInTheDocument();
        });
    
        test('handles missing banner prop', () => {
            renderShopCategory({ banner: undefined });
        
            const banner = screen.getByAltText("shopcategory-banner-alt");
            expect(banner).not.toHaveAttribute('src', '');
        });
      });

})