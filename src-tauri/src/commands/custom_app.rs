#![allow(non_snake_case)]

use crate::settings::{CustomApp, CustomApps};

/// 获取所有自定义应用
#[tauri::command]
pub fn get_custom_apps() -> Result<CustomApps, String> {
    Ok(crate::settings::get_custom_apps())
}

/// 添加自定义应用
#[tauri::command]
pub fn add_custom_app(app: CustomApp) -> Result<CustomApp, String> {
    //验证 ID格式
    if app.id.is_empty() {
        return Err("自定义应用 ID 不能为空".to_string());
    }
    if app.id.len() > 50 {
        return Err("自定义应用 ID 不能超过 50 个字符".to_string());
    }
    if !app.id.chars().all(|c| c.is_alphanumeric() || c == '-' || c == '_') {
        return Err("自定义应用 ID 只能包含字母、数字、短横线和下划线".to_string());
    }
    // 验证名称
    if app.name.trim().is_empty() {
        return Err("自定义应用名称不能为空".to_string());
    }
    // 验证图标
    if app.icon.trim().is_empty() {
        return Err("自定义应用图标不能为空".to_string());
    }

    crate::settings::upsert_custom_app(app).map_err(|e| e.to_string())
}

/// 更新自定义应用
#[tauri::command]
pub fn update_custom_app(app: CustomApp) -> Result<CustomApp, String> {
    // 验证 ID 不能为空
    if app.id.is_empty() {
        return Err("自定义应用 ID 不能为空".to_string());
    }
    // 验证名称
    if app.name.trim().is_empty() {
        return Err("自定义应用名称不能为空".to_string());
    }

    crate::settings::upsert_custom_app(app).map_err(|e| e.to_string())
}

/// 删除自定义应用
#[tauri::command]
pub fn delete_custom_app(id: String) -> Result<bool, String> {
    crate::settings::delete_custom_app(&id).map_err(|e| e.to_string())
}

/// 获取自定义应用的配置目录
#[tauri::command]
pub fn get_custom_app_dir(app_id: String) -> Result<String, String> {
    crate::settings::get_custom_app_dir(&app_id)
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}