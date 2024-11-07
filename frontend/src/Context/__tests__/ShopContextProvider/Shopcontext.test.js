import { render, act, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ShopContextProvider, { ShopContext } from '../../ShopContext';
import { useContext } from 'react';


// Setup mock fetch
global.fetch = jest.fn();

// Mock data
const mockProducts = [
  { id: 1, name: 'Product 1', new_price: 10, old_price: 15 },
  { id: 2, name: 'Product 2', new_price: 20, old_price: 25 }
];

// Test component to consume context
const TestComponent = () => {
  const context = useContext(ShopContext);
  return (
    <div>
      <span data-testid="total-items">{context.getTotalCartItems()}</span>
      <span data-testid="total-amount">{context.getTotalCartAmount()}</span>
      <span data-testid="products-loaded">{context.all_product.length}</span>
      <button onClick={() => context.addToCart(1)} data-testid="add-btn">Add Item</button>
      <button onClick={() => context.removeFromCart(1)} data-testid="remove-btn">Remove Item</button>
    </div>
  );
};

describe('ShopContextProvider', () => {
  beforeEach(() => {
    // Clear all mocks
    global.fetch.mockClear()
    jest.clearAllMocks();
    
    // Mock successful product fetch by default
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      })
    );
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null)
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });


  test('handles fetch response errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    

    // Mock fetch to simulate a network error in JSON parsing
    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true, // simulate a successful HTTP response
        json: () => Promise.reject(new Error('API Error')), // simulate JSON parsing failure
      })
    );


    const { getByTestId } = render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    // Wait for fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/allproducts');
    });


    // Assert error logging
    // Check if console.error was called
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });


    // Verify that products weren't loaded
    await waitFor(() => {
      expect(getByTestId('products-loaded')).toHaveTextContent('0');
    });
    

    consoleErrorSpy.mockRestore();
  });

  test('authenticated user cart operations', async () => {
    // Mock localStorage to return an auth token
    window.localStorage.getItem.mockImplementation(() => 'fake-auth-token');

    // Mock successful fetch responses
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(mockProducts) })) // products
      .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve({}) })) // getcart
      .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve({ success: true }) })); // addtocart

    const { getByTestId } = render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(document.querySelector('[data-testid="products-loaded"]')).toHaveTextContent('2');
    });

    // Add item to cart
    await act(async () => {
      getByTestId('add-btn').click();
    });

    // Verify cart operation included auth token
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/addtocart',
      expect.objectContaining({
        headers: expect.objectContaining({
          'auth_token': 'fake-auth-token'
        })
      })
    );
  });

  // Keep other existing tests
  test('context provider renders without crashing', () => {
    render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );
  });

  test('fetches products on mount', async () => {
    render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/allproducts');
    });
  });

  test('adds item to cart', async () => {
    const { getByTestId } = render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    // Wait for products to be loaded
    await waitFor(() => {
      expect(document.querySelector('[data-testid="products-loaded"]')).toHaveTextContent('2');
    });

    await act(async () => {
      getByTestId('add-btn').click();
    });

    await waitFor(() => {
      expect(getByTestId('total-items')).toHaveTextContent('1');
    });
  });

  test('removes item from cart', async () => {
    const { getByTestId } = render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    // Wait for products to be loaded
    await waitFor(() => {
      expect(document.querySelector('[data-testid="products-loaded"]')).toHaveTextContent('2');
    });

    // Add an item first
    await act(async () => {
      getByTestId('add-btn').click();
    });

    // Then remove it
    await act(async () => {
      getByTestId('remove-btn').click();
    });

    await waitFor(() => {
      expect(getByTestId('total-items')).toHaveTextContent('0');
    });
  });

  test('calculates cart total correctly', async () => {
    const { getByTestId } = render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    // Wait for products to be loaded
    await waitFor(() => {
      expect(document.querySelector('[data-testid="products-loaded"]')).toHaveTextContent('2');
    });

    // Add items
    await act(async () => {
      getByTestId('add-btn').click(); // Add first product (price: 10)
    });

    await waitFor(() => {
      expect(getByTestId('total-amount')).toHaveTextContent('10');
    });
  });
});

