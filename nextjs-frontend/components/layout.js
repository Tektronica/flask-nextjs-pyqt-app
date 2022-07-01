// import Head from 'next/head'
import Navbar from "./navigation/Navbar"
import TopHeader from "./navigation/TopHeader"
import Image from 'next/image'
export default function Layout({ children }) {

    // background image handled by tailwind
    const bgImageURL = "/public/rpi.svg"

    return (
        <>
            {/* background image */}
            {/* <div className="fixed bottom-0 left-0 overflow-hidden z-0">
            <Image
                alt="rpi"
                src={bgImageURL}
                width={260}
                height={260}
                objectFit="cover"
                quality={100}
            />
        </div> */}
            <div className="h-screen bg-neutral-200 flex flex-row justify-center">
                <div className="flex bg-white max-w-[1024px] z-50 shadow-lg">
                    <div className="flex flex-row bg-slate-200 ">

                        {/* <!-- left column --> */}
                        <div className="min-w-[200px]">
                            <Navbar />
                        </div>

                        {/* <!-- right column --> */}
                        <div className="">

                            {/* <!-- top header --> */}
                            <div className="sticky h-[65px] top-0 z-50 mb-4 shadow-md">
                                <TopHeader />
                            </div>
                            <div className="">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}