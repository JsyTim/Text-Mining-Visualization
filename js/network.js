var genres = {};
var movies = {};
var dataset = [];

var MAX_NUM = 360;

//read data_network
d3.tsv("data_network/movies.dat").then( data => {
  //Parse movies
  data.forEach( d => {
    var key = d.id;
    var values = {};
    values.title = d.title;
    values.pic = d.rtPictureURL;
    movies[key] = values;
  });
  // console.log(movies[1]);
  d3.tsv("data_network/movie_genres.dat").then(data => {
    //Parse genres
    var sel_movies = data.filter( d => d.movieID <= MAX_NUM);
    sel_movies.forEach( d => {
      var title = movies[parseInt(d.movieID)].title;
      if (!(d.genre in genres)) {
        genres[d.genre] = [title];
      }
      else {
        genres[d.genre].push(title);
      }
    });
    // console.log(genres);
    // build dataset
    dataset = Object.keys(genres).map( key => {
      return [key, genres[key]];
    });
    dataset.sort( (a, b) => {
      return (a[0] < b[0])? -1 : 1;
    })
    // console.log(dataset);

    var outer = d3.map();
    var inner = [];
    var links = [];

    var outerId = [0];

    dataset.forEach( d => {
      if( d == null)
        return;
      i = { id: 'i' + inner.length, name: d[0], related_links:[]};
      i.related_nodes = [i.id];
      inner.push(i);

      if(!Array.isArray(d[1]))
        d[1] = [d[1]];

      d[1].forEach( d1 => {
        o = outer.get(d1);

        if(o == null) {
          o = { name: d1, id: 'o' + outerId[0], related_links:[]};
          o.related_nodes = [o.id];
          outerId[0] = outerId[0] + 1;

          outer.set(d1, o);
        }

        l = {id: 'l-' + i.id + '-' + o.id, inner: i, outer: o}
        links.push(l);

        i.related_nodes.push(o.id);
        i.related_links.push(l.id);
        o.related_nodes.push(i.id);
        o.related_links.push(l.id);
      });
    });

    dataset = {
      inner: inner,
      outer: outer.values(),
      links: links
    }
    console.log(dataset);

    outer = dataset.outer;
    dataset.outer = Array(outer.length);

    var i1 = 0;
    var i2 = outer.length - 1;

    for( var i = 0; i < dataset.outer.length; ++i) {
      if( i % 2 == 1)
        dataset.outer[i2--] = outer[i];
      else
        dataset.outer[i1++] = outer[i];
    }

    // console.log(dataset.outer.reduce( (a,b) => { return a + b.related_links.length;}, 0)/dataset.outer.length);

    var colors = ["#FB8577","#F98396","#E98AB4","#CB96CC","#A2A3D8","#72AED8","#42B6CA","#28BAB2","#41BB93","#66B973","#8BB457","#AEAC45","#CDA143","#E79550","#F88969"]
    var color = d3.scaleLinear()
                  .domain([60, 220])
                  .range([colors.length - 1], 0)
                  .clamp(true);

    var diameter= 960;
    var rect_width = 100;
    var rect_height = 20;

    var link_width = "2px";

    var il = dataset.inner.length;
    var ol = dataset.outer.length;

    var inner_y = d3.scaleLinear()
                    .domain([0, il])
                    .range([-(il * rect_height)/2, (il * rect_height)/2]);

    mid  = (dataset.outer.length/2.0);
    var outer_x = d3.scaleLinear()
                    .domain([0, mid, mid, dataset.outer.length])
                    .range([15, 170, 190, 355]);
    var outer_y = d3.scaleLinear()
                    .domain([0, dataset.outer.length])
                    .range([0, diameter / 2 - 120]);

    dataset.outer = dataset.outer.map( (d, i) => {
      d.x = outer_x(i);
      d.y = diameter/3;
      return d;
    });
    dataset.inner = dataset.inner.map( (d, i) => {
      d.x = -(rect_width / 2);
      d.y = inner_y(i);
      return d;
    });

    function get_color(name) {
      var c = Math.round(color(name));
      if(isNaN(c))
        return '#dddddd';
      return colors[c];
    }

    function projectX(x) {
      return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
    }

    // var linkdata = dataset.links.map(d => {
    //   return {
    //     source: {
    //       x: dataset.outer.y * Math.cos(projectX(dataset.outer.x)),
    //       y: -dataset.outer.y * Math.sin(projectX(dataset.outer.x))
    //     },
    //     target: {
    //       x: dataset.inner.y + rect_height/2,
    //       y: -dataset.outer.x > 180 ? dataset.inner.x : dataset.inner.x + rect_width
    //     }
    //   }
    // });

    // var diagonal = d3.linkHorizontal()
    //                  .x( d => d.x)
    //                  .y( d => d.y);
    //
    //
    // var svg = d3.select("#network").append("svg")
    //             .attr("width", diameter)
    //             .attr("height", diameter)
    //             .append("g")
    //             .attr("transform", "translate(" + diameter/2 + "," + diameter/2 + ")");
    //
    // // links
    // var link = svg.append('g').attr('class', 'links').selectAll('.link')
    //               .data(dataset.links)
    //               .enter().append('path')
    //               .attr('id', d => d.id)
    //               .attr("d", diagonal(linkdata))
    //               .attr('stroke', d => get_color(d.inner.name))
    //               .attr('stroke-width', link_width);


  });
});
