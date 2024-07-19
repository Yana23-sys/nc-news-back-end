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
        test('200: sends a single article to the client by given id.', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(( {body}) => {
                
                expect(body).toMatchObject({
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

        test('200: It should also include comment_count property, which is the total count of all the comments with this article_id', () => {
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
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    comment_count: 11
                })
            })
        })

        test('200: sends the article with comment_count = 0, if it has no comments', () => {
            return request(app)
            .get('/api/articles/11')
            .expect(200)
            .then(( {body}) => {
                expect(body.comment_count).toBe(0)
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


        describe('?sort_by= responds with an array of articles that is ordered by the given sort_by query column name', () => {
            test('title', () => {
                return request(app)
                .get('/api/articles?sort_by=title')
                .expect(200)
                .then(( {body} ) => {
                    expect(body[0].title).toBe('Z')
                    expect(body).toBeSorted({ key:'title', descending: true})
                })
            })
            test('author', () => {
                return request(app)
                .get('/api/articles?sort_by=author')
                .expect(200)
                .then(( {body} ) => {
                    expect(body[0].author).toBe('rogersop')
                    expect(body).toBeSorted({ key:'author', descending: true})
                })
            })
            test('topic', () => {
                return request(app)
                .get('/api/articles?sort_by=topic')
                .expect(200)
                .then(( {body} ) => {
                    expect(body[0].topic).toBe('mitch')
                    expect(body).toBeSorted({ key:'topic', descending: true})
                })
            })
        })
        test('400: responds with "bad request" error message when given an invalid sort_by query', () => {
            return request(app)
            .get('/api/articles?sort_by=invalid-query')
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('invalid query')
            })
        })


        test('?order= responds with an array of treasures ordered by the given order query', () => {
            return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(( {body} ) => {
                expect(body).toBeSortedBy('created_at')
            })
        })
        test('400: responds with "bad request" error message when given an invalid order query', () => {
            return request(app)
            .get('/api/articles?order=invalid-query')
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('invalid query')
            })
        })


        test('?topic= responds with only the articles from given topic query', () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveLength(1)

                body.forEach(article => {
                    expect(article).toEqual({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: 'cats',
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })    
            })
        })
        test('?topic= responds with 200 and an empty array when given topic exists but has no articles', () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual([])
            })
        })
        test('404: responds with "not found" error message when given a topic that does not exist', () => {
            return request(app)
            .get('/api/articles?topic=dogs')
            .expect(404)
            .then(({ body }) => {
              expect(body.message).toBe('not found')
            })
        })


        test('200: sort_by and order queries together', () => {
            return request(app)
              .get('/api/articles?sort_by=title&order=asc')
              .expect(200)
              .then(({ body }) => {
                expect(body).toBeSorted('title', { ascending: true })
              })
        })
        test('200: sort_by, order and topic queries all together', () => {
            return request(app)
            .get('/api/articles?topic=mitch&sort_by=author&order=asc')
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveLength(12)

                body.forEach(article => {
                expect(article.topic).toBe('mitch')
                })

                expect(body).toBeSorted('author', { ascending: true })
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
    describe('PATCH', () => {
        describe('200: updates the comment given by id and returns this comment object', () => {
            test('increments the current comment\'s vote property', () => {
                return request(app)
                .patch('/api/comments/1')
                .send({ inc_votes : 1 })
                .expect(200)
                .then(( {body}) => {
                    expect(body).toEqual({
                        comment_id: 1,
                        body: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: 17,
                        article_id: expect.any(Number)
                    })
                })
            })
            test('decrements the current comment\'s vote property', () => {
                return request(app)
                .patch('/api/comments/1')
                .send({ inc_votes : -1 })
                .expect(200)
                .then(( {body}) => {
                    expect(body).toEqual({
                        comment_id: 1,
                        body: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: 15,
                        article_id: expect.any(Number)
                    })
                })
            })
        
        })

        test('400: responds with an error message when given an invalid id', () => {
            return request(app)
            .patch('/api/comments/not-an-id')
            .send({ inc_votes : 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('Bad request')
            })
        })

        test('404: responds with an error message when given a valid but non-existent id', () => {
            return request(app)
            .patch('/api/comments/999')
            .send({ inc_votes : 1 })
            .expect(404)
            .then(({ body }) => {
              expect(body.message).toBe('comment not found')
            });
        })

        test('400: responds with an error message when given a body that does not contain the correct field', () => {
            return request(app)
            .patch('/api/comments/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('Bad request')
            })
        })

        test('400: responds with an error message when given a body with invalid field name', () => {
            return request(app)
            .patch('/api/comments/1')
            .send({ inc_v : 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('Bad request')
            })
        })

        test('400: responds with an error message when given a body with valid field but the value of a field is invalidan (inc_votes is not a number)', () => {
            return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes : 'not-a-number' })
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe('Bad request')
            })
        })
    })
})

describe('/api/users', () => {
    describe('GET', () => {
        test('200: responds with an array of all users', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveLength(4)

                body.forEach(user => {
                    expect(user).toEqual({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
        })
    })
})

describe('/api/users/:username', () => {
    describe('GET', () => {
        test('200: responds with a user object by given id', () => {
            return request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(( {body}) => {
                
                expect(body).toMatchObject({
                    username: 'butter_bridge',
                    name: 'jonny',
                    avatar_url:
                    'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                })  
            })
        })

        test('404: sends an appropriate status and error message when given a non-existent username', () => {
            return request(app)
            .get('/api/users/not-exist')
            .expect(404)
            .then(({body}) => {
            expect(body.message).toBe('user not found')
            })
        })
    })
})