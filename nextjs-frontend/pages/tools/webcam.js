import Layout from '../../components/layout'
import ShadowBox from '../../components/containers/ShadowBox';
import { useState } from 'react';
import Image from 'next/image';

export default function Webcam() {

    const [haveVideoFeed, setVideoFeed] = useState(true)

    return (
        <>
            <div className='h-1/2 flex justify-center items-center'>
                <div className="w-1/2">
                    <ShadowBox>
                        <div className='grid grid-cols-1 gap-4'>
                            <h1>Video Stream</h1>
                            <Cam />
                        </div>
                    </ShadowBox>

                </div>
            </div>
        </>
    )
};

const Cam = () => {
    return (
        <div>
            <img
                src="/api/video_feed"
                alt="Stream"
                width='386'
                height='290'
            />
        </div>
    );
};

Webcam.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
};
