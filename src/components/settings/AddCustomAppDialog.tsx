import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CustomApp } from "@/types";
import { ProviderIcon } from "@/components/ProviderIcon";

// Available icons for custom apps
const AVAILABLE_ICONS = [
  { id: "circle", name: "Circle" },
  { id: "openai", name: "OpenAI" },
  { id: "anthropic", name: "Anthropic" },
  { id: "gemini", name: "Gemini" },
  { id: "opencode", name: "OpenCode" },
  { id: "openclaw", name: "OpenClaw" },
  { id: "hermes", name: "Hermes" },
  { id: "code", name: "Code" },
  { id: "bot", name: "Bot" },
  { id: "cpu", name: "CPU" },
  { id: "cloud", name: "Cloud" },
  { id: "server", name: "Server" },
];

interface AddCustomAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (app: Omit<CustomApp, "createdAt" | "updatedAt">) => void;
  editingApp?: CustomApp | null;
}

export function AddCustomAppDialog({
  isOpen,
  onClose,
  onAdd,
  editingApp,
}: AddCustomAppDialogProps) {
  const { t } = useTranslation();
  const [id, setId] = useState(editingApp?.id ?? "");
  const [name, setName] = useState(editingApp?.name ?? "");
  const [icon, setIcon] = useState(editingApp?.icon ?? "circle");
  const [description, setDescription] = useState(editingApp?.description ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!id.trim()) {
      setError("ID 不能为空");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(id.trim())) {
      setError("ID 只能包含字母、数字、短横线和下划线");
      return;
    }
    if (id.length > 50) {
      setError("ID 不能超过 50 个字符");
      return;
    }
    if (!name.trim()) {
      setError("名称不能为空");
      return;
    }
    if (!icon.trim()) {
      setError("请选择一个图标");
      return;
    }

    onAdd({
      id: id.trim(),
      name: name.trim(),
      icon,
      description: description.trim() || undefined,
      enabled: editingApp?.enabled ?? true,
      sortIndex: editingApp?.sortIndex ?? 0,
    });

    // Reset form
    setId("");
    setName("");
    setIcon("circle");
    setDescription("");
    onClose();
  };

  const handleClose = () => {
    setId("");
    setName("");
    setIcon("circle");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0" zIndex="alert">
        <DialogHeader>
          <DialogTitle>
            {editingApp
              ? t("settings.customApp.editTitle", { defaultValue: "编辑应用" })
              : t("settings.customApp.addTitle", { defaultValue: "添加应用" })}
          </DialogTitle>
          <DialogDescription>
            {editingApp
              ? t("settings.customApp.editDescription", {
                  defaultValue: "修改应用配置",
                })
              : t("settings.customApp.addDescription", {
                  defaultValue: "添加自定义应用工具",
                })}
          </DialogDescription>
        </DialogHeader>

        <form id="add-custom-app-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* ID Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">ID</label>
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="my-custom-agent"
              disabled={!!editingApp}
              className={!editingApp ? "" : "opacity-50"}
            />
            <p className="text-xs text-muted-foreground">
              唯一的标识符，只能包含字母、数字、短横线和下划线
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">名称</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Agent"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">图标</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map((iconOption) => (
                <button
                  key={iconOption.id}
                  type="button"
                  onClick={() => setIcon(iconOption.id)}
                  className={`
                    inline-flex items-center justify-center w-10 h-10 rounded-md border text-sm
                    ${
                      icon === iconOption.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-background hover:bg-muted"
                    }
                  `}
                  title={iconOption.name}
                >
                  <ProviderIcon icon={iconOption.id} name={iconOption.name} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">描述（可选）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述这个自定义应用..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <DialogFooter className="flex gap-2 border-t-0 bg-transparent pt-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" form="add-custom-app-form">
            {editingApp ? t("common.save", { defaultValue: "保存" }) : t("common.add", { defaultValue: "添加" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
