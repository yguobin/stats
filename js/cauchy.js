(function(stats) {
    var params = {
        "x0": {
            name: "x0",
            notation: "x_0",
            value: 0
        },
        "gamma": {
            name: "gamma",
            notation: "\\gamma",
            value: 1
        }
    };

    function pdf(x) {
        const x0 = params.x0.value, gamma = params.gamma.value;
        return 1 / (Math.PI * gamma * (1 + Math.pow((x-x0) / gamma, 2)));
    }

    function cdf(x) {
        const x0 = params.x0.value, gamma = params.gamma.value;
        return 1 / Math.PI * Math.atan((x - x0) / gamma) + 0.5;
    }

    stats.cauchy = {
        name: constant("Cauchy Distribution"),
        notation: () => `\\mathrm {f}(${params.x0.notation}, ${params.gamma.notation})`,
        value: () => `\\mathrm {f}(${params.x0.value}, ${params.gamma.value})`,
        params: function() {
            if( arguments.length === 0 ) return [params.x0, params.gamma];
            if( arguments.length === 1 ) return params[arguments[0]];
            params[arguments[0]].value = +arguments[1];
        },
        default_x: () => params.x0.value,
        domain: () => [params.x0.value - 4 * params.gamma.value, params.x0.value + 4 * params.gamma.value],
        properties: [
            "support", "PDF", "CDF", "mean", "median", "mode", "variance", "skewness", "extra_kurtosis"
        ],
        support: {
            name: constant("Support"),
            notation: constant("x \\in \\mathbb{R}"),
            value: constant("x \\in \\mathbb{R}")
        },
        PDF: {
            name: constant("PDF"),
            notation: constant("\\frac {1}{\\pi\\gamma [1 + (\\frac {x - x_0}{\\gamma})^2]}"),
            value: function() {
                const g = params.gamma.value == 1 ? "" : params.gamma.value;
                const x = params.x0.value ? `x - ${params.x0.value}` : "x";
                const t = params.gamma.value == 1 ? (params.x0.value ? `(${x})` : `${x}`) : `(\\frac {${x}}{${params.gamma.value}})`;
                return `\\frac {1}{\\pi${g} [1 + ${t}^2]}`;
            },
            f: pdf,
            range: () => [0, pdf(params.x0.value)]
        },
        CDF: {
            name: constant("CDF"),
            notation: constant("\\frac {1}{\\pi}\\text{arctan}(\\frac {x-x_0}{\\gamma}) + \\frac {1}{2}"),
            value: function() {
                const x = params.x0.value ? `x - ${params.x0.value}` : "x";
                const t = params.gamma.value == 1 ? (params.x0.value ? `(${x})` : `${x}`) : `\\frac {${x}}{${params.gamma.value}}`;
                return `\\frac {1}{\\pi}\\text{arctan}(${t}) + \\frac {1}{2}`;
            },
            f: cdf,
            range: () => [0, 1]
        },
        mean: {
            name: constant("Mean"),
            notation: constant("\\text {undefined}"),
            value: constant("\\text {undefined}")
        },
        median: {
            name: constant("Median"),
            notation: constant("x_{0}"),
            value: () => f4(params.x0.value)
        },
        mode: {
            name: constant("Mode"),
            notation: constant("x_{0}"),
            value: () => f4(params.x0.value)
        },
        variance: {
            name: constant("Variance"),
            notation: constant("\\text {undefined}"),
            value: constant("\\text {undefined}")
        },
        skewness: {
            name: constant("Skewness"),
            notation: constant("\\text {undefined}"),
            value: constant("\\text {undefined}")
        },
        extra_kurtosis: {
            name: constant("Extra kurtosis"),
            notation: constant("\\text {undefined}"),
            value: constant("\\text {undefined}")
        },
    }
})(window.stats = window.stats || {});

