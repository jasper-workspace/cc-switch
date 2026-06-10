//! Trae 配置文件读写模块
//!
//! 处理 ~/.trae-cn/settings.json 的读写

use std::path::PathBuf;

use crate::config::{get_home_dir, read_json_file, write_json_file};
use crate::error::AppError;

/// 获取 Trae 配置目录路径
pub fn get_traec_dir() -> PathBuf {
    get_home_dir().join(".trae-cn")
}

/// 获取 Trae settings.json 文件路径
pub fn get_traec_settings_path() -> PathBuf {
    get_traec_dir().join("settings.json")
}

/// 读取 Trae settings.json
pub fn read_traec_settings() -> Result<serde_json::Value, AppError> {
    let path = get_traec_settings_path();
    if !path.exists() {
        return Err(AppError::localized(
            "trae.settings.missing",
            "Trae 配置文件不存在",
            "Trae settings file is missing",
        ));
    }
    read_json_file(&path)
}

/// 写入 Trae settings.json（自动创建目录）
pub fn write_traec_settings(settings: &serde_json::Value) -> Result<(), AppError> {
    let path = get_traec_settings_path();
    // 确保目录存在
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| {
            AppError::io(parent, e)
        })?;
    }
    write_json_file(&path, settings)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::TempDir;

    fn temp_home() -> TempDir {
        TempDir::new().expect("failed to create temp home")
    }

    #[test]
    fn get_traec_dir_joins_correctly() {
        let dir = get_traec_dir();
        assert!(dir.to_string_lossy().ends_with(".trae-cn"));
    }

    #[test]
    fn get_traec_settings_path_ends_with_settings_json() {
        let path = get_traec_settings_path();
        assert!(path.file_name().map(|n| n == "settings.json").unwrap_or(false));
    }
}