import React from "react";
import { render, screen } from "@testing-library/react";
import Shop from "../Shop";



// Mock all child components
jest.mock('../../Components/Hero/Hero', () => {
    return function MockHero() {
      return <div data-testid="mock-hero">Hero Component</div>;
    };
  });
  
  jest.mock('../../Components/Popular/Popular', () => {
    return function MockPopular() {
      return <div data-testid="mock-popular">Popular Component</div>;
    };
  });
  
  jest.mock('../../Components/Offers/Offers', () => {
    return function MockOffers() {
      return <div data-testid="mock-offers">Offers Component</div>;
    };
  });
  
  jest.mock('../../Components/NewCollections/NewCollections', () => {
    return function MockNewCollections() {
      return <div data-testid="mock-new-collections">New Collections Component</div>;
    };
  });
  
  jest.mock('../../Components/NewsLetter/NewsLetter', () => {
    return function MockNewsLetter() {
      return <div data-testid="mock-newsletter">Newsletter Component</div>;
    };
  });
  
  describe('Shop Component', () => {
    
    test('renders all child components successfully', () => {
        render(<Shop />);
        
        expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
        expect(screen.getByTestId('mock-popular')).toBeInTheDocument();
        expect(screen.getByTestId('mock-offers')).toBeInTheDocument();
        expect(screen.getByTestId('mock-new-collections')).toBeInTheDocument();
        expect(screen.getByTestId('mock-newsletter')).toBeInTheDocument();
    });

    test('verifies component structure and dependencies', () => {
        const { container } = render(<Shop />);
        
        // Verify the component has the expected wrapper div
        expect(container.firstChild.tagName).toBe('DIV');
        
        // Verify the correct number of child components
        expect(container.firstChild.children.length).toBe(5);
        
        // Test for missing required props (if any were required)
        const shopElement = container.firstChild;
        expect(shopElement).not.toHaveAttribute('className');
        expect(shopElement).not.toHaveAttribute('style');
        
        // Verify component order
        const children = container.firstChild.children;
        expect(children[0]).toHaveAttribute('data-testid', 'mock-hero');
        expect(children[1]).toHaveAttribute('data-testid', 'mock-popular');
        expect(children[2]).toHaveAttribute('data-testid', 'mock-offers');
        expect(children[3]).toHaveAttribute('data-testid', 'mock-new-collections');
        expect(children[4]).toHaveAttribute('data-testid', 'mock-newsletter');
    });

})