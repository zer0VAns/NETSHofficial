import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';

const HelpModal = ({ open, onClose, title, content }) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} className="relative z-50">
          <motion.div
            className="fixed inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-bold mb-4">{title}</Dialog.Title>
                <div className="text-sm space-y-2">{content}</div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Entendido
                  </button>
                </div>
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default HelpModal;