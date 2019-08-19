(function(stats) {
    var params = {
        "mu": {
            name: "mu",
            notation: "\\mu",
            value: 0
        },
        "sigma2": {
            name: "sigma2",
            notation: "\\sigma^{2}",
            value: 1
        }
    };

    function pdf(x) {
        return Math.exp((-1) * Math.pow(x - params.mu.value, 2) / (2 * params.sigma2.value)) / (Math.sqrt(2 * Math.PI * params.sigma2.value));
    }

    function cdf(x) {
        // const std = Math.sqrt(params.sigma2.value), step = 10 * std / 50000,
        //     xs = d3.range(params.mu.value - 5 * std, x, step);
        // return xs.reduce((a, c) => a + pdf(c, params) * step, 0);
        return 0.5 * (1 + math.erf((x - params.mu.value) / Math.sqrt(params.sigma2.value * 2) ));
    }

    stats.normal = {
        name: constant("Normal Distribution"),
        notation: () => `\\mathcal {N}(${params.mu.notation}, ${params.sigma2.notation})`,
        value: () => `\\mathcal {N}(${params.mu.value}, ${params.sigma2.value})`,
        params: function() {
            if( arguments.length === 0 ) return [params.mu, params.sigma2];
            if( arguments.length === 1 ) return params[arguments[0]];
            params[arguments[0]].value = +arguments[1];
        },
        default_x: () => params.mu.value,
        domain: () => [params.mu.value -4 * Math.sqrt(params.sigma2.value), params.mu.value + 4 * Math.sqrt(params.sigma2.value)],
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
            notation: constant("\\frac {1}{\\sqrt {2\\pi \\sigma ^{2}}}e^{-{\\frac {(x-\\mu )^{2}}{2\\sigma ^{2}}}}"),
            value: function() {
                const mu = params.mu.value ? `(x-${params.mu.value})^{2}` : 'x^{2}';
                const sigma2_1 = params.sigma2.value != 1 ? `\\cdot ${f4(Math.sqrt(params.sigma2.value))}` : '';
                const sigma2_2 = params.sigma2.value != 1 ? `\\cdot ${f4(params.sigma2.value)}` : '';
                return `\\frac {1}{\\sqrt {2\\pi} ${sigma2_1}}e^{-{\\frac {${mu}}{2${sigma2_2}}}}`
            },
            f: pdf,
            range: () => [0, pdf(params.mu.value)]
        },
        CDF: {
            name: constant("CDF"),
            notation: constant("\\int_{-\\infty}^{z} {\\frac {1}{\\sqrt {2\\pi \\sigma ^{2}}}e^{-{\\frac {(x-\\mu )^{2}}{2\\sigma ^{2}}}}} dx"),
            value: function() {
                const mu = params.mu.value ? `(x-${params.mu.value})^{2}` : 'x^{2}';
                const sigma2_1 = params.sigma2.value != 1 ? `\\cdot ${f4(Math.sqrt(params.sigma2.value))}` : '';
                const sigma2_2 = params.sigma2.value != 1 ? `\\cdot ${f4(params.sigma2.value)}` : '';
                return `\\int_{-\\infty}^{z} \\frac {1}{\\sqrt {2\\pi} ${sigma2_1}}e^{-{\\frac {${mu}}{2${sigma2_2}}}} dx`;
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
            notation: constant("\\sigma^{2}"),
            value: () => f4(params.sigma2.value)
        },
        skewness: {
            name: constant("Skewness"),
            notation: constant("0"),
            value: constant(0)
        },
        extra_kurtosis: {
            name: constant("Extra kurtosis"),
            notation: constant("0"),
            value: constant(0)
        },
    }
})(window.stats = window.stats || {});
