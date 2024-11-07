import {render , cleanup ,screen} from '@testing-library/react'
import Hero from '../Hero/Hero'

afterEach(cleanup);

test('should render Hero component', () => {

    render(<Hero/>);

    const heroBoxElement = screen.getByTestId('hero');
    

    expect(heroBoxElement).toBeInTheDocument();
    expect(heroBoxElement.textContent).toContain("NEW ARRIVALS ONLY");
    expect(heroBoxElement.textContent).toContain("collections");
    expect(heroBoxElement.textContent).toContain("for everyone");
    expect(heroBoxElement.textContent).toContain("Latest Collection");
   
})

test('should render incorrect Hero component', () => {

    render(<Hero/>);

    const heroBoxElement = screen.getByTestId('hero');
  

    expect(heroBoxElement).toBeInTheDocument();
    expect(heroBoxElement.textContent).not.toContain("Hello World");
    expect(heroBoxElement.textContent).not.toContain("Tests");
})