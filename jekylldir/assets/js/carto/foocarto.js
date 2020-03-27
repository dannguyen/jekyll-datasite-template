---
# Add "layout: compress" here to compress the html code
---

1+1;

var qg = 1;
var qd = 1;


function render() {

    var states_url = "{{ '/static/data/topo/usa.tilegram.topo.json?v=' | append: site.github.build_revision | relative_url }}"

    var w = 960;
    var h = 560;
    var stateCodesWithNames = window.stateCodesWithNames;
    var topojson = window.topojson;
    var d3 = window.d3;
    var _ = window._;
    var data = generateData();

    qd = data;

    function generateData() {
        var states = ['DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'AK', 'CA', 'CO', 'AZ', 'AR', 'AL', 'CT'];

        function dataArray() {
            var data = [];
            _.times(states.length, function (n) {
                data.push({
                    code: states[n],
                    value: _.random(1, 98.5)
                });
            });
            return data;
        }

        return dataArray();
    }

    var f = d3.format('.1f');

    // var color = d3.scaleSequential(d3.interpolateViridis)
    // color.domain([0, 100])

    var svg = d3.select('svg').attr('width', w).attr('height', h);


    var us_hex = d3.json(states_url);

    Promise.all([us_hex])
    .then(function(the_response){

      console.log("carto url fetched");
        console.log(the_response);

      tilegram = the_response[0];

        qg = tilegram;

        var tiles = topojson.feature(tilegram, tilegram.objects.tiles);

        var transform = d3.geoTransform({
            point: function point(x, y) {
                return this.stream.point(x, -y);
            }
        });

        var path = d3.geoPath().projection(transform);

        var g = svg.append('g').attr('transform', 'translate(-0,' + (h - 0) + ')');

        // build list of state codes
        var stateCodes = [];
        // build list of state names
        var stateNames = [];
        // build a list of colour values
        var colorValues = [];

        tilegram.objects.tiles.geometries.forEach(function (geometry) {
            if (stateCodes.indexOf(geometry.properties.state) === -1) {
                stateCodes.push(geometry.properties.state);
                // pass in state names
                stateNames.push(_.find(stateCodesWithNames, { 'code': geometry.properties.state }).state);
                // pass in colour values
                colorValues.push(_.find(data, { 'code': geometry.properties.state }).value);
            }
        });

        console.log('stateCodes', stateCodes);
        console.log('stateNames', stateNames);
        console.log('colorValues', colorValues);

        var linear = d3.scaleLinear().domain([0, _.mean(colorValues), d3.max(colorValues)]).range(['#FDBB30', '#F47521', '#EE3124']);

        var borders = g.selectAll('.tiles').data(tiles.features).enter().append('path').attr('d', path).attr('class', 'border').attr('fill', function (d, i) {
            return linear(colorValues[i]);
        }).attr('stroke', '#130C0E').attr('stroke-width', 4);

        borders.on('click', function (d, i) {
            console.log('d', d);
            console.log('stateCodes[i]', stateCodes[i]);
            console.log('stateNames[i]', stateNames[i]);
        });

        borders.on('mouseover', function (d, i) {
            d3.select('#state').text(stateNames[i] + ' : ' + f(colorValues[i]));
        });

        // add some labels
        g.selectAll('.state-label').data(tiles.features).enter().append('text').attr('class', function (d) {
            return 'state-label state-label-' + d.id;
        }).attr('transform', function (d) {
            return 'translate(' + path.centroid(d) + ')';
        }).attr('dy', '.35em')
        .text(function (d) {
            return d.properties.state;
        });


    });
}
