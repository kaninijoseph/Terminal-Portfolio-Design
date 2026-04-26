import Image from "next/image";
import photo from "@/public/ngash.png";

interface HeaderProps {
  activeProjectImage?: string | null;
}

export default function Header({ activeProjectImage }: HeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 border-b border-gray-700 bg-black py-4 h-full w-full overflow-y-auto custom-scrollbar">
      {/* Top Section: Profile and Text */}
      <div className="flex flex-col gap-5 border-b border-gray-800 pb-6 w-full">
        {/* Profile Image Container */}
        <div className="w-full md:w-auto flex justify-center">
          <div className="relative w-[180px] h-[180px] lg:w-[220px] lg:h-[220px]">
            <Image
              src={photo}
              alt="Profile"
              fill
              className="rounded-lg border-2 border-gray-600 object-cover shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Profile Text content */}
        <div className="flex flex-col gap-2 text-center px-6">
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Joseph Ng'ang'a
          </h1>
          <p className="text-green-400 text-lg font-mono">
            Full-Stack Developer | AI Agent Builder
          </p>
          <p className="text-gray-400 text-sm italic">
            "Building intelligent solutions with code + creativity"
          </p>
        </div>
      </div>

      {/* PROJECT DISPLAY WINDOW - Only renders if an image is present */}
      {activeProjectImage && (
        <div className="w-full px-6 py-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative w-full aspect-video rounded border border-green-900/50 bg-gray-900/50 overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <img
              src={activeProjectImage}
              alt="Project Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 bg-green-500/20 text-green-400 text-[8px] px-2 py-1 font-mono uppercase tracking-widest border-b border-r border-green-500/30">
              Active_Source: RENDER_01
            </div>
            <div className="absolute bottom-0 right-0 bg-green-500 text-black text-[10px] px-2 font-bold uppercase tracking-tighter">
              Visual_Output
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
