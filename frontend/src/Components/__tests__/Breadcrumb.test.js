import { render, screen, cleanup} from '@testing-library/react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';


afterEach(cleanup);

test('should render correct breadcrumb component', () => {

    const mockProduct1 = {
        name: 'Product 1',
        category: 'women'
    };

    render(<Breadcrumb product={mockProduct1}/>);

    const breadcrumbElement = screen.getByText((content, element) => {
        return content.includes('HOME') && content.includes('SHOP') && 
               content.includes(mockProduct1.category) && content.includes(mockProduct1.name);
      });

    expect(breadcrumbElement).toBeInTheDocument();
  
  // This assertion checks if the exact category string is present
    expect(breadcrumbElement.textContent).toContain(mockProduct1.category);
    expect(breadcrumbElement.textContent).toContain(mockProduct1.name);

   
})

test('should render incorrect breadcrumb component', () => {

    const mockProduct2 = {
        name: 'Product 2',
        category: 'men'
    };

    expect(screen.queryByText(mockProduct2.category)).not.toBeInTheDocument();
    expect(screen.queryByText(mockProduct2.name)).not.toBeInTheDocument();

   
})