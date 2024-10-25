import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginSignup from "../LoginSignup";




// Mock the global fetch function
global.fetch = jest.fn();

describe("LoginSignup Component", () => {
    // Mock localStorage
    const mockSetItem = jest.fn();
    const mockGetItem = jest.fn();
    const mockRemoveItem = jest.fn();

    // Mock location replace
    const mockLocationReplace = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock the localStorage methods
        Object.defineProperty(window, 'localStorage', {
            value: {
                setItem: mockSetItem,
                getItem: mockGetItem,
                removeItem: mockRemoveItem,
            },
            writable: true,
        });

        // Mock the window location replace
        delete window.location; // Delete the original location object
        window.location = { replace: mockLocationReplace }; // Assign a new location object
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders LoginSignup component and allows switching between Login and Sign Up", () => {
        render(<LoginSignup />);

        expect(screen.getByText("Login")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Click here"));
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    });

    test("successful login", async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, token: "dummy_token" })
            })
        );

        render(<LoginSignup />);

        fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

        fireEvent.click(screen.getByText("Continue"));

        await new Promise((r) => setTimeout(r, 100));

        // Assert
        expect(mockSetItem).toHaveBeenCalledWith("auth_token", "dummy_token");
        expect(mockLocationReplace).toHaveBeenCalledWith("/");
    });

    test("successful signup", async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, token: "dummy_token" })
            })
        );

        render(<LoginSignup />);
        fireEvent.click(screen.getByText("Click here"));

        fireEvent.change(screen.getByPlaceholderText("Your Name"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

        fireEvent.click(screen.getByText("Continue"));

        await new Promise((r) => setTimeout(r, 100));

        // Assert
        expect(mockSetItem).toHaveBeenCalledWith("auth_token", "dummy_token");
        expect(mockLocationReplace).toHaveBeenCalledWith("/");
    });

    test("handles login error", async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: false, errors: "Invalid credentials" })
            })
        );

        jest.spyOn(window, 'alert').mockImplementation(() => {});

        render(<LoginSignup />);

        fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpassword" } });

        fireEvent.click(screen.getByText("Continue"));

        await new Promise((r) => setTimeout(r, 100));

        expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
    });

    test("handles signup error", async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: false, errors: "Email already exists" })
            })
        );

        jest.spyOn(window, 'alert').mockImplementation(() => {});

        render(<LoginSignup />);
        fireEvent.click(screen.getByText("Click here"));

        fireEvent.change(screen.getByPlaceholderText("Your Name"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

        fireEvent.click(screen.getByText("Continue"));

        await new Promise((r) => setTimeout(r, 100));

        expect(window.alert).toHaveBeenCalledWith("Email already exists");
    });
});