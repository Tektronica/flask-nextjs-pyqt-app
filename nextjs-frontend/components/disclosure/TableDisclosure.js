// <!-- requires Tailwind CSS v2.0+ -->
// <!-- requires @headlessui/react -->
// https://headlessui.com/react/dialog

import { Disclosure } from '@headlessui/react'
import React from 'react';

function TableDisclosure({ children, panelContent }) {

    return (
            <Disclosure>
                <Disclosure.Button className='bg-white border-b hover:bg-gray-200 cursor-pointer' as="tr">
                    {children}
                </Disclosure.Button>
                <Disclosure.Panel as='tr'>
                    <td colSpan="5">
                        <div className='px-2 grid grid-cols-3 bg-gray-100 shadow-inner'>
                            <div className='grid grid-cols-2'>
                                <div className='font-bold'>Ambient:</div>
                                <div>{panelContent.ambient}</div>
                                <div className='font-bold'>Mode:</div>
                                <div>{panelContent.mode}</div>
                                <div className='font-bold'>DMM:</div>
                                <div>{panelContent.dmm}</div>
                            </div>
                            <div className='grid grid-cols-2'>
                                <div className='font-bold'>Nominal:</div>
                                <div>{panelContent.amp_nominal}</div>
                                <div className='font-bold'>Actual:</div>
                                <div>{panelContent.amp_actual}</div>
                                <div className='font-bold'>Frequency:</div>
                                <div>{panelContent.freq_actual}</div>
                            </div>
                            <div className='grid grid-cols-2'>
                                <div className='font-bold'>Total Error:</div>
                                <div>{panelContent.total_error}</div>
                                <div className='font-bold'>Reading Error:</div>
                                <div>{panelContent.reading_error}</div>
                                <div className='font-bold'>% of Limit:</div>
                                <div>{panelContent.PercentofLimit}</div>
                            </div>
                        </div>
                    </td>
                </ Disclosure.Panel>
            </ Disclosure>
    )
}

export default TableDisclosure
