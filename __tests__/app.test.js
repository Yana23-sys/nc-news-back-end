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
    test('GET:200 sends a single article to the client by given id', () => {
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

    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body}) => {
        expect(body.message).toBe('article does not exist')
        })
    })

    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
        .get('/api/articles/not-a-team')
        .expect(400)
        .then(({body}) => {
        expect(body.message).toBe('Invalid article id: not-a-team')
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

describe.only('/api/articles/:article_id/comments', () => {
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
                        article_id: expect.any(Number)
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
            expect(body.message).toBe('article not found')
        })
        })
    })
})