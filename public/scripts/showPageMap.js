mapboxgl.accessToken = mbToken;
const map = new mapboxgl.Map({
	container: 'show-map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({ offset: 25})
  .setHTML(
    `<h3>${campground.title}</h3>`
  )
)
.addTo(map);

map.addControl(new mapboxgl.NavigationControl());