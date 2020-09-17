const jsonLink = "static/data/samples.json";

//pull data into memory
var jsonData;
d3.json(jsonLink).then((data) => {
    jsonData = data;
    init();
});

function init() {
    //select html
    var dropDown = d3.select('#selDataset');
    console.log(jsonData);
    jsonData.names.forEach((name) => {
        dropDown.append('option').text(name).property('value', name);
    })
    optionChanged(jsonData.names[0]) //to display graphics for 940 on init load
};

function optionChanged(personID) {

    barChart(personID);
    bubbleChart(personID);
    demographics(personID);
    //gaugeChart(personID);
};

function demographics(personID) {

    var metaData = jsonData.metadata.filter((sample) => sample.id === parseInt(personID))[0];

    var demoHTML = d3.select("#sample-metadata");
    demoHTML.html("")
    Object.entries(metaData).forEach(([key, value]) => demoHTML.append("h4").text(`${key}: ${value}`)); 

}

function barChart(personID) {

    var sampleData = jsonData.samples.filter(obj => obj.id.toString() === personID)[0];

    //console.log(metaData);
    //console.log(sampleData);

    //grabbing top 10 OTU IDs for chosen personID
    var topTenOTU = sampleData.otu_ids.slice(0, 10).reverse();
    //console.log(topTenOTU)

    //add OTU to ID on y axis
    var otuIDs = topTenOTU.map(x => "OTU " + x);

    //grabbing top 10 OTU sample values for chosen personID
    var sampleValues = sampleData.sample_values.slice(0, 10).reverse(); //used for x axis
    //console.log(sampleValues)

    //grabbing top 10 OTU sample labels for chosen personID
    var sampleLabels = sampleData.otu_labels.slice(0, 10).reverse();
    //console.log(sampleLabels);


    //build bar chart
    var trace1 = {
        type: "bar",
        x: sampleValues,
        y: otuIDs,
        text: sampleLabels,
        orientation: "h"
    };

    var barData = [trace1];

    Plotly.newPlot("bar", barData)
};


function bubbleChart(personID) {

    //var metaData = jsonData.metadata.filter((sample) => sample.id === parseInt(personID))[0];
    var sampleData = jsonData.samples.filter(obj => obj.id.toString() === personID)[0];

    //wont need to slice by 10 here since showing all

    //grabbing top 10 OTU IDs for chosen personID
    var otuIDs = sampleData.otu_ids;
    //console.log(otuIDs)

    //grabbing top 10 OTU sample values for chosen personID
    var sampleValues = sampleData.sample_values; //used for x axis
    //console.log(sampleValues)

    //grabbing top 10 OTU sample labels for chosen personID
    var sampleLabels = sampleData.otu_labels;
    //console.log(sampleLabels);

    var trace1 = {
        x: otuIDs,
        y: sampleValues,
        text: sampleLables,
        mode: 'markers',
        marker: {
            color: otuIDs,
            // opacity: [1, 0.8, 0.6, 0.4],
            size: sampleValues
        
        }
    };

    var data = [trace1];

    var layout = {
        // title: 'Marker Size and Color',
        showlegend: false,
        height: 500,
        width: 1200
    };

    Plotly.newPlot('bubble', data, layout);
};

function gaugeChart(personID) {
    var metaData = jsonData.metadata.filter((sample) => sample.id === parseInt(personID))[0];
    // navigate into json, access wfreq and plug it in to chart
    // var wfeq = metadata.wfreq;
    // console.log(wfeq)

    // var data = [
    //     {
    //         domain: { x: [0, 1], y: [0, 1] },
    //         value: 270,
    //         title: { text: "Speed" },
    //         type: "indicator",
    //         mode: "gauge+number"
    //     }
    // ];

    // var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);
}









//chart function
//bubble chart function
//metadata function







