function constant(x) { return () => x };

const f4f = d3.format(".4f");
const f4 = d3.format(".4");

function jax(x) { return `$${x}$`};

function integrate(f, start, end, step) {
    let total = 0;
    step = step || 0.01;
    for (let x = start; x < end; x += step) {
        total += f(x + step / 2) * step
    }
    return total;
}

function params(name){
    if( name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search) )
        return decodeURIComponent(name[1]);
    return null;
}

