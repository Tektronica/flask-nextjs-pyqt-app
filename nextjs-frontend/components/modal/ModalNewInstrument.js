// <!-- requires Tailwind CSS v2.0+ -->
// <!-- requires @headlessui/react -->

// dynamic content as state for modal creation
// https://stackoverflow.com/a/67369453

// react dynamic selection component
// https://stackoverflow.com/a/21736116

// when to use useEffect (lifecyle instead interaction)
// https://stackoverflow.com/a/57003236

import { Dialog } from '@headlessui/react'

const ModalNewInstrument = ({ isOpen, setIsOpen, config, onModalClose }) => {

    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50">

            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="border w-full max-w-lg rounded bg-white">

                    {/* <!-- Modal header --> */}
                    <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                        
                        <Dialog.Title className='text-xl font-semibold text-gray-900 dark:text-white'>
                            {config.name}
                        </Dialog.Title>

                        <button
                            onClick={() => setIsOpen(false)}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>

                    </div>
                    <Dialog.Description className='p-4'>
                        Change configuration of an instrument:
                    </Dialog.Description>

                    <form
                        onSubmit={handleOnSubmit.bind(this, config.name, setIsOpen, onModalClose)}
                        className="p-4 w-full max-w-lg"
                    >
                        <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                                    Instrument
                                </label>
                                <input
                                    name="itemInstr"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-zip"
                                    type="text"
                                    placeholder="<name>"
                                    defaultValue={config.instr}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                                    Connection
                                </label>
                                <div className="relative">
                                    <select
                                        name="itemMode"
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-state"
                                        defaultValue={config.mode}
                                    >
                                        <option value="LAN">LAN</option>
                                        <option value="GPIB">GPIB</option>
                                        <option value="SERIAL">Serial</option>
                                        <option value="RS232">RS232</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-2">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                                    Address
                                </label>
                                <input
                                    name="itemAddress"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-city"
                                    type="text"
                                    placeholder="0.0.0.0"
                                    defaultValue={config.address}
                                />
                            </div>
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                                    Port
                                </label>
                                <input
                                    name="itemPort"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-zip"
                                    type="text"
                                    placeholder="3490"
                                    defaultValue={config.port}
                                />
                            </div>
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                                    GPIB
                                </label>
                                <input
                                    name="itemGPIB"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-zip"
                                    type="text"
                                    placeholder="0"
                                    defaultValue={config.gpib}
                                />
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <button
                                type="submit"
                                // onClick={() => setIsOpen(false)}
                                className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                            >
                                Save Config
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete.bind(this, config.name, setIsOpen, onModalClose)}
                                className="border border-red-400 text-red-500 hover:text-white hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                    <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">

                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

async function handleOnSubmit(name, setIsOpen, onModalClose, e) {
    e.preventDefault()

    // https://stackoverflow.com/a/55939750

    const config = {
        name: name,
        instr: e.target.itemInstr.value,
        mode: e.target.itemMode.value,
        address: e.target.itemAddress.value,
        port: e.target.itemPort.value,
        gpib: e.target.itemGPIB.value,
    }

    console.log('client: editing, ', name)

    // POST method
    // https://stackoverflow.com/a/55647945
    let url = 'api/instruments/edit';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    })

    const body = await res.json()
    const status = body.data
    console.log('server: ', status)

    // close modal on success
    if (status === true) {
        setIsOpen(false)
        onModalClose()
    }

}

async function handleDelete(name, setIsOpen, onModalClose, e) {
    e.preventDefault()

    // https://stackoverflow.com/a/55939750

    const config = {
        name: name
    }

    console.log('client: deleting', name, 'from instrument roster')
    
    // POST method
    // https://stackoverflow.com/a/55647945
    let url = 'api/instruments/delete';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    })

    const body = await res.json()
    const status = body.data
    console.log('server: ', status)

    // close modal on success
    if (status === true) {
        setIsOpen(false)
        onModalClose()
    }

}

export default ModalNewInstrument
