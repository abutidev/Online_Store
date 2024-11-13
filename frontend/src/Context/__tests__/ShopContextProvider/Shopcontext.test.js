import React, { useContext } from 'react';
import { render, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShopContextProvider, { ShopContext } from '../../ShopContext';




const mockFetch = jest.fn();
global.fetch = mockFetch;



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




const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('ShopContext Tests', () => {
  const mockProducts = [

    { id: 1, name: 'Test Product 1', new_price: 10, old_price: 15  },
    { id: 2, name: 'Test Product 2', new_price: 20,  old_price: 25 }
  ];

  const mockProductResponse = {
    success: true,
    message: 'Products retrieved successfully',
    data: {
      Products: mockProducts
    },
    statusCode: 200
  };



  const mockCartEmptyResponse = {
    success: true,
    message: 'Cart data successfully retrieved',
    data: {
      User: {
        cart: {},  
        },
    },
    statusCode: 200,
  };
  


  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    

    // Mock console.error for error testing
    console.error = jest.fn();
  });
  
  afterEach(() => {
    mockFetch.mockClear();
  });

  test('fetches products on mount', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({ 
        json: () => Promise.resolve(mockProductResponse)
      })
    );

    render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/allproducts');
    });

    await waitFor(() => {
      expect(document.querySelector('[data-testid="products-loaded"]')).toHaveTextContent('2');
    });
  });

  test('fetches cart for authenticated user', async () => {
    const authToken = 'fake-auth-token';
    localStorage.getItem.mockImplementation(() => authToken);

    mockFetch
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(mockProductResponse)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(mockCartEmptyResponse)
      }));

    render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/getcart',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'auth_token': authToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }),
          body: ""
        })
      );
    });
  });


  test('handles API errors gracefully', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API error'))
    );

    render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('API error:', expect.any(Error));
    });
  });

  test('calculates cart total correctly', async () => {
    const authToken = 'fake-auth-token';
    localStorage.getItem.mockImplementation(() => authToken);

    const cartWithItems = {
      success: true,
      data: {
        User: {
          cart: { '1': 2 } 
        }
      }
    };

    mockFetch
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(mockProductResponse)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(cartWithItems)
      }));

    const { getByTestId } = render(
      <ShopContextProvider>
        <TestComponent />
      </ShopContextProvider>
    );

    await waitFor(() => {
      expect(getByTestId('total-amount')).toHaveTextContent('20'); // 2 * $10
    });
  });
});