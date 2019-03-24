var genres = new Set();
var movies = {};

//read data_network
d3.tsv("data_network/movies.dat").then( data => {
  data.forEach( d => {
    var key = d.id;
    var values = {};
    values.title = d.title;
    values.pic = d.rtPictureURL;
    movies[key] = values;
  });
  console.log(movies[1]);
});
d3.tsv("data_network/movie_genres.dat").then(data => {
  data.forEach( d => {
    if(!genres.has(d.genre)) {
      genres.add(d.genre);
      genres[d.genre] = [parseInt(d.movieID)];
    }
    else {
      genres[d.genre].push(parseInt(d.movieID));
    }
  });
  console.log(genres);
});

// console.log(genres);

// var outer = d3.map();
// var inner = [];
// var links = [];
