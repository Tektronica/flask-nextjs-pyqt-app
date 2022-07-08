import Layout from '../components/layout'
import ShadowBox from '../components/containers/ShadowBox';
import React, { useState, useEffect } from 'react';
import DashBox from '../components/containers/dashbox';

export default function Status() {
    const [dashboard, setDashboard] = useState(0);


    // return information from instrument config
    useEffect(() => {
        getStats(setDashboard);
    }, []);

    return (
        <>
            <ShadowBox>
                <h1 className="text-3xl font-bold underline">
                    Dashboard
                </h1>
                <div className='flex justify-between my-4'>
                    {
                        Object.entries(dashboard).map(function (stat, idx) {
                            return (
                                <DashBox stat={stat[1]} key={idx} />
                            )
                        })
                    }
                </div>

                <p>
                    Video provides a powerful way to help you prove your point. When you click Online Video, you can paste in the embed
                    code for the video you want to add. You can also type a keyword to search online for the video that best fits your
                    document.
                    <br /><br />
                    To make your document look professionally produced, Word provides header, footer, cover page, and text box designs
                    that complement each other. For example, you can add a matching cover page, header, and sidebar. Click Insert and
                    then choose the elements you want from the different galleries.
                    Themes and styles also help keep your document coordinated. When you click Design and choose a new Theme, the
                    pictures, charts, and SmartArt graphics change to match your new theme. When you apply styles, your headings change
                    to match the new theme.
                    <br /><br />
                    Save time in Word with new buttons that show up where you need them. To change the way a picture fits in your
                    document, click it and a button for layout options appears next to it. When you work on a table, click where you
                    want to add a row or a column, and then click the plus sign.
                    Reading is easier, too, in the new Reading view. You can collapse parts of the document and focus on the text you
                    want. If you need to stop reading before you reach the end, Word remembers where you left off - even on another
                    device.
                </p>
            </ShadowBox>
        </>
    )
}

async function getStats(setDashboard) {
    let url = 'api/stats';

    const resJSON = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const res = await resJSON.json();
    console.log(res, res.data)
    setDashboard(res.data);
}


Status.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}