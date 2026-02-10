import type { IconBaseProps } from "react-icons/lib";
import { cn } from "@/lib/utils";
import React from "react";
import { IoFlash, IoMusicalNotes, IoRocket } from "react-icons/io5";
import {
  GiPumpkinMask,
  GiScrollQuill,
  GiWitchFlight,
  GiGhost,
  GiMusicalScore,
} from "react-icons/gi";
import { useSettingsStore } from "@/store/settingsStore";

type IconComponent = React.ComponentType<{
  size?: string | number;
  className?: string;
}>;

type IconKey =
  | "menu-play"
  | "customize"
  | "quick-play"
  | "menu-radio"
  | "menu-settings"
  | "menu-login"
  | "menu-logout"
  | "menu-about";

type ThemedIconProps = {
  type: IconKey;
} & IconBaseProps;

const ThemedIcon = ({ type, className, ...props }: ThemedIconProps) => {
  const theme = useSettingsStore((state) => state.theme);

  const iconMap: Record<IconKey, Record<string, IconComponent | null>> = {
    "menu-play": {
      default: IoRocket,
      halloween: GiPumpkinMask,
    },
    customize: {
      default: GiScrollQuill,
      halloween: GiGhost,
    },
    "quick-play": {
      default: IoFlash,
      halloween: GiWitchFlight,
    },
    "menu-radio": {
      default: IoMusicalNotes,
      halloween: null,
    },
    "menu-settings": {},
    "menu-login": {},
    "menu-logout": {},
    "menu-about": {},
    // "menu-radio": {
    //   default: <IoMusicalNotes />,
    //   halloween: <Music />
    // },
    // "menu-settings": {
    //   default: <IoConstruct />,
    //   halloween: <Wrench />
    // },
  };

  const Icon = iconMap[type]?.[theme] || iconMap[type]?.default;

  if (!Icon) {
    return null;
  }

  return (
    <Icon aria-hidden="true" className={cn("size-5", className)} {...props} />
  );
};

export default ThemedIcon;
