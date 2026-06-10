import type { AppId } from "@/lib/api";
import type { CustomApps, VisibleApps } from "@/types";
import { ProviderIcon } from "@/components/ProviderIcon";
import { cn } from "@/lib/utils";
import { Monitor, Terminal } from "lucide-react";

const APP_BADGE_ICON: Partial<
  Record<AppId, { icon: typeof Terminal; offsetY?: number }>
> = {
  claude: { icon: Terminal },
  "claude-desktop": { icon: Monitor, offsetY: 0.5 },
};

interface AppSwitcherProps {
  activeApp: AppId;
  onSwitch: (app: AppId) => void;
  visibleApps?: VisibleApps;
  customApps?: CustomApps;
  compact?: boolean;
}

const BUILTIN_APPS: AppId[] = [
  "trae",
  "codebuddy",
  "claude",
  "claude-desktop",
  "codex",
  "opencode",
  "openclaw",
];
const STORAGE_KEY = "cc-switch-last-app";

export function AppSwitcher({
  activeApp,
  onSwitch,
  visibleApps,
  customApps,
  compact,
}: AppSwitcherProps) {
  const handleSwitch = (app: AppId) => {
    if (app === activeApp) return;
    localStorage.setItem(STORAGE_KEY, app);
    onSwitch(app);
  };
  const iconSize = 20;

  // Builtin app icon mapping
  const builtinAppIconName: Record<string, string> = {
    trae: "trae",
    codebuddy: "codebuddy",
    claude: "claude",
    "claude-desktop": "claude",
    codex: "openai",
    opencode: "opencode",
    openclaw: "openclaw",
  };

  // Builtin app display name mapping
  const builtinAppDisplayName: Record<string, string> = {
    trae: "Trae",
    codebuddy: "CodeBuddy",
    claude: "Claude Code",
    "claude-desktop": "Claude Desktop",
    codex: "Codex",
    opencode: "OpenCode",
    openclaw: "OpenClaw",
  };

  // Get app icon - prefer custom app metadata, fallback to builtin
  const getAppIcon = (appId: AppId): string => {
    if (builtinAppIconName[appId]) {
      return builtinAppIconName[appId];
    }
    // Custom app
    const customApp = customApps?.apps?.[appId];
    return customApp?.icon || "circle";
  };

  // Get app display name - prefer custom app metadata, fallback to builtin
  const getAppDisplayName = (appId: AppId): string => {
    if (builtinAppDisplayName[appId]) {
      return builtinAppDisplayName[appId];
    }
    // Custom app
    const customApp = customApps?.apps?.[appId];
    return customApp?.name || appId;
  };

  // Combine all apps (builtin + custom)
  const allApps = [...BUILTIN_APPS];
  if (customApps?.apps) {
    Object.keys(customApps.apps).forEach((id) => {
      if (!allApps.includes(id as AppId)) {
        allApps.push(id as AppId);
      }
    });
  }

  // Filter apps based on visibility settings (default all visible)
  const appsToShow = allApps.filter((app) => {
    if (!visibleApps) return true;
    // Check builtin app visibility
    if (BUILTIN_APPS.includes(app)) {
      return visibleApps[app as keyof VisibleApps];
    }
    // Check custom app visibility
    return visibleApps.customApps?.[app] ?? true;
  });

  return (
    <div className="inline-flex bg-muted rounded-xl p-1 gap-1">
      {appsToShow.map((app) => {
        const badgeConfig = APP_BADGE_ICON[app];
        const BadgeIcon = badgeConfig?.icon;
        const isActive = activeApp === app;
        const iconName = getAppIcon(app);
        const displayName = getAppDisplayName(app);

        return (
          <button
            key={app}
            type="button"
            onClick={() => handleSwitch(app)}
            className={cn(
              "group inline-flex items-center px-3 h-8 rounded-md text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50",
            )}
          >
            <span className="relative inline-flex shrink-0">
              <ProviderIcon icon={iconName} name={displayName} size={iconSize} />
              {BadgeIcon && (
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-[3px] border h-[11px] w-[11px]",
                    isActive
                      ? "bg-background border-border text-foreground"
                      : "bg-muted border-background text-muted-foreground group-hover:bg-background group-hover:text-foreground",
                  )}
                  aria-hidden="true"
                >
                  <BadgeIcon
                    className="h-[8px] w-[8px]"
                    strokeWidth={2.5}
                    style={
                      badgeConfig?.offsetY
                        ? { transform: `translateY(${badgeConfig.offsetY}px)` }
                        : undefined
                    }
                  />
                </span>
              )}
            </span>
            <span
              className={cn(
                "transition-all duration-200 whitespace-nowrap overflow-hidden",
                compact
                  ? "max-w-0 opacity-0 ml-0"
                  : "max-w-[120px] opacity-100 ml-2",
              )}
            >
              {displayName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
