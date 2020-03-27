// window.datasets = Object.is(window.datasets, undefined) ? {} : window.datasets;

const datautils = function(){

    let sets = {};
    const urls = {
        timeseries: "/jekyll-datasite-template/static/data/timeseries.csv?v=0.0.1"
    };


    const foo = function(){
        console.log('foo')
    }

    const getTimeSeries = function(eid){
        return fetchall_timeseries().then(function(alldata){
            let _edata = alldata.filter(function(d){ return d.id == eid && d.confirmed > 0})
            return _edata;
        })
    }


    const fetchall_timeseries = function(){
        const url = urls.timeseries

        let mypromise = d3.csv(url, function(d){
                    return {id: d.id,
                            datestring: d.date,
                            date: new Date(d.date),
                            confirmed: +d.confirmed,
                            deaths: +d.deaths}
                }).then(function(data){
                    // console.log(`fetching: ${url}`)
                    sets.timeseries = data;
                    // console.log('fetched: ', data)
                    return sets.timeseries;
                })

        return mypromise
    }

console.log('datautils loaded')

    return {
        foo: foo,
        getTimeSeries: getTimeSeries,
        // fetchTimeSeries: fetchTimeSeries,
        sets: sets
    }

}()




    //     if(Object.is(window.datasets.timeseries, undefined)){
    //         // window.datasets.timeseries = await d3.csv(DATA_URL, function(d){
    //         //     return {id: d.id, date: new Date(d.date), confirmed: +d.confirmed, deaths: +d.deaths}
    //         // })
    //         d3.csv(DATA_URL, function(d){
    //             return {id: d.id, date: new Date(d.date), confirmed: +d.confirmed, deaths: +d.deaths}
    //         }).then(function(data){
    //             window.datasets.timeseries = data;
    //             return window.datasets.timeseries;
    //         })


    //     }else{
    //         return window.datasets.timeseries;
    //     }
    // }
