---
# hi
---



const dailySeries = function(){

    const renderConfirmed = function(id, target_id){
        let svg = d3.select('#'+target_id),
            width = svg.node().getBoundingClientRect().width,
            height = svg.node().getBoundingClientRect().height;


        let pfoo = datautils.getTimeSeries(id);
        Promise.resolve(pfoo)
            .then(function(resp){
                let data = resp;
                var xScale = d3.scaleTime()
                                .domain(d3.extent(data, function(d){ return d.date }))
                                .range([0, width])

                var yScale = d3.scaleLog()
                                .domain([1, d3.max(data, function(d){ return d.confirmed })])
                                .range([height, 0])

                var dline = d3.line()
                    .x(function(d){ return xScale(d.date)})
                    .y(function(d){ return yScale(d.confirmed)})
                    .curve(d3.curveMonotoneX);


                svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", dline)
                // add dots
                svg.selectAll(".dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", "dot")
                    .attr("cx", function(d, i){ return xScale(d.date)})
                    .attr("cy", function(d, i){ return yScale(d.confirmed)})
                    .attr("r", 4)
                    .on("mouseover", function(d){
                        console.log(d)
                    })

            })
    };


    return {
        renderConfirmed: renderConfirmed
    }

}();


