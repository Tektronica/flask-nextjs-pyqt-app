import Layout from '../components/layout'
import ShadowBox from '../components/containers/ShadowBox';
import Image from 'next/image';

export default function Create() {

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Select a test to run:
                </h1>
                <div className='flex flex-col items-center justify-center group'>
                    <button className='w-48 px-4 rounded bg-green-500 text-white text-2xl uppercase transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300'>
                        Run Test
                    </button>

                    <div className="transition-opacity ease-in duration-700 opacity-0 : group-hover:opacity-100">
                        <Image src='/constructionpatrick.png'
                            alt="Construction Patrick Star"
                            width={357} height={536}
                        />
                    </div>
                </div>
            </ShadowBox>

        </>
    )
}


Create.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}