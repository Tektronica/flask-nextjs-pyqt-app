
const ShadowBox = ({ children }) => {

    return (
        <div className="flex flex-col">
            <div className="mt-4 ml-4 mr-4 p-4 rounded-lg shadow-md bg-white">
                {children}
            </div>
        </div>
    )
}

export default ShadowBox
