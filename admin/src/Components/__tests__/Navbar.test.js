import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../Navbar/Navbar';


jest.mock('../Navbar/Navbar.css', () => ({}));

  
jest.mock('../../assets/nav-logo.svg', () => 'test-file-stub');
jest.mock('../../assets/nav-profile.svg', () => 'test-file-stub');



describe('Navbar Component', () => {

    
    test('renders navbar with all elements correctly', () => {
        
        render(<Navbar />);

        // Get both images
        const images = screen.getAllByRole('img',{ hidden: true });

        expect(images).toHaveLength(2);
        
        
        images.forEach(img => {
        expect(img).toHaveAttribute('src', 'test-file-stub');
        });

        expect(images[0]).toHaveAttribute('alt', 'logo');
        expect(images[1]).toHaveAttribute('alt', 'profile');
        
        // Verify images have correct classes in order
        expect(images[0]).toHaveClass('nav-logo');
        expect(images[1]).toHaveClass('nav-profile');
    });
});