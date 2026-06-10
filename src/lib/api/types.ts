// 前端统一使用 AppId 作为应用标识（与后端命令参数 `app` 一致）
// 支持内置应用 + 自定义应用 ID（任意字符串）
export type AppId =
  | "trae"
  | "codebuddy"
  | "claude"
  | "claude-desktop"
  | "codex"
  | "gemini"
  | "opencode"
  | "openclaw"
  | "hermes"
  | string;
