// based on prepared DOM, initialize echarts instance
var networkChart = echarts.init(document.getElementById('network'));
networkChart.showLoading();
//Network parameters
edge_length = 150
repulsion_set = 200
gravity_set = 0.2
fontsize_set = 18
color_scheme = ['#F9F871', '#FFC75F', '#FF9671', '#FF6F91', '#D65DB1', '#845EC2']

d3.json("data/actors-word.json").then( actor_word => {
  $.get('data/movie-network.json', function (movie_network) {
    d3.json("data/movies-map.json").then( movies_map => {
      $.get('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95368/world.json', function(worldJson){
        // echarts.registerMap('world',worldJson);
        // var mapChart = echarts.init(document.getElementById('geospatial'));
        // mapChart.showLoading();

      //Initialize map
      countsByYear('1990');
      d3.select('#value').text("1990");

//------------------------------------------ wordcloud
      totalnum = 200;
      dataset = actor_word["1990"];
      if (dataset.length >= totalnum) {
        reducedDataset = dataset.slice(1,totalnum);
      }
      else {
        reducedDataset = dataset;
      }

      var cloud = Highcharts.chart('wordcloud', {
          series: [{
              type: 'wordcloud',
              data: reducedDataset,
              name: 'Occurrences'
          }],
          title: {
              text: 'Wordcloud of actors'
          }
      });

//------------------------------------------ network
      this_network = movie_network["1990"]
      networkChart.hideLoading();
      option = {
          legend: {
              textStyle: {
                fontSize: fontsize_set
              },
              data: ['0-Star', '1-Star', '2-Star', '3-Star', '4-Star', '5-Star']
          },
          series: [{
              type: 'graph',
              layout: 'force',
              animation: false,
              label: {
                  normal: {
                      position: 'right',
                      formatter: '{b}'
                  }
              },
              draggable: true,
              data: this_network.nodes.map( node => {
                node.id = node["id"];
                return node;
              }),
              categories: this_network.categories,
              force: {
                initLayout: 'circular',
                edgeLength: edge_length,
                repulsion: repulsion_set,
                gravity: gravity_set
              },
              edges: this_network.links
          }]
      };

      networkChart.setOption(option);
//------------------------------------------ map Echarts
    // this_map = movies_map['1990'];
    // console.log(this_map);
    // mapChart.hideLoading();
    // map_option = {
    //   title: {
    //       text: 'Filming Locations of the Movies in ' + '1990',
    //       left: 'center',
    //       top: 'top'
    //   },
    //   tooltip: {
    //       trigger: 'item',
    //       formatter: function (params) {
    //           var value = (params.value + '').split('.');
    //           value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
    //           return params.seriesName + '<br/>' + params.name + ' : ' + value;
    //       }
    //   },
    //   toolbox: {
    //       show: true,
    //       orient: 'vertical',
    //       left: 'right',
    //       top: 'center'
    //   },
    //   visualMap: {
    //       min: 0,
    //       max: 250,
    //       text:['High','Low'],
    //       realtime: false,
    //       calculable: true,
    //       inRange: {
    //           color: ['lightskyblue','yellow', 'orangered']
    //       }
    //   },
    //   series: [
    //       {
    //           name: 'Filming Locations of the Movies in ' + '1990',
    //           type: 'map',
    //           mapType: 'world',
    //           roam: true,
    //           itemStyle:{
    //               emphasis:{label:{show:true}}
    //           },
    //           data:this_map
    //         }
    //       ]
    // };
    //
    // mapChart.setOption(map_option);
//------------------------------------------ slider
    var slider = d3
      .sliderHorizontal()
      .min(1903)
      .max(2011)
      .ticks(20)
      .step(1)
      .width(960)
      .default(1990)
      .displayValue(false)
      .on('onchange', val => {
        d3.select('#value').text(val);
        countsByYear(val);
  //------------------------------------------ wordcloud control
        update_word = actor_word[val.toString()];
        if (update_word.length >= totalnum) {
          reduced_word = update_word.slice(1,totalnum);
        }
        else {
          reduced_word = update_word;
        }

        cloud.series[0].setData(reduced_word);
  //------------------------------------------ network control
        networkChart.showLoading();
        update_network = movie_network[val];
        update_option = {
            legend: {
                textStyle: {
                  fontSize: fontsize_set
                },
                data: ['0-Star', '1-Star', '2-Star', '3-Star', '4-Star', '5-Star']
            },
            series: [{
                type: 'graph',
                layout: 'force',
                animation: false,
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                draggable: true,
                data: update_network.nodes.map( node => {
                  node.id = node["id"];
                  return node;
                }),
                categories: update_network.categories,
                force: {
                  initLayout: 'circular',
                  edgeLength: edge_length,
                  repulsion: repulsion_set,
                  gravity: gravity_set
                },
                edges: update_network.links
            }]
         };
         networkChart.hideLoading();
         networkChart.setOption(update_option);
//------------------------------------------ map Echarts control
         // mapChart.showLoading();
         // update_map = movies_map[val];
         // update_map_option = {
         //   title: {
         //       text: 'Filming Locations of the Movies in ' + val,
         //       left: 'center',
         //       top: 'top'
         //   },
         //   tooltip: {
         //       trigger: 'item',
         //       formatter: function (params) {
         //           var value = (params.value + '').split('.');
         //           value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
         //                   + '.' + value[1];
         //           return params.seriesName + '<br/>' + params.name + ' : ' + value;
         //       }
         //   },
         //   toolbox: {
         //       show: true,
         //       orient: 'vertical',
         //       left: 'right',
         //       top: 'center'
         //   },
         //   visualMap: {
         //       min: 0,
         //       max: 250,
         //       text:['High','Low'],
         //       realtime: false,
         //       calculable: true,
         //       inRange: {
         //           color: ['lightskyblue','yellow', 'orangered']
         //       }
         //   },
         //   series: [
         //       {
         //           name: 'Filming Locations of the Movies in ' + val,
         //           type: 'map',
         //           mapType: 'world',
         //           roam: true,
         //           itemStyle:{
         //               emphasis:{label:{show:true}}
         //           },
         //           data:update_map
         //         }
         //       ]
         // };
         // mapChart.hideLoading();
         // mapChart.setOption(update_map_option);
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
  });
});
