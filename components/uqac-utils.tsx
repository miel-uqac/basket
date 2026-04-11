import { Loader2 } from "lucide-react"

// === Button ===
// Basic styled button
// Props:
// - children: content inside button
// - disabled: disables click + removes hover style
// - onClick: click handler
// - className: extra styles
// Usage:
// <Button onClick={...}>Click</Button>
export function Button({children, disabled=false, onClick, className=""}: {children: React.ReactNode, disabled?: boolean, onClick: any, className?: string}) {
    return (
        <button disabled={disabled} onClick={onClick} className={`text-black bg-[#b2c083] p-2 ${disabled ? "" : "hover:bg-uqac-green"} transition ${className}`}>
            {children}
        </button>
    )
}

// === UqacBox ===
// Generic container with sticky top title bar and scrollable content
// Props:
// - title: text shown in header
// - children: content inside
// - className: extra styles
// Usage:
// <UqacBox title="Title">...</UqacBox>
export function UqacBox({children, className="", title}: {children?: React.ReactNode, className?: string, title: string}) {
    return (
        <div className={`overflow-hidden shadow-[2px_4px_13px_-1px_rgba(0,0,0,0.09)] max-h-[calc(100%-95px)] min-w-[20%] min-h-[20%] border-[1px] border-black/20 relative ${className}`}>
            <div className="z-[2] w-full h-[50px] bg-uqac-green top-0 sticky flex items-center justify-center">
                <span className="text-white text-3xl">{title}</span>
            </div>
            <div className="relative flex-1 p-4 overflow-y-auto w-full h-[calc(100%-50px)] flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    )
}

// === LoadingBox ===
// Full overlay loading state (absolute)
// Use for when something shouldn't be displayed yet
// Props:
// - className: extra styles
// Usage:
// <LoadingBox /> inside relative parent
export function LoadingBox({className=""}: {className?: string}) {
    return (
        <span className={`bg-black/80 absolute top-0 left-0 w-full h-full flex items-center justify-center text-white ${className}`}>
            <Loader2 className="mr-2 transition animate-spin" />
            Loading...
        </span>
    )
}

// === InputBox ===
// Styled input field
// Props:
// - placeholder
// - onChange
// - type (text, password, etc.)
// - className
// Usage:
// <InputBox type="text" onChange={...} placeholder="..." />
export function InputBox({placeholder, onChange, type, className=""}: {placeholder: string, onChange: any, type: string, className?: string}) {
    return (
        <input className={`p-2 border-[1px] border-black/20 text-black ${className}`} placeholder={placeholder} onChange={onChange} type={type}></input>
    )
}

// === Wrapper ===
// Full-size flex center container
// Must be used in every page as the top most element
// Props:
// - children
// - className
// Usage:
// <Wrapper>...</Wrapper>
export function Wrapper({children, className=""}: {children?: React.ReactNode, className?: string}) {
    return (
        <div className={`w-full h-full flex items-center justify-center ${className}`}>
            {children}
        </div>
    )
}
