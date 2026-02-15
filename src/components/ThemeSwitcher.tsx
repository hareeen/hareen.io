import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeSwitcherProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const width = props.width ?? 18;
  const height = props.height ?? 18;
  const strokeWidth = props.strokeWidth;

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
    } else {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [theme, mounted]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <SunIcon
            width={width}
            height={height}
            strokeWidth={strokeWidth}
            className="dark:hidden"
          />
          <MoonIcon
            width={width}
            height={height}
            strokeWidth={strokeWidth}
            className="hidden dark:block"
          />
          <span className="sr-only">Toggle Theme</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          checked={theme === "light"}
          onClick={() => {
            setTheme("light");
          }}
        >
          밝게
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "dark"}
          onClick={() => {
            setTheme("dark");
          }}
        >
          어둡게
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "system"}
          onClick={() => {
            setTheme("system");
          }}
        >
          시스템 설정에 맞게
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
