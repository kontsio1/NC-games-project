const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
beforeEach(() => seed(testData));
// jest.setTimeout(10000);

afterAll(() => {
  if (db.end) db.end();
});

describe("1. GET /api/categories", () => {
  test("status:200, responds with an array of objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("5. GET /api/reviews:review_id", () => {
  test("status:200, responds with an array of objects", () => {
    return request(app)
      .get("/api/reviews/6")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  })
  test("status:400, review_id is not a number", ()=> {
    return request(app)
    .get("/api/reviews/EhWhatWasThatIdAgain")
    .expect(400)
    .then( (res) => {
      const msg = res.body.msg;
      expect(msg).toBe('Very Bad Request!');
    })
  })
  test("status:404, review_id is a non-valid number", ()=> {
    return request(app)
    .get("/api/reviews/1445")
    .expect(404)
    .then( (res) => {
      const msg = res.body.msg;
      expect(msg).toBe('Not Found!');
    })
  })
});
