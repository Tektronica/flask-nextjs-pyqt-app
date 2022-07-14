
const ShadowBox = ({ children }) => {

    return (
        <div className="flex flex-col">
            <div className="grow mt-4 mx-4 p-4 rounded-lg shadow-md bg-white">
                {children}
            </div>
        </div>
    )
}

export default ShadowBox
