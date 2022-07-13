// <-- MAIN LAYOUT -->
// https://play.tailwindcss.com/uOnWQzR9tl

import Navbar from "./navigation/Navbar"
import TopHeader from "./navigation/TopHeader"
import Image from 'next/image'

export default function Layout({ children }) {

    // background image handled by tailwind
    const bgImageLEFT = "/cliffs_bg.svg"
    const bgImageRIGHT = "/cliffs_bg_right.svg"
    return (
        <>
            {/* background image */}
            <div className='fixed w-full bottom-0 flex justify-between'>
                <div className='left-0 z-0'>
                    <Image
                        alt="cliffs-left"
                        src={bgImageLEFT}
                        width={3000}
                        height={400}
                        layout=""
                        objectFit="cover"
                    />
                </div>
                {/* <div className='right-0 z-0'>
                    <Image
                        alt="cliffs-right"
                        src={bgImageRIGHT}
                        width={282}
                        height={222}
                        layout=""
                        objectFit="cover"
                    />
                </div> */}
            </div>
            <div className="overflow-hidden h-screen bg-neutral-200 flex flex-row justify-center">
                <div className="w-full flex flex-col h-screen bg-white max-w-[1100px] z-50 drop-shadow-lg">
                    <div className="flex flex-1 overflow-hidden bg-slate-200">

                        {/* <!-- left column --> */}
                        <div className="flex min-w-[200px]">
                            <Navbar />
                        </div>

                        {/* <!-- right column --> */}
                        <div className="flex flex-1 flex-col">

                            {/* <!-- top header --> */}
                            <div className="flex h-[65px] top-0 z-50 drop-shadow-md">
                                <TopHeader />
                            </div>
                            <div className="flex flex-1 overflow-y-auto">
                                <div className="grow">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}