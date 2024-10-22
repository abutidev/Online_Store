import {render, screen, cleanup} from '@testing-library/react'
import Offers from '../Offers/Offers';

afterEach(cleanup);

test ('should render Offers component successfully',() => {
    
    render(<Offers/>);

    const offersElement = screen.getByTestId('offers-left');

    expect(offersElement).toBeInTheDocument();
    expect(offersElement).toHaveTextContent('ONLY ON BEST SELLERS PRODUCTS');

})

test ('should render Offers component incorrectly',() => {
    
    render(<Offers/>);

    const offersElement = screen.getByTestId('offers-left');

    expect(offersElement).not.toHaveTextContent('Hello World');;
    expect(offersElement).not.toHaveTextContent('ISTQB');

})