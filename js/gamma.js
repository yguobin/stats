(function gamma(stats) {
    var params = {
        "a": {
            name: "a",
            notation: "a",
            value: 1
        },
        "b": {
            name: "b",
            notation: "b",
            value: 1
        }
    };

    function variance() { return params.a.value / Math.pow(params.b.value, 2); }

    function std() { return Math.sqrt(variance()); }

    function pdf(x) {
        const a = params.a.value, b = params.b.value;
        return Math.pow(b, a) / math.gamma(a) * Math.pow(x, a-1) * Math.exp(-x * b);
    }

    function cdf(x) {
        return integrate(pdf, 0, x, x / std() / 10000);
    }

    stats.gamma = {
        name: constant("Gamma Distribution"),
        notation: () => `\\mathcal {G}(${params.a.notation}, ${params.b.notation})`,
        value: () => `\\mathcal {G}(${params.a.value}, ${params.b.value})`,
        params: function() {
            if( arguments.length === 0 ) return [params.a, params.b];
            if( arguments.length === 1 ) return params[arguments[0]];
            params[arguments[0]].value = +arguments[1];
        },
        default_x: () => 0,
        domain: () => [0, 6 * std()],
        properties: [
            "support", "PDF", "CDF", "mean", "mode", "variance", "skewness", "extra_kurtosis"
        ],
        support: {
            name: constant("Support"),
            notation: constant("x \\in (0, \\infty)"),
            value: constant("x \\in (0, \\infty)")
        },
        PDF: {
            name: constant("PDF"),
            notation: constant("\\frac {b^{a}}{\\Gamma(a)} x^{a-1}e^{-bx}"),
            value: function() {
                const g = Number.isInteger(params.a.value) ? ((params.a.value === 1 || params.a.value === 2)? (params.b.value === 1 ? "" : Math.pow(params.b.value, params.a.value)) : `\\frac {${Math.pow(params.b.value, params.a.value)}}{${math.gamma(params.a.value)}}`) : `\\Gamma(${params.a.value})`;
                const a = params.a.value === 1 ? "" : (params.a.value === 2 ? `x` : `x^{${params.a.value-1}}`);
                const b = params.b.value != 1 ? `${params.b.value}` : ``;
                return `${g} ${a}e^{-${b}x}`
            },
            f: pdf,
            range: () => [0, params.a.value >= 1 ? pdf((params.a.value - 1) / params.b.value) : 1]
        },
        CDF: {
            name: constant("CDF"),
            notation: constant("\\int_{0}^{x} \\frac {b^{a}}{\\Gamma(a)} u^{a-1}e^{-bu} du"),
            value: function() {
                const g = Number.isInteger(params.a.value) ? ((params.a.value === 1 || params.a.value === 2)? (params.b.value === 1 ? "" : Math.pow(params.b.value, params.a.value)) : `\\frac {${Math.pow(params.b.value, params.a.value)}}{${math.gamma(params.a.value)}}`) : `\\Gamma(${params.a.value})`;
                const a = params.a.value === 1 ? "" : (params.a.value === 2 ? `x` : `x^{${params.a.value-1}}`);
                const b = params.b.value != 1 ? `${params.b.value}` : ``;
                return `\\int_{0}^{x} ${g} ${a}e^{-${b}u} du`
            },
            f: cdf,
            range: () => [0, 1]
        },
        mean: {
            name: constant("Mean"),
            notation: constant("\\frac {a}{b}"),
            value: () => f4(params.a.value / params.b.value)
        },
        mode: {
            name: constant("Mode"),
            notation: () => `\\frac {a-1}{b} \\text {for } a \\geq 1`,
            value: () => params.a.value >= 1 ? f4((params.a.value - 1) / params.b.value) : "\\text {undefined}"
        },
        variance: {
            name: constant("Variance"),
            notation: constant("\\frac {a}{b^{2}}"),
            value: () => f4(params.a.value / (params.b.value * params.b.value))
        },
        skewness: {
            name: constant("Skewness"),
            notation: constant("\\frac {2}{\\sqrt {a}}"),
            value: () => f4(2 / Math.sqrt(params.a.value))
        },
        extra_kurtosis: {
            name: constant("Extra kurtosis"),
            notation: constant("\\frac {6}{a}"),
            value: () => f4(6 / Math.sqrt(params.a.value))
        },
    }
})(window.stats = window.stats || {});
