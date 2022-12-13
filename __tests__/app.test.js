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

describe("3. GET /api/categories", () => {
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

describe("4. GET /api/reviews", () => {
  test("status:200, responds with an array of objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
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
        expect(review).toMatchObject({
          review_id: 6,
          title: "Occaecat consequat officia in quis commodo.",
          category: "social deduction",
          designer: "Ollie Tabooger",
          owner: "mallionaire",
          review_body:
            "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: "2020-09-13T12:19:28.077Z",
          votes: 8,
        });
      });
  });
  test("status:400, review_id is not a number", () => {
    return request(app)
      .get("/api/reviews/EhWhatWasThatIdAgain")
      .expect(400)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Very Bad Request!");
      });
  });
  test("status:404, review_id is a non-valid number", () => {
    return request(app)
      .get("/api/reviews/1445")
      .expect(404)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Not Found!");
      });
  });
});

describe("6. GET /api/comments/:review_id/comments", ()=>{
  test("status:200, responds with an array of objects", ()=>{
    return request(app)
    .get("/api/reviews/3/comments")
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      expect(comments).toBeSortedBy('created_at', {descending: true})
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
  test("status:200, responds with an empty array when there are no comments", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then(({body}) => {
        const {comments} = body;
        expect(comments).toEqual([])
      });
  });
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
      .get("/api/reviews/1453/comments")
      .expect(404)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Not Valid Review Id");
      });
  });
})