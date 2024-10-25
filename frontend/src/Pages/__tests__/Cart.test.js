import { render , screen } from '@testing-library/react';
import React from 'react';
import Cart from '../Cart';
import CartItems from '../../Components/CartItems/CartItems';



// Mock the CartItems component
jest.mock("../../Components/CartItems/CartItems");

describe("Cart Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders CartItems component when there are items in the cart", () => {
        // Arrange
        CartItems.mockImplementation(() => (
            <div data-testid="cart-items">Item 1, Item 2</div>
        ));

        // Act
        render(<Cart />);

        // Assert
        const cartItemsElement = screen.getByTestId("cart-items");
        expect(cartItemsElement).toBeInTheDocument();
        expect(cartItemsElement).toHaveTextContent("Item 1");
        expect(cartItemsElement).toHaveTextContent("Item 2");
    });

    test("handles empty cart scenario", () => {
        // Arrange
        CartItems.mockImplementation(() => (
            <div data-testid="empty-cart">Your cart is empty</div>
        ));

        // Act
        render(<Cart />);

        // Assert
        const emptyCartElement = screen.getByTestId("empty-cart");
        expect(emptyCartElement).toBeInTheDocument();
        expect(emptyCartElement).toHaveTextContent("Your cart is empty");

        expect(emptyCartElement).not.toHaveTextContent("Item 1");
        expect(emptyCartElement).not.toHaveTextContent("Item 2");
    });
});