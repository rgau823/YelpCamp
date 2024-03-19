const express = require('express');
const router = express.Router();
const catchAsync = require('../util/CatchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isOwner, validateCampground  } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
  .get(catchAsync(campgrounds.showCampgrounds))
  .put(isLoggedIn, isOwner, upload.array('image'),  validateCampground, catchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isOwner, catchAsync(campgrounds.destroyCampground))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(campgrounds.renderEditForm))


module.exports = router;