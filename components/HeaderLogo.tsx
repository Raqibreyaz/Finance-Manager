import Link from "next/link";
import Image from "next/image";

export const HeaderLogo = () => {
  return (
    <Link href={"/"}>
      <div className="items-center hidden lg:flex ">
        <Image src={"/logo.svg"} alt="logo" height={35} width={35} />
        <p className="capitalize font-semibold text-white text-2xl ml-2.5">
          finance
        </p>
      </div>
    </Link>
  );
};
