import '@testing-library/jest-dom';

// Mock all image imports
jest.mock('../../assets/cross_icon.png', () => 'test-file-stub', { virtual: true });
jest.mock('../../assets/nav-logo.svg', () => 'test-file-stub');
jest.mock('../../assets/nav-profile.svg', () => 'test-file-stub');
jest.mock('../../assets/Product_Cart.svg', () => 'test-file-stub');
jest.mock('../../assets/Product_list_icon.svg', () => 'test-file-stub');