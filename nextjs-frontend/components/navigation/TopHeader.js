import Link from 'next/link'
import ModalAbout from '../modal/ModalAbout'
import Image from 'next/image'
import Heroicons from '../../assets/heroicons'
import { useState } from 'react'

const TopHeader = () => {
    let [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* <div id="triangle-right"></div> */}
            <div className="flex flex-1 justify-end bg-white">
                <div className="pr-8 grid grid-rows-1 grid-flow-col gap-8 items-center h-[65px] bg-white">

                    {/* <!-- Modal toggle --> */}
                    <div className="text-gray-800 hover:text-cyan-500">
                        <button onClick={() => setIsOpen(true)}>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                About
                            </div>
                        </button>
                        <ModalAbout isOpen={isOpen} setIsOpen={setIsOpen}/>
                    </div>

                    {/* <!-- Reboot the Raspberry Pi --> */}
                    <div className="text-gray-800 hover:text-cyan-500">
                        <button onClick={handleHeaderClick.bind(this, 'reboot')}>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reboot
                            </div>
                        </button>
                    </div>

                    {/* <!-- Shutdown the Raspberry Pi --> */}
                    <div className="text-gray-800 hover:text-red-500">
                        <button onClick={handleHeaderClick.bind(this, 'shutdown')}>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                        clipRule="evenodd" />
                                </svg>
                                Shutdown
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}


async function handleHeaderClick(cmd, e) {
    // send raspbian executable shell commands
    if (['reboot', 'shutdown'].includes(cmd)) {
        const rpi_cmd = { data: cmd }

        // POST method
        // https://stackoverflow.com/a/55647945
        let url = 'api/rpi';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rpi_cmd)
        })

        console.log(res)
    }
}

export default TopHeader
