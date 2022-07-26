import * as np from './base';  // numpy-like base functions


export function blackman(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones([1])
    }
    const n = np.arange(1 - M, M, 2)
    return 0.42 + 0.5 * Math.cos(Math.PI * n / (M - 1)) + 0.08 * Math.cos(2.0 * Math.PI * n / (M - 1))
};

export function bartlett(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones([1])
    }
    const n = np.arange(1 - M, M, 2)
    return np.where(np.less_equal(n, 0), 1 + n / (M - 1), 1 - n / (M - 1))
};

export function hanning(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones([1])
    }
    const n = np.arange(1 - M, M, 2)
    return 0.5 + 0.5 * cos(Math.PI * n / (M - 1))
};

export function hamming(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones([1])
    }
    const n = np.arange(1 - M, M, 2)
    return 0.54 + 0.46 * cos(Math.PI * n / (M - 1))
};

export function rectangular(M) {
    return np.ones([M])
};
