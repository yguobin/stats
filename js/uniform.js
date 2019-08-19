(function(stats) {
    var params = {
        "a": {
            name: "a",
            notation: "a",
            value: 0
        },
        "b": {
            name: "b",
            notation: "b",
            value: 1
        }
    };

    function pdf(x) {
        return x >= params.a.value && x <= params.b.value ? 1 / (params.b.value - params.a.value) : 0;
    }

    function cdf(x) {
        return x < params.a.value ? 0 : (x >= params.b.value ? 1 : (x-params.a.value)/(params.b.value-params.a.value));
    }

    function variance() { return (params.b.value - params.a.value)**2 / 12; }

    function std() { return Math.sqrt(variance()); }

    stats.uniform = {
        name: constant("Uniform Distribution"),
        notation: () => `\\mathcal {U}(a, b)`,
        value: () => `\\mathcal {U}(${params.a.value}, ${params.b.value})`,
        params: function() {
            if( arguments.length === 0 ) return [params.a, params.b];
            if( arguments.length === 1 ) return params[arguments[0]];
            params[arguments[0]].value = +arguments[1];
        },
        default_x: () => params.a.value,
        domain: () => [params.a.value - 2 * (params.b.value - params.a.value), params.b.value + 2 * (params.b.value - params.a.value)],
        properties: [
            "support", "PDF", "CDF", "mean", "median", "mode", "variance", "skewness", "extra_kurtosis"
        ],
        support: {
            name: constant("Support"),
            notation: constant("x \\in [a, b]"),
            value: () => `x \\in [${params.a.value}, ${params.b.value}]`
        },
        PDF: {
            name: constant("PDF"),
            notation: constant("\\begin{cases} \\frac {1}{b - a}, & \\text{for } x \\in [a, b]\\\\0, & \\text{otherwise}\\end{cases}"),
            value: function() {
                const v = f4(1 / (params.b.value - params.a.value));
                return `\\begin{cases} ${v}, & \\text{for } x \\in [${params.a.value}, ${params.b.value}]\\\\0, & \\text{otherwise}\\end{cases}`
            },
            f: pdf,
            range: () => [0, 1 / (params.b.value - params.a.value)]
        },
        CDF: {
            name: constant("CDF"),
            notation: constant("\\begin{cases} 0, & \\text{for } x < a\\\\\\frac {x - a}{b - a}, & \\text{for } x \\in [a, b]\\\\1, & \\text{for } x \\geq b\\end{cases}"),
            value: function() {
                const v1 = params.a.value > 0 ? `-${params.a.value}` : params.a.value == 0 ? "" : `+${-params.a.value}`;
                if( params.b.value - params.a.value === 1 ) {
                    return `\\begin{cases} 0, & \\text{for } x < ${params.a.value}\\\\{x ${v1}}, & \\text{for } x \\in [${params.a.value}, ${params.b.value}]\\\\1, & \\text{for } x \\geq ${params.b.value}\\end{cases}`;
                }
                const v2 = f4(params.b.value - params.a.value);
                return `\\begin{cases} 0, & \\text{for } x < ${params.a.value}\\\\\\frac {x ${v1}}{${v2}}, & \\text{for } x \\in [${params.a.value}, ${params.b.value}]\\\\1, & \\text{for } x \\geq ${params.b.value}\\end{cases}`;
            },
            f: cdf,
            range: () => [0, 1]
        },
        mean: {
            name: constant("Mean"),
            notation: constant("\\frac {1}{2}(a + b)"),
            value: () => f4((params.a.value + params.b.value) / 2)
        },
        median: {
            name: constant("Median"),
            notation: constant("\\frac {1}{2}(a + b)"),
            value: () => f4((params.a.value + params.b.value) / 2)
        },
        mode: {
            name: constant("Mode"),
            notation: constant("\\text{any value in }(a, b)"),
            value: () => `\\text{any value in }(${params.a.value}, ${params.b.value})`
        },
        variance: {
            name: constant("Variance"),
            notation: constant("\\frac {1}{12}(b - a)^2"),
            value: () => f4(variance())
        },
        skewness: {
            name: constant("Skewness"),
            notation: constant("0"),
            value: constant(0)
        },
        extra_kurtosis: {
            name: constant("Extra kurtosis"),
            notation: constant("-\\frac {6}{5}"),
            value: constant("-\\frac {6}{5}")
        },
    }
})(window.stats = window.stats || {});
