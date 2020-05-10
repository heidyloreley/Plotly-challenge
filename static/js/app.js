
// ----------------------VERSION 3 ------------------------

// ----------------------1. Build DropdownOptions Function /  Get IDs + Showthem in dropdown menu------------------------
// function DropdownOptions(selectedId){
function DropdownOptions() {

    d3.json("data/samples.json").then((d) => {
        var IDs = d.names;
        console.log(d.names);

        var dataset = d3.select("#selDataset");
        var idOption;
        for (var i = 0; i < IDs.length; i++) {
            idOption = dataset.append("option").text(IDs[i]);
        }
    })
};
DropdownOptions();

// ----------------------2. Initial graph based on default value id = 940, the first on the list------------------------
function init() {

    // Get values to plot initial information
    d3.json("data/samples.json").then((d) => {
        // console.log(d);
        var IDs = d.names;
        var selectedId = IDs[0];
        // console.log(selectedId);   

        getData(selectedId)  
    });
};
init();


// ----------------------3. Update Plots on Change of option Function ------------------------

function optionChanged(selectedId) {

    // Obtain graph information based on selected Id
    getData(selectedId)
};



// ----------------------4. GetData Function for any DropdownValue selected  & Plot graphs and Info------------------------
function getData(selectedId) {

    // / Get values to plot information
    d3.json("data/samples.json").then((d) => {

        console.log(d);

        var FilteredInfo = d.samples.filter(row => row.id === selectedId); //d.samples is an array of objects [{},{},...{}], so filter gets an array of 1 object [{}] 
        console.log(FilteredInfo)

        var values = FilteredInfo[0].sample_values;  // to use the object in FilteredInfo, get it from inside the array it is by using the [0]
        var otuID = FilteredInfo[0].otu_ids;
        var otuLabel = FilteredInfo[0].otu_labels;

        var selectedIdInfo = values.map((value, index) => {
            return {
                values: value,
                otuID: otuID[index],
                otuLabel: otuLabel[index]
            }
        });
        console.log(selectedIdInfo);

        var sortedValues = selectedIdInfo.sort((a, b) => b.values - a.values);
        var slicedValues = sortedValues.slice(0, 10);
        var reverseValues = slicedValues.reverse()

        // Information for Bar Graph
        var ValuestoPlot = reverseValues.map(x => x.values);
        var OtuIDstoPlot = reverseValues.map(x => `OTU${x.otuID}`);
        var OtuLabelstoPlot = reverseValues.map(x => x.otuLabel);

        var trace1 = {
            x: ValuestoPlot,
            y: OtuIDstoPlot,
            text: OtuLabelstoPlot,
            type: "bar",
            orientation: "h"
        };

        var data = [trace1];

        var layout = {
            title: "Top 10 OTUS",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTUS ids" },
        };

        Plotly.newPlot("bar", data, layout)

        // Information for Bubble Chart
        var ValuesBubble = selectedIdInfo.map(x => x.values);
        var OtuIDsBubble = selectedIdInfo.map(x => x.otuID);
        var OtuLabelsBubble = selectedIdInfo.map(x => x.otuLabel);

        var trace2 = {
            x: OtuIDsBubble,
            y: ValuesBubble,
            text: OtuLabelsBubble,
            mode: "markers",
            marker: {
                color: OtuIDsBubble,
                size: ValuesBubble
            }
        };

        var bubbledata = [trace2];

        var bubblelayout = {
            title: "Bubble Chart",
            xaxis: { title: "OTUS ids" },
            yaxis: { title: "Sample Values" },
            showlegend: false
        };

        Plotly.newPlot("bubble", bubbledata, bubblelayout)


        // Information for Demographic Table
        var demographics = d.metadata;
        console.log(demographics); //I get an Array of Objects [{k:v,k:v,...,k:v},{k:v,k:v,...,k:v},...{k:v,k:v,...,k:v}] 

        var IdDemoInfo = demographics.filter(Idselected => Idselected.id == selectedId)[0]; // the filter gets [{}], so use [0] to get just the object
        console.log(IdDemoInfo);

        var panelBody = d3.select(".panel-body");

        panelBody.html("");

        Object.entries(IdDemoInfo).forEach(([k, v]) => {
            panelBody.append("p").text(`${k}:${v}\n`)
        });
    });
};