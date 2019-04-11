function wordCloud(year, country){
  var yearCount = year; // TESTING: this one should be modify so it stores the year selected
  var countryText = "USA";// TESTING: this one should be modify so it stores the country selected
  var testGenres = yearData[yearCount][countryText].genres; //testGenres returns the tags and occurrences of the movie with id equal to yearCount
  var testActors = yearData[yearCount][countryText].actors;


  var testDirectors = yearData[yearCount][countryText].directors;
  console.log(testGenres);
  console.log(testActors);
  console.log(testDirectors);

      //Font size of the wordcloud
      Highcharts.seriesTypes.wordcloud.prototype.deriveFontSize = function (relativeWeight) {
          var maxFontSize = 25;
          // Will return a fontSize between 0px and 25px.
          return Math.floor(maxFontSize * relativeWeight);
      };

      //Button to create wordcloud from the tag movie dictionary
      var btn = document.createElement("BUTTON");
      btn.innerHTML = "Next";
      document.body.appendChild(btn);

      //Creates the wordcloud
      btn.addEventListener ("click", function() {
          yearCount++;                        //TEXTING:
          //yearCount = d.year;               //These lines are to set yearCount equal to the year selected and countryText equal to country selected
          //countryText = d.country;
          var testGenres = yearData[yearCount][countryText].genres;
          var testActors = yearData[yearCount][countryText].actors;
          var testDirectors = yearData[yearCount][countryText].directors;
          //Update the WordCloud
          var newDataGenres = Highcharts.reduce(testGenres, function (arr, word) {
              var obj = Highcharts.find(arr, function (obj) {
                  return obj.name === word;
              });
              if (obj) {
                  obj.weight += 1;
              } else {
                  obj = {
                      name: word,
                      weight: 1
                  };
                  arr.push(obj);
              }
              return arr;
          }, []);
          cloud = Highcharts.chart('containerGenres', {
              series: [{
                  type: 'wordcloud',
                  data: newDataGenres,
                  name: 'Occurrences'
              }],
              title: {
                  text: "Genres of " + yearCount + " in " + countryText
              }
          });
          var newDataActors = Highcharts.reduce(testActors, function (arr, word) {
              var obj = Highcharts.find(arr, function (obj) {
                  return obj.name === word;
              });
              if (obj) {
                  obj.weight += 1;
              } else {
                  obj = {
                      name: word,
                      weight: 1
                  };
                  arr.push(obj);
              }
              return arr;
          }, []);
          cloud = Highcharts.chart('containerActors', {
              series: [{
                  type: 'wordcloud',
                  data: newDataActors,
                  name: 'Occurrences'
              }],
              title: {
                  text: "Actors of " + yearCount + " in " + countryText
              }
          });
          var newDataDirectors = Highcharts.reduce(testDirectors, function (arr, word) {
              var obj = Highcharts.find(arr, function (obj) {
                  return obj.name === word;
              });
              if (obj) {
                  obj.weight += 1;
              } else {
                  obj = {
                      name: word,
                      weight: 1
                  };
                  arr.push(obj);
              }
              return arr;
          }, []);
          cloud = Highcharts.chart('containerDirectors', {
              series: [{
                  type: 'wordcloud',
                  data: newDataDirectors,
                  name: 'Occurrences'
              }],
              title: {
                  text: "Directors of " + yearCount + " in " + countryText
              }
          });
      });

      var newDataGenres = Highcharts.reduce(testGenres, function (arr, word) {
              var obj = Highcharts.find(arr, function (obj) {
                  return obj.name === word;
              });
              if (obj) {
                  obj.weight += 1;
              } else {
                  obj = {
                      name: word,
                      weight: 1
                  };
                  arr.push(obj);
              }
              return arr;
          }, []);

      cloud = Highcharts.chart('containerGenres', {
          series: [{
              type: 'wordcloud',
              data: newDataGenres,
              name: 'Occurrences'
          }],
          title: {
              text: "Genres of " + yearCount + " in " + countryText
          }
      });

      var newDataActors = Highcharts.reduce(testActors, function (arr, word) {
          var counter = 0;
          var obj = Highcharts.find(arr, function (obj) {
              return obj.name === word;
          });
          if (obj) {
              obj.weight += 1;
          } else {
              obj = {
                  name: word,
                  weight: 1
              };
              arr.push(obj);
              counter++;
          }
          if (counter > 300){
              return arr;
          }
          return arr;
      }, []);


      cloud = Highcharts.chart('containerActors', {
          series: [{
              type: 'wordcloud',
              data: newDataActors,
              name: 'Occurrences'
          }],
          title: {
              text: "Actors of " + yearCount + " in " + countryText
          }
      });

      var newDataDirectors = Highcharts.reduce(testDirectors, function (arr, word) {
          var obj = Highcharts.find(arr, function (obj) {
              return obj.name === word;
          });
          if (obj) {
              obj.weight += 1;
          } else {
              obj = {
                  name: word,
                  weight: 1
              };
              arr.push(obj);
          }
          return arr;
      }, []);


      cloud = Highcharts.chart('containerDirectors', {
          series: [{
              type: 'wordcloud',
              data: newDataDirectors,
              name: 'Occurrences'
          }],
          title: {
              text: "Directors of " + yearCount + " in " + countryText
          }
      });
}
