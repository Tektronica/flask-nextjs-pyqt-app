import Layout from '../components/layout'
import ShadowBox from '../components/containers/ShadowBox';
import Image from 'next/image';
import { useState } from 'react'

export default function Create() {
    const [buttonIsHovering, buttonHoverProps] = useHover()

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Select a test to run:
                </h1>
                <div className='flex items-center justify-center'>
                    <div className='group flex flex-col items-center justify-center'>
                        <button
                            {...buttonHoverProps}
                            className='w-48 px-4 rounded bg-green-500 hover:bg-red-500 text-white text-2xl uppercase transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-500'
                        >
                            {buttonIsHovering ? "Broken" : "Run Test"}
                        </button>

                        <div className=" w-1/2 transition delay-500 transition-opacity ease-in duration-700 opacity-0 : group-hover:opacity-100">
                            <Image src='/constructionpatrick.png'
                                alt="Construction Patrick Star"
                                width={357} height={536}
                            />
                        </div>
                    </div>
                </div>
            </ShadowBox>

        </>
    )
}

function useHover() {
    const [hovering, setHovering] = useState(false)
    const onHoverProps = {
        onMouseEnter: () => setHovering(true),
        onMouseLeave: () => setHovering(false),
    }
    return [hovering, onHoverProps]
}


Create.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}