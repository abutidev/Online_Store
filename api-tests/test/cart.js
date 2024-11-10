import supertest from 'supertest';
import { expect } from 'chai';




const request = supertest('http://localhost:4000/');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZmYTU1MjRiOGI0YTVmMmJjMTcxM2Q4In0sImlhdCI6MTcyNzg2NjEyNH0.B6FH9KvKtJUIhNUDO4Dh4fKtvfxd92W9cbuGN_2Hsdc'
const wrongToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZmYTU1MjRiOGI0YTVm'



describe('Cart data' ,() => {

    it('POST / user adding product to cart successfully', () =>{

        const data ={
            itemId : '50'
        }


        return request
        .post('addtocart')
        .set('auth_token', token)
        .send(data)
        .then((res) => {

            expect(res.body.success).to.equal(true);
            expect(res.body.statusCode).to.equal(201);
            expect(res.body.message).to.equal('Added');
            expect(res.body.data.product.productId).to.equal(data.itemId)
        })

    })

    it('POST / invalid user attempting to add a product to the cart', () =>{

        const data ={
            itemId : "50"
        }


        return request
        .post('addtocart')
        .set('auth_token', wrongToken)
        .send(data)
        .then((res) => {
            expect(res.body.success).to.equal(false);
            expect(res.body.statusCode).to.equal(401);
            expect(res.body.message).to.equal('Please authenticate using a valid token');
            expect(res.body.data.Token).to.equal(wrongToken)
        })

    })


    it('POST / user removing product from cart successfully', () =>{

        const data ={
            itemId : '50'
        }


        return request
        .post('removefromcart')
        .set('auth_token', token)
        .send(data)
        .then((res) => {
            expect(res.body.success).to.equal(true);
            expect(res.body.statusCode).to.equal(200);
            expect(res.body.message).to.equal('Removed!');
            expect(res.body.data.product.productId).to.equal(data.itemId)
        })

    })

    it('POST / invalid user attempting to remove product from cart', () =>{

        const data ={
            itemId : "50"
        }


        return request
        .post('removefromcart')
        .set('auth_token', wrongToken)
        .send(data)
        .then((res) => {
            expect(res.body.success).to.equal(false);
            expect(res.body.statusCode).to.equal(401);
            expect(res.body.message).to.equal('Please authenticate using a valid token');
            expect(res.body.data.Token).to.equal(wrongToken)
        })

    })
   


    it('POST / user retrieving cartdata successfully', () =>{

        return request
        .post('getcart')
        .set('auth_token', token)
        .send()
        .then((res) => {
            expect(res.body.success).to.equal(true);
            expect(res.body.statusCode).to.equal(200);
            expect(res.body.message).to.equal('Cart data successfully retrieved');
            
        })

    })

    it('POST / invalid user attempting to retrieve cartdata', () =>{

        return request
        .post('getcart')
        .set('auth_token', wrongToken)
        .send()
        .then((res) => {
            expect(res.body.success).to.equal(false);
            expect(res.body.statusCode).to.equal(401);
            expect(res.body.message).to.equal('Please authenticate using a valid token');
            expect(res.body.data.Token).to.equal(wrongToken)
        })

    })

})