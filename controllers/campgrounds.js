const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding( {accessToken: mbToken })

module.exports.index = async (req, res)=> {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res)=> { 
  res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next)=> {
  const geoData = await geoCoder.forwardGeocode( {
    query: req.body.campground.location,
    limit: 1
  }).send()
  const newCG = new Campground (req.body.campground);
  newCG.geometry = geoData.body.features[0].geometry;
  newCG.author = req.user._id;
  newCG.image = req.files.map( f => ({url: f.path, filename: f.filename}))
  await newCG.save();
  console.log(newCG);
  req.flash('success', 'New campground successfully created');
  res.redirect(`/campgrounds/${newCG._id}`);
}

module.exports.showCampgrounds = async(req, res)=> {
  const campground = await Campground.findById(req.params.id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
  if(!campground) {
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async(req, res)=> {
  const { id } = req.params;
  const campground = await Campground.findById(req.params.id);
  if(!campground) {
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground })
}


module.exports.updateCampground = async (req, res)=> {
  const { id } = req.params;
  const campg = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  const imgs = req.files.map( f => ({url: f.path, filename: f.filename}))
  campg.image.push(...imgs);
  await campg.save();
  if(req.body.deleteImage) {
    for (let f of req.body.deleteImage) {
      await cloudinary.uploader.destroy(f);
    }
    await campg.updateOne({$pull: {image: {filename: {$in: req.body.deleteImage}}}})
    console.log(campg);
  }
  
  req.flash('success', 'Successfully updated campground')
  res.redirect(`/campgrounds/${campg._id}`);
}

module.exports.destroyCampground = async(req, res)=> {
  const { id } = req.params;
  const campground = await Campground.findById(req.params.id);
  if(!campground) {
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds');
  }

  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Campground deleted');
  res.redirect('/campgrounds');
}