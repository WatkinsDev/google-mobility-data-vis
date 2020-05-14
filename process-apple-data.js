parsedAppleMobilityData = function () {
    var request = new XMLHttpRequest();  
    request.open("GET", 'http://localhost:8080/applemobilitytrends.csv', false);   
    request.send(null);  
    const csv = request.responseText;

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

    const csvToJson = R.pipe(
        R.split('\n'),
        R.tail(),
        R.map(R.pipe(
            R.split(','),
            R.zipObj(columns),
        )),
        R.filter(isUk),
        R.filter(transportType),
        R.map(R.dissoc('geo_type')),
        R.map(R.dissoc('region')),
        R.map(R.dissoc('transportation_type')),
        R.map(R.dissoc('alternative_name'))
    )(csv)
    
    return R.map(
            element => {return {"Date":element[0], "AnswerCount":element[1]}}
        )(R.toPairs(csvToJson[0]));
        

}
parsedAppleMobilityData();
