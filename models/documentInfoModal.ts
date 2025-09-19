import { DocuInfo } from "./documentInfo";

export interface DocumentInfoProps{
    isOpen: boolean;
    onClose: ()=> void;
    data: DocuInfo[];
}