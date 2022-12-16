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

describe("2. GET -wrong path-", () => {
  test("status:404, responds with appropriate error message", () => {
    return request(app)
      .get("/mistake/path")
      .expect(404)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Sorry what?");
      });
  });
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

describe("5. GET /api/reviews/:review_id", () => {
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

describe("6. GET /api/comments/:review_id/comments", () => {
  test("status:200, responds with an array of objects", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              review_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status:200, responds with an empty array when there are no comments", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
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
});

describe("7. POST /api/reviews/:review_id/comments", () => {
  test("status:201, responds with the posted comment object", () => {
    const newComment = {
      username: "dav3rid",
      body: "Absulutely amazing gamme, would definetely recommend",
    };
    return request(app)
      .post("/api/reviews/13/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.body).toBe(newComment.body),
          expect(comment.author).toBe(newComment.username),
          expect(comment.review_id).toBe(13);
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("status:400, post body missing required fields", () => {
    const newComment = {
      body: "good game",
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Very Bad Request!");
      });
  });
  test("status:404, post body with non-existent username", () => {
    const newComment = {
      username: "kontsio",
      body: "good game",
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Not found!");
      });
  });
  test("status:404, post body with non-existent review_id", () => {
    const newComment = {
      username: "dav3rid",
      body: "good game",
    };
    return request(app)
      .post("/api/reviews/115/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Not found!");
      });
  });
  test("status:400, post body with an invalid review_id", () => {
    const newComment = {
      username: "dav3rid",
      body: "good game",
    };
    return request(app)
      .post("/api/reviews/banana/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Very Bad Request!");
      });
  });
});

describe("8. PATCH /api/reviews/:review_id", () => {
  test("status:200, responds with the amended review object - positive increment", () => {
    const patchedVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/7")
      .send(patchedVotes)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          review_id: 7,
          title: "Mollit elit qui incididunt veniam occaecat cupidatat",
          category: "social deduction",
          designer: "Avery Wunzboogerz",
          owner: "mallionaire",
          review_body:
            "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
          review_img_url:
            "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: "2021-01-25T09:16:54.963Z",
          votes: 10,
        });
      });
  });
  test("status:200, responds with the amended review object - negative increment", () => {
    const patchedVotes = { inc_votes: -3 };
    return request(app)
      .patch("/api/reviews/7")
      .send(patchedVotes)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          review_id: 7,
          title: "Mollit elit qui incididunt veniam occaecat cupidatat",
          category: "social deduction",
          designer: "Avery Wunzboogerz",
          owner: "mallionaire",
          review_body:
            "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
          review_img_url:
            "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: "2021-01-25T09:16:54.963Z",
          votes: 6,
        });
      });
  });
  test("status:200 patch body includes invalid fields", () => {
    const patchedVotes = { inc_votes: 4, bestProgrammerAround: "me" };
    return request(app)
      .patch("/api/reviews/7")
      .send(patchedVotes)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          review_id: 7,
          title: "Mollit elit qui incididunt veniam occaecat cupidatat",
          category: "social deduction",
          designer: "Avery Wunzboogerz",
          owner: "mallionaire",
          review_body:
            "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
          review_img_url:
            "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: "2021-01-25T09:16:54.963Z",
          votes: 13,
        });
      });
  });
  test("status:400 patch body missing required fields", () => {
    const patchedVotes = {};
    return request(app)
      .patch("/api/reviews/7")
      .send(patchedVotes)
      .expect(400)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Very Bad Request!");
      });
  });
  test("status:400 patch body invalid inc_votes increment", () => {
    const patchedVotes = { inc_votes: "It's snowing!" };
    return request(app)
      .patch("/api/reviews/7")
      .send(patchedVotes)
      .expect(400)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Very Bad Request!");
      });
  });
  test("status:400 invalid review_id", () => {
    const patchedVotes = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/bananas")
      .send(patchedVotes)
      .expect(400)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Very Bad Request!");
      });
  });
  test("status:400 review_id is valid but does not exist", () => {
    const patchedVotes = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/112")
      .send(patchedVotes)
      .expect(404)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Not Found!");
      });
  });
});

describe("10. GET /api/reviews (queries)", () => {
  test("status:400 invalid query schema", () => {
    return request(app)
      .get("/api/reviews?bananas")
      .expect(400)
      .then((res) => {
        const msg = res.body.msg;
        expect(msg).toBe("Very Bad Request!");
      });
  });
  describe("GET /api/reviews?category=...", () => {
    test("status:200, responds with an array of review objects of the query category", () => {
      return request(app)
        .get("/api/reviews?category=hidden-roles")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          reviews.forEach((review) => {
            expect(review.category).toBe("hidden-roles");
            expect(review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
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
    test("status:200, responds with an array of review objects of the query category", () => {
      return request(app)
        .get("/api/reviews?category=strategy")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          reviews.forEach((review) => {
            expect(review.category).toBe("strategy");
            expect(review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
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
    test("status:200 query category does not exist", () => {
      return request(app)
        .get("/api/reviews?category=pop-culture")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toEqual([]);
        });
    });
    describe("GET /api/reviews?sort_by=...", () => {
      test("status:200 responds with an array of sorted review objects", () => {
        return request(app)
          .get("/api/reviews?sort_by=owner")
          .expect(200)
          .then(({ body }) => {
            const { reviews } = body;
            expect(reviews).toBeSortedBy("owner", { descending: true });
            reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  designer: expect.any(String),
                })
              );
            });
          });
      });
      test("status:200 responds with an array of sorted review objects", () => {
        return request(app)
          .get("/api/reviews?sort_by")
          .expect(200)
          .then(({ body }) => {
            const { reviews } = body;
            expect(reviews).toBeSortedBy("created_at", { descending: true });
            reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  designer: expect.any(String),
                })
              );
            });
          });
      });
      test("status:400 query category does not exist", () => {
        return request(app)
          .get("/api/reviews?sort_by=pop-culture")
          .expect(400)
          .then((res) => {
            console.log(res.body);
            const msg = res.body.msg;
            expect(msg).toBe("Very Bad Request!");
          });
      });
    });
    describe.only("GET /api/reviews?sort_by=...&order=...", () => {
      test("status:200 responds with an array of ordered sorted review objects", () => {
        return request(app)
          .get("/api/reviews?sort_by=owner&order=asc")
          .expect(200)
          .then(({ body }) => {
            const { reviews } = body;
            expect(reviews).toBeSortedBy("owner");
            reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  designer: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
});
