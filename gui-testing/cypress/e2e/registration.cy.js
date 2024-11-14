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

    it.only('registering an existing user', () => {


        const data = {
            username:`checking user`,
            password:'123456789',
            email:`tothulo022@gmail.com`
        }

        //Step 1: Navigate to the login page
        cy.contains('button', 'Login').should('be.visible');
        cy.contains('button', 'Login').click();
        cy.url().should('include', '/login');


        //Step 2: fill in the necessary details
        
        cy.contains('span', 'Click here').should('be.visible');
        cy.contains('span', 'Click here').click();
        cy.wait(500)
        cy.get('input[name="email"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Email Address');
        cy.get('input[name="password"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Password');

        cy.get('input[name="email"]').type(data.email);
        cy.get('input[name="username"]').type(data.username);
        cy.get('input[name="password"]').type(data.password);
        cy.contains('button', 'Continue').should('be.visible');

        
        // step3 : Assert
        cy.intercept('POST', 'http://localhost:4000/signup').as('signUpRequest');
  
        cy.contains('button','Continue').click();

        cy.wait('@signUpRequest', { timeout: 10000 }).then((interception) => {
            
            expect(interception.response.statusCode).to.eq(401); 
            expect(interception.response.body).to.have.property('message', 'User already exists');
            expect(interception.response.body.data.email).to.exist;   
        });
    })



})