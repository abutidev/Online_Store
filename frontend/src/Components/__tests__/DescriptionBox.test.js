import { render,screen, cleanup } from "@testing-library/react"; 
import DescriptionBox from "../DescriptionBox/DescriptionBox";


afterEach(cleanup);

test('should render DescriptionBox component', () => {

    render(<DescriptionBox/>);

    const descriptionBoxElement = screen.getByTestId('description-box');
    

    expect(descriptionBoxElement).toBeInTheDocument();
    expect(descriptionBoxElement.textContent).toContain("It serves as a virtual marketplace where businesses and individuals");
    expect(descriptionBoxElement.textContent).toContain("Each product usually has it's own dedicated page with relevant information.");
})

test('should render incorrect DescriptionBox component', () => {

    render(<DescriptionBox/>);

    const descriptionBoxElement = screen.getByTestId('description-box');
  

    expect(descriptionBoxElement).toBeInTheDocument();
    expect(descriptionBoxElement.textContent).not.toContain("Hello World");
    expect(descriptionBoxElement.textContent).not.toContain("Tests");
})

