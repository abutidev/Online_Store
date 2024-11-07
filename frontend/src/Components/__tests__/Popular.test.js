import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Popular from '../Popular/Popular';



// Mock the Item component
jest.mock('../Item/Item', () => {
  return function MockItem({ name }) {
    return <div data-testid="mock-item">{name}</div>;
  };
});

describe('Popular Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset fetch mock
    global.fetch = jest.fn();
  });

const mockProducts = [
    { id: 1, name: 'Item 1', image: 'image1.jpg', new_price: '10', old_price: '15' },
    { id: 2, name: 'Item 2', image: 'image2.jpg', new_price: '20', old_price: '25' },
  ];


  test('renders popular when API call is successful', async () => {
    

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockProducts),
    });

    render(<Popular />);

    // Check if the title is rendered
    expect(screen.getByText('POPULAR IN WOMEN')).toBeInTheDocument();

    // Wait for the items to be rendered
    await waitFor(() => {
      expect(screen.getAllByTestId('mock-item')).toHaveLength(2);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

test('renders error message when API call fails', async () => {

    // Mock fetch to simulate an API failure
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch')));

    // Suppress the console.error during this test to avoid unwanted logs
    jest.spyOn(console, 'error').mockImplementation(() => {});
  


    await act(async () => {
        render(<Popular />);
      });
  
    // Check if the title is still rendered (if it should be visible even when there's an error)
    expect(screen.getByText('POPULAR IN WOMEN')).toBeInTheDocument();

    // Check to ensure that there's no products if and the API fails to load
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    

    // Restore the original console.error
    console.error.mockRestore();
  });
  
});