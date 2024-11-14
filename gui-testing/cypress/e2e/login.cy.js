describe('Login flow', () => {
    beforeEach(() => {
        cy.visit('/login');

        cy.contains('button', 'Continue').should('be.visible');

    });

    it('User logs in successfully', () => {

        const data = {
            email:`tothulo022@gmail.com`,
            password:'123456789',
            
        }

        //step1 fill in the details
        cy.get('input[name="email"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Email Address');
        cy.get('input[name="password"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Password');
        cy.get('input[name="email"]').type(data.email);
        cy.get('input[name="password"]').type(data.password);
        cy.contains('button', 'Continue').should('be.visible');
        cy.contains('button','Continue').click();


        // step2 Assert
        cy.url().should('include', '/');
        cy.contains('button', 'Logout').should('be.visible');
        cy.get('[data-testid="hero"]').should('exist')


    });

    it('user attempting to log in with a wrong password', () => {

        const data = {
            email:`tothulo022@gmail.com`,
            password:'12345',
        }

       //step1 fill in the details
       cy.get('input[name="email"]')
       .should('be.visible')
       .and('have.attr', 'placeholder', 'Email Address');
        cy.get('input[name="password"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Password');
        cy.get('input[name="email"]').type(data.email);
        cy.get('input[name="password"]').type(data.password);
        cy.contains('button', 'Continue').should('be.visible');
        cy.contains('button','Continue').click();


        
        //step2 Assertions    
        cy.intercept('POST', 'http://localhost:4000/login').as('loginRequest');
  
        cy.contains('button','Continue').click();

        cy.wait('@loginRequest', { timeout: 10000 }).then((interception) => {
            
            expect(interception.response.statusCode).to.eq(401); 
            expect(interception.response.body).to.have.property('message', 'Wrong password');
            expect(interception.response.body.data.password).to.exist;   
        });

    });

    it('non-existant user attempting to log', () => {

        const data = {
            email:`o022@gmail.com`,
            password:'12345',
            
        }
        //step1 fill in the details
       cy.get('input[name="email"]')
       .should('be.visible')
       .and('have.attr', 'placeholder', 'Email Address');
        cy.get('input[name="password"]')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Password');
        cy.get('input[name="email"]').type(data.email);
        cy.get('input[name="password"]').type(data.password);
        cy.contains('button', 'Continue').should('be.visible');
  

        //step2 Assertions    
        cy.intercept('POST', 'http://localhost:4000/login').as('loginRequest');
        cy.contains('button','Continue').click();

        cy.wait('@loginRequest', { timeout: 10000 }).then((interception) => {
            expect(interception.response.statusCode).to.eq(401); 
            expect(interception.response.body).to.have.property('message', 'User not found');
            expect(interception.response.body.data.email).to.exist;
                
        });
    });
})