const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const app = require('../app.js')
const endpoints = require('../endpoints/endpoints.json')

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('invalid endpoint', () => {
    test('404 status and error message when given an endpoint that doesn\'t exist', () => {
        return request(app)
        .get('/api/not-a-route')
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe('path not found')
        })
    })
})

describe('/api', () => {
    test('GET: responds with a json object with all available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body}) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})


describe("/api/topics", () => {
    describe("GET", () => {
        test("200: responds with an array of all topics", () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(( {body}) => {
      
                expect(body).toHaveLength(3)
        
                body.forEach( topic => {
                    expect(topic).toEqual({
                    description: expect.any(String),
                    slug: expect.any(String)
                    })
                })
            })
        })
    })
})


describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        test('200: sends a single article to the client by given id', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(( {body}) => {
                
                expect(body).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
                
            })
        })

        test('404: sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then(({body}) => {
            expect(body.message).toBe('article does not exist')
            })
        })

        test('400: sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
            .get('/api/articles/not-a-team')
            .expect(400)
            .then(({body}) => {
            expect(body.message).toBe('Invalid article id: not-a-team')
            })
        })
    })
    
    describe('PATCH', () => {
        describe('200: updates the article given by id and returns this article object', () => {
            test('increments the current article\'s vote property', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes : 1 })
                .expect(200)
                .then(( {body}) => {
                    expect(body).toEqual({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 101,
                        article_img_url: expect.any(String)
                    })
                })
            })
            test('decrements the current article\'s vote property', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes : -50 })
                .expect(200)
                .then(( {body}) => {
                    expect(body).toEqual({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 50,
                        article_img_url: expect.any(String)
                    })
                })
            })
            test('if the article doesn\'t have a votes property, it\'s incremented from 0 (votes value by defoult)', () => {
                return request(app)
                .patch('/api/articles/2')
                .send({ inc_votes : 10 })
                .expect(200)
                .then(( {body}) => {
                    expect(body).toEqual({
                        article_id: 2,
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: 10,
                        article_img_url: expect.any(String)
                    })
                })
            })
            test('if the article doesn\'t have a votes property, it\'s decremented from 0 (votes value by defoult)', () => {
                return request(app)
                .patch('/api/articles/2')
                .send({ inc_votes : -10 })
                .expect(200)
                .then(( {body}) => {
                    expect(body).toEqual({
                        article_id: 2,
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: -10,
                        article_img_url: expect.any(String)
                    })
                })
            })
        })

        test('400: responds with an error message when given an invalid id', () => {
            return request(app)
            .patch('/api/articles/not-an-id')
            .send({ inc_votes : 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('Bad request')
            })
        })

        test('404: responds with an error message when given a valid but non-existent id', () => {
            return request(app)
            .patch('/api/articles/999')
            .send({ inc_votes : 1 })
            .expect(404)
            .then(({ body }) => {
              expect(body.message).toBe('article not found')
            });
        })

        test('400: responds with an error message when given a body that does not contain the correct field', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('Bad request')
            })
        })

        test('400: responds with an error message when given a body with invalid field name', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({ inc_vote : 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('Bad request')
            })
        })

        test('400: responds with an error message when given a body with valid field but the value of a field is invalidan (inc_votes is not a number)', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes : 'not-a-number' })
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('Bad request')
            })
        })
    })
})

describe('/api/articles', () => {
    describe('GET', () => {
        test("200: responds with an array of all articles", () => {

            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(( {body}) => {
                expect(body).toHaveLength(13)
        
                body.forEach( article => {
                    expect(article).toEqual({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            })
        })

        test('200: responds with articles sorted by date in descending order by defoult', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(( {body} ) => {
              expect(body[0].title).toBe('Eight pug gifs that remind me of mitch')
              expect(body).toBeSorted({ key:'created_at', descending: true})
            })
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test('200: sends an array of comments for the given article_id', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body}) => {
                expect(body.length).toBe(11)

                body.forEach( comment => {
                    expect(comment).toEqual({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_id: 1
                    })
                })
            })
        })
        test('200: responds with comments sorted by date in ascending order by defoult', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(( {body} ) => {
              expect(body[0].comment_id).toBe(9)
              expect(body).toBeSorted({ key:'created_at', ascending: true})
            })
        })

        test('200: responds with an empty array if the article exists but has no comments', () => {
            return request(app)
            .get('/api/articles/7/comments')
            .expect(200)
            .then(({ body}) => {
                expect(body).toEqual([])
            })
        })

        test('400: responds with an error message when given an invalid id', () => {
            return request(app)
            .get('/api/articles/not-id/comments')
            .expect(400)
            .then(({ body}) => {
              expect(body.message).toBe('Bad request')
            })
          })
      
        test('404: responds with an error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({ body}) => {
            expect(body.message).toBe('Resource not found')
        })
        })
    })

    describe('POST', () => {
        test('201: inserts a new comment to the article givem by id and sends the new comment back to the client', () => {
            const newComment = {
                username: 'butter_bridge',
                body: 'I love pugs!!'
            }
            return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body).toEqual({
                    comment_id: expect.any(Number),
                    body: 'I love pugs!!',
                    author: 'butter_bridge',
                    created_at: expect.any(String),
                    votes: 0,
                    article_id: 3
                })
            })
        })

        test('400: responds with an error message when given an invalid id', () => {
            const newComment = {
                username: 'butter_bridge',
                body: 'I love pugs!!'
            }
            return request(app)
            .post('/api/articles/not-id/comments')
            .send(newComment)
            .expect(400)
            .then(({ body}) => {
              expect(body.message).toBe('Bad request')
            })
        })

        test('404: responds with an error message when given a valid but non-existent id', () => {
            const newComment = {
                username: 'butter_bridge',
                body: 'I love pugs!!'
            }
            return request(app)
            .post('/api/articles/999/comments')
            .send(newComment)
            .expect(404)
            .then(({ body}) => {
                expect(body.message).toBe('Resource not found')
            })
        })

        test('400: responds with an error message when given a body that does not contain the correct fields', () => {
            const newComment = {
                username: 'butter_bridge'
            }
            return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('Bad request')
            })
        })

        test('400: responds with an error message when given a body with valid fields but the value of a field is invalid', () => {
            const newComment = {
                username: '',
                body: 'I love pugs!!'
            }
            return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('Bad request')
            })
        })
    })
})

describe('/api/comments/:comment_id', () => {
    describe('DELETE', () => {
        test('204: deletes a comment from the database given a comment id', () => {
            return request(app).delete('/api/comments/1').expect(204)
        })

        test('404: responds with an error message when given comment id does not exist', () => {
            return request(app)
            .delete('/api/comments/999')
            .expect(404)  
            .then(({ body}) => {
                expect(body.message).toBe('Resource not found')
            })
        })

        test('400: responds with an error message when given invalid comment id', () => {
            return request(app)
            .delete('/api/comments/not-number')
            .expect(400)  
            .then(({ body}) => {
                expect(body.message).toBe('Bad request')
            })
        })
    })
})