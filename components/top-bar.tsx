import UqacLogo from "./uqac-logo";

export default function TopBar() {
    return (
        <div className="w-full h-[75px] bg-uqac-green flex items-center justify-center overflow-hidden">
            <span className="text-[3rem] font-medium">Basket</span>
            <UqacLogo className="p-2 fill-white" />
        </div>
    )
}