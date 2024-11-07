import {render , cleanup ,screen} from '@testing-library/react'
import Item from '../Item/Item'
import { BrowserRouter } from 'react-router-dom' ;



afterEach(cleanup);

// Mock the window.scrollTo function
global.scrollTo = jest.fn();

const mockProduct1 = {
    id : '01',
    name: 'Product 1',
    new_price: 50,
    old_price: 60,

};

const mockProduct2 = {
    id : '02',
    name: 'Product 2',
    new_price: 20,
    old_price: 30,
}

const renderComponent = (props = mockProduct1) => {
    return render(
    <BrowserRouter>
        <Item {...props}/>
    </BrowserRouter> 
    );
  };

;

test('should render Item component', () => {

    renderComponent();

    const itemBoxElement = screen.getByTestId("item");
    
    // console.log(itemBoxElement.textContent);
    expect(itemBoxElement).toBeInTheDocument();
    expect(itemBoxElement.textContent).toContain("Product 1");
    expect(itemBoxElement.textContent).toContain("1");
    expect(itemBoxElement.textContent).toContain("50");
    expect(itemBoxElement.textContent).toContain("60");

   
})

test('should render incorrect Item component', () => {

    renderComponent();

    expect(screen.queryByText(mockProduct2.id)).not.toBeInTheDocument();
    expect(screen.queryByText(mockProduct2.name)).not.toBeInTheDocument();
    expect(screen.queryByText(mockProduct2.old_price)).not.toBeInTheDocument();
    
})