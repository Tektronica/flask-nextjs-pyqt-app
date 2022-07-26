import KissFFTModule from "./kissFFT";
import * as np from './base';  // numpy-like base functions
import { blackman, bartlett, hanning, hamming, rectangular } from "./windowing"

function toDictOfLists(listOfDicts) {
    // converts a list of data points to array
    // [ {x: 0.0, y: 0.0}, ... ] ==> { x:[0.0, ...], y:[0.0, ...] }

    let dictOfLists = {};

    // all objects must have the same key
    Object.keys(listOfDicts[0]).forEach(k => {
        dictOfLists[k] = listOfDicts.map(o => o[k]);
    });

    return dictOfLists
};

function rfft(yt) {
    // yt should be an array of floats yt = [0.0, 0.0, 0.0, ...]
    // xt are normalized and must be scaled xt = [1, 2, 3, ...]
    var rfft = new KissFFTModule.FFTR(yt.length)
    var transform = fftr.forward(buffer);
    var transScaled = scaleTransform(transform, non2PowSize);
    var backAgain = fftr.inverse(transScaled);

    fftr.dispose();
};

function rms_flat(a) {
    // Return the root mean square of all the elements of * a *, flattened out.
    // https://stackoverflow.com/a/17463210
    // https://code.activestate.com/recipes/393090/
    // https://stackoverflow.com/a/33004170

    const sqr = np.absolute(a) ** 2
    const mean = np.fsum(sqr) / sqr.length  // computed from partial sums
    return Math.sqrt(mean)
};

function find_range(f, x) {
    // Find range between nearest local minima from peak at index x
    console.log('Client: finding range between nearest local minima from peak at index x')

    let lowermin = 0;
    let uppermin = 0;

    for (i in np.arange(x + 1, f.length)) {
        if (f[i + 1] >= f[i]) {
            uppermin = i
            break
        }
    }
    for (i in np.arange(x - 1, 0, -1)) {
        if (f[i] <= f[i - 1]) {
            lowermin = i + 1
            break
        }
    }

    return lowermin, uppermin
};

function getWindowLength(f0 = 10e3, fs = 2.5e6, windfunc = 'blackman', error = 0.1, mainlobe_type = 'relative') {
    /*
    Computes the window length of the measurement.An error is expressed since the main lobe width is directly
    proportional to the number of cycles captured.The minimum value of M correlates to the lowest detectable frequency
    by the windowing function. For instance, blackman requires a minimum of 6 period cycles of the frequency of interest
        in order to express content of that lobe in the DFT.Sampling frequency does not play a role in the width of the
    lobe, only the resolution of the lobe.
    :param f0: fundamental frequency of signal
    :param fs: sampling frequency
    :param windfunc: "Rectangular", "Bartlett", "Hanning", "Hamming", "Blackman"
    :param error: 100 % error suggests the lowest detectable frequency is the fundamental
    : return: window length of integer value(number of time series samples collected)
    */

    console.log('client: computing window length')

    // lowest detectable frequency by window
    // aka - the main lobe width
    let ldf = 0.0;
    let M = 0;

    if (mainlobe_type == 'relative') {
        ldf = f0 * error
    } else if (mainlobe_type == 'absolute') {
        ldf = error
    } else {
        console.log('Client Error:Incorrect main lobe type used!\nSelection should either be relative or absolute.')
    }

    if (windfunc == 'rectangular') {
        M = Math.floor(2 * (fs / ldf))
    } else if (windfunc in ('bartlett', 'hanning', 'hamming')) {
        M = Math.floor(4 * (fs / ldf))
    } else if (windfunc == 'blackman') {
        M = Math.floor(6 * (fs / ldf))
    } else {
        console.log('Client Error:Not a valid windowing function.')
    }
    return M
};


function windowed_fft(yt, Fs, M, windfunc = 'blackman') {
    /*
    :param yt: time series data
    :param Fs: sampling frequency
    :param N: number of samples, or the length of the time series data
    :param windfunc: the chosen windowing function

    : return:
        xf_fft: Two sided frequency axis.
        yf_fft  : Two sided power spectrum.
        xf_rfft : One sided frequency axis.
        yf_rfft : One sided power spectrum.
        main_lobe_width : The bandwidth(Hz) of the main lobe of the frequency domain window function.
    */

    console.log('\tperforming windowed FFT')

    // remove DC offset
    yt -= Math.mean(yt)

    // Calculate windowing function and its length----------------------------------------------------------------------
    if (windfunc == 'rectangular') {
        w = rectangular(M)
        main_lobe_width = 2 * (Fs / M)
    }
    else if (windfunc == 'bartlett') {
        w = bartlett(M)
        main_lobe_width = 4 * (Fs / M)
    }
    else if (windfunc == 'hanning') {
        w = hanning(M)
        main_lobe_width = 4 * (Fs / M)
    }
    else if (windfunc == 'hamming') {
        w = hamming(M)
        main_lobe_width = 4 * (Fs / M)
    }
    else if (windfunc == 'blackman') {
        w = blackman(M)
        main_lobe_width = 6 * (Fs / M)
    }
    else {
        // TODO - maybe include kaiser as well, but main lobe width varies with alpha
        console.log('Client Error:Invalid windowing function selected!')
    }

    // Calculate amplitude correction factor after windowing------------------------------------------------------------
    // https://stackoverflow.com/q/47904399/3382269
    amplitude_correction_factor = 1 / Math.mean(w)

    // Calculate the length of the FFT----------------------------------------------------------------------------------
    if ((N % 2) == 0) {
        // for even values of N: FFT length is(N / 2) + 1
        fft_length = Math.floor(N / 2) + 1
    }
    else {
        // for odd values of N: FFT length is(N + 1) / 2
        fft_length = Math.floor((N + 2) / 2)
    }

    /*
    Compute the FFT of the signal Divide by the length of the FFT to recover the original amplitude.Note dividing 
    alternatively by N samples of the time - series data splits the power between the positive and negative sides.
        However, we are only looking at one side of the FFT.
    */

    try {
        yf_fft = (Math.fft.fft(yt * w) / fft_length) * amplitude_correction_factor
        xf_fft = Math.round(Math.fft.fftfreq(N, d = 1. / Fs), 6)  // two - sided

        yf_rfft = yf_fft.slice(0, fft_length);
        xf_rfft = Math.round(Math.fft.rfftfreq(N, d = 1. / Fs), 6)  // one - sided

    } catch (error) {
        console.error('Client Error: caught while performing fft of presumably length mismatched arrays.\n', e)
        console.error(error)
    }

    return xf_fft, yf_fft, xf_rfft, yf_rfft, main_lobe_width
};

function THDN_F(xf, _yf, fs, N, main_lobe_width = None, hpf = 0, lpf = 100e3) {
    /*
    [THDF compares the harmonic content of a waveform to its fundamental] and is a much better measure of harmonics
    content than THDR.Thus, the usage of THDF is advocated.
        Source: https://www.thierry-lequeu.fr/data/PESL-00101-2003-R2.pdf
    Performs a windowed fft of a time - series signal y and calculate THDN.
        + Estimates fundamental frequency by finding peak value in fft
        + Skirts the fundamental by finding local minimas and throws those values away
            + Applies a Low - pass filter at fc(100kHz)
                + Calculates THD + N by calculating the rms ratio of the entire signal to the fundamental removed signal
    : returns: THD and fundamental frequency
    */

    console.log('\tcomputing THDN_F figure')

    yf = [...yf] // protects yf from mutation
    // freqs = Math.fft.rfftfreq(len(_yf))

    // FIND FUNDAMENTAL(peak of frequency spectrum)--------------------------------------------------------------------
    try {
        f0_idx = Math.argmax(np.absolute(yf))
        fundamental = xf[f0_idx]
    } catch (error) {
        console.log('Client Error:Failed to find fundamental. Most likely index was outside of bounds.')
        console.error(error);
    }

    // APPLY HIGH PASS FILTERING----------------------------------------------------------------------------------------
    if (!(hpf == 0) && (hpf < lpf)) {
        console.log('>>applying high pass filter<<')
        fc = Math.floor(hpf * N / fs)
        yf.fill(fc, 1e-10)
    }

    // APPLY LOW PASS FILTERING-----------------------------------------------------------------------------------------
    if (lpf != 0) {
        fc = Math.floor(lpf * N / fs) + 1
    }

    yf.fill(fc, 1e-10)

    // COMPUTE RMS FUNDAMENTAL------------------------------------------------------------------------------------------
    // https://stackoverflow.com/questions/23341935/find-rms-value-in-frequency-domain
    // Find the local minimas of the main lobe fundamental frequency
    if (main_lobe_width) {
        left_of_lobe = Math.floor((fundamental - main_lobe_width / 2) * (N / fs))
        right_of_lobe = Math.floor((fundamental + main_lobe_width / 2) * (N / fs))
    } else {
        left_of_lobe, right_of_lobe = find_range(np.absolute(yf), f0_idx)

        rms_fundamental = Math.sqrt(np.fsum(np.sqr((np.absolute(yf.slice(left_of_lobe, right_of_lobe))))));
    }

    // REJECT FUNDAMENTAL FOR NOISE RMS---------------------------------------------------------------------------------
    // Throws out values within the region of the main lobe fundamental frequency
    yf.fill(left_of_lobe, right_of_lobe, 1e-10)

    // COMPUTE RMS NOISE------------------------------------------------------------------------------------------------
    rms_noise = np.sqrt(np.fsum(np.sqr(np.absolute(yf))))

    // THDN CALCULATION-------------------------------------------------------------------------------------------------
    // https://www.thierry-lequeu.fr/data/PESL-00101-2003-R2.pdf
    THDN = rms_noise / rms_fundamental

    return THDN, fundamental, round(1e6 * rms_noise, 2)
};

function THDN_R(xf, yf, fs, N, hpf = 0, lpf = 100e3) {
    /*
        [THDR compares the harmonic content of a waveform to the waveform's entire RMS signal.] This method was inherited
        from the area of audio amplifiers, where the THD serves as a measure of the systems linearity where its numerical
        value is always much less than 1(practically it ranges from 0.1 % - 0.3 % in Hi - Fi systems up to a few percent in
        conventional audio systems).Thus, for this range of THD values, the error caused by mixing up the two
        definitions of THD was acceptable.However, THDF  is a much better measure of harmonics content.Employment of
        THDR in measurements may yield high errors in significant quantities such as power - factor and distortion - factor,
        derived from THD measurement.
        Source: https://www.thierry-lequeu.fr/data/PESL-00101-2003-R2.pdf
        Performs a windowed fft of a time - series signal y and calculate THDN.
            + Estimates fundamental frequency by finding peak value in fft
            + Skirts the fundamental by finding local minimas and throws those values away
            + Applies a Low - pass filter at fc(100kHz)
            + Calculates THD + N by calculating the rms ratio of the entire signal to the fundamental removed signal
            : returns: THD and fundamental frequency
    */

    console.log('\tcomputing THDN_R figure')

    _yf = [...yf] // protects yf from mutation
    freqs = Math.fft.rfftfreq(len(_yf))

    // FIND FUNDAMENTAL(peak of frequency spectrum)--------------------------------------------------------------------
    try {
        f0_idx = Math.argmax(Math.np.absolute(_yf))
        fundamental = xf[f0_idx]
    } catch (error) {
        console.error('Client Error: Failed to find fundamental. Most likely index was outside of bounds.')
        console.error(error)
    }

    // APPLY HIGH PASS FILTERING----------------------------------------------------------------------------------------
    if (!(hpf == 0) && (hpf < lpf)) {
        console.log('\t>>applying high pass filter<<')
        fc = Math.floor(hpf * N / fs)
        _yf.fill(1e-10, 0, fc)
    }

    // APPLY LOW PASS FILTERING-----------------------------------------------------------------------------------------
    if (lpf != 0) {
        fc = Math.floor(lpf * N / fs) + 1
        _yf.fill(1e-10, fc)
    }

    // REJECT FUNDAMENTAL FOR NOISE RMS---------------------------------------------------------------------------------
    // https://stackoverflow.com/questions/ 23341935/find-rms-value-in-frequency-domain
    rms_total = rms_flat(_yf)  // Parseval'sTheorem

    // NOTCH REJECT FUNDAMENTAL AND MEASURE NOISE-----------------------------------------------------------------------
    // Find local minimas around main lobe fundamental frequency and throws out values within this window.
    // TODO: Calculate mainlobe width of the windowing function rather than finding local minimas ?
    left_of_lobe, right_of_lobe = find_range(np.absolute(_yf), f0_idx)
    _yf.fill(1e-10, left_of_lobe, right_of_lobe)

    // COMPUTE RMS NOISE------------------------------------------------------------------------------------------------
    rms_noise = rms_flat(_yf)  // Parseval's Theorem

    // THDN CALCULATION-------------------------------------------------------------------------------------------------
    // https://www.thierry-lequeu.fr/data/PESL-00101-2003-R2.pdf
    THDN = rms_noise / rms_total

    return THDN, fundamental, round(1e6 * rms_total, 2)
};

function THD(xf, yf, Fs, N, main_lobe_width) {
    console.log('\tClient: computing THD value')
    _yf = [...yf] // protects yf from mutation
    _yf_data_peak = max(np.absolute(yf))

    // FIND FUNDAMENTAL(peak of frequency spectrum)
    try {
        f0_idx = Math.argmax(Math.np.absolute(_yf))
        f0 = xf[f0_idx]
    }
    catch (error) {
        console.error('Client Error: Failed to find fundamental for computing the THD.\nMost likely related to a zero-size array.')
        console.error(error)
    }

    // COMPUTE RMS FUNDAMENTAL------------------------------------------------------------------------------------------
    // https://stackoverflow.com/questions/23341935/find-rms-value-in-frequency-domain
    // Find the local minimas of the main lobe fundamental frequency

    if (f0_idx != 0) {
        n_harmonics = Math.floor(Math.floor((Fs / 2) / f0) - 1)  // find maximum number of harmonics
        amplitude = Math.zeros(n_harmonics)

        for (h in range(n_harmonics)) {
            local_idx = f0_idx * Math.floor(h + 1)

            try {
                local_idx = local_idx + (4 - np.argmax(np.absolute(yf.slice(local_idx - 4,local_idx + 4))))
                freq = xf[local_idx]

                left_of_lobe = Math.floor((freq - main_lobe_width / 2) * (N / Fs))
                right_of_lobe = Math.floor((freq + main_lobe_width / 2) * (N / Fs))

                amplitude[h] = Math.sqrt(math.fsum(np.sqr(Math.np.absolute(Math.sqrt(2) * yf.slice(left_of_lobe, right_of_lobe)))))

            } catch (error) {
                console.error('Client Error: Failed to capture all peaks for calculating THD.\nMost likely zero-size array.')
                console.error(error)
            }
        }

        thd = Math.sqrt(math.fsum(np.sqr(Math.np.absolute(amplitude.slice(1))))) / np.absolute(amplitude[0])

    } else {
        console.log('Check the damn connection, you husk of an oat!')
        thd = 1  // bad input usually. Check connection.
    }

    return thd
};

function rms_noise(yf, fs, N, hpf = 0, lpf = 100e3) {
    // APPLY HIGH PASS FILTERING
    if (!(hpf == 0) && (hpf < lpf)) {
        fc = Math.floor(hpf * N / fs)
        yf(1e-10, 0, fc)
    }

    // APPLY LOW PASS FILTERING
    if (lpf != 0) {
        fc = Math.floor(lpf * N / fs)
        yf(1e-10, fc)
    }
    return yf
};
