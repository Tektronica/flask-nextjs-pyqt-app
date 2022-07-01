import Link from 'next/link'
import Modal from '../containers/Modal'
import Image from 'next/image'
import Heroicons from '../../assets/heroicons'

const TopHeader = () => {
    // banner image handled by tailwind
    const bgImageURL = "/banner.svg"
    return (
        <>
            {/* <div id="triangle-right"></div> */}
            <div className="flex flex-1 justify-end bg-white">
                
                <div className="pr-8 grid grid-rows-1 grid-flow-col gap-8 items-center h-[65px] bg-white">
                    <div className="text-gray-800 hover:text-cyan-500">
                        {/* <!-- Modal toggle --> */}
                        <button className="flex items-center"
                            type="button"
                            data-modal-toggle="aboutModal">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            About
                        </button>
                    </div>
                    <div className="text-gray-800 hover:text-cyan-500">
                        <Link href='/reboot'>
                            <a className="flex items-center">
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </span>
                                Reboot
                            </a>
                        </Link>
                    </div>
                    <div className="text-gray-800 hover:text-red-500">
                        <Link href='/shutdown'>
                            <a className="flex items-center">
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd"
                                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                            clipRule="evenodd" />
                                    </svg>
                                </span>
                                Shutdown
                            </a>
                        </Link>
                    </div>
                </div>
            </div>

            <Modal message={{ id: "aboutModal", header: 'About', body: 'The quick brown fox jumped over the lazy dog' }} />
        </>
    )
}

export default TopHeader
