import { AnimatePresence, motion } from "framer-motion";
import Tooltip from "./Tooltip";
import { MdBarChart, MdContactPage } from "react-icons/md";
import { FaCertificate, FaBriefcase, FaRegFileAlt } from "react-icons/fa";


export default function MoreOptions() {
    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, delay: 0.1 }}>
                <Tooltip tip="Celebrate an occasion">
                    <button type="button" className="p-2 cursor-pointer rounded-full">
                        <FaCertificate size={22} className="text-gray-600" />
                    </button>
                </Tooltip>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, delay: 0.2 }}>
                <Tooltip tip="Share that you're hiring">
                    <button type="button" className="p-2 cursor-pointer rounded-full">
                        <FaBriefcase size={22} className="text-gray-600" />
                    </button>
                </Tooltip>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, delay: 0.3 }}>
                <Tooltip tip="Create a poll">
                    <button type="button" className="p-2 cursor-pointer rounded-full">
                        <MdBarChart size={22} className="text-gray-600" />
                    </button>
                </Tooltip>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, delay: 0.4 }}>
                <Tooltip tip="Add a document">
                    <button type="button" className="p-2 cursor-pointer rounded-full">
                        <FaRegFileAlt size={22} className="text-gray-600" />
                    </button>
                </Tooltip>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, delay: 0.5 }}>
                <Tooltip tip="Find an expert">
                    <button type="button" className="p-2 cursor-pointer rounded-full">
                        <MdContactPage size={22} className="text-gray-600" />
                    </button>
                </Tooltip>
            </motion.div>
        </AnimatePresence>
    )
};