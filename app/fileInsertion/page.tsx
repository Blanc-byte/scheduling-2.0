"use client";
import { useState } from 'react';

export default function FileInsertion(){
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        setFileName(e.target.files[0].name);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFileName(e.dataTransfer.files[0].name);
        }
    };
    return (
        <div className="max-w-full h-187 flex items-center justify-center">
            <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="max-w-md mx-auto p-6 border-2 border-dashed border-gray-400 rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
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
                    <p className="mt-3 text-sm text-green-600">Selected: {fileName}</p>
                )}
            </div>
        </div>
    );
}