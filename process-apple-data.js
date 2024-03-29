parsedAppleMobilityData = function () {
    const csv = getCSV();
    
    const columns = R.pipe(
        R.split('\n'),
        R.head(),
        R.split(',')
    )(csv); 

    //Convert CSV to JSON
    const isUk = obj => obj["region"] === 'UK';
    const transportType = obj => obj["transportation_type"] === 'driving';
    // const transportType = obj => obj["transportation_type"] === 'walking';
    // const transportType = obj => obj["transportation_type"] === 'transit';

    return csvToJson = R.pipe(
        R.split('\n'),
        R.tail(),
        R.map(R.pipe(
            R.split(','),
            R.zipObj(columns),
        )),
        R.filter(isUk),
        R.filter(transportType),
        R.map(R.omit(['geo_type','region','transportation_type','alternative_name'])),
        element => R.toPairs(element[0]),
        R.map(element => {return {"Date":element[0], "AnswerCount":element[1]}})
    )(csv)
}
getCSV = function(){
    var request = new XMLHttpRequest();  
    request.open("GET", 'http://localhost:8080/applemobilitytrends.csv', false);   
    request.send(null);  
    return request.responseText;
}

parsedAppleMobilityData();
