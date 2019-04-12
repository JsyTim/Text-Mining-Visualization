var categories= ['Action', 'Adventure', 'Animation', 'Children', 'Comedy','Crime','Gadgets','GPS & Navigation','Home Audio','Office Electronics','Portable Audio','Portable Video','Security & Surveillance','Service','Television & Video','Car & Vehicle'];

var nums1 = [0,190,179,156,0,190,179,213,209,190,179,156,209,190,190];
var nums2 = [0,0,0,0,0,190,179,213,209,190,179,156,209,190,190];
var num3 = [];
var colors = ["#F78571","#F98286","#F4839C","#E788B1","#D490C2","#BB99CF","#9DA2D6","#7DAAD7","#5BB1D0","#3CB6C4","#2CB9B3","#37BA9E","#4EBA87","#68B871","#82B55D","#9BB04E","#B3AA44","#C9A243","#DD9A4A","#ED9157"];

function genreBar(nums){
		var grid = d3.range(25).map(function(i){
			return {'x1':0,'y1':0,'x2':0,'y2':480};
		});

		var tickVals = grid.map(function(d,i){
			if(i>0){ return i*10; }
			else if(i===0){ return "100";}
		});

		var xscale = d3.scaleLinear()
						.domain([0,200])
						.range([0,722]);

		var yscale = d3.scaleLinear()
						.domain([0,categories.length])
						.range([0,480]);

		var colorScale = d3.scaleQuantize()
						.domain([0,categories.length])
						.range(colors);

		var canvas = d3.select('#wrapper')
						.append('svg')
						.attr('width',900)
						.attr('height',550)

		var grids = canvas.append('g')
						  .attr('id','grid')
						  .attr('transform','translate(150,10)')
						  .selectAll('line')
						  .data(grid)
						  .enter()
						  .append('line')
						  .attr('x1', function(d,i){ return i*30;})
						  .attr('y1',function(d){ return d.y1; })
						  .attr('x2',function(d,i){ return i*30; })
						  .attr('y2',function(d){ return d.y2; })
							.style('stroke','#adadad')
							.style('stroke-width','1px');

		var xAxis = d3.axisBottom(xscale).tickValues(tickVals);
		var yAxis = d3.axisLeft(yscale)
					.tickSize(2)
					.tickFormat(function(d,i){ return categories[i]; })
					.tickValues(d3.range(17));

		var y_xis = canvas.append('g')
						  .attr("transform", "translate(150,0)")
						  .attr('id','yaxis')
						  .call(yAxis);

		var x_xis = canvas.append('g')
						  .attr("transform", "translate(150,480)")
						  .attr('id','xaxis')
						  .call(xAxis);

		var chart = canvas.append('g')
							.attr("transform", "translate(150,0)")
							.attr('id','bars')
							.selectAll('rect')
							.data(nums)
							.enter()
							.append('rect')
							.attr('height',19)
							.attr('x',0)
							.attr('y',function(d,i){ return yscale(i)-10; })
							.style('fill',function(d,i){ return colorScale(i); })
							.attr('width',function(d){ return 0; });


		var transit = d3.select("svg").selectAll("rect")
						    .data(nums)
						    .transition()
						    .duration(1000)
						    .attr("width", function(d) {return xscale(d); });

		var transitext = d3.select('#bars')
							.selectAll('text')
							.data(nums)
							.enter()
							.append('text')
							.attr('x', function(d) {return xscale(d)-200; })
							.attr('y', function(d,i){ return yscale(i)+35; })
							.text(function(d){ return d; }).style({'fill':'#fff','font-size':'14px'});
}
genreBar(num3)
