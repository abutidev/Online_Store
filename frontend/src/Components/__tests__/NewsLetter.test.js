import { render, cleanup, screen } from "@testing-library/react";
import NewsLetter from "../NewsLetter/NewsLetter";

afterEach(cleanup);

test('Should render component successfully', () => {

    render(<NewsLetter />);

    const newsLetterElement  = screen.getByTestId('newsletter');

    expect(newsLetterElement).toBeInTheDocument();
    expect(newsLetterElement.textContent).toContain("Get Exclusive Offers On Your Email");
}
)

test('Should render component incorrectly ', () => {

    render(<NewsLetter />);

    const newsLetterElement  = screen.getByTestId('newsletter');

    
    expect(newsLetterElement.textContent).not.toContain("Hello World");
    expect(newsLetterElement.textContent).not.toContain("I love you");
}
)