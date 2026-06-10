import { invoke } from "@tauri-apps/api/core";
import type { CustomApp, CustomApps } from "@/types";

export const customAppsApi = {
  /** 获取所有自定义应用 */
  getAll: (): Promise<CustomApps> => invoke("get_custom_apps"),

  /** 添加自定义应用 */
  add: (app: CustomApp): Promise<CustomApp> => invoke("add_custom_app", { app }),

  /** 更新自定义应用 */
  update: (app: CustomApp): Promise<CustomApp> => invoke("update_custom_app", { app }),

  /** 删除自定义应用 */
  delete: (id: string): Promise<boolean> => invoke("delete_custom_app", { id }),

  /** 获取自定义应用的配置目录 */
  getDir: (appId: string): Promise<string> =>
    invoke("get_custom_app_dir", { appId }),
};