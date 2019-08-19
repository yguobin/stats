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
        },
        "nu": {
            name: "nu",
            notation: "\\nu",
            value: 1
        }
    };

    function pdf(x) {
        const g = math.gamma, mu = params.mu.value, s2 = params.sigma2.value, nu = params.nu.value, pi = Math.PI, sqrt = Math.sqrt, pow = Math.pow;
        return g((nu + 1) / 2) / (sqrt(nu * s2 * pi) * g(nu / 2)) * pow(1 + pow(x - mu, 2) / s2 / nu, (-1) * (nu + 1) / 2);
    }

    function cdf(x) {
        const mu = params.mu.value, std = Math.sqrt(params.sigma2.value),
            start = mu - 20 * std, end = x, step = 40 * std / 10000;
        return integrate(pdf, start, end, step);
    }

    stats.student_t = {
        name: constant("Student's t-distribution"),
        notation: () => `\\mathrm {T}(${params.mu.notation}, ${params.sigma2.notation}, ${params.nu.notation})`,
        value: () => `\\mathrm {T}(${params.mu.value}, ${params.sigma2.value}, ${params.nu.value})`,
        params: function() {
            if( arguments.length === 0 ) return [params.mu, params.sigma2, params.nu];
            if( arguments.length === 1 ) return params[arguments[0]];
            params[arguments[0]].value = +arguments[1];
        },
        default_x: () => params.mu.value,
        domain: () => [params.mu.value - (10 - 2 *(params.nu.value -1) / 3) * Math.sqrt(params.sigma2.value), params.mu.value + (10 - 2 *(params.nu.value -1) / 3) * Math.sqrt(params.sigma2.value)],
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
            notation: constant("\\frac {\\Gamma(\\frac {\\nu + 1}{2})}{\\sqrt {\\nu\\pi\\sigma^{2}} \\Gamma(\\frac {\\nu}{2})} [1 + \\frac {1}{\\nu} (\\frac {x - \\mu}{\\sigma})^{2}]^{-\\frac {\\nu+1}{2}}"),
            value: function() {
                const x = params.mu.value ? `(x-${params.mu.value})` : 'x';
                const s2 = params.sigma2.value == 1 ? "" : params.sigma2.value;
                const t = params.sigma2.value != 1 ? `\\frac {${x}^2}{${params.sigma2.value}}` : `${x}^2`;
                const nu0 = params.nu.value == 1 ? "" : params.nu.value;
                const nu1 = Number.isInteger((params.nu.value + 1) / 2) ? math.gamma((params.nu.value + 1) / 2) : `\\Gamma(${(params.nu.value + 1) / 2})`;
                const nu2 = Number.isInteger(params.nu.value / 2) ? math.gamma(params.nu.value / 2) : `\\Gamma(${params.nu.value / 2})`;
                const nu3 = params.nu.value == 1 ? "" : `\\frac {1}{${params.nu.value}}`;
                return `\\frac {${nu1}}{\\sqrt {${nu0}\\pi${s2}}\\text { } ${nu2}} [1 + ${nu3}${t}]^{-${nu1}}`;
            },
            f: pdf,
            range: () => [0, pdf(params.mu.value)]
        },
        CDF: {
            name: constant("CDF"),
            notation: constant("\\int_{-\\infty}^{x} \\frac {\\Gamma(\\frac {\\nu + 1}{2})}{\\sqrt {\\nu\\pi\\sigma^{2}} \\Gamma(\\frac {\\nu}{2})} [1 + \\frac {1}{\\nu} (\\frac {u - \\mu}{\\sigma})^{2}]^{-\\frac {\\nu+1}{2}} du"),
            value: function() {
                const x = params.mu.value ? `(u-${params.mu.value})` : 'u';
                const s2 = params.sigma2.value == 1 ? "" : params.sigma2.value;
                const t = params.sigma2.value != 1 ? `\\frac {${x}^2}{${params.sigma2.value}}` : `${x}^2`;
                const nu0 = params.nu.value == 1 ? "" : params.nu.value;
                const nu1 = Number.isInteger((params.nu.value + 1) / 2) ? math.gamma((params.nu.value + 1) / 2) : `\\Gamma(${(params.nu.value + 1) / 2})`;
                const nu2 = Number.isInteger(params.nu.value / 2) ? math.gamma(params.nu.value / 2) : `\\Gamma(${params.nu.value / 2})`;
                const nu3 = params.nu.value == 1 ? "" : `\\frac {1}{${params.nu.value}}`;
                return `\\int_{-\\infty}^{x} \\frac {${nu1}}{\\sqrt {${nu0}\\pi${s2}}\\text { } ${nu2}} [1 + ${nu3}${t}]^{-${nu1}} du`;
            },
            f: cdf,
            range: () => [0, 1]
        },
        mean: {
            name: constant("Mean"),
            notation: constant("\\mu \\text {for } \\nu > 1\\text {, otherwise undefined}"),
            value: () => params.nu.value > 1 ? f4(params.mu.value) : "\\text {undefined}"
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
            notation: constant("\\begin{cases} \\infty & \\text {for } 1 < \\nu \\leq 2 \\\\\\frac {\\nu\\sigma^{2}}{\\nu-2} & \\text {for } \\nu > 2\\\\\\text {undefined} & \\text {otherwise} \\end{cases}"),
            value: () => params.nu.value > 1 && params.nu.value <= 2 ? "\\infty" : (params.nu.value > 2 ? f4(params.nu.value * params.sigma2.value / (params.nu.value - 2)) : "\\text {undefined}")
        },
        skewness: {
            name: constant("Skewness"),
            notation: constant("0 \\text {for } \\nu > 3\\text {, otherwise undefined}"),
            value: () => params.nu.value > 3 ? 0 : "\\text {undefined}"
        },
        extra_kurtosis: {
            name: constant("Extra kurtosis"),
            notation: constant("\\begin{cases} \\infty & \\text {for } 2 < \\nu \\leq 4 \\\\\\frac {6}{\\nu-4} & \\text {for } \\nu > 4\\\\\\text {undefined} & \\text {otherwise} \\end{cases}"),
            value: () => params.nu.value > 2 && params.nu.value <= 4 ? "\\infty" : (params.nu.value > 4 ? f4(6 / (params.nu.value - 4)) : "\\text {undefined}")
        },
    }
})(window.stats = window.stats || {});
