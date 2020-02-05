const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');

describe(`Reviews service object`, function() {
 let db

 const testUsers = helpers.makeUsersArray();
 const testReviews = helpers.makeReviewsArray();

 before('make knex instance', () => {
  db = knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  })
  app.set('db', db)
 })

 after('disconnect from db', () => db.destroy());

 beforeEach('clean the table', () => db.raw(
  `TRUNCATE
    reviewstream_reviews,
    reviewstream_users
    RESTART IDENTITY CASCADE`
  )
  .then(() => {
    return db
      .into('reviewstream_users')
      .insert(testUsers)
      .then(() => {
        db.raw(
          `SELECT setval('reviewstream_users_id_seq', ?)`,
          [testUsers[testUsers.length - 1].id],
        )
      })
  })
  .then(() => {
    return db
      .into('reviewstream_reviews')
      .insert(testReviews)
      .then(() => {
        db.raw(
          `SELECT setval('reviewstream_reviews_id_seq', ?)`,
          [testReviews[testReviews.length - 1].id],
        )
      })
  })
 );


 describe('POST /api/reviews', () => {
  it(`adds review to review list, responding with 201`, () => {
    const newReview = {
      user_id: 1,
      show_name: 'Girls',
      season: 4,
      streaming_service: 'HBO Now',
      review: 'It was ok, other seasons were better.',
      rating: 3
    }

  return supertest(app)
    .post('/api/reviews')
    .set('Content-Type', 'application/json')
    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
    .send(newReview)
    .expect(201)
  })
 })


 describe(`GET /api/reviews/user/:user_id`, () => {
  context(`Given no reviews for user id`, () => {
    it(`responds with 404`, () => {
    const userId = 123
    return supertest(app)
      .get(`/api/reviews/user/${userId}`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(404)
      })
    })
    context('Given there are reviews in the database', () => {
      it('responds with 200 and the specified review', () => {
        const reviewId = 1
        const testUserId = testUsers[0].id
        testReviews[0].id = 1
        return supertest(app)
          .get(`/api/reviews/user/${testUserId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, testReviews)
    })
  })
 })


 describe(`GET /api/reviews/:review_id`, () => {
  context(`Given no reviews`, () => {
    it(`responds with 404`, () => {
      const reviewId = 123
      return supertest(app)
        .get(`/api/reviews/${reviewId}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(404, { error: { message: "Review does not exist"} })
      })
    })
    context('Given there are reviews in the database', () => {
      it('responds with 200 and the specified review', () => {
        const reviewId = 1
        const testReview = testReviews[0]
        return supertest(app)
          .get(`/api/reviews/${reviewId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          // .expect(200, testReview)
          .expect(res => {
              // console.log(res.body, 'reviewtest')
              expect(res.body).to.eql(testReview)
          })
          .expect(200)
    })
  })
 })

 describe('PATCH /api/reviews/:review_id', () => {
  it(`responds 204 when updated field is submitted`, () => {
    return supertest(app)
      .patch(`/api/reviews/1`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .send({ streaming_service: 'Netflix' })
      .expect(204)
  })
 })

 describe(`DELETE api/reviews/:review_id`, () => {
  it('responds with 204', () => {
  const reviewId = 1
    return supertest(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(204)
  })
 })
})