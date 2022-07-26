function fsum(arr) {
    // returns the sum of all list items
    return arr.reduce((a, b) => a + b)
};

function absolute(arr) {
    // returns absolute value for each list item 
    if (typeof arr === 'object') {
        return arr.map(Math.abs);
    } else {
        return Math.abs(arr)
    }
};

function argmax(arr) {
    // returns the indices of the maximum values along an axis.
    // TODO: support multiple axes (recursive call)
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
};

function sqr(arr) {
    // returns squared value for each list item
    if (typeof arr === 'object') {
        return arr.map((x) => Math.pow(x, 2));
    } else {
        return Math.pow(arr, 2)
    }
};

function zip(x1, x2) {
    // two array-like objects are passed element-by-element to func
    // return length is equal to the shortest input array length
    // returns [func(a1, a2), func(b1, b2), func(c1, c2), ...]

    return x1.map((x, i) => [x, x2[i]]);
}

function zipWith(x1, x2, func) {
    // two array-like objects are passed element-by-element to func
    // return length is equal to the shortest input array length
    // returns [func(a1, a2), func(b1, b2), func(c1, c2), ...]

    return x1.map((x, i) => func(x, x2[i]));
}

function less_equal(x1, x2) {
    // supports up to n-dimensions

    if ((typeof x1 === 'object') && (typeof x2 === 'object')) {
        return zipWith(x1, x2, less_equal)

    } else if ((typeof x1 === 'number') && (typeof x2 === 'object')) {
        return x2.map((a) => (a <= x2))

    } else if ((typeof x1 === 'object') && (typeof x2 === 'number')) {
        return x1.map((a) => (x1 <= a))

    } else {
        return (x1 <= x2)
    }
};

function where(condition, x, y) {
    // Return elements chosen from x or y depending on condition.
    
    const func = (condition) => (condition ? x : y)

    if (Array.isArray(condition[0])) {
        return condition.map((a) => where(a, x, y));
    } else {
        return condition.map((a) => func(a));
    }
};

function wh(condition, x, y) {
    condition.map(a => {
        return a
    })
}

function arange(start = 0, stop, step = 1) {
    /*
    Returns an array with evenly spaced elements as per the interval.

    start : [optional] start of interval range. By default start = 0
    stop  : end of interval range
    step  : [optional] step size of interval. By default step size = 1,  
    For any output out, this is the distance between two adjacent values, out[i+1] - out[i]. 
    */

    const listLength = Math.ceil((stop - start) / step)

    return Array(listLength).fill(start).map((x, y) => x + y * step)
};

function NDimArray(dimensions, value = undefined) {
    // [row, col, stack]. default fill value is undefined

    if (dimensions.length > 0) {
        var dim = dimensions[0];
        var rest = dimensions.slice(1);
        return Array(dim).fill(value).map(() => NDimArray(rest, value));

    } else {
        return value;
    }
};

function ones(shape) {
    // returns a n-dimensional array of ones
    // shape is a dimensional list [ row, col, stack, ... ]
    return NDimArray(shape, 1)
};

function zeros(shape) {
    // returns a n-dimensional array of zeros
    // shape is a dimensional list [ row, col, stack, ... ]
    return NDimArray(shape, 0)
};

function empty(shape) {
    // returns a n-dimensional array of undefined
    // shape is a dimensional list [ row, col, stack, ... ]
    return NDimArray(shape)
};

function full(shape, value = undefined) {
    // returns a n-dimensional array of some value - else undefined
    // shape is a dimensional list [ row, col, stack, ... ]
    return NDimArray(shape, value)
};
