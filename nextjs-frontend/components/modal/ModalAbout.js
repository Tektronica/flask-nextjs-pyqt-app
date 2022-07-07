// <!-- requires Tailwind CSS v2.0+ -->
// <!-- requires @headlessui/react -->
// https://headlessui.com/react/dialog

import Link from 'next/link'
import { Dialog } from '@headlessui/react'

const ModalAbout = ({ isOpen, setIsOpen }) => {


    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="border w-full max-w-sm rounded bg-white">

                    {/* <!-- Modal header --> */}
                    <div class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">

                        <Dialog.Title className='text-xl font-semibold text-gray-900 dark:text-white'>
                            About
                        </Dialog.Title>

                        <button
                            onClick={() => setIsOpen(false)}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </button>

                    </div>

                    <Dialog.Description className='p-4 text-gray-500'>
                        Version: v1.0
                    </Dialog.Description>

                    <div class="p-4 w-full max-w-lg">
                        <p className='text-base leading-relaxed text-cyan-800 dark:text-gray-400'>
                            “Calpi is a react frontend hosted on a Raspberry Pi 4 for the purpose of conducting calibration and measurement. The interface is able to review test reports, manually toggle gpio pins, and send individual commands to instruments.”
                        </p>
                    </div>
                    <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                        <button
                            onClick={() => setIsOpen(false)}
                            type="button"
                            className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                        >
                            Done
                        </button>
                    </div>
                </Dialog.Panel>

            </div>
        </Dialog>
    )
}

export default ModalAbout
