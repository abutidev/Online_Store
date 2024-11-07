import { fireEvent,render, screen, cleanup} from '@testing-library/react';
import CartItems from '../CartItems/CartItems'; 
import { ShopContext } from '../../Context/ShopContext';



test('should render correct cartItems', () => {

    const mockShopContext = {
        getTotalCartAmount: jest.fn().mockReturnValue(40),
        all_product: [
          { id: 1, name: 'Product 1', new_price: 10, image: 'product1.jpg' },
          { id: 2, name: 'Product 2', new_price: 20, image: 'product2.jpg' },
        ],
        cartItems: { 1: 2, 2: 1 },
        removeFromCart: jest.fn()
      };
    
      
    const MockShopProvider = ({ children }) => (
        <ShopContext.Provider value={mockShopContext}>
            {children}
        </ShopContext.Provider>
        );


    render(
        <MockShopProvider>
          <CartItems />
        </MockShopProvider>
      );

    const textHeaderDiv = screen.getByTestId('cartitems-header');
  
    // Test header rendering
    expect(textHeaderDiv).toHaveTextContent("Products");
    expect(textHeaderDiv).toHaveTextContent("Title");
    expect(textHeaderDiv).toHaveTextContent("Price");
    expect(textHeaderDiv).toHaveTextContent("Quantity");
    expect(textHeaderDiv).toHaveTextContent("Total");
    expect(textHeaderDiv).toHaveTextContent("Remove");
    
    //Test product rendering
    const cartItemsInfoDiv = screen.getAllByTestId('cartitems-info');
    const cartItemsData = mockShopContext.all_product;

    expect(cartItemsInfoDiv.length).toBe(cartItemsData.length);

    // You can loop through them and check each one
    cartItemsInfoDiv.forEach((item, index) => {
    expect(item).toHaveTextContent(cartItemsData[index].name);
    expect(item).toHaveTextContent(cartItemsData[index].new_price);

    });

    const cartItemsTotalsDiv = screen.getByTestId('cartitems-totals');

    // Test total price rendering
    expect(cartItemsTotalsDiv).toHaveTextContent("$40");  
    expect(mockShopContext.getTotalCartAmount).toHaveBeenCalledWith();


    // Test remove button rendering and functionality
    const removeButtons = screen.getAllByAltText('remove-button');
    expect(removeButtons).toHaveLength(2);
    
    // Check if the buttons have the correct class
    removeButtons.forEach(button => {
        expect(button).toHaveClass('cartitems-remove-icon');
    });

    // Simulate clicking the first remove button
    fireEvent.click(removeButtons[0]);

    expect(mockShopContext.removeFromCart).toHaveBeenCalledWith(1)
})
