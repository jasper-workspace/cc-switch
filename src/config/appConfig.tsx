import React from "react";
import type { AppId } from "@/lib/api/types";
import {
  ClaudeIcon,
  CodexIcon,
  OpenClawIcon,
} from "@/components/BrandIcons";
import { ProviderIcon } from "@/components/ProviderIcon";

export interface AppConfig {
  label: string;
  icon: React.ReactNode;
  activeClass: string;
  badgeClass: string;
}

export const APP_IDS: AppId[] = [
  "trae",
  "codebuddy",
  "claude",
  "claude-desktop",
  "codex",
  "opencode",
  "openclaw",
];

/** App IDs shown in Skills panels (excludes OpenClaw — it doesn't support Skills) */
export const SKILLS_APP_IDS: AppId[] = [
  "trae",
  "codebuddy",
  "claude",
  "codex",
  "opencode",
];

/** App IDs shown in MCP panels (excludes OpenClaw) */
export const MCP_APP_IDS: AppId[] = [...SKILLS_APP_IDS];

export const APP_ICON_MAP: Record<AppId, AppConfig> = {
  trae: {
    label: "Trae",
    icon: (
      <ProviderIcon
        icon="trae"
        name="Trae"
        size={14}
        showFallback={false}
      />
    ),
    activeClass:
      "bg-teal-500/10 ring-1 ring-teal-500/20 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400",
    badgeClass:
      "bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 border-0 gap-1.5",
  },
  codebuddy: {
    label: "CodeBuddy",
    icon: (
      <ProviderIcon
        icon="codebuddy"
        name="CodeBuddy"
        size={14}
        showFallback={false}
      />
    ),
    activeClass:
      "bg-purple-500/10 ring-1 ring-purple-500/20 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400",
    badgeClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 border-0 gap-1.5",
  },
  claude: {
    label: "Claude",
    icon: <ClaudeIcon size={14} />,
    activeClass:
      "bg-orange-500/10 ring-1 ring-orange-500/20 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400",
    badgeClass:
      "bg-orange-500/10 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20 border-0 gap-1.5",
  },
  "claude-desktop": {
    label: "Claude Desktop",
    icon: <ClaudeIcon size={14} />,
    activeClass:
      "bg-amber-500/10 ring-1 ring-amber-500/20 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border-0 gap-1.5",
  },
  codex: {
    label: "Codex",
    icon: <CodexIcon size={14} />,
    activeClass:
      "bg-green-500/10 ring-1 ring-green-500/20 hover:bg-green-500/20 text-green-600 dark:text-green-400",
    badgeClass:
      "bg-green-500/10 text-green-700 dark:text-green-300 hover:bg-green-500/20 border-0 gap-1.5",
  },
  opencode: {
    label: "OpenCode",
    icon: (
      <ProviderIcon
        icon="opencode"
        name="OpenCode"
        size={14}
        showFallback={false}
      />
    ),
    activeClass:
      "bg-indigo-500/10 ring-1 ring-indigo-500/20 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    badgeClass:
      "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 border-0 gap-1.5",
  },
  openclaw: {
    label: "OpenClaw",
    icon: <OpenClawIcon size={14} />,
    activeClass:
      "bg-rose-500/10 ring-1 ring-rose-500/20 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400",
    badgeClass:
      "bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 border-0 gap-1.5",
  },
};
