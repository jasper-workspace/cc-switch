//! Trae MCP sync module
//!
//! Handles MCP server sync for Trae (similar to Claude JSON format).
//!
//! ## Format
//!
//! Trae uses `mcpServers` in settings.json, same as Claude.

use std::collections::HashMap;

use serde_json::{Map, Value};

use crate::app_config::{McpApps, McpServer, MultiAppConfig};
use crate::error::AppError;
use crate::trae_config;

use super::validation::validate_server_spec;

/// Check if Trae MCP sync should proceed
fn should_sync_traec_mcp() -> bool {
    trae_config::get_traec_settings_path().exists()
}

/// Read mcpServers map from Trae settings.json
fn read_mcp_servers_map() -> Result<Map<String, Value>, AppError> {
    let settings = trae_config::read_traec_settings()?;
    let servers = settings
        .get("mcpServers")
        .and_then(|v| v.as_object())
        .map(|obj| obj.iter().map(|(k, v)| (k.clone(), v.clone())).collect())
        .unwrap_or_default();
    Ok(servers)
}

/// Write mcpServers map to Trae settings.json
fn set_mcp_servers_map(servers: &Map<String, Value>) -> Result<(), AppError> {
    let path = trae_config::get_traec_settings_path();
    let mut settings = if path.exists() {
        trae_config::read_traec_settings()?
    } else {
        serde_json::json!({})
    };

    let obj = settings
        .as_object_mut()
        .ok_or_else(|| AppError::Config("Trae settings must be a JSON object".into()))?;
    obj.insert("mcpServers".into(), Value::Object(servers.clone()));

    trae_config::write_traec_settings(&settings)
}

// ============================================================================
// Public API: Sync Functions
// ============================================================================

/// Sync a single MCP server to Trae live config
pub fn sync_single_server_to_traec(
    _config: &MultiAppConfig,
    id: &str,
    server_spec: &Value,
) -> Result<(), AppError> {
    if !should_sync_traec_mcp() {
        return Ok(());
    }

    let mut current = read_mcp_servers_map()?;
    current.insert(id.to_string(), server_spec.clone());
    set_mcp_servers_map(&current)
}

/// Remove a single MCP server from Trae live config
pub fn remove_server_from_traec(id: &str) -> Result<(), AppError> {
    if !should_sync_traec_mcp() {
        return Ok(());
    }

    let mut current = read_mcp_servers_map()?;
    current.remove(id);
    set_mcp_servers_map(&current)
}

/// Import MCP servers from Trae settings to unified structure
///
/// Existing servers will have Trae app enabled without overwriting other fields.
pub fn import_from_traec(config: &mut MultiAppConfig) -> Result<usize, AppError> {
    let servers_map = read_mcp_servers_map()?;
    if servers_map.is_empty() {
        return Ok(0);
    }

    let servers = config.mcp.servers.get_or_insert_with(HashMap::new);

    let mut changed = 0;
    let mut errors = Vec::new();

    for (id, spec) in servers_map {
        if let Err(e) = validate_server_spec(&spec) {
            log::warn!("Skip invalid Trae MCP server '{id}': {e}");
            errors.push(format!("{id}: {e}"));
            continue;
        }

        if let Some(existing) = servers.get_mut(&id) {
            if !existing.apps.trae {
                existing.apps.trae = true;
                changed += 1;
                log::info!("MCP server '{id}' enabled for Trae");
            }
        } else {
            servers.insert(
                id.clone(),
                McpServer {
                    id: id.clone(),
                    name: id.clone(),
                    server: spec,
                    apps: McpApps {
                        claude: false,
                        codex: false,
                        gemini: false,
                        opencode: false,
                        hermes: false,
                        trae: true,
                        codebuddy: false,
                    },
                    description: None,
                    homepage: None,
                    docs: None,
                    tags: Vec::new(),
                },
            );
            changed += 1;
            log::info!("Imported new MCP server '{id}' from Trae");
        }
    }

    if !errors.is_empty() {
        log::warn!("Import completed with {} failures: {:?}", errors.len(), errors);
    }

    Ok(changed)
}