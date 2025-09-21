import { DocuInfo } from "@/models/documentInfo";
import { useState } from "react";

export function DocumentFunctions(){
    const [data, setData] = useState<DocuInfo[]>([]);

    const checkTheUnits = async () => {
        if(!data) return null;




    }; 
    return {
        data,
        setData
    };
}