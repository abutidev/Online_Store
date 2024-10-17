import { render,screen, cleanup } from "@testing-library/react"; 
import Footer from "../Footer/Footer";


afterEach(cleanup);

test('should render Footer component', () => {

    render(<Footer/>);

    const footerBoxElement = screen.getByTestId('footer');
    

    expect(footerBoxElement).toBeInTheDocument();
    expect(footerBoxElement.textContent).toContain("SHOPPER");
    expect(footerBoxElement.textContent).toContain("Company");
    expect(footerBoxElement.textContent).toContain("Products");
    expect(footerBoxElement.textContent).toContain("Offices");
    expect(footerBoxElement.textContent).toContain("About");
    expect(footerBoxElement.textContent).toContain("Contact");
    expect(footerBoxElement.textContent).toContain("Copyright @ 2023 - All Rights Reserved.");

})

test('should render incorrect Footer component', () => {

    render(<Footer/>);

    const footerBoxElement = screen.getByTestId('footer');
  

    expect(footerBoxElement).toBeInTheDocument();
    expect(footerBoxElement.textContent).not.toContain("Hello World");
    expect(footerBoxElement.textContent).not.toContain("Tests");
})