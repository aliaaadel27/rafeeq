import { cva } from "class-variance-authority";

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 ...",
  {
    variants: { variant: { default: "", outline: "" }, size: { default: "h-8 text-sm", sm: "h-7 text-xs" } },
    defaultVariants: { variant: "default", size: "default" },
  }
);
