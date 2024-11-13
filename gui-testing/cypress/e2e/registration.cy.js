describe('User registration flow', () => {

    beforeEach(() => {
        cy.visit('/') 

        cy.get('[data-testid="hero"]').should('exist')
    })


    let email;
    let password;

    it('New User registers an account successfully', () => {


        const num = Math.floor(Math.random() * 999)

        //Step 1: Navigate to the login page
        cy.contains('button', 'Login').should('be.visible');
        cy.contains('button', 'Login').click();
        cy.url().should('include', '/login');


        //Step 2: Choose the create and account opt & fill in the necessary details
        cy.contains('span', 'Click here').should('be.visible');
        cy.contains('span', 'Click here').click();
        cy.wait(500)
        cy.get('input[name="username"]').should('be.visible');

        cy.get('input[name="username"]').type(`TestingCypress${num}`);
        cy.get('input[name="email"]').type(`cypress${num}@gmail.com`);
        cy.get('input[name="password"]').type("cypress12345");
        cy.contains('button', 'Continue').should('be.visible');
        cy.contains('button','Continue').click();
        email = `cypress${num}@gmail.com`;
        password = "cypress12345";

        cy.url().should('include', '/login');
        cy.contains('button', 'Logout').should('be.visible');
    })



})