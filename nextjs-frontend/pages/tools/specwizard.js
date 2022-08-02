import Layout from '../../components/layout'
import ShadowBox from '../../components/containers/ShadowBox';
import { useState } from 'react';
import { round } from '../../modules/dsp/base';

export default function SpecWizard() {

    const [results, setResults] = useState(undefined)

    const parser = new SpecParser

    return (
        <>
            <div className='h-1/2 flex justify-center items-center'>
                <div className="w-1/2">
                    <ShadowBox>
                        <div className='grid grid-cols-1 gap-4'>
                            {/* heading */}
                            <div>
                                <h1 className="text-xl font-bold">
                                    Absolute Accuracy
                                </h1>
                            </div>

                            {/* user input fields */}
                            <div>
                                <div className="grid grid-rows-1 grid-flow-col gap-4">
                                    <div>
                                        <label className="min-w-[40px]">
                                            <span>Range</span>
                                            <input
                                                type="text"
                                                id="spec-range"
                                                className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50 font-mono"
                                                defaultValue={'2.2A'}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <label className="min-w-[40px]">
                                            <span>Value</span>
                                            <input
                                                type="text"
                                                id="spec-value"
                                                className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50 font-mono"
                                                defaultValue={'1A'}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="min-w-[40px]">
                                        <span>Absolute Accuracy</span>
                                        <input
                                            type="text"
                                            id="spec-absolute"
                                            className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50 font-mono"
                                            defaultValue={'440ppm + 100uA'}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* button */}
                            <div>
                                <button
                                    onClick={(e) => (handleClick(e.target.id, parser, setResults))}
                                    id = 'btn-compute'
                                    className='px-4 border border-cyan-500 rounded text-cyan-600 hover:bg-cyan-500 hover:text-white'
                                >
                                    Compute!
                                </button>
                            </div>

                            {/* results */}
                            <div>
                                <div className='flex flex-cols-2'>
                                    <div className="min-w-[80px] mr-2">
                                        PPM:
                                    </div>
                                    <input
                                        readOnly
                                        type="text"
                                        id="result-ppm"
                                        className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50 font-mono"
                                        defaultValue={results ? results.ppm : '--'}
                                    />
                                </div>
                                <div className='flex flex-cols-2'>
                                    <div className="min-w-[80px] mr-2">
                                        Percent:
                                    </div>
                                    <input
                                        readOnly
                                        type="text"
                                        id="result-percent"
                                        className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50 font-mono"
                                        defaultValue={results ? results.percent : '--'}
                                    />
                                </div>
                                <div className='flex flex-cols-2'>
                                    <div className="min-w-[80px] mr-2">
                                        Value:
                                    </div>
                                    <input
                                        readOnly
                                        type="text"
                                        id="results-value"
                                        className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50 font-mono"
                                        defaultValue={results ? results.value : '--'}
                                    />
                                </div>
                            </div>
                        </div>
                    </ShadowBox>

                </div>
            </div>
        </>
    )
};

function handleClick(id, parser, setResults) {
    console.log(`${id} has been pressed. Computing values from absolute accuracy.`)

    parser.text_range = document.getElementById('spec-range').value
    const text_value = document.getElementById('spec-value').value

    parser.text_value = text_value
    const stack = parser.buildStack(document.getElementById('spec-absolute').value)

    try {
        var parsed = parser.evaluateStack(stack)
        console.log(parsed)
    } catch (e) {
        window.alert(e)
    };


    const result_ppm = round(parsed / parser.find_multiplier(text_value) * 1e6, 2) + ' PPM'
    const result_percent = round(parsed / parser.find_multiplier(text_value) * 100, 5) + '%'
    const result_value = find_prefix(String(parsed))

    setResults({ ppm: result_ppm, percent: result_percent, value: result_value })
};

function find_order(val, order = 0) {
    if (Math.round(val) == 0) {
        order += 1
        return find_order(1000 * val, order)
    } else {
        return `${val}e-${order * 3}`
    }
};

function to_eng_string(s) {
    var new_string = ''

    if (Math.round(parseFloat(s)) == 0) {
        new_string = find_order(parseFloat(s))
    } else {
        // new_string = Decimal(s).to_eng_string()
        new_string = s
    }
    return new_string
};

function find_prefix(val_string) {
    val_string = to_eng_string(val_string)
    console.log(val_string)

    try {
        const parsed = val_string.split('e')
        var val = parsed[0]
        var exponent = parsed[1]

    } catch (e) {
        // const val_string = '%.2e' % Decimal(val_string)
        const val_string = val_string
        console.log(val_string)
        console.error(e)
        const parsed = val_string.split('e')
        var val = parsed[0]
        var exponent = parsed[1]
    }

    const exp = {
        '0': '',
        '-3': 'm',
        '-6': 'u',
        '-9': 'n',
        '-12': 'p',
        '-15': 'f'
    };

    const r = Math.round(exponent) % 3
    var s = ''

    if (r < 0) {
        s = String(round(parseFloat(val), 5)) + `e-0${r}` + exp[Math.round(exponent) - r]
    } else {
        s = String(round(parseFloat(val), 5)) + exp[Math.round(exponent) - r]
    }
    return s
}

class SpecParser {
    constructor() {
        this.text_value = ''
        this.text_range = ''
        this.text_spec = ''

        this.prefix = {
            'c': 1e-2,
            '%': 1e-2,
            'm': 1e-3,
            'u': 1e-6,
            'μ': 1e-6,
            'n': 1e-9,
            'p': 1e-12,
            'f': 1e-15,
            'a': 1e-18,
            'z': 1e-21,
            'y': 1e-24
        };

        this.uncertainty = {
            'ppm': 1e-6,
            'PPM': 1e-6,
            '%': 1e-2
        };

        this.units = ['s', 'm', 'kg', 'A', 'K', 'mol', 'cd', 'V', 'Ω', 'ohm', 'J'];

        this.opn = {
            "+": (x, y) => (x + y),
            "-": (x, y) => (x - y),
            "*": (x, y) => (x * y),
            "/": (x, y) => (x / y),
            "^": (x, y) => (x ** y)
        };
    };

    find_multiplier(val) {
        // val could equal '12mA', '1.2mA' '12', '12PPM', '12 ppm'
        const parsed = (val.split(/(-?\d*\.?\d+)/)).filter(x => !!x);
        const string_val = parsed[0];
        const unit = parsed[1];

        if (unit) {
            if (this.units.includes(unit)) {
                val = 1.0
            } else if (unit in this.uncertainty) {
                val = this.uncertainty[unit]
            } else if (unit[0] in this.prefix) {
                val = this.prefix[unit[0]]
            } else {
                console.log('ERROR: invalid string: units are not recognized.')
            };

            return val * parseFloat(string_val)
        }
        else {
            console.error('could not find multiplier!')
        }

    };

    buildStack(spec) {
        /*
        https://stackoverflow.com/a/4998688/3382269
        https://stackoverflow.com/a/2136580/3382269

        spec = 550ppm + 100uA
        parsed = ['550ppm', '+', '100uA']
        stack = [['X', '20ppm'], ['Y', '10ppm'], ['Z', '10uV']]
        */
        const parsed = (spec.split(/([-&\|()]|\w+)/)).filter(x => (!!x));

        console.log(parsed)

        var opStack = [];
        var stack = [];
        const spec_item = { 0: 'X', 2: 'Y', 4: 'Z' }

        for (const [idx, item] of parsed.entries()) {
            if ('+-*/'.includes(item.replace(/ /g, ''))) {
                opStack.push(item.replace(/ /g, ''))
            } else {
                stack.push([spec_item[idx], item])
            }
        };
        console.log(stack);

        return [...stack, ...opStack.reverse()]  // merges opStack in reverse order with stack
    };

    eval_units(op) {
        // op could equal ['range', 12PPM], ['reading', 12 %], [12mA], or [12m]...
        // https://stackoverflow.com/a/3340115/3382269
        const spec_type = op[0];
        const spec_val = op[1];
        const spec = (spec_val.split(/(-?\d*\.?\d+)/)).filter(x => !!x)
        var s = 0

        try {
            if (spec[1] == '%' || (spec[1].toLowerCase() === 'ppm')) {
                // (X of value + Y of range + Z)
                if (spec_type == 'X') {
                    s = this.find_multiplier(spec_val) * this.find_multiplier(this.text_value)
                } else if (spec_type == 'Y') {
                    s = this.find_multiplier(spec_val) * this.find_multiplier(this.text_range)
                } else {
                    console.log('ERROR: something went wrong. Review how spec items are identified (X of value + Y of range + Z)')
                }
            } else {
                s = this.find_multiplier(spec_val)
            }
            return s

        } catch (e) {
            console.error('could not evaluate units!')
            throw e
        }

    };

    evaluateStack(s) {
        // note: operands are pushed onto the stack in reverse order.See.pop()
        const op = s.pop();
        try {
            if (Array.isArray(op)) {
                return this.eval_units(op)

            } else if ("+-*/^".includes(op)) {
                // note: operands are pushed onto the stack in reverse order
                const op2 = this.evaluateStack(s)
                const op1 = this.evaluateStack(s)
                return this.opn[op](op1, op2)
            }
        } catch (e) {
            console.error('could not evaluate stack!')
            throw e
        }
    };

};

SpecWizard.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
};
