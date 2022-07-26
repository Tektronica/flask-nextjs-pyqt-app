import * as np from './base';  // numpy-like base functions


function blackman(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones(1)
    }
    n = np.arange(1 - M, M, 2)
    return 0.42 + 0.5 * Math.cos(pi * n / (M - 1)) + 0.08 * Math.cos(2.0 * pi * n / (M - 1))
}

function bartlett(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones(1)
    }
    n = np.arange(1 - M, M, 2)
    return np.where(np.less_equal(n, 0), 1 + n / (M - 1), 1 - n / (M - 1))
}

function hanning(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones(1)
    }
    n = np.arange(1 - M, M, 2)
    return 0.5 + 0.5 * Math.cos(pi * n / (M - 1))
}

function hamming(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones(1)
    }
    n = np.arange(1 - M, M, 2)
    return 0.5 + 0.5 * Math.cos(pi * n / (M - 1))
}

function rectangular(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones(1)
    }
    n = np.arange(1 - M, M, 2)
    return 0.5 + 0.5 * Math.cos(pi * n / (M - 1))
}
