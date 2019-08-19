const g_margin = 20;

const dispatch_params_changed = d3.dispatch("params_changed");
const dispatch_pdf_changed = d3.dispatch("pdf_changed");
const dispatch_cdf_changed = d3.dispatch("cdf_changed");
const dispatch_pdf_clicked = d3.dispatch("pdf_clicked");
const dispatch_cdf_clicked = d3.dispatch("cdf_clicked");

const f = d3.format(".4f");
d3.select("#pdf").attr("transform", `translate(${g_margin}, ${g_margin})`);
d3.select("#cdf").attr("transform", `translate(${g_margin}, ${g_margin})`);

function stat_req() {
    const p_dist = params("dist");
    if( !p_dist || !window.stats[p_dist] ) return window.stats.normal;
    const dist = window.stats[p_dist];
    dist.params().forEach(p => {
        if( params(p.name) )
            p.value = +params(p.name);
    });
    return dist;
}

const dist = stat_req();

function navList() {
    d3.select(".nav-dist").selectAll("li").remove();
    d3.select(".nav-dist").selectAll("li").data(Object.keys(window.stats).sort()).enter().append("li")
        .append("a").attr("href", d => `index.html?dist=${d}`).text(d => window.stats[d].name() + jax(window.stats[d].notation()));
    d3.selectAll(".nav-dist li a").each(function() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
    });
}

navList();

function initInfobox() {
    const header = d3.select(".info header div");
    header.html(dist.name() + " <span>" + jax(dist.notation()) + "</span>");
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, header.node()]);
    const infobox = d3.select(".infobox tbody");
    infobox.selectAll(".row").remove();
    const tr_params = infobox.append("tr").classed("row", true);
    tr_params.append("th").text("Parameters");
    tr_params.append("td").classed("jax", true).selectAll("p").data(dist.params()).enter().append("p").text(d => jax(d.notation));
    const tr_params_value = tr_params.append("td").classed("jax", true);
    tr_params_value.selectAll("p").data(dist.params()).enter().append("p").classed("last_p", (d, i, data) => i == data.length - 1)
        .append("input")
        .attr("type", "textbox").attr("size", 3).attr("id", d => `txt${d.name}`).attr("name", d => `${d.name}`).attr("value", d => f4(d.value)).style("text-align", "right");
    tr_params_value.select(".last_p").append("button").attr("id", "btnParameters").text("Set");
    const props = dist.properties.map(p => {
        const prop = dist[p];
        prop.id = p;
        return prop;
    });
    infobox.selectAll("tr.props").data(props).enter(props).append("tr").classed("props", true).classed("row", true)
        .each(function(datum) {
            const tr = d3.select(this);
            tr.append("th").text(datum.name());
            tr.append("td").text(jax(datum.notation())).classed("jax", true);
            tr.append("td").text(jax(datum.value())).classed("jax", true).classed("prop_v", true);
        });
    infobox.selectAll(".jax").each(function() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
    });
    d3.select("#btnParameters").on('click', update);
}

initInfobox();
drawGraphs();

function drawGraphs() {
    initPdfHeader();
    initPdfGraph();
    initCdfHeader();
    initCdfGraph();
    dispatch_pdf_changed.call("pdf_changed", {x: dist.default_x()});
    dispatch_cdf_changed.call("cdf_changed", {x: dist.default_x()});
}

function update() {
    d3.selectAll(".infobox tbody tr td input").each(function() {
        dist.params(d3.select(this).attr("name"), +d3.select(this).node().value);
    });
    dispatch_params_changed.call("params_changed");
}

dispatch_params_changed.on('params_changed', function() {
    updateInfobox();
    drawGraphs();
});

function updateInfobox() {
    d3.selectAll(".infobox tbody tr.props .prop_v").each(function(datum) {
        d3.select(this).text(jax(datum.value()));
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
    });
}

function clearGraph() {
    d3.select("#cdf").selectAll("*").remove();
}

function initPdfHeader() {
    d3.select("#h_pdf").select(".g_sec_name").text(`${dist.PDF.name()} ${jax(dist.value())}`);
    const pdf_input = `<input type='text' size='3' value='${f4(dist.default_x())}' id='txtPdf' class='g_sec_input'>`;
    const pdf_output = `<span id='spanPdf'> $) = ${f4f(dist.PDF.f(dist.default_x()))}$</span>`;
    d3.select("#h_pdf").select(".g_sec_value").html("$f_{X}(x =$ " + pdf_input + " " + pdf_output);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#h_pdf").select(".g_sec_name").node()]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#h_pdf").select(".g_sec_value").node()]);
    d3.select("#txtPdf").on('input', function() {
        d3.select("#spanPdf").text(` $) = ${f4f(dist.PDF.f(this.value))}$`);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#spanPdf").node()]);
        dispatch_pdf_changed.call("pdf_changed", {x: this.value});
    });
}

function initCdfHeader() {
    d3.select("#h_cdf").select(".g_sec_name").text(`${dist.CDF.name()} ${jax(dist.value())}`);
    const cdf_input = `<input type='text' size='3' value='${f4(dist.default_x())}' id='txtCdf' class='g_sec_input'>`;
    const cdf_output = `<span id='spanCdf'> $) = ${f4f(dist.CDF.f(dist.default_x()))}$</span>`;
    d3.select("#h_cdf").select(".g_sec_value").html("$F_{X}(x =$ " + cdf_input + " " + cdf_output);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#h_cdf").select(".g_sec_name").node()]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#h_cdf").select(".g_sec_value").node()]);
    d3.select("#txtCdf").on('input', function() {
        d3.select("#spanCdf").text(` $) = ${f4f(dist.CDF.f(this.value))}$`);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#spanCdf").node()]);
        dispatch_cdf_changed.call("cdf_changed", {x: this.value});
    });
    dispatch_cdf_changed.call("cdf_changed", {x: dist.default_x()});
}

function initPdfGraph() {
    d3.select("#pdf").selectAll("*").remove();
    const g_pdf = d3.select("#pdf");
    const g_pdf_width = d3.select("#g_pdf").node().clientWidth - 2 * g_margin;
    const g_pdf_height = d3.select("#g_pdf").node().clientHeight - 2 * g_margin;
    const pdf_x_scale = d3.scaleLinear().domain(dist.domain()).rangeRound([0, g_pdf_width]);
    const pdf_y_scale = d3.scaleLinear().domain(dist.PDF.range()).rangeRound([g_pdf_height, 0]);
    drawGrid(g_pdf, pdf_x_scale, pdf_y_scale);
    drawPdf(g_pdf, pdf_x_scale, pdf_y_scale);
    dispatch_pdf_changed.on('pdf_changed', function() {
        d3.select("#pdf").selectAll(".graph_value").remove();
        d3.select("#pdf").append("circle").classed("graph_value", true).attr("cx", pdf_x_scale(this.x)).attr("cy", pdf_y_scale(dist.PDF.f(this.x))).attr("r", 5);
    });
}

function initCdfGraph() {
    d3.select("#cdf").selectAll("*").remove();
    const g_cdf = d3.select("#cdf");
    const g_cdf_width = d3.select("#g_cdf").node().clientWidth - 2 * g_margin;
    const g_cdf_height = d3.select("#g_cdf").node().clientHeight - 2 * g_margin;
    const cdf_x_scale = d3.scaleLinear().domain(dist.domain()).rangeRound([0, g_cdf_width]);
    const cdf_y_scale = d3.scaleLinear().domain(dist.CDF.range()).rangeRound([g_cdf_height, 0]);
    drawGrid(g_cdf, cdf_x_scale, cdf_y_scale);
    drawCdf(g_cdf, cdf_x_scale, cdf_y_scale);
    dispatch_cdf_changed.on('cdf_changed', function() {
        d3.select("#cdf").selectAll(".graph_value").remove();
        d3.select("#cdf").append("circle").classed("graph_value", true).attr("cx", cdf_x_scale(this.x)).attr("cy", cdf_y_scale(dist.CDF.f(this.x))).attr("r", 5);
    });
}

function drawGrid(g, x_scale, y_scale) {
    const x_n = 10, y_n = 10;
    const x_ticks = x_scale.ticks(x_n), y_ticks = y_scale.ticks(y_n),
        x_tickFormat = x_scale.tickFormat(x_n), y_tickFormat = y_scale.tickFormat(y_n);
    const x_grid = d3.line().x((d, i) => x_scale.range()[i]).y(d => y_scale(d)),
        y_grid = d3.line().x(d => x_scale(d)).y((d, i) => y_scale.range()[i]);
    const f = d3.format(".1f");
    g.append("g").attr("class", "grid grid-x").selectAll("path").data(y_ticks).enter().append("path")
        .attr("d", d => x_grid([d, d]));
    g.append("g").attr("class", "grid grid-y").selectAll("path").data(x_ticks).enter().append("path")
        .attr("d", d => y_grid([d, d]));
    const x_axis = g.append("g").attr("class", "axis axis-x");
    x_axis.append("path").attr("d", x_grid([0, 0]));
    x_axis.selectAll("text").data(x_ticks).enter().append("text")
        .attr("x", d => x_scale(d)).attr("y", d => y_scale(0) + 6)
        .text(x_tickFormat);
    const y_axis = g.append("g").attr("class", "axis axis-y");
    y_axis.append("path").attr("d", y_grid([dist.default_x(), dist.default_x()]));
    y_axis.selectAll("text").data(y_ticks).enter().append("text")
        .attr("x", d => x_scale(dist.default_x()) - 6).attr("y", d => y_scale(d))
        .text(y_tickFormat);
}

function drawPdf(g, x_scale, y_scale) {
    const x_low = x_scale.domain()[0], x_high = x_scale.domain()[1], step = (x_high - x_low) / (x_scale.range()[1] - x_scale.range()[0]);
    const x = d3.range(x_low, x_high, step);
    const line = d3.line().x(x_scale).y(d => y_scale(dist.PDF.f(d)));
    g.append("path").attr("class", "func").attr("d", line(x));
    d3.select("#g_pdf").on("click", function() {
        const x = x_scale.invert(d3.mouse(this)[0] - g_margin);
        d3.select("#pdf").selectAll(".graph_value").remove();
        d3.select("#pdf").append("circle").classed("graph_value", true).attr("cx", x_scale(x)).attr("cy", y_scale(dist.PDF.f(x))).attr("r", 5);
        d3.select("#txtPdf").node().value = f4(x);
        d3.select("#spanPdf").text(` $) = ${f4f(dist.PDF.f(x))}$`);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#spanPdf").node()]);
    });
}

function drawCdf(g, x_scale, y_scale) {
    const x_low = x_scale.domain()[0], x_high = x_scale.domain()[1], step = (x_high - x_low) / (x_scale.range()[1] - x_scale.range()[0]);
    const x = d3.range(x_low, x_high, step), y = x.map(d => dist.CDF.f(d));
    data = d3.zip(x, y);
    const line = d3.line().x(d => x_scale(d[0])).y(d => y_scale(d[1]));
    g.append("path").attr("class", "func").attr("d", line(data));
    d3.select("#g_cdf").on("click", function() {
        const x = x_scale.invert(d3.mouse(this)[0] - g_margin);
        d3.select("#cdf").selectAll(".graph_value").remove();
        d3.select("#cdf").append("circle").classed("graph_value", true).attr("cx", x_scale(x)).attr("cy", y_scale(dist.CDF.f(x))).attr("r", 5);
        d3.select("#txtCdf").node().value = f4(x);
        d3.select("#spanCdf").text(` $) = ${f4f(dist.CDF.f(x))}$`);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#spanCdf").node()]);
    });
}

/*
function drawDist() {
    clearGraph();

    const g_pdf = d3.select("#pdf");
    const std = Math.sqrt(this.sigma2), pdf_max = pdf(params.mu, this);
    const g_pdf_width = d3.select("#g_pdf").node().clientWidth - 2 * g_margin;
    const g_pdf_height = d3.select("#g_pdf").node().clientHeight - 2 * g_margin;
    const pdf_x_scale = d3.scaleLinear().domain([params.mu - 4 * std, params.mu + 4 * std]).rangeRound([0, g_pdf_width]);
    const pdf_y_scale = d3.scaleLinear().domain([0, pdf_max * 1.2]).rangeRound([g_pdf_height, 0]);
    drawGrid(g_pdf, pdf_x_scale, pdf_y_scale, params);
    drawPdf(g_pdf, pdf_x_scale, pdf_y_scale, this);
    function updatePdfValue(x) {
        d3.select("#spanPdf").text(" $) = " + f(pdf(x, params)) + "$");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#spanPdf").node()]);
        g_pdf.selectAll(".graph_value").remove();
        g_pdf.append("circle").classed("graph_value", true).attr("cx", pdf_x_scale(x)).attr("cy", pdf_y_scale(pdf(x, params))).attr("r", 5);
    }
    d3.select("#txtPdf").on('input', function() {
        updatePdfValue(this.value);
    });
    updatePdfValue(params.mu);
    d3.select("#g_pdf").on("click", function() {
        const x = f(pdf_x_scale.invert(d3.mouse(this)[0] - g_margin));
        d3.select("#txtPdf").node().value = x;
        updatePdfValue(x);
    });

    const g_cdf = d3.select("#cdf");
    const g_cdf_width = d3.select("#g_cdf").node().clientWidth - 2 * g_margin;
    const g_cdf_height = d3.select("#g_cdf").node().clientHeight - 2 * g_margin;
    const cdf_x_scale = d3.scaleLinear().domain([this.mu - 4 * std, this.mu + 4 * std]).rangeRound([0, g_cdf_width]);
    const cdf_y_scale = d3.scaleLinear().domain([0, 1.1]).rangeRound([g_cdf_height, 0]);
    drawGrid(g_cdf, cdf_x_scale, cdf_y_scale, params);
    drawCdf(g_cdf, cdf_x_scale, cdf_y_scale, this);
    d3.select("#h_cdf").select(".g_sec_name").text(`CDF $\\mathcal {N}(${params.mu}, ${params.sigma2})$`);
    const cdf_input = "<input type='text' size='3' value='" + params.mu + "' id='txtCdf' class='g_sec_input'>";
    const cdf_output = "<span id='spanCdf'> $) = " + f(cdf(params.mu, params)) + "$</span>";
    d3.select("#h_cdf").select(".g_sec_value").html("$F_{X}(x =$ " + cdf_input + " " + cdf_output);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#h_cdf").select(".g_sec_name").node()]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#h_cdf").select(".g_sec_value").node()]);
    function updateCdfValue(x) {
        const F = cdf(x, params);
        d3.select("#spanCdf").text(" $) = " + f(F) + "$");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, d3.select("#spanCdf").node()]);
        g_cdf.selectAll(".graph_value").remove();
        g_cdf.append("circle").classed("graph_value", true).attr("cx", cdf_x_scale(x)).attr("cy", cdf_y_scale(F)).attr("r", 5);
    }
    d3.select("#txtCdf").on('input', function() {
        updateCdfValue(this.value);
    });
    updateCdfValue(params.mu);
    d3.select("#g_cdf").on("click", function() {
        const x = f(cdf_x_scale.invert(d3.mouse(this)[0] - g_margin));
        d3.select("#txtCdf").node().value = x;
        updateCdfValue(x);
    });
}

function drawGrid(g, x_scale, y_scale, params) {
    const x_n = 10, y_n = 10;
    const x_ticks = x_scale.ticks(x_n), y_ticks = y_scale.ticks(y_n),
        x_tickFormat = x_scale.tickFormat(x_n), y_tickFormat = y_scale.tickFormat(y_n);
    const x_grid = d3.line().x((d, i) => x_scale.range()[i]).y(d => y_scale(d)),
          y_grid = d3.line().x(d => x_scale(d)).y((d, i) => y_scale.range()[i]);
    const f = d3.format(".1f");
    g.append("g").attr("class", "grid grid-x").selectAll("path").data(y_ticks).enter().append("path")
        .attr("d", d => x_grid([d, d]));
    g.append("g").attr("class", "grid grid-y").selectAll("path").data(x_ticks).enter().append("path")
        .attr("d", d => y_grid([d, d]));
    const x_axis = g.append("g").attr("class", "axis axis-x");
    x_axis.append("path").attr("d", x_grid([0, 0]));
    x_axis.selectAll("text").data(x_ticks).enter().append("text")
        .attr("x", d => x_scale(d)).attr("y", d => y_scale(0) + 6)
        .text(x_tickFormat);
    const y_axis = g.append("g").attr("class", "axis axis-y");
    y_axis.append("path").attr("d", y_grid([params.mu, params.mu]));
    y_axis.selectAll("text").data(y_ticks).enter().append("text")
        .attr("x", d => x_scale(params.mu) - 6).attr("y", d => y_scale(d))
        .text(y_tickFormat);
}

function pdf(x, prams) {
    return Math.exp((-1) * Math.pow(x - prams.mu, 2) / (2 * prams.sigma2)) / (Math.sqrt(2 * Math.PI * prams.sigma2));
}

function cdf(x, params) {
    const std = Math.sqrt(params.sigma2), step = 10 * std / 50000,
        xs = d3.range(params.mu - 5 * std, x, step);
    return xs.reduce((a, c) => a + pdf(c, params) * step, 0);
}

function drawPdf(g, x_scale, y_scale, params) {
    const x_low = x_scale.domain()[0], x_high = x_scale.domain()[1], step = (x_high - x_low) / (x_scale.range()[1] - x_scale.range()[0]);
    const x = d3.range(x_low, x_high, step);
    const line = d3.line().x(x_scale).y(d => y_scale(pdf(d, params)));
    g.append("path").attr("class", "func").attr("d", line(x));
}

function drawCdf(g, x_scale, y_scale, params) {
    const x_low = x_scale.domain()[0], x_high = x_scale.domain()[1], step = (x_high - x_low) / (x_scale.range()[1] - x_scale.range()[0]);
    const x = d3.range(x_low, x_high, step), y = x.map(d => pdf(d, params));
    const cdf = new Array(y.length);
    for( let i in y ) {
        cdf[i] = i == 0 ? y[i] : cdf[i-1] + y[i] * step;
    }
    data = d3.zip(x, cdf);
    const line = d3.line().x(d => x_scale(d[0])).y(d => y_scale(d[1]));
    g.append("path").attr("class", "func").attr("d", line(data));
}

d3.select("#btnParameters").on('click', update);

dispatch.on('parameters_changed', function() {
    updateInfobox.call(this);
    drawDist.call(this);
});

update();
*/
