;

const dailyChange = function(){

    const renderConfirmed = function(id, target_id){
        let svg = d3.select('#'+target_id),
            width = svg.node().getBoundingClientRect().width,
            height = svg.node().getBoundingClientRect().height;


        let pfoo = datautils.getTimeSeries(id);
        Promise.resolve(pfoo)
            .then(function(resp){
                console.log('TKTK: renderConfirmed change hides 0/negative values!')
                let data = resp;

                data.forEach(function(d, i){
                    var a = data[i-1]
                    if(i == 0){
                        d.delta = 10;
                    }else if(a.confirmed < 1){
                        d.delta = 10;
                    }else{
                        d.delta = 100 * (d.confirmed - a.confirmed)/a.confirmed
                    }
                })


                let xScale = d3.scaleBand()
                                .rangeRound([0, width], 0.05)
                                .padding(0.1)
                                .domain(data.map(function(d){ return d.date }))


                // console.log("hey: ", xScale.bandwidth())
                // console.log(data.map(function(d){ return d.date }))

                let yScale = d3.scaleLog()
                                .domain([10, d3.max(data, function(d){ return d.delta })])
                                .rangeRound([height, 0])

                svg.selectAll("bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .style("fill", "steelblue")
                    .attr("x", function(d){ return xScale(d.date)})
                    .attr("width", xScale.bandwidth())
                    .attr("y", function(d){ return yScale(d.delta)})
                    .attr("height", function(d){ return height - yScale(d.delta)})
                    .on("mouseover", function(d){ console.log(d) })

            });


    };

    return {
        renderConfirmed: renderConfirmed
    }


}();

