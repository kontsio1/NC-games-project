const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { get } = require("../app");
beforeEach(() => seed(testData));

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

// describe("2. GET /api/comments", () => {
//   test("status:200, responds with an array of objects", () => {
//     return request(app)
//       .get("/api/comments")
//       .expect(200)
//       .then(({ body }) => {
//         const { comments } = body;
//         expect(comments).toHaveLength(13);
//         comments.forEach((review) => {
//           expect(review).toEqual(
//             expect.objectContaining({
//               owner: expect.any(String),
//               title: expect.any(String),
//               review_id: expect.any(Number),
//               category: expect.any(String),
//               review_img_url: expect.any(String),
//               created_at: expect.any(String),
//               votes: expect.any(Number),
//               designer: expect.any(String),
//               comment_count: expect.any(Number),
//             })
//           );
//         });
//       });
//   });
// });

describe("6. GET /api/comments/:review_id/comments", ()=>{
  test("status:200, responds with an array of objects", ()=>{
    return request(app)
    .get("/api/reviews/3/comments")
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            review_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String)
          })
        );
      });
    });
  })
  test("status:400, review_id is not a number", () => {
    return request(app)
      .get("/api/reviews/EhWhatWasThatIdAgain/comments")
      .expect(400)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Very Bad Request!");
      });
  });
  test("status:404, review_id is a non-valid number", () => {
    return request(app)
      .get("/api/reviews/1445/comments")
      .expect(404)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Not Valid Review Id");
      });
  });
})