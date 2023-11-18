import Image from "next/image";

import SearchForm from "./search-form";

const HeroBanner = () => {
  return (
    <header className="relative h-[90vh] max-h-[500px] w-full">
      <Image
        src="https://placehold.co/600x400.png"
        alt="banner"
        fill
        priority
        sizes="(max-width: 50px) 2vw"
      />
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.1)]">
        <div className="text-background! absolute z-10 w-3/4">
          <h1 className="mb-8 text-center text-4xl font-extrabold tracking-wide">
            Stunning 1 million+ high quality royalty free{" "}
            <span className="text-blue-700">images</span> shared by our
            community and creators.
          </h1>
          <SearchForm />
        </div>
      </div>
    </header>
  );
};

export default HeroBanner;
