export default function ButtonDet({ children, onClick, className }) {
    return (
        <button
            onClick={onClick}
            className={`bg-[#a5732db5] cursor-pointer w-1/3 text-white px-4 py-3 h-12 rounded hover:bg-[#a5732db5]-700 transition ${className}`}
        >
            {children}
        </button>
    );
}
