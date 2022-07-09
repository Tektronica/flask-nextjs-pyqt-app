
const StatBox = ({ stat }) => {

    const dashIcon = getDashIcon(stat.name)

    return (
        <div className='bg-gradient-to-t from-gray-100 grow mt-4 ml-4 mr-4 p-4 rounded-lg shadow-md bg-white'>
            <div className='flex flex-row'>
                <div>
                    <div className='pr-2 uppercase text-gray-500'>
                        {stat.name}
                    </div>
                    <div className='text-2xl font-bold pr-2'>
                        {stat.shortDescription}
                    </div>
                </div>

                <div className='text-orange-600'>
                    {dashIcon}
                </div>
            </div>

            <div className='mt-4 pr-2 text-xs text-gray-500 border-t'>
                {stat.longDescription}
            </div>

        </div>
    )
}

const getDashIcon = (name) => {
    let dashIcon;

    if (name == 'cpu') {
        dashIcon = (
            <div class='text-amber-500'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            </div>
        )
    } else if (name == 'memory') {
        dashIcon = (
            <div class='text-cyan-500'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
            </div>
        )
    } else if (name == 'disk') {
        dashIcon = (
            <div class='text-lime-500'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
            </div>
        )
    }

    return (
        <>
            {dashIcon}
        </>
    )
}

export default StatBox
