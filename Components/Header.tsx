import Image from "next/image";
import photo from "@/public/ngash.png";

export default function Header() {
  return (
    <div className="flex flex-col  items-center gap-4 md:gap-4 border-b border-gray-700 bg-black py-4 h-full w-full">
      {/* Image container - responsive sizing */}
      <div className="w-full md:w-auto flex justify-center">
        <div className="relative w-[200px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[220px] md:h-[220px] lg:w-[280px] lg:h-[280px]">
          <Image
            src={photo}
            alt="Profile"
            fill
            className="rounded-lg border-2 border-gray-600 object-cover shadow-lg"
            sizes="(max-width: 768px) 200px, (max-width: 1024px) 220px, 280px"
            priority
          />
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
          Joseph Ng'ang'a Kanini
        </h1>
        <p className="text-green-400 text-lg sm:text-xl md:text-2xl">
          AI Developer | Software Engineer
        </p>
        <p className="text-gray-400 text-base sm:text-lg flex">
          Building intelligent solutions with code + creativity
        </p>
      </div>
    </div>
  );
}
