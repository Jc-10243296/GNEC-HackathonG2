//Citations
//Ocean Health Index. Year. ohi-global version: Global scenarios data for Ocean Health Index, [date downloaded]. National Center for Ecological Analysis and Synthesis, University of California, Santa Barbara. Available at: https://github.com/OHI-Science/ohi-global/releases

let myChart;  // Global variable to hold the chart instance]
let region;
let year;
let typeShort;
let dimension;
let chartGenerated = false;
let yearList = [];
let regionList = [];
let typeShortList = [];
let dimensionList = [];

// id priority over place
const retrieveData = async () => {
    const proxyUrl = "http://localhost:8080/";
    const targetUrl = "https://oceanhealthindex.org/data/scores.csv";
    let returnedData = [];

    const response = await fetch(proxyUrl + targetUrl);
    const csvData = await response.text();

    const rows = csvData.split('\n');

    for (let row of rows) {
        let data = row.split(',');
        if (data[0] === "scenario") {
            continue;
        }
        if (!yearList.includes(data[0])) {
            yearList.push(data[0])
        }
        if (!regionList.includes(data[5])) {
            regionList.push(data[5])
        }
        if (!typeShortList.includes(data[1])) {
            typeShortList.push(data[1])
        }
        if (!dimensionList.includes(data[3])) {
            dimensionList.push(data[3])
        }
        // Apply the filters based on the passed parameters
        // if (id != "" && data[4] != id) {
        //     continue;
        // }
        if (region != "" && data[5] != region) {
            continue;
        }
        if (year != "" && data[0] != year) {
            continue;
        }
        if (typeShort != "" && data[1] != typeShort) {
            continue;
        }
        if (dimension != "" && data[3] != dimension) {
            continue;
        }

        // Add matching row data to returnedData with actual newline
        returnedData.push(row);  // Correctly add newline
    }
    return returnedData;
}

const generateDataYearEmpty = (GeneratedData) => {
    let currentRegionList = [];
    let currentTypeShortList = [];
    let currentDimensionList = [];
    let labelList = [];
    let labelDoubleList = [];
    let dataSetsList = [];

    for (let data of GeneratedData) {
        const dataSet = data.split(',')
        if (!currentRegionList.includes(dataSet[5])) {
            currentRegionList.push(dataSet[5])
        }
        if (!currentTypeShortList.includes(dataSet[1])) {
            currentTypeShortList.push(dataSet[1])
        }
        if (!currentDimensionList.includes(dataSet[3])) {
            currentDimensionList.push(dataSet[3])
        }
    }
    let numDataSets = currentRegionList.length * currentTypeShortList.length * currentDimensionList.length;

    for (let region of currentRegionList) {
        for (let typeShort of currentTypeShortList) {
            for (let dimension of currentDimensionList) {
                labelList.push(region + " " + typeShort + " " + dimension);
                labelDoubleList.push([region, typeShort, dimension])
            }
        }
    }

    for (let i = 0; i < numDataSets; i++) {
        let dataList = [];
        for (let data of GeneratedData) {
            const dataSet = data.split(',')
            if (dataSet[5] === labelDoubleList[i][0] && dataSet[1] === labelDoubleList[i][1] && dataSet[3] === labelDoubleList[i][2]) {
                dataList.push(dataSet[6])
            }
        }
        dataSetsList.push(dataSet(dataList, labelList[i]))
    }
    return {
        labels: yearList, // Categories on the x-axis
        datasets: dataSetsList
    };
}

const generateDataRegionEmpty = (GeneratedData) => {
    let currentYearList = [];
    let currentTypeShortList = [];
    let currentDimensionList = [];
    let labelList = [];
    let labelDoubleList = [];
    let dataSetsList = [];

    for (let data of GeneratedData) {
        const dataSet = data.split(',')
        if (!currentYearList.includes(dataSet[0])) {
            currentYearList.push(dataSet[0])
        }
        if (!currentTypeShortList.includes(dataSet[1])) {
            currentTypeShortList.push(dataSet[1])
        }
        if (!currentDimensionList.includes(dataSet[3])) {
            currentDimensionList.push(dataSet[3])
        }
    }
    let numDataSets = currentTypeShortList.length * currentDimensionList.length * currentYearList.length;

    for (let typeShort of currentTypeShortList) {
        for (let dimension of currentDimensionList) {
            for (let year of currentYearList) {
                labelList.push(year + " " + typeShort + " " + dimension);
                labelDoubleList.push([year, typeShort, dimension])
            }
        }
    }

    for (let i = 0; i < numDataSets; i++) {
        let dataList = [];
        for (let data of GeneratedData) {
            const dataSet = data.split(',')
            if (dataSet[0] === labelDoubleList[i][0] && dataSet[1] === labelDoubleList[i][1] && dataSet[3] === labelDoubleList[i][2]) {
                dataList.push(dataSet[6])
            }
        }
        dataSetsList.push(dataSet(dataList, labelList[i]))
    }
    return {
        labels: regionList, // Categories on the x-axis
        datasets: dataSetsList
    };
}

const generateDataTypeShortEmpty = (GeneratedData) => {
    let currentYearList = [];
    let currentRegionList = [];
    let currentDimensionList = [];
    let labelList = [];
    let labelDoubleList = [];
    let dataSetsList = [];

    for (let data of GeneratedData) {
        const dataSet = data.split(',')
        if (!currentYearList.includes(dataSet[0])) {
            currentYearList.push(dataSet[0])
        }
        if (!currentRegionList.includes(dataSet[5])) {
            currentRegionList.push(dataSet[5])
        }
        if (!currentDimensionList.includes(dataSet[3])) {
            currentDimensionList.push(dataSet[3])
        }
    }
    let numDataSets = currentRegionList.length * currentDimensionList.length * currentYearList.length;

    for (let region of currentRegionList) {
        for (let dimension of currentDimensionList) {
            for (let year of currentYearList) {
                labelList.push(year + " " + region + " " + dimension);
                labelDoubleList.push([year, region, dimension])
            }
        }
    }

    for (let i = 0; i < numDataSets; i++) {
        let dataList = [];
        for (let data of GeneratedData) {
            const dataSet = data.split(',')
            if (dataSet[0] === labelDoubleList[i][0] && dataSet[5] === labelDoubleList[i][1] && dataSet[3] === labelDoubleList[i][2]) {
                dataList.push(dataSet[6])
            }
        }
        dataSetsList.push(dataSet(dataList, labelList[i]))
    }
    return {
        labels: typeShortList, // Categories on the x-axis
        datasets: dataSetsList
    };
}

const generateDataDimensionEmpty = (GeneratedData) => {
    let currentYearList = [];
    let currentRegionList = [];
    let currentTypeShortList = [];
    let labelList = [];
    let labelDoubleList = [];
    let dataSetsList = [];

    for (let data of GeneratedData) {
        const dataSet = data.split(',')
        if (!currentYearList.includes(dataSet[0])) {
            currentYearList.push(dataSet[0])
        }
        if (!currentRegionList.includes(dataSet[5])) {
            currentRegionList.push(dataSet[5])
        }
        if (!currentTypeShortList.includes(dataSet[1])) {
            currentTypeShortList.push(dataSet[1])
        }
    }
    let numDataSets = currentRegionList.length * currentTypeShortList.length * currentYearList.length;

    for (let region of currentRegionList) {
        for (let typeShort of currentTypeShortList) {
            for (let year of currentYearList) {
                labelList.push(year + " " + region + " " + typeShort);
                labelDoubleList.push([year, region, typeShort])
            }
        }
    }

    for (let i = 0; i < numDataSets; i++) {
        let dataList = [];
        for (let data of GeneratedData) {
            const dataSet = data.split(',')
            if (dataSet[0] === labelDoubleList[i][0] && dataSet[5] === labelDoubleList[i][1] && dataSet[1] === labelDoubleList[i][2]) {
                dataList.push(dataSet[6])
            }
        }
        dataSetsList.push(dataSet(dataList, labelList[i]))
    }
    return {
        labels: dimensionList, // Categories on the x-axis
        datasets: dataSetsList
    };
}

const generateDataAllFull = (GeneratedData) => {
    let info = null;
    // Loop through the GeneratedData array
    for (let data of GeneratedData) {
        const dataSet = data.split(',');
        // Check conditions
        if (
            dataSet[0] === year &&
            dataSet[1] === typeShort &&
            dataSet[3] === dimension &&
            dataSet[5] === region
        ) {
            info = dataSet[6];
            console.log(info)
        }
    }

    // Ensure datasets is an array
    return {
        labels: ["Statistic"], // Categories on the x-axis
        datasets: [dataSet([info], "Statistic")]
    };
};


const dataSet = (data, label) => {
    return {
        label: label,
        data: data, // Data points for each category
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }
}

// Data and configuration for the chart
const configureChart = (GeneratedData) => {
    let data;
    let type;
    if (year === "") {
        data = generateDataYearEmpty(GeneratedData)
        type='line'
    } else if (region === "") {
        data = generateDataRegionEmpty(GeneratedData)
        type='bar'
    }else if (typeShort === "") {
        data = generateDataTypeShortEmpty(GeneratedData)
        type='bar'
    } else if (dimension === ""){
        data = generateDataDimensionEmpty(GeneratedData)
        type='bar'
    } else {
        data = generateDataAllFull(GeneratedData)
        type='bar'
    }

    const config = {
        type: type, // Chart type (bar chart)
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    if (myChart) {
        myChart.destroy();
    }

    // Create a new Chart instance and render it on the canvas
    myChart = new Chart(
        document.getElementById('myChart'), // The canvas element
        config // The configuration object
    );
    chartGenerated = true;
}
// An async function to call retrieveData and update the HTML
const displayData = async (dataType) => {
    region = dataType[0];
    year = dataType[1];
    typeShort = dataType[2];
    dimension = dataType[3]
    const data = await retrieveData(); // Use await to get the data
    console.log(data)
    //document.getElementById('analysis').innerText = data; // Update the HTML with the result
    if (data.length < 5000) {
        configureChart(data);
    }
}

function handleClick() {
    let dataTypes = ["region", "year", "issue", "dataType"]
    for (let i = 0; i < dataTypes.length; i++) {
        let e = document.getElementById(dataTypes[i]);
        dataTypes[i] = e.value;
    }
    displayData(dataTypes);
}

const button = document.getElementById("ClickMe");
button.addEventListener("click", handleClick);

// const IDtoRegion = {
//     '0': 'Global average',
//     '1': 'Cocos Islands',
//     '2': 'Christmas Island',
//     '3': 'Norfolk Island',
//     '4': 'Macquarie Island',
//     '5': 'New Caledonia',
//     '6': 'Vanuatu',
//     '7': 'Solomon Islands',
//     '8': 'Palau',
//     '9': 'Micronesia',
//     '10': 'Nauru',
//     '11': 'Marshall Islands',
//     '12': 'Wake Island',
//     '13': 'Northern Mariana Islands and Guam',
//     '14': 'Taiwan',
//     '15': 'Philippines',
//     '16': 'Australia',
//     '17': 'Papua New Guinea',
//     '18': 'Fiji',
//     '19': 'Tuvalu',
//     '20': 'South Korea',
//     '21': 'North Korea',
//     '24': 'Cambodia',
//     '25': 'Thailand',
//     '26': 'Andaman and Nicobar',
//     '28': 'Comoro Islands',
//     '29': 'Mayotte',
//     '30': 'Glorioso Islands',
//     '31': 'Seychelles',
//     '32': 'RÃ©union',
//     '33': 'Juan de Nova Island',
//     '34': 'Bassas da India',
//     '35': 'Ile Europa',
//     '36': 'Ile Tromelin',
//     '37': 'Mauritius',
//     '38': 'British Indian Ocean Territory',
//     '39': 'Maldives',
//     '40': 'Sri Lanka',
//     '41': 'Mozambique',
//     '42': 'Madagascar',
//     '43': 'Kenya',
//     '44': 'Somalia',
//     '45': 'Eritrea',
//     '46': 'Djibouti',
//     '47': 'Yemen',
//     '48': 'Oman',
//     '49': 'Sudan',
//     '50': 'Saudi Arabia',
//     '51': 'Kuwait',
//     '52': 'Bahrain',
//     '53': 'Pakistan',
//     '54': 'United Arab Emirates',
//     '55': 'Azores',
//     '56': 'Cape Verde',
//     '57': 'Madeira',
//     '58': 'Canary Islands',
//     '59': 'Belgium',
//     '60': 'Gibraltar',
//     '61': 'Tunisia',
//     '62': 'Morocco',
//     '63': 'Western Sahara',
//     '64': 'Mauritania',
//     '65': 'Gambia',
//     '66': 'Senegal',
//     '67': 'Libya',
//     '68': 'Malta',
//     '69': 'Latvia',
//     '70': 'Estonia',
//     '71': 'Bulgaria',
//     '72': 'Romania',
//     '73': 'Russia',
//     '74': 'Georgia',
//     '75': 'Ukraine',
//     '76': 'Turkey',
//     '77': 'Syria',
//     '78': 'Lebanon',
//     '79': 'Israel',
//     '80': 'Greece',
//     '81': 'Cyprus',
//     '82': 'Albania',
//     '84': 'Algeria',
//     '85': 'Ascension',
//     '86': 'Saint Helena',
//     '88': 'Tristan da Cunha',
//     '89': 'South Georgia and the South Sandwich Islands',
//     '90': 'Prince Edward Islands',
//     '91': 'Crozet Islands',
//     '92': 'Amsterdam Island and Saint Paul Island',
//     '93': 'Kerguelen Islands',
//     '94': 'Heard and McDonald Islands',
//     '95': 'Falkland Islands',
//     '96': 'Sierra Leone',
//     '97': 'Liberia',
//     '98': 'Togo',
//     '99': 'Benin',
//     '100': 'Republique du Congo',
//     '101': 'Namibia',
//     '102': 'South Africa',
//     '103': 'Sao Tome and Principe',
//     '104': 'Equatorial Guinea',
//     '105': 'Bouvet Island',
//     '106': 'Ghana',
//     '107': 'Clipperton Island',
//     '108': 'Bermuda',
//     '110': 'Bahamas',
//     '111': 'Turks and Caicos Islands',
//     '112': 'Cuba',
//     '113': 'Cayman Islands',
//     '114': 'Haiti',
//     '115': 'Dominican Republic',
//     '116': 'Puerto Rico and Virgin Islands of the United States',
//     '117': 'British Virgin Islands',
//     '118': 'Anguilla',
//     '119': 'Saint Kitts and Nevis',
//     '120': 'Antigua and Barbuda',
//     '121': 'Montserrat',
//     '122': 'Saint Lucia',
//     '123': 'Dominica',
//     '124': 'Barbados',
//     '125': 'Grenada',
//     '126': 'Trinidad and Tobago',
//     '127': 'Saint Vincent and the Grenadines',
//     '129': 'Panama',
//     '130': 'Costa Rica',
//     '131': 'Nicaragua',
//     '132': 'Colombia',
//     '133': 'Honduras',
//     '134': 'El Salvador',
//     '135': 'Mexico',
//     '136': 'Guatemala',
//     '137': 'Ecuador',
//     '138': 'Peru',
//     '139': 'Venezuela',
//     '140': 'Guadeloupe and Martinique',
//     '141': 'Faeroe Islands',
//     '143': 'Iceland',
//     '144': 'Jan Mayen',
//     '145': 'Greenland',
//     '146': 'Pitcairn',
//     '147': 'French Polynesia',
//     '148': 'Line Islands (Kiribati)',
//     '149': 'Jarvis Island',
//     '150': 'Palmyra Atoll',
//     '151': 'American Samoa',
//     '152': 'Samoa',
//     '153': 'Cook Islands',
//     '154': 'Niue',
//     '155': 'Tonga',
//     '156': 'Tokelau',
//     '157': 'Phoenix Islands (Kiribati)',
//     '158': 'Howland Island and Baker Island',
//     '159': 'Johnston Atoll',
//     '161': 'Wallis and Futuna',
//     '162': 'New Zealand',
//     '163': 'United States',
//     '164': 'Belize',
//     '166': 'Jamaica',
//     '167': 'Guyana',
//     '168': 'Suriname',
//     '169': 'French Guiana',
//     '171': 'Brazil',
//     '172': 'Argentina',
//     '173': 'Uruguay',
//     '174': 'Finland',
//     '175': 'Denmark',
//     '176': 'Germany',
//     '177': 'Netherlands',
//     '178': 'Poland',
//     '179': 'France',
//     '180': 'United Kingdom',
//     '181': 'Ireland',
//     '182': 'Spain',
//     '183': 'Portugal',
//     '184': 'Italy',
//     '185': 'Monaco',
//     '186': 'Montenegro',
//     '187': 'Croatia',
//     '188': 'Slovenia',
//     '189': 'Lithuania',
//     '190': 'Qatar',
//     '191': 'Iran',
//     '192': 'Iraq',
//     '193': 'Guinea Bissau',
//     '194': 'Guinea',
//     '195': 'Ivory Coast',
//     '196': 'Nigeria',
//     '197': 'Cameroon',
//     '198': 'Gabon',
//     '199': 'Democratic Republic of the Congo',
//     '200': 'Angola',
//     '202': 'Tanzania',
//     '203': 'India',
//     '204': 'Bangladesh',
//     '205': 'Myanmar',
//     '206': 'Malaysia',
//     '207': 'Vietnam',
//     '208': 'Singapore',
//     '209': 'China',
//     '210': 'Japan',
//     '212': 'Gilbert Islands (Kiribati)',
//     '213': 'Antarctica',
//     '214': 'Egypt',
//     '215': 'Jordan',
//     '216': 'Indonesia',
//     '218': 'Canada',
//     '219': 'Saint Pierre and Miquelon',
//     '220': 'Sint Maarten',
//     '221': 'Northern Saint-Martin',
//     '222': 'Sweden',
//     '223': 'Norway',
//     '224': 'Chile',
//     '227': 'Jersey',
//     '228': 'Guernsey',
//     '231': 'East Timor',
//     '232': 'Bosnia and Herzegovina',
//     '237': 'Oecussi Ambeno',
//     '244': 'Curacao',
//     '245': 'Bonaire',
//     '247': 'Brunei',
//     '248': 'Saba',
//     '249': 'Sint Eustatius',
//     '250': 'Aruba'
// }