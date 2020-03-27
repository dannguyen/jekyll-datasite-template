var svg = d3.select("#mapbox"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var states_url = "/jekyll-datasite-template/static/data/usa.tilegram.topo.json?v=0.0.1"



var us_states = d3.json(states_url);

Promise.all([us_states]).then(function(the_response){

  console.log("carto url fetched");
  console.log(the_response);

  geodata = the_response[0];

  var tiles = topojson.feature(geodata, geodata.objects.tiles);

  var transform = d3.geoTransform({
    point: function point(x, y) {
        return this.stream.point(x, -y);
    }
  });

  var path = d3.geoPath() //.projection(transform);

//  var g = svg.append('g').attr('transform', 'translate(-350,' + (height - 10) + ')');

  geodata.objects.tiles.geometries.forEach(function(geometry){



  })

  var borders = svg.selectAll('.tiles').data(tiles.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'border')
    .attr('fill', function(d, i){
      return '#fdd'
    })
    .attr('stroke', '#333')
})
