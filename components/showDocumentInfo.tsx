import { DocuInfo } from "@/models/documentInfo";
import "@/css/removal.css"
import { useEffect, useRef } from "react";

export interface DocumentInfoProps{
    isOpen: boolean;
    onClose: ()=> void;
    data: DocuInfo[];
}

export default function ShowDucomentInformation( {isOpen, onClose, data}: DocumentInfoProps){

    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect( () => {
        function handleClickOutside(event: MouseEvent){
            if(modalRef.current && !modalRef.current.contains(event.target as Node)){
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },[onClose]);

    
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" >
            <div ref={modalRef} className="p-6 rounded-2xl shadow-lg w-[1200px] h-[600px] overflow-auto bg-gray 
                            transform transition-all duration-300 ease-out animate-fadeIn 
                            border-2 border-green-400 scrollbar-hide">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    Course Offerings
                </h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead className="bg-green-200">
                            <tr>
                                <th className="px-4 py-2 border border-gray-300 text-left">#</th>
                                <th className="px-4 py-2 border border-gray-300 text-left">Course</th>
                                <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                                <th className="px-4 py-2 border border-gray-300 text-left">Section</th>
                                <th className="px-4 py-2 border border-gray-300 text-left">Lec</th>
                                <th className="px-4 py-2 border border-gray-300 text-left">Lab</th>
                                <th className="px-4 py-2 border border-gray-300 text-left">No of Students</th>
                                <th className="px-4 py-2 border border-gray-300 text-left">Faculty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-green-100"}
                                >
                                <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.courseNumber}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.courseDescription}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.section}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.lec ?? "-"}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.lab ?? "-"}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.noOfStudents}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.faculty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transform transition-all duration-300 ease-out animate-fadeOut"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}