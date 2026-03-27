export default function BottomBar() {
    return (
        <div className="shrink-0 w-full h-[30px] bg-black flex items-center justify-center overflow-hidden">
            <span className="text-[1rem] font-light truncate">Work in progress site | <a href="https://github.com/miel-uqac/basket" target="_blank" className="text-blue-300 underline">miel-uqac/basket</a> | v{process.env.NEXT_PUBLIC_PROJECT_VERSION}</span>
        </div>
    )
}