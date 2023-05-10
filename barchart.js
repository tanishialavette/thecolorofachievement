const airtable_api = "https://api.airtable.com/v0/appE6aFAtJyhHEvCy/NYC?api_key=keyS5mMq95mwxiIXd";

const html = document.documentElement;

axios
    .get(airtable_api)
    .then(function (result) {
        // console.log(result.data.records)
        [data, imgs] = analyzeData(result.data.records)
        ratio = result.data.records[0]["fields"]["Instructional_Days"]

        BarChart(data, {
            x: d => d.counts,
            y: d => d.standard,
            dayRatio: ratio,
            imgs: imgs,
            xFormat: "",
            xLabel: "Instructional Days →",
            color: "black",
            width: window.innerWidth,
            height: window.innerHeight,
            marginTop: 100, // the top margin, in pixels
            marginRight: 100, // the right margin, in pixels
            marginBottom: 100, // the bottom margin, in pixels
            marginLeft: 100, // the left margin, in pixels
        })
    });

function analyzeData(data) {

    data = data.filter((item) => item.fields.Order !== undefined);

    // pls put them in the right order
    data.sort(function (a, b) {
        return parseInt(a['fields']['Order']) - parseInt(b['fields']['Order']);
    });

    console.log(data)

    const numbers = [...new Set(data.map(d => d["fields"]["Standard_Number"]))];
    const texts = [...new Set(data.map(d => d["fields"]["Standard_Text"]))];
    const newData = [];
    const imgs = [];

    numbers.forEach((value, i) => {
        const count = data.filter(d => d["fields"]["Standard_Number"] === value).length;

        if (typeof value !== 'undefined') {
            newData.push({
                standard: value,
                counts: count,
                text: texts[i],
            })
        }

    });

    let rower = 1
    let indexer = 1

    data.forEach((el, i) => {
        let imgURL = (typeof el["fields"]["Image"] !== 'undefined') ? el["fields"]["Image"][0]['thumbnails'] : 0;
        imgURL.source = (typeof el["fields"]["Image_Source"] !== 'undefined') ? el["fields"]["Image_Source"] : 0;
        imgURL.width = el["fields"]["Image"][0]['width']
        imgURL.height = el["fields"]["Image"][0]['height']
        imgURL.topic = el["fields"]["Essential_Topic"]
        imgURL.number = el["fields"]["Standard_Number"]

        imgURL.row = rower
        imgURL.col = indexer

        indexer++

        if (typeof newData[rower - 1] !== 'undefined') {

            if (indexer / (newData[rower - 1]['counts']) > 1) {
                rower++
                indexer = 1
            }

            imgs.push(imgURL)
        }
    })

    return [newData, imgs]
}

function BarChart(data, {
    x = d => d, // given d in data, returns the (quantitative) x-value
    y = (d, i) => i, // given d in data, returns the (ordinal) y-value
    dayRatio = d => d,
    title, // given d in data, returns the title text
    imageSource,
    marginTop = 30, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 10, // the bottom margin, in pixels
    marginLeft = 0, // the left margin, in pixels
    width, // the outer width of the chart, in pixels
    height, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    yPadding = 0.1, // amount of y-range to reserve to separate bars
    yDomain, // an array of (ordinal) y-values
    yRange, // [top, bottom]
    color = "currentColor", // bar fill color
    titleColor = "white", // title fill color when atop bar
    titleAltColor = "currentColor", // title fill color when atop background
}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);

    // console.log(dayRatio)

    // Compute default domains, and unique the y-domain.
    if (xDomain === undefined) xDomain = [0, 10];
    if (yDomain === undefined) yDomain = Y;
    yDomain = new d3.InternSet(yDomain);

    // Omit any data not present in the y-domain.
    const I = d3.range(X.length).filter(i => yDomain.has(Y[i]));

    // Compute the default height.
    if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
    if (yRange === undefined) yRange = [marginTop, height - marginBottom];

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
    const xAxis = d3.axisTop(xScale).ticks(11);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    // Compute titles.
    if (title === undefined) {
        const formatValue = xScale.tickFormat(100, xFormat);
        title = i => `${formatValue(X[i])}`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

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

    // console.log(imgs)

    const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "fixed")
        .style("pointer-events", "none")
        .style("left", "0")
        .style("top", "0")
        // .style("background", "#000")
        // .style("width", "500px")
        // .style("height", "500px")
        .style("opacity", 1)

    const tooltipText = tooltip.append("p").append("span").style("background", "#000").style("color", "#fff")

    const tooltipImage = tooltip.append("img")

    // Define patterns for each image
    const patternGroup = svg.append("g")
        .attr("class", "patterns")
        .selectAll(".pattern")
        .data(imgs)
        .enter()
        .append("pattern")
        .attr("id", (d) => `pattern-${d.row}-${d.col}`)
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("width", "1")
        .attr("height", "1")
        .append("image")
        .attr("x", "0")
        .attr("y", "0")
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("width", "1")
        .attr("height", "1")
        .attr("xlink:href", d => {
            if (d !== 0) {
                return d.large.url
            }
        })
    // .attr("width", xScale(1) - xScale(0))
    // .attr("height", yScale.bandwidth())
    // .attr("preserveAspectRatio", "none");

    const index = d3.local(); // Local variable for storing the index.

    //rect
    const bar = svg
        .selectAll(".g")
        .data(X)
        .enter()
        .append("g")
        .selectAll(".r")
        .data((d, i) => d3.range(d).map(() => i))
        .enter()
        .append("rect")
        .each(function (d, i) {
            index.set(this, i); // Store index in local variable.
        })

    bar.attr("x", (d, i) => xScale(i * dayRatio))
        .attr("y", (d, i) => yScale(Y[d]))
        .transition()
        .delay((d, i) => 300 + i * 200)
        .duration(2000)
        .attr("fill", (d, i) => `url(#pattern-${d+1}-${i+1})`)
        .attr("stroke", "silver")
        .attr("stroke-width", 2)
        .attr("width", xScale(dayRatio) - xScale(0))
        .attr("height", yScale.bandwidth())

    bar.on('mouseover', function (event, d, i) {

            let indexer = index.get(this);

            d3.select(this).transition()
                .duration('50')
                .attr('cursor', 'pointer')
                .attr('opacity', '.5');

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            if (event.pageY > html.clientHeight / 2) {
                tooltip.style("top", (event.pageY - html.clientHeight / 2) + "px")
            } else {
                tooltip.style("top", (event.pageY) + "px")
            }

            if (event.pageX > html.clientWidth / 2){
                tooltip.style("left", (event.pageX - html.clientWidth / 2) + "px")
            }
            else {
                tooltip.style("left", (event.pageX) + "px")
            }

            const imageIndex = calNum(d, indexer)

            tooltipImage
                .attr("src", imgs[imageIndex]['large']['url'])
                .style("font-color", "white");

            tooltipText.html(imgs[imageIndex]['number']+ " " +imgs[imageIndex]['topic'])
        })
        .on('mouseout', function (event, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');

            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });

    function calNum(d, i) {
        // console.log(d, i)
        const num = data.map((d) => d.counts)
        let sum = 0

        for (let j = 0; j < d; j++) {
            sum += num[j]
        }

        return sum + i
    }

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
        .text(title)
        .call(text => text.filter(i => xScale(X[i]) - xScale(0) < 20) // short bars
            .attr("dx", +4)
            .attr("fill", titleAltColor)
            .attr("text-anchor", "start"));

    const yaxis = svg.append("g")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .style("font-size", "15px")
        .call(yAxis)

    return svg.node();
}