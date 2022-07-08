// import { useRouter } from 'next/router'
import Link from 'next/link'
import { Heroicons } from '../../assets/heroicons'

const Navbar = () => {
    // const router = useRouter()
    // const handleClick = (e,) => {
    //     var btn = document.getElementById('menuBtn');
    //     var nav = document.getElementById('menu');

    //     btn.classList.toggle('open');
    //     nav.classList.toggle('flex');
    //     nav.classList.toggle('hidden');
    // }

    // const nav = {'Status':{'href': '/', 'svg':}, 'Status':{'href': '/'}, 'Status':{'href': '/'}, 'Status':{'href': '/'}, 'Status':{'href': '/'}, 'Status':{'href': '/'}}

    return (
        <div className='flex flex-col flex-1 bg-gradient-to-b from-zinc-800 via-zinc-800 to-zinc-900'>
            <div className='h-[65px] bg-cyan-600 shadow-md shadow-cyan-800 flex justify-center'>
                <div className='text-white text-4xl'>
                    <Link href='/'>
                        <a className="flex items-center h-[65px]">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                </svg>
                            </span>
                            CalPi
                        </a>
                    </Link>
                </div>
            </div>

            <div className="flex-grow p-4">
                <div className="pb-4 text-gray-400 hover:text-white">
                    <Link href='/status'>
                        <a className="flex items-center">
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </span>
                            Status
                        </a>
                    </Link>
                </div>
                <div className="pb-4 text-gray-400 hover:text-white">
                    <Link href='/create'>
                        <a className="flex items-center">
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </span>
                            New Test
                        </a>
                    </Link>
                </div>
                <div className="pb-4 text-gray-400 hover:text-white">
                    <Link href='/queue'>
                        <a className="flex items-center">
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </span>
                            Queue
                        </a>
                    </Link>
                </div>
                <div className="pb-4 text-gray-400 hover:text-white">
                    <Link href='/history'>
                        <a className="flex items-center">
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </span>
                            History
                        </a>
                    </Link>
                </div>
                <div className="pb-4 text-gray-400 hover:text-white">
                    <Link href='/instruments'>
                        <a className="flex items-center">
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </span>
                            Instruments
                        </a>
                    </Link>
                </div>
                <div className="pb-4 text-gray-400 hover:text-white">
                    <Link href='/tools'>
                        <a className="flex items-center">
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                            Tools
                        </a>
                    </Link>
                    <div className='border-t border-cyan-800 my-2 pl-4'>
                        <div className="pb-2 text-gray-400 hover:text-white">
                            ◦ Spec Wizard
                        </div>
                        <div className="pb-2 text-gray-400 hover:text-white">
                            ◦ Thermal Imager
                        </div>
                        <div className="pb-2 text-gray-400 hover:text-white">
                            ◦ Webcam
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar