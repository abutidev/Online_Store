import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import Navbar from '../Navbar/Navbar';

// Mock the images
jest.mock('../Assets/logo.png', () => 'logo-mock');
jest.mock('../Assets/cart_icon.png', () => 'cart-icon-mock');
jest.mock('../Assets/nav_dropdown.png', () => 'nav-dropdown-mock');

// Mock the ShopContext
const mockGetTotalCartItems = jest.fn(() => 5);
const mockShopContext = {
  getTotalCartItems: mockGetTotalCartItems
};

const renderNavbar = () => {
  return render(
    <ShopContext.Provider value={mockShopContext}>
      <Router>
        <Navbar />
      </Router>
    </ShopContext.Provider>
  );
};


beforeEach(() => {

    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
        value: {
        getItem: jest.fn(),
        removeItem: jest.fn()
        },
        writable: true
    });

    // Mock window.location.replace
    originalReplace = window.location.replace;
    delete window.location;
    window.location = { replace: jest.fn() };
});


afterEach(() => {
    // Restore original window.location.replace after each test
    window.location.replace = originalReplace;
});


test('renders Navbar component', () => {
    renderNavbar();
    expect(screen.getByText('SHOPPER')).toBeInTheDocument();
});

test('renders all navigation links', () => {
    renderNavbar();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Men')).toBeInTheDocument();
    expect(screen.getByText('Women')).toBeInTheDocument();
    expect(screen.getByText('Kids')).toBeInTheDocument();
});

test('shows Login button when not authenticated', () => {
    localStorage.getItem.mockReturnValue(null);
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
});

test('shows Logout button when authenticated', () => {
    localStorage.getItem.mockReturnValue('some-token');
    renderNavbar();
    expect(screen.getByText('Logout')).toBeInTheDocument();
});

test('logout button removes auth token and redirects', () => {
    localStorage.getItem.mockReturnValue('some-token');
    renderNavbar();
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(window.location.replace).toHaveBeenCalledWith('/');
});


test('toggles menu visibility on dropdown click', () => {
    renderNavbar();
    const dropdown = screen.getByAltText('dropdown-click');
    fireEvent.click(dropdown);

    const menu = screen.getByRole('list');
    expect(menu).toHaveClass('nav-menu-visible');
    expect(dropdown).toHaveClass('open');

    fireEvent.click(dropdown);
    expect(menu).not.toHaveClass('nav-menu-visible');
    expect(dropdown).not.toHaveClass('open');
});

test('changes active menu item on click', () => {
    renderNavbar();
    fireEvent.click(screen.getByText('Men'));
    expect(screen.getByText('Men').closest('li').querySelector('hr')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Women'));
    expect(screen.getByText('Women').closest('li').querySelector('hr')).toBeInTheDocument();
    expect(screen.getByText('Men').closest('li').querySelector('hr')).toBeNull();
});
