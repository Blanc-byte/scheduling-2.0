 import "@/css/animation.css";
 import Image from "next/image";
 
 interface AlertProp{
    message: string;
    isOpen: boolean;
    onClose: ()=>void;
 }

export default function Alert({message, isOpen, onClose}: AlertProp){
    if(!isOpen) return null;

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-110 h-50 animate-fadeIn border-2 border-emerald-300
                            flex flex-col items-center justify-center">
                
                <Image 
                    src="/gifs/bite.gif" 
                    alt="bite"
                    width={150}
                    height={150}
                    unoptimized 
                    className="rounded-full"
                />
                <p className="text-lg font-semibold text-gray-800">{message}</p>
                <button className="mt-4 p-2 pl-4 pr-4 rounded-2xl bg-emerald-300 hover:bg-emerald-400 transition"
                    onClick={onClose}
                >
                    CLOSE
                </button>
            </div>
        </div>
    );
}