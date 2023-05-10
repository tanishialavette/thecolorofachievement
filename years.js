const airtable_api = "https://api.airtable.com/v0/appE6aFAtJyhHEvCy/NYC?api_key=keyS5mMq95mwxiIXd";

// This you can change!
const color1 = "gray" //color of the instructional days bar
const color2 = "black" // color of each year's bar

function update(string) {

    const year = string.substring(string.length - 4, string.length);
    const month = string.substring(0, string.length - 4);

    // this will output the string
    d3.select("#title").html(`Appearance of ${year} ${month} v.s. Instructional Time`.replace("_", " "))

    // call this one will change the data
    BarChart(newData[string], {
        x: d => d.counts,
        y: d => d.standard
    })
}

const years = ["January2020", "January2019", "June2019", "August2019", "January2018", "June2018", "August2018", "January2017", "June2017", "August2017", "January2016", "June2016", "August2016"]
const xLabel = "Instructional Days →"
const color = "black"
const marginTop = 100 // the top margin in pixels
const marginRight = 100 // the right margin in pixels
const marginBottom = 100 // the bottom margin in pixels
const marginLeft = 200 // the left margin in pixels
const width = window.innerWidth;
const height = window.innerHeight;

/*====================================================
You don't really need to touch the follow part


These are d3.js
====================================================*/
const instructD = []
let X, Y, xScale, yScale, xAxis, yAxis, I
let yRange // [topbottom]
let titleColor = "white" // title fill color when atop bar
let titleAltColor = "currentColor" // title fill color when atop background
let xRange = [marginLeft, width - marginRight]
let xFormat // a format specifier string for the x-axis
let yPadding = 0.1 // amount of y-range to reserve to separate bars
let xType
let xDomain, yDomain
let dayRatio

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

axios
    .get(airtable_api)
    .then(function (result) {
        // console.log(result.data.records)
        [newData] = analyzeData(result.data.records)
        // newData[]
        dayRatio = result.data.records[0]["fields"]["Instructional_Days"]
        data = newData[years[0]]

        generateButtons(years);

        // Compute values.
        X = d3.map(data, d => d.counts);
        Y = d3.map(data, d => d.standard);

        // Compute default domains, and unique the y-domain.
        xDomain = [0, 10];
        yDomain = Y;
        yDomain = new d3.InternSet(yDomain);

        // Omit any data not present in the y-domain.
        I = d3.range(X.length).filter(i => yDomain.has(Y[i]));

        // Compute the default height.
        // height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
        yRange = [marginTop, height - marginBottom];

        // Construct scales and axes.
        xScale = d3.scaleLinear().domain(xDomain).range(xRange);
        console.log(xScale)
        yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
        xAxis = d3.axisTop(xScale).ticks(11);
        yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

        svg.append("g")
            .attr("transform", `translate(0,${marginTop})`)
            .call(xAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", height - marginTop - marginBottom)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")

                .attr("x", width - marginRight)
                .attr("y", -50)
                .style("font-size", "20px")
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text(xLabel));

        svg.append("g")
            .attr("fill", titleColor)
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("text")
            .data(I)
            .join("text")
            .attr("x", i => xScale(X[i]))
            .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("dx", -4)

        const yaxis = svg.append("g")
            .attr("transform", `translate(${marginLeft}, 0)`)
            .style("font-size", "15px")
            .call(yAxis)

        XX = d3.map(instructD, d => d.counts);

        const bar = svg
            .selectAll(".g")
            .data(XX)
            .enter()
            .append("g")
            .selectAll("rect")
            .data((d, i) => d3.range(d).map(() => i))
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(i * dayRatio) + 3)
            .attr("y", (d, i) => yScale(Y[d]))
            .attr("fill", color1)
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .transition()
            .delay((d, i) => i * 150)
            .duration(1000)
            .attr("width", xScale(dayRatio) - xScale(0))
            .attr("height", yScale.bandwidth() / 2)

        BarChart(data, {
            x: d => d.counts,
            y: d => d.standard
        })
    });

function analyzeData(data) {

    data = data.filter((item) => item.fields.Order !== undefined);

    // pls put them in the right order
    data.sort(function (a, b) {
        return parseInt(a['fields']['Order']) - parseInt(b['fields']['Order']);
    });

    const numbers = [...new Set(data.map(d => d["fields"]["Standard_Number"]))];
    const newData = [];

    numbers.forEach((value, i) => {
        const count = data.filter(d => d["fields"]["Standard_Number"] === value).length;
        if (typeof value !== 'undefined') {
            instructD.push({
                standard: value,
                counts: count,
            })
        }

    });

    console.log(instructD)

    years.forEach((yr, i) => {

        newData[yr] = []

        numbers.forEach((num, j) => {

            if (typeof num !== "undefined") {

                newData[yr].push({
                    standard: num,
                    counts: 0

                });
            }

        });
    });

    data.forEach((value, i) => {

        const st_number = value["fields"]["Standard_Number"]

        years.forEach((yr, j) => {

            if (typeof value["fields"] !== "undefined") {
                if (typeof (value["fields"][yr]) !== "undefined") {
                    if (value["fields"][yr] === "TRUE") {

                        newData[yr].forEach((num, k) => {

                            if (num.standard === st_number) {

                                newData[yr][k]["counts"]++
                            }

                        });

                    }

                }
            }

        });

    });

    console.log(newData)

    return [newData, instructD]
}

function generateButtons(data) {
    d3.select("#buttons")
    .selectAll("button")
        .data(data)
        .enter()
        .append("button")
        .attr("onclick", function (d) {
            return `update("${d}")`
        })
        .html(function (d) {
            // Extract the year and month from the string and format it
            const year = d.substring(d.length - 4, d.length);
            const month = d.substring(0, d.length - 4);
            return `${year} ${month}`;
        })
}

function BarChart(thisdata, {
    x = d => d, // given d in data, returns the (quantitative) x-value
    y = (d, i) => i // given d in data, returns the (ordinal) y-value
}) {

    const index = d3.local(); // Local variable for storing the index.

    x = d3.map(thisdata, d => d.counts);

    svg
        .selectAll(".year-bar")
        .remove()

    //rect
    const years = svg
        .selectAll(".g")
        .data(x)
        .enter()
        .append("g")
        .selectAll("rect")
        .data((d, i) => d3.range(d).map(() => i))
        .enter()
        .append("rect")
        .attr("class", "year-bar")
        .each(function (d, i) {
            index.set(this, i); // Store index in local variable.
        })
        .attr("x", (d, i) => xScale(i * dayRatio) + 3)
        .attr("y", (d, i) => yScale(Y[d]) + yScale.bandwidth() / 2)
        .attr("fill", color2)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .transition()
        .delay((d, i) => i * 150)
        .duration(1000)
        .attr("width", xScale(dayRatio) - xScale(0))
        .attr("height", yScale.bandwidth() / 2)

    // bar

    // bar
    //     .on('mouseover', function (event, d, i) {

    //         let indexer = index.get(this);

    //         d3.select(this).transition()
    //             .duration('50')
    //             .attr('cursor', 'pointer')
    //             .attr('opacity', '.5');

    //     })
    //     .on('mouseout', function (event, d) {
    //         d3.select(this).transition()
    //             .duration('50')
    //             .attr('opacity', '1');

    //     });

    return svg.node();
}