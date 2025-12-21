import Image from "next/image";

const AdminBackgroundCard = ({ bg, onDelete }) => {
    const isVideo = bg.url.match(/\.(mp4|webm|ogg)$/) || bg.url.includes("/video/upload/");

    return (
        <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 shadow-2xl">
            {/* Preview Area */}
            <div className="aspect-video w-full overflow-hidden bg-zinc-900 relative">
                {isVideo ? (
                    <video
                        src={bg.url}
                        muted
                        loop
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => e.target.pause()}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        src={bg.url}
                        alt={bg.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                )}

                {/* Theme Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${bg.theme === 'light' ? 'bg-white text-black' : 'bg-black text-white border border-white/20'
                    }`}>
                    {bg.theme} UI
                </div>
            </div>

            {/* Info Area */}
            <div className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-md">
                <div className="flex-1 min-w-0 mr-2">
                    <h3 className="font-medium text-sm truncate text-white">{bg.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {isVideo ? "Motion Asset" : "Static Image"}
                    </p>
                </div>

                <div className="flex gap-1 ">
                    <button
                        onClick={() => onDelete(bg._id)}
                        className="p-2 hover:bg-red-500/20 cursor-pointer rounded-full transition group/del"
                        title="Delete Background"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm120-160q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280Z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBackgroundCard;