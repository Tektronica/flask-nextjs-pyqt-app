// <!-- requires Tailwind CSS v2.0+ -->
// <!-- requires @headlessui/react -->
// https://headlessui.com/react/dialog

import Link from 'next/link'
import { Disclosure } from '@headlessui/react'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils'

function TableDisclosure({ children }) {
    return (
        <Disclosure>
            {/* {({ open }) => ( */}
            <>
                {/* {open && ( */}
                <>
                    <Disclosure.Button className='bg-white border-b hover:bg-gray-200' as="tr">
                        {/* <tr onClick={() => { open = true }}> */}
                        {children}
                        {/* </tr> */}
                    </Disclosure.Button>
                    <Disclosure.Panel as='tr'>
                        <td colspan="5">
                            <div className='px-2 grid grid-cols-3 bg-gray-100 shadow-inner'>
                                <div className='grid grid-cols-2'>
                                    <div className='font-bold'>Mode:</div>
                                    <div>DCI</div>
                                    <div className='font-bold'>Amplitude:</div>
                                    <div>5mA</div>
                                    <div className='font-bold'>Actual:</div>
                                    <div>0.00005</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-bold'>Mode:</div>
                                    <div>DCI</div>
                                    <div className='font-bold'>Amplitude:</div>
                                    <div>5mA</div>
                                    <div className='font-bold'>Actual:</div>
                                    <div>0.00005</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-bold'>Total Error:</div>
                                    <div>0.0000000091</div>
                                    <div className='font-bold'>Reading Error:</div>
                                    <div>-0.00000000081</div>
                                    <div className='font-bold'>% of Limit:</div>
                                    <div>-8.9011</div>
                                </div>
                            </div>
                        </td>
                    </ Disclosure.Panel>
                </>
                {/* )} */}
            </>
            {/* )} */}
        </ Disclosure>
    )
}

export default TableDisclosure
