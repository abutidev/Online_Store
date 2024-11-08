import supertest from 'supertest';
import { expect } from 'chai';




const request = supertest('http://localhost:4000/');


describe('Users', () => {
    it('POST / registering a user', () => {

        const num = Math.floor(Math.random() * 999)

        const data = {
            username:`testing user${num}`,
            password:'Test1212',
            email:`testing${num}@gmail.com`
        }


        return request
            .post('signup')
            .send(data)
            .then((res) => {
                expect(res.body.data.user.email).to.equal(data.email);
                expect(res.body.data.user.username).to.equal(data.username);
                expect(res.body.success).to.equal(true);
                expect(res.body.message).to.equal('User registered successfully')
            });
    });




    
});