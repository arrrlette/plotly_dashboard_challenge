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

    //console.log(jsonData);

    //add ID's to drop down
    jsonData.names.forEach((name) => {
        dropDown.append('option').text(name).property('value', name);
    })

    //function to call chart options. added index [0] to display 940's data on initial download
    optionChanged(jsonData.names[0]) //to display graphics for 940 on init load
};

function optionChanged(personID) {

    demographics(personID);
    barChart(personID);
    bubbleChart(personID);
    gaugeChart(personID);
};

function demographics(personID) {

    //saving json metadata for selected ID into a variable
    var metaData = jsonData.metadata.filter((sample) => sample.id === parseInt(personID))[0];
    //console.log(metaData)

    //select html
    var demoHTML = d3.select("#sample-metadata");
    //to only show current data called
    demoHTML.html("")
    //appends each key and value in the metaData to the html
    Object.entries(metaData).forEach(([key, value]) => demoHTML.append("h4").text(`${key}: ${value}`));

}

function barChart(personID) {

    //saving json sample data for selected ID into a variable
    var sampleData = jsonData.samples.filter(obj => obj.id.toString() === personID)[0];
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

    var layout = {
        title: "<b>Top Ten OTUs Found</b>",
        xaxis: {
            title: 'OTU IDs'
        },
        yaxis: {
            title: 'Sample Values'
        }
    }

    var barData = [trace1];

    //plot bar graph
    Plotly.newPlot("bar", barData, layout)
};


function bubbleChart(personID) {

    //saving json sample data for selected ID into a variable
    var sampleData = jsonData.samples.filter(obj => obj.id.toString() === personID)[0];

    //grabbing all OTU IDs for chosen personID
    var otuIDs = sampleData.otu_ids;
    //console.log(otuIDs)

    //grabbing all OTU sample values for chosen personID
    var sampleValues = sampleData.sample_values; //used for x axis
    //console.log(sampleValues)

    //grabbing all OTU sample labels for chosen personID
    var sampleLabels = sampleData.otu_labels;
    //console.log(sampleLabels);

    var trace1 = {
        x: otuIDs,
        y: sampleValues,
        text: sampleLabels,
        mode: 'markers',
        marker: {
            color: otuIDs,
            size: sampleValues,
            colorscale: 'Greens'
        }
    };

    var data = [trace1];

    var layout = {
        // title: 'Marker Size and Color',
        showlegend: false,
        height: 500,
        width: 1200,
        title: "<b>Belly Button Bacteria</b>",
        xaxis: {
            title: 'OTU IDs'
        },
        yaxis: {
            title: 'Sample Values'
        }
    };

    //plot bubble graph
    Plotly.newPlot('bubble', data, layout);
};

function gaugeChart(personID) {

    //saving json metadata for selected ID into a variable
    var metaData = jsonData.metadata.filter((sample) => sample.id === parseInt(personID))[0];
    // navigate into json, access wfreq and plug it in to chart
    var wfreq = metaData.wfreq;
    //console.log(wfreq);

    var data = [
        {
            type: "indicator",
            mode: "gauge+number",
            value: wfreq,
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "red" },
                bar: { color: "#3366cc" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    { range: [0, 2], color: "#66c2ff" },
                    { range: [2,4], color: "#4db8ff" },
                    { range: [4,6], color: "#33adff" },
                    { range: [6,8], color: "#1aa3ff" },
                    { range: [8,9], color: "#0099ff" }
                ],
            }
        }
    ];

    var layout = {
        width: 500,
        height: 400,
        font: { color: "black", family: "Arial" }
    };

    //plot gauge
    Plotly.newPlot('gauge', data, layout);
}