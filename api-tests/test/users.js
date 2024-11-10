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
                expect(res.body.statusCode).to.equal(201);
                expect(res.body.data.user.email).to.equal(data.email);
                expect(res.body.data.user.username).to.equal(data.username);
                expect(res.body.success).to.equal(true);
                expect(res.body.message).to.equal('User registered successfully')
            });

           
    });


    it('POST / registering an existing user', () => {

        const data = {
            username:`checking user`,
            password:'123456789',
            email:`tothulo022@gmail.com`
        }

        return request
            .post('signup')
            .send(data)
            .then((res) => {
                expect(res.body.statusCode).to.equal(401);
                expect(res.body.data.email).to.equal(data.email);
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('User already exists')
            });
    
    });

    it('POST / user logging in sucessfully', () => {

        const data = {
           
            email:`tothulo022@gmail.com`,
            password:'123456789',
            
        }

        return request
            .post('login')
            .send(data)
            .then((res) => {
                expect(res.body.statusCode).to.equal(201);
                expect(res.body.data.user.email).to.equal(data.email);
                expect(res.body.message).to.equal('User logged in successfully');
                expect(res.body.success).to.equal(true);
            });
    
    });
     

    it('POST / user attempting to log in with a wrong password', () => {

        const data = {
            email:`tothulo022@gmail.com`,
            password:'12345',
        }

        return request
            .post('login')
            .send(data)
            .then((res) => {
                expect(res.body.data.password).to.equal(data.password);
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Wrong password');
                expect(res.body.statusCode).to.equal(401)
                
            });

    });

    it('POST / non-existant user attempting to log', () => {

        const data = {
            email:`o022@gmail.com`,
            password:'12345',
            
        }

        return request
            .post('login')
            .send(data)
            .then((res) => {
                expect(res.body.data.email).to.equal(data.email);
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('User not found');
                expect(res.body.statusCode).to.equal(401)
                
            });
    });


});   






