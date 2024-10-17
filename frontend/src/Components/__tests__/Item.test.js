import {render , cleanup ,screen} from '@testing-library/react'
import Item from '../Item/Item'

afterEach(cleanup);

test('should render Item component', () => {

    const mockProduct1 = {
        id : '01',
        name: 'Product 1',
        category: 'women',
        new_price: 50,
        old_price: 60,


    };

    render(<Item id={mockProduct1.id} name={mockProduct1.name} 
        new_price={mockProduct1.new_price} old_price={mockProduct1.old_price}/>);

    const itemBoxElement = screen.getByTestId('item');
    

    expect(itemBoxElement).toBeInTheDocument();
    expect(itemBoxElement.textContent).toContain("Product 1");
    expect(itemBoxElement.textContent).toContain("1");
    expect(itemBoxElement.textContent).toContain("women");
    expect(itemBoxElement.textContent).toContain(" 50");
    expect(itemBoxElement.textContent).toContain("60");

   
})

test('should render incorrect Item component', () => {


    const mockProduct1 = {
        id : '01',
        name: 'Product 1',
        category: 'women',
        new_price: 50,
        old_price: 60,


    };

    const mockProduct2 = {
        id : '02',
        name: 'Product 2',
        category: 'men',
        new_price: 20,
        old_price: 30,
    };

    render(<Item id={mockProduct1.id} name={mockProduct1.name} 
        new_price={mockProduct1.new_price} old_price={mockProduct1.old_price}/>);

   

    expect(screen.queryByText(mockProduct2.id)).not.toBeInTheDocument();
    expect(screen.queryByText(mockProduct2.name)).not.toBeInTheDocument();
    expect(screen.queryByText(mockProduct2.category)).not.toBeInTheDocument();
    expect(screen.queryByText(mockProduct2.old_price)).not.toBeInTheDocument();
    
})