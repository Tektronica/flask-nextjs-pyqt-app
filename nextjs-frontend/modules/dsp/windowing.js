import * as np from './base';  // numpy-like base functions


export function blackman(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones([1])
    }
    const n = np.arange(1 - M, M, 2)

    return n.map((a) => (0.42 + 0.5 * Math.cos(Math.PI * a / (M - 1)) + 0.08 * Math.cos(2.0 * Math.PI * a / (M - 1))))
};

export function bartlett(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones([1])
    }
    const n = np.arange(1 - M, M, 2)
    return n.map((a) => (np.where(np.less_equal(a, 0), 1 + a / (M - 1), 1 - a / (M - 1))))
};

export function hanning(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones([1])
    }
    const n = np.arange(1 - M, M, 2)
    return n.map((a) => (0.5 + 0.5 * Math.cos(Math.PI * a / (M - 1))))
};

export function hamming(M) {
    if (M < 1) {
        return new Array()
    } if (M == 1) {
        return np.ones([1])
    }
    const n = np.arange(1 - M, M, 2)
    return n.map((a) => (0.54 + 0.46 * Math.cos(Math.PI * a / (M - 1))))
};

export function rectangular(M) {
    return np.ones([M])
};
