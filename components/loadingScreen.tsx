import Image from "next/image";

export default function LoadingScreen(){
    return(
        <div className="fixed insert-0 z-50 flex items-center justify-center">
            <Image
                src="/gifs/loading.gif"
                alt="Loading"
                height={120}
                width={120}
                unoptimized
                className="rounded-full"
            />
        </div>
    );

}