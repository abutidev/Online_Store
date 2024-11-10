import supertest from "supertest";
import { expect } from "chai";  

const request = supertest('http://localhost:4000/');

let itemId;


describe('Admin' , () =>{
    it('POST / admin adds a product to inventory', () => {
        
        const data = {
            name : "Galxboy",
            image : "http://localhost:4000/images/product_1731231697685.jpg",
            category : "men",
            new_price : "100",
            old_price : "125"
        }

        return request
            .post('addproduct')
            .send(data)
            .then((res) => {
                itemId = res.body.data.product.id 
                expect(res.body.success).to.equal(true);
                expect(res.body.statusCode).to.equal(201);
                expect(res.body.message).to.equal('Product successfully saved');
                expect(res.body.data.product.name).to.equal(data.name);
                expect(res.body.data.product.category).to.equal(data.category);
                

            });

    });


    it('POST / admin removes a product from inventory', () => {
        
        const data = {
           id : `${itemId}`
           
        }


        // {
        //     "success": true,
        //     "statusCode": 201,
        //     "message": "Product successfully removed",
        //     "data": {
        //         "product": {
        //             "id": "101"
        //         }
        //     }
        // }
        return request
            .post('removeproduct')
            .send(data)
            .then((res) => {
                expect(res.body.success).to.equal(true);
                expect(res.body.statusCode).to.equal(201);
                expect(res.body.message).to.equal('Product successfully removed');
                expect(res.body.data.product.id).to.equal(data.id);
                

            });
    });


    it('GET / admin retrieving all products successfully', () =>{

        return request
        .get('allproducts')
        .then((res) => {
            expect(res.body.success).to.equal(true);
            expect(res.body.statusCode).to.equal(200);
            expect(res.body.message).to.equal('All products successfully retrieved');
            
        })

    })

})