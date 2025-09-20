"use client";

import { useState, useEffect } from "react";
import { DocuInfo } from "@/models/documentInfo";
export default function Testing(){

    const [data, setData] = useState<DocuInfo[]>([]);

    useEffect(() => {
        const file = localStorage.getItem("docxData");
        if(file){
            setData(JSON.parse(file));
        }
    },[]);
    
    return(
        <div>
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
        </div>
    );
}