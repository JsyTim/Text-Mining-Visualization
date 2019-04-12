//Initialize a map inside a div called map
var map = L.map('geospatial', {
  zoomControl: false,
  scrollWheelZoom: false,
  dragging: false,
  attributionControl: false,
}).setView([10.074329, 42.534796], 2.2);

// //initialize an info control
// var info = L.control();
//
// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };
//
// // method that we will use to update the control based on feature properties passed
// info.update = function (props) {
//
//     this._div.innerHTML = '<h4>Detailed Information</h4>' +
//         //ternary
//         (props ?
//         //if hovering on a district
//           "District: " + props.Region +
//           "<br>Water:" + props.Water + "%" +
//           "<br>Help: " + props.Help +
//           "<br>Food: " + props.Food + "%"
//         //if not hovering on a district
//         : 'Hover over a district');
// };
//
// //add info to map
// info.addTo(map);

//merge the two data sets
// for (i = 0; i < districts.features.length; i++) {
//   districts.features[i].properties.dist_num = i
//   // for (j = 0; j < region_concern.features.length; j++) {
//   //   if (districts.features[i].properties.dist_num == region_concern.features[j].region) {
//   //       districts.features[i].properties.count = region_concern.features[j].;
//   //   }
//   // }
// };
// year = '1995'
// for (i = 0; i < districts.features.length; i++) {
//   // districts.features[i].properties.dist_num = i
//   districts.features[i].properties.genres_nums = []
//   for (j = 0; j < region_concern[year].length; j++) {
//     if (districts.features[i].id == region_concern[year][j]['region_name'] || districts.features[i].properties.name == region_concern[year][j]['region_name']) {
//         districts.features[i].properties.count = region_concern[year][j]['counts'];
//         districts.features[i].properties.genres_nums = region_concern[year][j]['genres_nums'];
//     }
//   }
// };

var geojson;

var style_override = {};
var style_target = function(f) {
    return f.properties.count
};
var style_item = function(f) { return 'water'};
window.onload = function(e){
    // document.getElementById('change-water').click();
}
function merge_styles(base, new_styles){
    for (var attrname in new_styles) { base[attrname] = new_styles[attrname]; }
    return base;
}

//set color palatte
function getColor(d) {
  return d > 80 ? '#67000d' :
    d > 60 ? '#cb181d' :
    d > 40 ? '#ef3b2c' :
    d > 20 ? '#fb6a4a' :
    d > 0 ? '#fc9272' : '#ffffff'
};
//
// //set color palatte
// function getColor(d, item) {
//   if(item == 'water'){
//     console.log('water');
//       return   d > 80  ? '#006d2c' :
//                d > 60  ? '#2ca25f' :
//                d > 40  ? '#66c2a4' :
//                d > 20  ? '#99d8c9' :
//                d > 0   ? '#ccece6' : '#edf8fb'
//     }else if(item == 'help'){
//       console.log('help');
//       return   d > 1000 ? '#990000' :
//                d > 500  ? '#d7301f' :
//                d > 200  ? '#ef6548' :
//                d > 100  ? '#fc8d59' :
//                d > 50   ? '#fdbb84' :
//                d > 20   ? '#fdd49e' :
//                d > 10   ? '#fee8c8' :'#fff7ec';
//     }else if(item == 'food'){
//       console.log('food');
//       return   d > 80  ? '#980043' :
//                d > 60  ? '#dd1c77' :
//                d > 40  ? '#df65b0' :
//                d > 20  ? '#c994c7' :
//                d > 0   ? '#d4b9da' : '#f1eef6'
//     }
// };



//attach color palatte to category
function style(feature, color, item) {
    var target = style_target(feature);
    var item = style_item();
    var fillColor = (!color) ? getColor(target, item) : color;
    var default_style = {
        fillColor: fillColor,
        weight: 0.5,
        opacity: 1,
        color: 'grey',
        fillOpacity: 0.8

    };
    return merge_styles(default_style, style_override);
};
//
// function genreBar(nums){
//     var categories= ['Action', 'Adventure', 'Animation', 'Children', 'Comedy','Crime','Documentary','Drama','Fantasy','Film-Noir','Horror','IMAX','Musical','Mystery','Romance','Sci-Fi', 'Thriller', 'War'];
//
//     var colors = ["#F78571","#F98286","#F4839C","#E788B1","#D490C2","#BB99CF","#9DA2D6","#7DAAD7","#5BB1D0","#3CB6C4","#2CB9B3","#37BA9E","#4EBA87","#68B871","#82B55D","#9BB04E","#B3AA44","#C9A243","#DD9A4A","#ED9157"];
//
// 		var grid = d3.range(25).map(function(i){
// 			return {'x1':0,'y1':0,'x2':0,'y2':480};
// 		});
//
// 		var tickVals = grid.map(function(d,i){
// 			if(i>0){ return i*10; }
// 			else if(i===0){ return "100";}
// 		});
//
// 		var xscale = d3.scaleLinear()
// 						.domain([0,60])
// 						.range([0,700]);
//
// 		var yscale = d3.scaleLinear()
// 						.domain([0,categories.length])
// 						.range([0,480]);
//
// 		var colorScale = d3.scaleQuantize()
// 						.domain([0,categories.length])
// 						.range(colors);
//
// 		var canvas = d3.select('#wrapper')
// 						.append('svg')
// 						.attr('width',900)
// 						.attr('height',550)
//
// 		// var grids = canvas.append('g')
// 		// 				  .attr('id','grid')
// 		// 				  .attr('transform','translate(150,10)')
// 		// 				  .selectAll('line')
// 		// 				  .data(grid)
// 		// 				  .enter()
// 		// 				  .append('line')
// 		// 				  .attr('x1', function(d,i){ return i*30;})
// 		// 				  .attr('y1',function(d){ return d.y1; })
// 		// 				  .attr('x2',function(d,i){ return i*30; })
// 		// 				  .attr('y2',function(d){ return d.y2; })
// 		// 					.style('stroke','#adadad')
// 		// 					.style('stroke-width','1px');
//
// 		var xAxis = d3.axisBottom(xscale).tickValues(tickVals);
// 		var yAxis = d3.axisLeft(yscale)
// 					.tickSize(2)
// 					.tickFormat(function(d,i){ return categories[i]; })
// 					.tickValues(d3.range(17));
//
// 		var y_xis = canvas.append('g')
// 						  .attr("transform", "translate(150,0)")
// 						  .attr('id','yaxis')
// 						  .call(yAxis);
//
// 		var x_xis = canvas.append('g')
// 						  .attr("transform", "translate(150,480)")
// 						  .attr('id','xaxis')
// 						  .call(xAxis);
//
// 		var chart = canvas.append('g')
// 							.attr("transform", "translate(150,0)")
// 							.attr('id','bars')
// 							.selectAll('rect')
// 							.data(nums)
// 							.enter()
// 							.append('rect')
// 							.attr('height',19)
// 							.attr('x',0)
// 							.attr('y',function(d,i){ return yscale(i)-10; })
// 							.style('fill',function(d,i){ return colorScale(i); })
// 							.attr('width',function(d){ return 0; });
//
//
// 		var transit = d3.select("svg").selectAll("rect")
// 						    .data(nums)
// 						    .transition()
// 						    .duration(1000)
// 						    .attr("width", function(d) {return xscale(d); });
//
// 		var transitext = d3.select('#bars')
// 							.selectAll('text')
// 							.data(nums)
// 							.enter()
// 							.append('text')
// 							.attr('x', function(d) {return xscale(d)-200; })
// 							.attr('y', function(d,i){ return yscale(i)+35; })
// 							.text(function(d){ return d; }).style({'fill':'#fff','font-size':'14px'});
// }

var geojson = L.geoJson(districts, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
// L.geoJson(districts).addTo(map);
function clean() {
  $("#wrapper").empty();
  // var html = '<g><text></text></g>'
  // $("#chart").append(html);
}

function highlightFeature(e) {
    var layer = e.target;
    //on hover change color from what was defined in function style(feature)
    style_override = {
        weight: 3,
        color: '#666699',
        dashArray: '0.8',
        fillOpacity: 0.7
    }
    geojson.resetStyle(e.target);

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    clean();
    var nums = []
    nums = layer.feature.properties.genres_nums;
    console.log(nums)
    genreBar(nums);
     //on hover change infobox
    // info.update(layer.feature.properties);
}


//reset highlight when hovering out
function resetHighlight(e) {
    style_override = {};
    geojson.resetStyle(e.target);
    // info.update();
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}

var geojson = L.geoJson(districts, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


//create an initial legend for the map style on load
var legend;
//create an legend
var legend = L.control({
  position: 'topleft'
})
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = ['100', '80', '60', '40', '20', '0'],
    labels = [];

  // loop through categories and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i]) + '"></i> ' +
      grades[i] + '<br>';
  }
  return div;
};
legend.addTo(map);

function countsByYear(year){
  //merge the two data sets
  for (i = 0; i < districts.features.length; i++) {
    // districts.features[i].properties.dist_num = i
    if(region_concern[year] != "undefined" ){
      for (j = 0; j < region_concern[year].length; j++) {
        if (districts.features[i].id == region_concern[year][j]['region_name'] || districts.features[i].properties.name == region_concern[year][j]['region_name']) {
            districts.features[i].properties.count = region_concern[year][j]['counts'];
        }
      }
    }
  };

  map.eachLayer(function (layer) {
    map.removeLayer(layer)
  });

  var geojson = L.geoJson(districts, {
      style: style,
      onEachFeature: onEachFeature
  }).addTo(map);
}
