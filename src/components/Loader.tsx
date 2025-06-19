

interface LoaderProps {
    retry: () => void;
    error: string;
}

const Loader = ({ retry, error }: LoaderProps) => {

    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <div className='flex items-center justify-center text-lg text-slate-400 gap-8'>
            <div className='text-2xl text-blue-900'>
                Loading 
                <span className="dots gap-2">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
                </span>
            </div>
            <span 
                className='bg-slate-200 text-red-800 text-[16px] border border-red-800 
                rounded-sm px-6 py-[2px] text-center' 
                onClick={retry}
            >
                Retry
            </span>
            </div>
            {
                error !== "" ? <span className='text-[16px] text-red-800'>{error}</span> : null
            }
        </div>
    )
}



export default Loader;
