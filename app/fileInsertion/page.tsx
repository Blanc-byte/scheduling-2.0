"use client";
import { useState } from 'react';
import { parseDocx} from "@/uploads/readDocs";
import { DocuInfo } from '@/models/documentInfo';
import ShowDucomentInformation  from "@/components/showDocumentInfo";
import "@/css/animation.css";
import { setDocxData, getDocxData } from '@/models/documentInfo';
import Alert from '@/components/alert';

export default function FileInsertion(){
    const [fileName, setFileName] = useState<string | null>(null);
    const [data, setData] = useState<DocuInfo[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [openAlertIfWrongDocx, setOpenAlertIfWrongDocx] = useState<boolean>(false);
    

    const fileValidation = () => {
        if(data.length !== 0){

        }else{
            setOpenAlert(true);
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.name.endsWith(".docx")) {
                setOpenAlertIfWrongDocx(true);
                return;
            }

            setFileName(e.target.files[0].name);
            const docData = await parseDocx(file);
            setData(docData);
            setDocxData(docData);
            console.log("sadsad", JSON.stringify(getDocxData(), null, 2));
            setOpen(true);
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];

            if (!file.name.endsWith(".docx")) {
                setOpenAlertIfWrongDocx(true);
                return;
            }

            setFileName(e.dataTransfer.files[0].name);

            const docData = await parseDocx(file);
            setData(docData);
            setDocxData(docData);
            console.log("sadsad", JSON.stringify(getDocxData(), null, 2));
            setOpen(true);
        }
    };
    return (
        <div className="max-w-full h-187 flex flex-col items-center justify-center">
            <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="animate-slow-pulse max-w-md mx-auto p-6 border-2 border-dashed border-gray-400 rounded-xl text-center 
                        cursor-pointer bg-gray-50 hover:bg-gray-100 transition shadow"
            >
                <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <label htmlFor="fileUpload" className="block text-gray-600">
                    <span className="font-medium text-blue-600">Click to upload</span> or drag & drop
                </label>
                {fileName && (
                    <div className='animate-fadeIn'>
                        <p className="mt-3 text-sm text-green-600">Selected: {fileName}</p>
                        <button
                            className='mt-2 bg-green-300 p-2 rounded-2xl w-20 cursor-pointer hover:bg-green-500 transition italic times'
                            onClick={()=> setOpen(true)}
                        >
                            VIEW
                        </button>
                    </div>
                )}
            </div>

            
            <button
                className='mt-7 bg-blue-200 p-2 rounded-xs w-110 cursor-pointer hover:bg-blue-300 transition italic times'
                onClick={fileValidation}
            >
                Validate
            </button>

            {fileName && (
                <ShowDucomentInformation
                    isOpen = {open}
                    onClose={()=>setOpen(false)}
                    data={data}
                />
            )}

            {openAlert && 
                <Alert 
                    message="Upload a File First" 
                    isOpen = {openAlert}
                    onClose={ ()=> setOpenAlert(false)}
                />
            }

            {openAlertIfWrongDocx && 
                <Alert 
                    message="Only .docx are allowed" 
                    isOpen = {openAlertIfWrongDocx}
                    onClose={ ()=> setOpenAlertIfWrongDocx(false)}
                />
            }

        </div>  
    );
}