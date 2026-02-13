import Card from "@/components/common/Card";
import { useState } from "react";
import SettingsDialog from "./common/SettingsDialog";
import Attributions from "./game/results/Attributions";
import useAuth from "@/hooks/useAuth";
import LogoutAlert from "./auth/LogoutAlert";
import AuthDialog from "./auth/AuthDialog";
import MenuCollapsible from "./MenuCollapsible";
import ToggleSwitch from "./common/ToggleSwitch";
import { cn } from "@/lib/utils";
import { IoConstruct, IoLogInOutline, IoLogOutOutline } from "react-icons/io5";
import { GiBookmark } from "react-icons/gi";
import { showToastSuccess } from "./common/ToastWrapper";
import ThemedIcon from "./ThemedIcon";
import ticket1 from "@/assets/svgs/halloween/ticket-1.svg";
import { Button } from "./ui/button";
import { useSettingsStore } from "@/store/settingsStore";

type MenuProps = {
  onFormStart: () => void;
  toggleRadio: () => void;
  isRadioOn: boolean;
  handleQuickPlay: () => void;
};

const Menu = ({
  onFormStart,
  toggleRadio,
  isRadioOn,
  handleQuickPlay,
}: MenuProps) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [shouldAnimateRocket, setShouldAnimateRocket] = useState(false);

  const { user, logout } = useAuth();

  const radioTheme = useSettingsStore((state) => state.radioTheme);
  const theme = useSettingsStore((state) => state.theme);
  const animations = useSettingsStore((state) => state.animations);
  const setRadioTheme = useSettingsStore((state) => state.setRadioTheme);

  const isHalloween = theme === "halloween";

  const menuButtons = [
    {
      label: "Settings",
      onClick: () => setOpenSettings(true),
      icon: (
        <IoConstruct size={20} aria-hidden="true" className="text-yellow-500" />
      ),
    },
    user
      ? {
          label: "Sign out",
          onClick: () => setOpenLogout(true),
          icon: (
            <IoLogOutOutline
              size={20}
              className="text-error-foreground"
              aria-hidden="true"
            />
          ),
        }
      : {
          label: "Sign in",
          onClick: () => setOpenLogin(true),
          icon: (
            <IoLogInOutline
              size={20}
              aria-hidden="true"
              className="text-green-400"
            />
          ),
        },
    {
      label: "About",
      onClick: () => setOpenAbout(true),
      icon: (
        <GiBookmark size={20} aria-hidden="true" className="text-yellow-50" />
      ),
    },
  ];

  const renderMenuButtons = menuButtons.map(({ label, onClick, icon }) => (
    <Button key={label} onClick={onClick} variant={`menu-${theme}`}>
      <span className="inline-flex justify-center items-center gap-1 relative">
        {icon}
        {label}
      </span>
    </Button>
  ));

  const onLogoutConfirm = () => {
    logout();
    showToastSuccess("Successfully logged out");
  };

  return (
    <Card className="menu py-10 overflow-hidden">
      <h1
        className={cn(
          "mb-4 p-0",
          isHalloween
            ? "[text-shadow:0_0_15px_oklch(70%_0.25_50_/_0.5)]"
            : "[text-shadow:0_0_15px_oklch(75%_0.22_250_/_0.5)]",
        )}
      >
        TriviaFlair
      </h1>

      <MenuCollapsible
        onMenuOpened={() => setShouldAnimateRocket(true)}
        flame={isHalloween}
        contentClassName="flex flex-row gap-2 justify-between"
        label={
          <span className="inline-flex justify-center items-center gap-1 relative">
            <ThemedIcon
              type="menu-play"
              size={20}
              aria-hidden="true"
              className={cn(
                "text-chart-4 will-change-[transform,opacity]",
                "drop-shadow-[0_0_13px_var(--color-chart-4)]",
                theme === "default" &&
                  animations &&
                  shouldAnimateRocket &&
                  "group-data-[state=open]:animate-flyoff",
                theme === "default" &&
                  animations &&
                  shouldAnimateRocket &&
                  "group-data-[state=closed]:animate-flyback",
              )}
            />

            <span>Play the Game</span>
          </span>
        }
      >
        <Button onClick={onFormStart} variant={"purple"}>
          <ThemedIcon
            type="customize"
            size={20}
            className="text-chart-4 brightness-120"
          />{" "}
          Customize
        </Button>
        <Button onClick={handleQuickPlay} variant={"purple"}>
          <ThemedIcon
            type="quick-play"
            size={20}
            aria-hidden="true"
            className="text-chart-4 brightness-120"
          />{" "}
          Quick Play
        </Button>
      </MenuCollapsible>

      <MenuCollapsible
        label={
          <span className="inline-flex justify-center items-center gap-1 relative w-full">
            <ThemedIcon
              type="menu-radio"
              size={20}
              aria-hidden="true"
              className="text-chart-4"
            />
            <span>Radio Widget</span>
          </span>
        }
      >
        <div className="flex flex-col gap-4 relative">
          <ToggleSwitch
            id="radio-toggle"
            label="Radio"
            checked={isRadioOn}
            onChange={toggleRadio}
            switchClassName={cn("ring-1 ring-popover/60")}
            className="gap-4 flex"
            labelClassName="text-15-16 inline-flex items-baseline justify-center"
          />

          <div className="space-y-1">
            <ToggleSwitch
              id="radioTheme-toggle"
              label={`Theme: ${radioTheme === "retro" ? "Retro" : "Futuristic"}`}
              checked={radioTheme === "futuristic"}
              onChange={(checked) =>
                setRadioTheme(checked ? "futuristic" : "retro")
              }
              switchClassName={cn("ring-1 ring-popover/60")}
              className="gap-4 flex"
              labelClassName="text-15-16"
            />
            <div
              className={cn(
                "text-xs text-muted-foreground/50 text-center",
                isHalloween && "text-black/70",
              )}
            >
              {radioTheme === "retro"
                ? "Vintage wood & warm glow"
                : "Sleek metal & blue accents"}
            </div>
          </div>
          {isHalloween && (
            <img
              src={ticket1}
              alt=""
              className="size-32 absolute -right-13 top-1/2 -translate-y-1/2"
            />
          )}
        </div>
      </MenuCollapsible>

      {renderMenuButtons}

      <AuthDialog open={openLogin} onOpenChange={setOpenLogin} />
      <LogoutAlert
        open={openLogout}
        onOpenChange={setOpenLogout}
        onConfirm={onLogoutConfirm}
      />
      <SettingsDialog open={openSettings} onOpenChange={setOpenSettings} />
      <Attributions open={openAbout} onOpenChange={setOpenAbout} />
    </Card>
  );
};

export default Menu;
