const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
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

describe("5. GET /api/reviews:review_id", () => {
  test("status:200, responds with an array of objects", () => {
    return request(app)
      .get("/api/reviews/6")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        console.log(review);
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
