parsedGoogleMobilityData = function () {
    
    console.log("Loading");

    // Data reading
    // const R = require('ramda')
    // const fs = require('fs')
    // const csv = fs.readFileSync('./Global_Mobility_Report.csv', 'utf8')

    var request = new XMLHttpRequest();  
    request.open("GET", 'http://localhost:8080/Global_Mobility_Report.csv', false);   
    request.send(null);  
    console.log("request.responseText")
    csv = request.responseText;

    const columns = ["country_region_code","country_region","sub_region_1","sub_region_2","date","retail_and_recreation_percent_change_from_baseline","grocery_and_pharmacy_percent_change_from_baseline","parks_percent_change_from_baseline","transit_stations_percent_change_from_baseline","workplaces_percent_change_from_baseline","residential_percent_change_from_baseline"];
    console.log(columns)

    // Logging
    const traceWithCount = msg => R.tap(x => console.log(msg, x.length))
    const traceWithAll = msg => R.tap(x => console.log(msg, x))
    const traceWithout = msg => R.tap(x => console.log(msg))

    // Utility Methods
    String.prototype.removeCharAt = function (i) {
        var tmp = this.split(''); 
        tmp.splice(i - 1 , 1);
        return tmp.join('');
    }

    const removeCommasInsideSpeechMarksAndReturns = k => {
        const first  = k.indexOf("\"");
        const next = k.indexOf("\"", first+1);
        if(first > -1){
            const commaToRemove = k.split("").splice(first, next-first).indexOf(",")
            const newK = k.removeCharAt(first+commaToRemove+1, 1);
            // console.log(newK);
            return newK.replace("\r","");
        }
        return k.replace("\r","")
    };

    // getValueRelativeToMinAndMax = (min, max, value) =>{
    //     const eachDataPointIsWorth = (Math.abs(max - min) / 100 )
    //     if(min < 0){
    //         return ((value - min)) * eachDataPointIsWorth;
    //     }
    //     return ((value + min)) * eachDataPointIsWorth;
    // }

    getValueRelativeToMinAndMax = (min, max, value) =>{
        console.log("getValueRelativeToMinAndMax")
        console.log({
            min:min,
            max:max,
            value:value
        })
        if(min < 0){
            return parseInt(value) - min;
        }
        return value;
    }

    //Convert CSV to JSON
    const csvToJson = R.compose(
    R.map(R.compose(
        R.zipObj(columns),
        R.split(','),
        removeCommasInsideSpeechMarksAndReturns
    )),
    R.split('\n')
    )(csv)


    //? Chould x => y => not work the same?
    const numbers = R.curry((data, header) => R.pipe(
        (values) => R.pluck(header, values),
        (dater) => R.map(pluckedNumberAsString => { return parseInt(pluckedNumberAsString)}, dater),
        )(data)
    );

    // const typeInput = 'retail_and_recreation_percent_change_from_baseline';
    // const typeInput = "grocery_and_pharmacy_percent_change_from_baseline";
    // const typeInput = "parks_percent_change_from_baseline";
    // const typeInput = "workplaces_percent_change_from_baseline";
    const typeInput = "residential_percent_change_from_baseline";

    const countryInput = 'GB';
    const regionInput1 = 'City of Bristol';
    const regionInput2 = "Bath and North East Somerset";

    // Get data for requested location
    const isUk = obj => obj["country_region_code"] === countryInput
    const isRegion = obj => obj["sub_region_1"] === regionInput1 || obj["sub_region_1"] === regionInput2
    // const isRegion = obj => true

    const jsonFiltered = R.map(
        R.filter(isRegion),
        R.filter(isUk)
    )(csvToJson)

    console.log("jsonFiltered[0]")
    console.log(jsonFiltered[0])
    console.log(jsonFiltered[1])
    console.log(jsonFiltered[2])

    // Get min and max for all areas for certain field
    const numbersWithData = numbers(jsonFiltered)
    const typeNumbers = numbersWithData(typeInput);
    const minForType = R.reduce(R.min, Infinity, typeNumbers)
    const maxForType = R.reduce(R.max, -Infinity, typeNumbers)

    // Convert data to shape required for vis
    return R.map(element => {return {
            Date: element["date"], 
            AnswerCountMin: minForType,
            AnswerCountMax: maxForType,
            AnswerCount:getValueRelativeToMinAndMax(minForType, maxForType, element[typeInput]).toString(), 
            AnswerCountBeforeAdjustment:element[typeInput]
        }
    }, jsonFiltered);
}
parsedGoogleMobilityData();
