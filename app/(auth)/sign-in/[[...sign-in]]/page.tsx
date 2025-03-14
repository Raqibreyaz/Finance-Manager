import Image from "next/image";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center pt-16">
          <h1 className="font-bold text-3xl text-[#232A47]">Welcome Back!</h1>
          <p className="text-base text-[#7E8CA0]">
            Login or Create account to get back to your dashboard!
          </p>
        </div>
        <p className="font-thin text-xs text-center text-red-500">
          * for guest, email: iamguest321@gmail.com, password: iamaguest321
        </p>
        <div className="flex items-center justify-center mt-5">
          <ClerkLoaded>
            <SignIn
            // appearance={{
            //   elements: { footer: "hidden" },
            // }}
            />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
        <Image src={"/logo.svg"} height={100} width={100} alt="Logo" />
      </div>
    </div>
  );
}
