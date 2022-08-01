import Layout from '../components/layout'
import ShadowBox from '../components/containers/ShadowBox';
import Image from 'next/image';

export default function About() {

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    About
                </h1>
                <div className='flex flex-col items-center justify-center group'>
                    <div className="">
                        <Image src='/blockdiagram.png'
                            alt="Block diagram"
                            width={1352} height={792}
                        />
                    </div>
                </div>
            </ShadowBox>

        </>
    )
};

About.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
};
