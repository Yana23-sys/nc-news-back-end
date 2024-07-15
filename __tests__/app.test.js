const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const app = require('../app.js')

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