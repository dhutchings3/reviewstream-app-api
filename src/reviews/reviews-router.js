const express = require('express')
const ReviewsService = require('./reviews-service')
const { requireAuth } = require('../middleware/jwt-auth')
const reviewsRouter = express.Router()
const bodyParser = express.json()
const UsersService = require('../users/users-service')

reviewsRouter
  .route('/')
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { user_id, show_name, season, streaming_service, review, rating } = req.body
    const newReview = { user_id, show_name, season, streaming_service, review, rating }

    for (const [key, value] of Object.entries(newReview))
      if (value == null)
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      })
    ReviewsService.postReview(req.app.get('db'), newReview)
      .then(review => {
        res.status(201).send(newReview)
      })
      .catch((error) => {
        next(error)
      })
  })

reviewsRouter
  .route('/user/:user_id')
  .get((req, res, next) => {
    UsersService.getUserById(req.app.get('db'), req.params.user_id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(404)
        }
        return ReviewsService.getReviewsByUserId(req.app.get('db'), req.params.user_id)
          .then(reviews => {
          res.json(reviews)
        })
      })
      .catch(next)
  })

reviewsRouter
  .route('/:review_id')
  .all((req, res, next) => {
    ReviewsService.getReviewById(req.app.get('db'), req.params.review_id)
      .then(review => {
        if (!review) {
          return res.status(404).json({
            error: { message: "Review does not exist"}
          })
        }
        res.reivew = review
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.review)
  })
  .patch(requireAuth, bodyParser, (req, res, next) => {
    const { user_id, show_name, season, streaming_service, review, rating } = req.body
    const updatedReview = { user_id, show_name, season, streaming_service, review, rating }

    for (const [key, num] of Object.entries(updatedReview))
      if (num == 0)
        return res.status(400).json({
          error: { message: `Body must contain updated content` }
        })

    ReviewsService.updateReview(req.app.get('db'), req.params.review_id, updatedReview)
      .then(review => {
        res.status(204).end()
      })
      .catch(next)
  })
  .delete(requireAuth, (req, res, next) => {
    ReviewsService.deleteReview(req.app.get('db'), req.params.review_id)
      .then(review => {
        res.status(204).end()
      })
      .catch(next)
  })



module.exports = reviewsRouter;