
const DashBox = ({ stat }) => {

    return (
        <div className='grow mt-4 ml-4 mr-4 p-4 rounded-lg shadow-md bg-white'>
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 7H7v6h6V7z" />
                        <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>

            <div className='mt-4 pr-2 text-sm text-gray-500 border-t'>
                {stat.longDescription}
            </div>
            
        </div>
    )
}

export default DashBox
