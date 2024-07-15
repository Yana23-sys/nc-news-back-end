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
            
            expect(body.article).toEqual({
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
        expect(body.message).toBe('Bad request')
        })
    })
})