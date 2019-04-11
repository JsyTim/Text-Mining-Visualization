var slider = d3
  .sliderHorizontal()
  .min(1900)
  .max(2010)
  .ticks(20)
  .step(1)
  .width(960)
  .default(1990)
  .displayValue(false)
  .on('onchange', val => {
    d3.select('#value').text(val);
  });

d3.select('#slider')
  .append('svg')
  .attr('width', 1080)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)')
  .call(slider);
