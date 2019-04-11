//Initialize a map inside a div called map
var map = L.map('geospatial', {
  zoomControl: false,
  scrollWheelZoom: false,
  dragging: false,
  attributionControl: false,
}).setView([0.074329, 30.534796], 1.75);

//initialize an info control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {

    this._div.innerHTML = '<h4>Detailed Information</h4>' +
        //ternary
        (props ?
        //if hovering on a district
          "District: " + props.Region +
          "<br>Water:" + props.Water + "%" +
          "<br>Help: " + props.Help +
          "<br>Food: " + props.Food + "%"
        //if not hovering on a district
        : 'Hover over a district');
};

//add info to map
info.addTo(map);

//merge the two data sets
for (i = 0; i < districts.features.length; i++) {
  districts.features[i].properties.dist_num = i
  // for (j = 0; j < region_concern.features.length; j++) {
  //   if (districts.features[i].properties.dist_num == region_concern.features[j].region) {
  //       districts.features[i].properties.count = region_concern.features[j].;
  //   }
  // }
};
for (i = 0; i < districts.features.length; i++) {
  // districts.features[i].properties.dist_num = i
  for (j = 0; j < region_concern.features.length; j++) {
    if (districts.features[i].properties.dist_num == region_concern.features[j].dist_num) {
        districts.features[i].properties.count = region_concern.features[j].count;
    }
  }
};
console.log(districts);
//merge the two data sets
for (i=0; i<districts.features.length; i++) {
    //console.log("districts.features[i].properties ", typeof districts.features[i].properties);
    //console.log("districts.features.properties.dist_num ", districts.features[i].properties.dist_num);
    // for (j=0; j<test_data.features.length; j++) {
        // if (districts.features[i].properties.dist_num == test_data.features[j].dist_num) {
        //     //console.log("IN DISTRICTS", districts.features[i].properties.dist_num, "IN TEST DATA", test_data.features[j].dist_num);
        //     districts.features[i].properties.Region = test_data.features[j].Region;
        //     districts.features[i].properties.Water = test_data.features[j].Water;
        //     districts.features[i].properties.Help = test_data.features[j].Help;
        //     districts.features[i].properties.Food = test_data.features[j].Food;
        // }
    }
    //districts.features[i].properties.anotherItem = "Whatever";
    //console.log('districts.features.properties.anotherItem', districts.features[i].properties.anotherItem);
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

var geojson = L.geoJson(districts, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
// L.geoJson(districts).addTo(map);

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

     //on hover change infobox
    info.update(layer.feature.properties);
}


//reset highlight when hovering out
function resetHighlight(e) {
    style_override = {};
    geojson.resetStyle(e.target);
    info.update();
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

//
// //click to change color style to Water categories
// document.getElementById("change-water")
//         .addEventListener('click', function () {
//           style_target = function(f) { return f.properties.Water };
//           style_item = function(f){ return 'water' };
//           geojson.setStyle(style);
//
//           if (legend instanceof L.Control) { map.removeControl(legend); }
//
//           legend = L.control({position: 'topright'});
//
//           legend.onAdd = function (map) {
//
//             var div = L.DomUtil.create('div', 'info legend'),
//                 grades = ['0', '20','40','60','80','100'],
//                 labels = [];
//
//             // loop through categories and generate a label with a colored square for each interval
//             for (var i = 0; i < grades.length; i++) {
//                 div.innerHTML +=
//                     '<i style="background:' + getColor(grades[i], 'water') + '"></i> ' +
//                     grades[i]  + '<br>' ;
//             }
//             console.log("DIV FOR CHANGE WATER: ", div.innerHTML);
//             div.innerHTML += "<i style='background:gray'></i> unknown<br>"
//             return div;
//           };
//           legend.addTo(map);
//        });
//
// //click to change color style to Help categories
// document.getElementById("change-help")
//         .addEventListener('click', function () {
//           style_target = function(f) { return f.properties.Help };
//           style_item = function(f){ return 'help' };
//           geojson.setStyle(style);
//
//           if (legend instanceof L.Control) { map.removeControl(legend); }
//
//           legend = L.control({position: 'topright'});
//
//           legend.onAdd = function (map) {
//
//             var div = L.DomUtil.create('div', 'info legend'),
//                 grades = ['10','20','50','100','200','500','1000'],
//                 labels = [];
//
//             // loop through categories and generate a label with a colored square for each interval
//             for (var i = 0; i < grades.length; i++) {
//                 div.innerHTML +=
//                     '<i style="background:' + getColor(grades[i], 'help') + '"></i> ' +
//                     grades[i]  + '<br>' ;
//             }
//             div.innerHTML += "<i style='background:gray'></i> unknown<br>"
//
//             return div;
//           };
//            legend.addTo(map);
//        });
//
//
//
// //click to change color style to Food categories
// document.getElementById("change-food")
//         .addEventListener('click', function () {
//           style_target = function(f) { return f.properties.Food };
//           style_item = function(f){ return 'food' };
//           geojson.setStyle(style);
//
//           if (legend instanceof L.Control) { map.removeControl(legend); }
//
//           legend = L.control({position: 'topright'});
//
//           legend.onAdd = function (map) {
//
//             var div = L.DomUtil.create('div', 'info legend'),
//                 grades = ['0', '20','40','60','80','100'],
//                 labels = [];
//
//             // loop through categories and generate a label with a colored square for each interval
//             for (var i = 0; i < grades.length; i++) {
//                 div.innerHTML +=
//                     '<i style="background:' + getColor(grades[i], 'food') + '"></i> ' +
//                     grades[i]  + '<br>' ;
//             }
//             div.innerHTML += "<i style='background:gray'></i> unknown<br>"
//
//             return div;
//           };
//            legend.addTo(map);
//        });
/*
//click to change color style to race categories
document.getElementById("plain-style")
        .addEventListener('click', function () {
          style_target = function(f) { return f.properties.genderx };
          geojson.setStyle(style);

          if (legend instanceof L.Control) { map.removeControl(legend); }

          legend = L.control({position: 'topright'});

          legend.onAdd = function (map) {

            //had to create a dummy div to get add/remove to work.
            var div = L.DomUtil.create('div', 'info legend')//,
            return div;
          };
          legend.addTo(map);

       });
*/
