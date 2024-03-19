const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../util/CatchAsync');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewer } = require('../middleware')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewer, catchAsync(reviews.destroyReview));

module.exports = router;