export default function BottomBar() {
    return (
        <div className="w-full h-[30px] bg-black flex items-center justify-center overflow-hidden">
            <span className="text-[1rem] font-light">Work in progress site | miel-uqac/Basket | v{process.env.NEXT_PUBLIC_PROJECT_VERSION}</span>
        </div>
    )
}