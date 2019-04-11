var genres = new Set();
var movies = {};
var dataset = [];

var MAX_NUM = 180;

//read data_network
d3.tsv("data_network/movies.dat").then( data => {

  // List all years
  var years = [];
  data.forEach( d=> {
    if( !years.includes(d.year)) {
      years.push(d.year);
    }
  });
  years.sort();

  min_year = d3.min(years);
  max_year = d3.max(years);

  // console.log(min_year);
  // console.log(max_year);

  // Init year-movie directory
  year_movie = {};
  for(i = min_year; i <= max_year; i++) {
    year_movie[i] = [];
  }
  // Sort all movies by years
  data.forEach( d=> {
    year_movie[d.year].push(d);
  });
  // console.log(year_movie);

  //Parse movies
  data.forEach( d => {
    var key = d.id;
    var values = {};
    values.title = d.title;
    values.pic = d.rtPictureURL;
    movies[key] = values;
  });

  d3.tsv("data_network/movie_genres.dat").then(data => {

    //Parse genres
    data.forEach( d => {
      if( !(d.genre in genres) ) {
        genres.add(d.genre);
      }
    });
    // console.log(genres);
    genres.forEach( d => {
      genres[d]=[];
    });

    var slider = d3
      .sliderHorizontal()
      .min(min_year)
      .max(max_year)
      .ticks(20)
      .step(1)
      .width(960)
      .default(2000)
      .displayValue(false)
      .on('onchange', val => {
        d3.select('#value').text(val);

        // Only keep 120 movies
        var sel_movies = year_movie[val].slice(0,120);
        // console.log(sel_movies);

        sel_movies.forEach( d => {
          var id = parseInt(d.id);
          var title = movies[id].title;
          data.forEach(da => {
            if (da.movieID == id) {
              genres[da.genre].push(title);
            }
          })
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
        // console.log(dataset);
        // console.log(dataset.inner.length);

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

        var colors = ["#F78571","#F98286","#F4839C","#E788B1","#D490C2","#BB99CF","#9DA2D6","#7DAAD7","#5BB1D0","#3CB6C4","#2CB9B3","#37BA9E","#4EBA87","#68B871","#82B55D","#9BB04E","#B3AA44","#C9A243","#DD9A4A","#ED9157"];

        var diameter= 750;
        var cavas_size = diameter + 300;
        var rect_width = 100;
        var rect_height = diameter/dataset.inner.length - 20;

        var link_width = "1px";

        var il = dataset.inner.length;
        var ol = dataset.outer.length;

        var inner_y = d3.scaleLinear()
                        .domain([0, il])
                        .range([-(il * rect_height)/2, (il * rect_height)/2]);

        mid  = (dataset.outer.length/2.0);
        var outer_x = d3.scaleLinear()
                        .domain([0, mid, mid, dataset.outer.length])
                        .range([15, 165, 195, 350]);
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
          var array = dataset.inner.map(d => d.name);
          // console.log(array)
          var index = array.indexOf(name)
          return colors[index];
        }

        function projectX(x) {
          return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
        }

        var svg = d3.select("#network").append("svg")
                    .attr("width", cavas_size)
                    .attr("height", cavas_size)
                    .append("g")
                    .attr("transform", "translate(" + cavas_size/2 + "," + cavas_size/2 + ")");

        //links
        var link = svg.append('g').attr('class', 'links').selectAll('.link')
                      .data(dataset.links)
                      .enter().append('path')
                      .attr('id', d => d.id)
                      .attr("d", d => {
                        var source = {x: d.outer.y * Math.cos(projectX(d.outer.x)),
                                      y: -d.outer.y * Math.sin(projectX(d.outer.x))};
                        var target = {x: d.inner.y + rect_height/2,
                                      y: d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width};
                        return diagonal(source, target);
                      })
                      .style("fill", "none")
                      .attr('stroke', d => get_color(d.inner.name))
                      .attr('stroke-width', link_width);

        //outer nodes
        var onode = svg.append('g').attr("class", "outer_node").selectAll(".outer_node")
                       .data(dataset.outer)
                       .enter().append("g")
                       .attr("transform", d => {return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";})
                       .on("mouseover", mouseover)
                       .on("mouseout", mouseout);

        onode.append("circle")
             .attr('id', d => d.id)
             .attr('r', 3);

        onode.append("circle")
             .attr('r', 5)
             .attr('visibility', 'hidden');

        onode.append("text")
             .attr('id', d => {return d.id + '-txt'})
             .attr('dy', '.31em')
             .attr('text-anchor', d => {return d.x < 180 ? "start" : "end";})
             .attr("transform", d => { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
             .text(d => d.name);

        // inner nodes
        var inode = svg.append('g').attr("class", "inner_node").selectAll(".inner_node")
                       .data(dataset.inner)
                       .enter().append("g")
                       .attr("transform", (d, i) => { return "translate(" + d.x + "," + d.y + ")";})
                       .on("mouseover", mouseover)
                       .on("mouseout", mouseout);

        inode.append('rect')
           .attr('width', rect_width)
           .attr('height', rect_height)
           .attr('id', d => d.id)
           .attr('fill', d => get_color(d.name));

        inode.append("text")
        	.attr('id', function(d) { return d.id + '-txt'; })
           .attr('text-anchor', 'middle')
           .attr("transform", "translate(" + rect_width/2 + ", " + rect_height * .75 + ")")
           .text(d => d.name);

        function mouseover(d)
        {
        	// bring to front
        	d3.selectAll('.links .link').sort(function(a, b){ return d.related_links.indexOf(a.id); });

           for (var i = 0; i < d.related_nodes.length; i++)
           {
               d3.select('#' + d.related_nodes[i]).classed('highlight', true);
               d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'bold').attr("font-size", "15px");
           }

           for (var i = 0; i < d.related_links.length; i++)
               d3.select('#' + d.related_links[i]).attr('stroke-width', '3.5px');
        }

        function mouseout(d)
        {
           for (var i = 0; i < d.related_nodes.length; i++)
           {
               d3.select('#' + d.related_nodes[i]).classed('highlight', false);
               d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'normal').attr("font-size", "12px");;
           }

           for (var i = 0; i < d.related_links.length; i++)
               d3.select('#' + d.related_links[i]).attr('stroke-width', link_width);
        }

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
          path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`
          return path
        };
      });

    d3.select('#slider')
      .append('svg')
      .attr('width', 1080)
      .attr('height', 80)
      .append('g')
      .attr('transform', 'translate(30,30)')
      .call(slider);

  });
});
