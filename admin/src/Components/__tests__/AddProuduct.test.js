import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddProduct from '../AddProduct/AddProduct';




// Mock fetch globally
global.fetch = jest.fn();


// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn();

// Mock alert
global.alert = jest.fn();

describe('AddProduct Component', () => {

    beforeEach(() => {
        fetch.mockClear();
        URL.createObjectURL.mockClear();
        alert.mockClear();



        fetch.mockImplementation(() => 
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ success: true })
            })
        );
    });


    describe('Positive Cases', () => {
        test('renders all form elements correctly', () => {
            render(<AddProduct />);

            // Check for input fields using their placeholders and names
            expect(screen.getAllByPlaceholderText('Type here')).toHaveLength(3);
            
            // Check for category selector
            const categorySelect = screen.getByRole('combobox');
            expect(categorySelect).toBeInTheDocument();
            expect(categorySelect).toHaveValue('women'); // Default value in your component
            
            // Check for Add button
            expect(screen.getByText('Add')).toBeInTheDocument();
        });

        test('handles input changes correctly', async () => {
            render(<AddProduct />);

            // Get inputs by their labels
            const titleInput = screen.getAllByPlaceholderText('Type here')[0];
            const oldPriceInput = screen.getAllByPlaceholderText('Type here')[1];
            const newPriceInput = screen.getAllByPlaceholderText('Type here')[2];
            const categorySelect = screen.getByRole('combobox');

            // Simulate user input
            fireEvent.change(titleInput, { target: { value: 'Test Product', name: 'name' } });
            fireEvent.change(oldPriceInput, { target: { value: '100', name: 'old_price' } });
            fireEvent.change(newPriceInput, { target: { value: '80', name: 'new_price' } });
            fireEvent.change(categorySelect, { target: { value: 'men', name: 'category' } });

            // Verify values
            expect(titleInput.value).toBe('Test Product');
            expect(oldPriceInput.value).toBe('100');
            expect(newPriceInput.value).toBe('80');
            expect(categorySelect.value).toBe('men');
        });

        test('handles image upload', async () => {
            render(<AddProduct />);

            const file = new File(['test'], 'test.png', { type: 'image/png' });
            const fileInput = document.querySelector('#file-input');
            
            URL.createObjectURL.mockReturnValue('mocked-url');
            
            fireEvent.change(fileInput, { target: { files: [file] } });

            // Verify the image preview is updated
            const previewImage = screen.getByAltText('');
            expect(previewImage.src).toContain('mocked-url');
        });

        test('successfully adds product', async () => {
            render(<AddProduct />);

            // Mock successful API responses
            fetch
                .mockImplementationOnce(() => 
                Promise.resolve({
                    json: () => Promise.resolve({ success: true, image_url: 'test-image-url' })
                })
                )
                .mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ success: true })
                })
                );

            // Fill form
            const inputs = screen.getAllByPlaceholderText('Type here');
            fireEvent.change(inputs[0], { target: { value: 'Test Product', name: 'name' } });
            fireEvent.change(inputs[1], { target: { value: '100', name: 'old_price' } });
            fireEvent.change(inputs[2], { target: { value: '80', name: 'new_price' } });

            // Upload image
            const file = new File(['test'], 'test.png', { type: 'image/png' });
            const fileInput = document.querySelector('#file-input');
            fireEvent.change(fileInput, { target: { files: [file] } });

            // Click Add button
            const addButton = screen.getByText('Add');
            fireEvent.click(addButton);

            // Wait for API calls to complete
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(2);
                expect(alert).toHaveBeenCalledWith('Product Added Successfully');
            });
        });
    });
    
    describe('Negative Cases', () => {

        test('shows error for empty form submission', async () => {
            render(<AddProduct />);
            
            // Mock the fetch calls as in the successful case, but with empty values
            fetch
                .mockImplementationOnce(() => 
                    Promise.resolve({
                        json: () => Promise.resolve({ 
                            success: true,
                            image_url: '' 
                        })
                    })
                )
                .mockImplementationOnce(() => 
                    Promise.resolve({
                        json: () => Promise.resolve({ 
                            success: false,
                            message: 'Validation failed'
                        })
                    })
                );
        
            // Get and clear all input fields
            const inputs = screen.getAllByPlaceholderText('Type here');
            
            // Submit empty values but trigger the change events
            fireEvent.change(inputs[0], { target: { value: '', name: 'name' } });
            fireEvent.change(inputs[1], { target: { value: '', name: 'old_price' } });
            fireEvent.change(inputs[2], { target: { value: '', name: 'new_price' } });
        
            // Create an empty file for the image input
            const emptyFile = new File([], 'empty.png', { type: 'image/png' });
            const fileInput = document.querySelector('#file-input');
            fireEvent.change(fileInput, { target: { files: [emptyFile] } });
        
            // Submit the form
            const addButton = screen.getByText('Add');
            fireEvent.click(addButton);
        
            // Wait for all promises to resolve
            await waitFor(() => {
                // Verify API calls were made (since we're not preventing at frontend)
                expect(fetch).toHaveBeenCalledTimes(2);
                
                // Verify the error alert was shown
                // Using the exact message that matches your component
                expect(alert).toHaveBeenCalledWith('Failed to add product');
            });
        
            // Verify the form values remain empty
            inputs.forEach(input => {
                expect(input.value).toBe('');
            });
        });

    });
})



