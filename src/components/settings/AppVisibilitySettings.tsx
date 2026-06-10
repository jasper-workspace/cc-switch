import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProviderIcon } from "@/components/ProviderIcon";
import type { SettingsFormState } from "@/hooks/useSettings";
import type { CustomApps, VisibleApps } from "@/types";
import type { AppId } from "@/lib/api";
import { Plus } from "lucide-react";

interface AppVisibilitySettingsProps {
  settings: SettingsFormState;
  onChange: (updates: Partial<SettingsFormState>) => void;
  customApps?: CustomApps;
  onAddCustomApp?: () => void;
}

const BUILTIN_APP_CONFIG: Array<{
  id: AppId;
  icon: string;
  nameKey: string;
}> = [
  { id: "trae", icon: "trae", nameKey: "apps.trae" },
  { id: "codebuddy", icon: "codebuddy", nameKey: "apps.codebuddy" },
  { id: "claude", icon: "claude", nameKey: "apps.claudeCode" },
  {
    id: "claude-desktop",
    icon: "claude",
    nameKey: "apps.claudeDesktop",
  },
  { id: "codex", icon: "openai", nameKey: "apps.codex" },
  { id: "opencode", icon: "opencode", nameKey: "apps.opencode" },
  { id: "openclaw", icon: "openclaw", nameKey: "apps.openclaw" },
];

export function AppVisibilitySettings({
  settings,
  onChange,
  customApps,
  onAddCustomApp,
}: AppVisibilitySettingsProps) {
  const { t } = useTranslation();

  const visibleApps: VisibleApps = {
    trae: true,
    codebuddy: true,
    claude: true,
    "claude-desktop": true,
    codex: true,
    opencode: true,
    openclaw: true,
    ...settings.visibleApps,
  };

  // Count how many apps are currently visible
  const builtinCount = BUILTIN_APP_CONFIG.filter(
    (app) => visibleApps[app.id as keyof VisibleApps]
  ).length;
  const customAppsCount = customApps?.apps
    ? Object.keys(customApps.apps).filter(
        (id) => visibleApps.customApps?.[id] !== false
      ).length
    : 0;
  const visibleCount = builtinCount + customAppsCount;

  const handleToggleBuiltin = (appId: AppId) => {
    const key = appId as keyof VisibleApps;
    const isCurrentlyVisible = visibleApps[key] as boolean;
    // Prevent disabling the last visible app
    if (isCurrentlyVisible && visibleCount <= 1) return;

    onChange({
      visibleApps: {
        ...visibleApps,
        [appId]: !isCurrentlyVisible,
      },
    });
  };

  const handleToggleCustom = (appId: string) => {
    const isCurrentlyVisible = visibleApps.customApps?.[appId] ?? true;
    // Prevent disabling the last visible app
    if (isCurrentlyVisible && visibleCount <= 1) return;

    onChange({
      visibleApps: {
        ...visibleApps,
        customApps: {
          ...(visibleApps.customApps ?? {}),
          [appId]: !isCurrentlyVisible,
        },
      },
    });
  };

  return (
    <section className="space-y-2">
      <header className="space-y-1">
        <h3 className="text-sm font-medium">
          {t("settings.appVisibility.title")}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t("settings.appVisibility.description")}
        </p>
      </header>

      {/* Builtin Apps */}
      <div className="inline-flex gap-1 rounded-md border border-border-default bg-background p-1">
        {BUILTIN_APP_CONFIG.map((app) => {
          const isVisible = (visibleApps[app.id as keyof VisibleApps] as boolean) ?? true;
          // Disable button if this is the last visible app
          const isDisabled = isVisible && visibleCount <= 1;

          return (
            <AppButton
              key={app.id}
              active={isVisible}
              disabled={isDisabled}
              onClick={() => handleToggleBuiltin(app.id)}
              icon={app.icon}
              name={t(app.nameKey)}
            >
              {t(app.nameKey)}
            </AppButton>
          );
        })}
      </div>

      {/* Custom Apps */}
      {customApps?.apps && Object.keys(customApps.apps).length > 0 && (
        <div className="inline-flex gap-1 rounded-md border border-border-default bg-background p-1">
          {Object.values(customApps.apps).map((app) => {
            const isVisible = visibleApps.customApps?.[app.id] ?? true;
            // Disable button if this is the last visible app
            const isDisabled = isVisible && visibleCount <= 1;

            return (
              <AppButton
                key={app.id}
                active={isVisible}
                disabled={isDisabled}
                onClick={() => handleToggleCustom(app.id)}
                icon={app.icon}
                name={app.name}
              >
                {app.name}
              </AppButton>
            );
          })}
        </div>
      )}

      {/* Add Custom App Button */}
      {onAddCustomApp && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddCustomApp}
          className="h-11 p-4 ml-2"
        >
          <Plus className="h-4 w-4" />
          {t("settings.appVisibility.addCustomApp")}
        </Button>
      )}
    </section>
  );
}

interface AppButtonProps {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: string;
  name: string;
  children: React.ReactNode;
}

function AppButton({
  active,
  disabled,
  onClick,
  icon,
  name,
  children,
}: AppButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      size="sm"
      variant={active ? "default" : "ghost"}
      className={cn(
        "min-w-[90px] w-auto gap-1.5 px-3 h-9",
        active
          ? "shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      <ProviderIcon icon={icon} name={name} size={14} />
      {children}
    </Button>
  );
}