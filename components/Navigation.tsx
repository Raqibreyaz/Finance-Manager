"use client";
import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "@/components/nav-button";
import { useMedia } from "react-use";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const routes = [
  { href: "/", label: "overview" },
  { href: "/transactions", label: "transactions" },
  { href: "/accounts", label: "accounts" },
  { href: "/categories", label: "categories" },
  { href: "/settings", label: "settings" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMedia("(max-width:1023px)", false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant={"outline"}
            size={"sm"}
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map(({ href, label }) => (
              <Button
                key={href}
                variant={href === pathname ? "secondary" : "ghost"}
                onClick={() => onClick(href)}
              >
                {label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  } else
    return (
      <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto ">
        {routes.map(({ label, href }) => (
          <NavButton
            key={href}
            label={label}
            href={href}
            isActive={pathname === href}
          />
        ))}
      </nav>
    );
};
