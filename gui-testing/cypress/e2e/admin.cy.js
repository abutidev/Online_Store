describe('Admin flow', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/');

    });


    let itemId;
    

    it('admin retrieving all products successfully', () =>{

       
        cy.get('[alt="list_product"]').should('be.visible')
        

        cy.intercept('GET', 'http://localhost:4000/allproducts').as('listProductRequest');
        
        cy.get('[alt="list_product"]').click();

        cy.wait('@listProductRequest', { timeout: 10000 }).then((interception) => {
            expect(interception.response.statusCode).to.eq(200); 
            expect(interception.response.body).to.have.property('message', 'All products successfully retrieved');
            expect(interception.response.body.data.Products).to.exist;   
        });

        cy.url().should('include', '/listproduct')
        cy.get('.listproduct-allproducts').should('exist').and('be.visible');
        cy.get('.listproduct-allproducts').scrollTo('bottom');


    

    });


    it('admin adds a new product to our inventory', () => {
        
        const data = {
            name : "Newly Added Cypress",
            category : "men",
            new_price : "100",
            old_price : "125"
        }

        // step 1: Navigate to addproduct page
        cy.get('[alt="add_product"]').should('be.visible')
        cy.get('[alt="add_product"]').click()
        cy.url().should('include', '/addproduct')
        cy.contains('button', 'Add').should('be.visible');


        // step 2: Fill in the product details
        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="name"]').type(data.name);

        cy.get('input[name="old_price"]').should('be.visible');
        cy.get('input[name="old_price"]').type(data.old_price);

        cy.get('input[name="new_price"]').should('be.visible');
        cy.get('input[name="new_price"]').type(data.new_price);

        cy.get('.addproduct-selector').select('men');
        cy.get('.addproduct-selector').should('have.value', 'men');

        cy.get('[type="file"]').selectFile('cypress/images/Prod_1.jpg',{force: true});

        
        //step 3: Assertions    
        cy.intercept('POST', 'http://localhost:4000/addproduct').as('addProductRequest');
        cy.contains('button', 'Add').click();
        cy.wait('@addProductRequest', { timeout: 10000 }).then((interception) => {
            
            expect(interception.response.statusCode).to.eq(201); 
            expect(interception.response.body).to.have.property('message', 'Product successfully saved');
            expect(interception.response.body.data.product).to.exist;   
            itemId = interception.response.body.data.product.id;

        });
    });

    it('admin removes product from our inventory', () => {
        

        // step 1: Navigate to thr list product page
        cy.get('[alt="list_product"]').should('be.visible')
        cy.get('[alt="list_product"]').click()
        cy.url().should('include', '/listproduct')
        cy.get('.listproduct-allproducts').should('exist').and('be.visible');
        cy.get('.listproduct-allproducts').scrollTo('bottom');


        
        // Step 2: finding the product we just added in the previous function
        cy.get(`[data-product-id="${itemId}"]`)
        .should('exist')
        .within(() => {
            cy.get('.listproduct-product-img').should('be.visible');
            cy.contains('$').should('exist'); 
            cy.get('.listproduct-remove-icon').click(); 
        });


        
        //step 3: Assertions    
        cy.intercept('POST', 'http://localhost:4000/removeproduct').as('removeProductRequest');
        
        cy.get(`[data-product-id="${itemId}"]`)
        .within(() => {
            cy.get('.listproduct-remove-icon').click();
        });
        cy.wait('@removeProductRequest', { timeout: 10000 }).then((interception) => {
            expect(interception.response.statusCode).to.eq(201); 
            expect(interception.response.body).to.have.property('message', 'Product successfully removed');
            expect(interception.response.body.data.product.id).to.equal(itemId);   
        
        });
    });

   


})