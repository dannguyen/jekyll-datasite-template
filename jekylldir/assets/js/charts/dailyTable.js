
const dailyTable = function(){
    const headermap = {
        'datestring': 'Date',
        'confirmed': 'Confirmed',
        'deaths': 'Deaths'
    }

    const headers = Object.keys(headermap);

    function render(id, target_id){
        console.log('about to render', id)
        Promise.resolve(datautils.getTimeSeries(id))
            .then(function(resp){
                let data = resp.sort((a,b) => b.date - a.date)
                let target = d3.select("#"+target_id);



                target.append("thead")
                    .append("tr")
                    .selectAll('th')
                    .data(headers.map(h => headermap[h]))
                    .enter()
                    .append('th')
                    .text(d => d);


                let rows = target.selectAll('tr')
                    .data(data)
                    .enter()
                    .append('tr')

                rows.selectAll('td')
                    .data(d => headers.map(h => [h, d[h]]) )
                    .enter()
                    .append('td')
                    .attr("class", d => d[0])
                    .text(d => d[1])

        })

    }



    return {
        render: render
    }

}()

