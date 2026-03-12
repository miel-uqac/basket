import { Loader2 } from "lucide-react"

export function Button({children, disabled=false, onClick, className=""}: {children: React.ReactNode, disabled?: boolean, onClick: any, className?: string}) {
    return (
        <button disabled={disabled} onClick={onClick} className={`text-black bg-[#b2c083] p-2 ${disabled ? "" : "hover:bg-uqac-green"} transition ${className}`}>
            {children}
        </button>
    )
}

export function UqacBox({children, className, title}: {children: React.ReactNode, className: string, title: string}) {
    return (
        <div className={`shadow-[2px_4px_13px_-1px_rgba(0,0,0,0.09)] border-[1px] border-black/20 relative ${className}`}>
            <div className="w-full h-[50px] bg-uqac-green top-0 absolute flex items-center justify-center">
                <span className="text-white text-3xl">{title}</span>
            </div>
            {children}
        </div>
    )
}

export function LoadingBox() {
    return (
        <span className='bg-black/80 absolute top-0 left-0 w-full h-full flex items-center justify-center text-white'>
            <Loader2 className="mr-2 transition animate-spin" />
            Loading...
        </span>
    )
}

export function InputBox({placeholder, onChange, type, className=""}: {placeholder: string, onChange: any, type: string, className?: string}) {
    return (
        <input className={`p-2 border-[1px] border-black/20 text-black ${className}`} placeholder={placeholder} onChange={onChange} type={type}></input>
    )
}