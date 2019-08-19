(function(stats) {
    var params = {
        "mu": {
            name: "mu",
            notation: "\\mu",
            value: 0
        },
        "b": {
            name: "b",
            notation: "b",
            value: 1
        }
    };

    function pdf(x) {
        return Math.exp((-1) * Math.abs(x - params.mu.value) / params.b.value) / (2 * params.b.value);
    }

    function cdf(x) {
        return x < params.mu.value ?
            Math.exp((x - params.mu.value) / params.b.value) / 2
            : 1 - Math.exp(-(x - params.mu.value) / params.b.value) / 2;
    }

    stats.laplace = {
        name: constant("Laplace Distribution"),
        notation: () => `\\mathcal {f}(${params.mu.notation}, ${params.b.notation})`,
        value: () => `\\mathcal {f}(${params.mu.value}, ${params.b.value})`,
        params: function() {
            if( arguments.length === 0 ) return [params.mu, params.b];
            if( arguments.length === 1 ) return params[arguments[0]];
            params[arguments[0]].value = +arguments[1];
        },
        default_x: () => params.mu.value,
        domain: () => [params.mu.value -4 * Math.sqrt(params.b.value), params.mu.value + 4 * Math.sqrt(params.b.value)],
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
            notation: constant("\\frac {1}{2b} \\text {exp}(-\\frac {|x - \\mu|}{b})"),
            value: function() {
                const mu = params.mu.value ? `|x-${params.mu.value}|` : '|x|';
                const b = params.b.value != 1 ? `\\frac {${mu}}{${params.b.value}}` : `${mu}`;
                return `\\frac {1}{${2*params.b.value}} \\text {exp}(-{${b}})`
            },
            f: pdf,
            range: () => [0, pdf(params.mu.value)]
        },
        CDF: {
            name: constant("CDF"),
            notation: constant("\\begin{cases} \\frac {1}{2} \\text {exp} (\\frac {x - \\mu}{b}) & \\text {if } x \\leq \\mu \\\\1 - \\frac {1}{2} \\text {exp} (-\\frac {x - \\mu}{b}) & \\text {if } x > \\mu  \\end{cases}"),
            value: function() {
                const mu = params.mu.value ? `x-${params.mu.value}` : 'x';
                const b = params.b.value != 1 ? `\\frac {${mu}}{${params.b.value}}` : `${mu}`;
                return `\\begin{cases} \\frac {1}{2} \\text {exp} (${b}) & \\text {if } x \\leq \\mu \\\\1 - \\frac {1}{2} \\text {exp} (-${b}) & \\text {if } x > \\mu  \\end{cases}`
            },
            f: cdf,
            range: () => [0, 1]
        },
        mean: {
            name: constant("Mean"),
            notation: constant("\\mu"),
            value: () => f4(params.mu.value)
        },
        median: {
            name: constant("Median"),
            notation: constant("\\mu"),
            value: () => f4(params.mu.value)
        },
        mode: {
            name: constant("Mode"),
            notation: constant("\\mu"),
            value: () => f4(params.mu.value)
        },
        variance: {
            name: constant("Variance"),
            notation: constant("2b^{2}"),
            value: () => f4(2 * params.b.value * params.b.value)
        },
        skewness: {
            name: constant("Skewness"),
            notation: constant("0"),
            value: constant(0)
        },
        extra_kurtosis: {
            name: constant("Extra kurtosis"),
            notation: constant("0"),
            value: constant(3)
        },
    }
})(window.stats = window.stats || {});
