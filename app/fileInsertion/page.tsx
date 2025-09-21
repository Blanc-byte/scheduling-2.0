"use client";
import { useState } from 'react';
import { parseDocx} from "@/uploads/readDocs";
import { DocuInfo } from '@/models/documentInfo';
import ShowDucomentInformation  from "@/components/showDocumentInfo";
import "@/css/animation.css";
import { setDocxData } from '@/models/documentInfo';
import Alert from '@/components/alert';
import LoadingScreen from '@/components/loadingScreen';

export default function FileInsertion(){
    const [fileName, setFileName] = useState<string | null>(null);
    const [data, setData] = useState<DocuInfo[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [openAlertIfWrongDocx, setOpenAlertIfWrongDocx] = useState<boolean>(false);
    const [openAlertIfNoData, setOpenAlertIfNoData] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [hover, setHover] = useState<boolean>(false);
    

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

            setLoading(true);

            try{
                const docData = await parseDocx(file);

                if(docData.length===0){
                    setOpenAlertIfNoData(true);
                    return;
                }

                setFileName(e.target.files[0].name);

                setData(docData);
                setDocxData(docData);
                setOpen(true);

            }catch(error){
                console.error("Error parsing docx ", error);
            }finally{   
                setLoading(false);
            }
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

            setLoading(true);
            try{
                const docData = await parseDocx(file);

                if(docData.length===0){
                    setOpenAlertIfNoData(true);
                    return;
                }

                setFileName(file.name);

                setData(docData);
                setDocxData(docData);
                setOpen(true);
            }catch(error){
                console.error("Error parsing docx ", error);
            }finally{   
                setLoading(false);
            }
        }
    };
    return (
        <div className="max-w-full h-187 flex flex-col items-center justify-center">
            <div
                onMouseEnter={()=>setHover(true)}
                onMouseLeave={()=>setHover(false)}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`animate-slow-pulse w-150 mx-auto p-6 border-2 border-dashed border-gray-400 rounded-xl text-center 
                            cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all shadow
                            ${hover? "scale-110":"scale-100"}`}
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
                            className='mt-2 bg-green-300 p-2 rounded-2xl w-20 cursor-pointer hover:bg-green-500 
                                        transition italic times'
                            onClick={()=> setOpen(true)}
                        >
                            VIEW
                        </button>
                    </div>
                )}
            </div>

            
            <button
                onMouseEnter={()=>setHover(true)}
                onMouseLeave={()=>setHover(false)}
                className={`
                    mt-7 bg-blue-200 p-2 rounded-xs w-150 cursor-pointer hover:bg-blue-300 transition-all duration-100 italic times
                    ${hover? "scale-105": "scale-100"}
                    `}
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

            {openAlertIfNoData && 
                <Alert 
                    message="No Data Read, Check The File" 
                    isOpen = {openAlertIfNoData}
                    onClose={ ()=> setOpenAlertIfNoData(false)}
                />
            }
            {loading && 
                <LoadingScreen />
            }

        </div>  
    );
}