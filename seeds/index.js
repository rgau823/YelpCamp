const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=> {
  console.log('Mongo connection open');
})
.catch(err => {
  console.log('Mongo error detected');
  console.log(err);
})

const  db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
  console.log('Database connected');
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async()=> {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const price = Math.floor(Math.random() * 20) + 10;
    const rand1000 = Math.floor(Math.random()*1000)
    const camp = new Campground({
      author: '65e8e206ca0f838567c3f2ed',
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      geometry: { type: 'Point', coordinates: [
        cities[rand1000].longitude, 
        cities[rand1000].latitude
      ] 
    },
      title: `${sample(descriptors)} ${sample(places)}`,
      image: [
        {
          url: 'https://res.cloudinary.com/dzsgts8jb/image/upload/v1709952236/YelpCamp/rzbkjbiwuk256rbbe7ss.jpg',
          filename: 'YelpCamp/rzbkjbiwuk256rbbe7ss',
        },
        {
          url: 'https://res.cloudinary.com/dzsgts8jb/image/upload/v1709952236/YelpCamp/mxjvituzxmpxfzstjuwq.jpg',
          filename: 'YelpCamp/mxjvituzxmpxfzstjuwq',
        }
      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi fuga impedit placeat beatae, quibusdam, corrupti voluptates harum aperiam iure illo amet error soluta dolores explicabo dolorem suscipit, totam delectus dolor.',
      price
    })
    await camp.save();
  }
}

seedDB().then(()=> {
  mongoose.connection.close();
});