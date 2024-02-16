export const directusUserFields = [
  'id',
  'status',
  'first_name',
  'last_name',
  'email',
  'password',
  'token',
  'last_access',
  'last_page',
  'external_identifier',
  'tfa_secret',
  'auth_data',
  'provider',
  'theme',
  'role',
  'language',
  'avatar',
  'title',
  'description',
  'location',
  'tags',
  'email_notifications',
]

export const directusRoleFields = [
  'id',
  'name',
  'description',
  'icon',
  'enforce_tfa',
  'external_id',
  'ip_whitelist',
  'app_access',
  'admin_access',
]

export const directusFileFields = [
  'id',
  'storage',
  'filename_disk',
  'filename_download',
  'title',
  'type',
  'folder',
  'uploaded_by',
  'uploaded_on',
  'modified_by',
  'modified_on',
  'charset',
  'filesize',
  'width',
  'height',
  'duration',
  'embed',
  'description',
  'location',
  'tags',
  'metadata',
]

export const directusFolderFields = [
  'id',
  'name',
  'parent',
]

export const directusFlowFields = [
  'id',
  'name',
  'icon',
  'color',
  'description',
  'status',
  'trigger',
  'accountability',
  'options',
  'operation',
  'date_created',
  'user_created',
]

export const directusOperationFields = [
  'id',
  'name',
  'key',
  'type',
  'position_x',
  'position_y',
  'options',
  'resolve',
  'reject',
  'flow',
  'date_created',
  'user_created',
]

export const directusDashboardFields = [
  'id',
  'name',
  'icon',
  'note',
  'date_created',
  'user_created',
  'color',
]

export const directusPanelFields = [
  'id',
  'dashboard',
  'name',
  'icon',
  'color',
  'show_header',
  'note',
  'type',
  'position_x',
  'position_y',
  'width',
  'height',
  'options',
  'date_created',
  'user_created',
]

export const directusSettingsFields = [
  'id',
  'project_name',
  'project_url',
  'project_color',
  'project_logo',
  'public_foreground',
  'public_background',
  'public_note',
  'auth_login_attempts',
  'auth_password_policy',
  'storage_asset_transform',
  'storage_asset_presets',
  'custom_css',
  'storage_default_folder',
  'basemaps',
  'mapbox_key',
  'module_bar',
  'project_descriptor',
  'default_language',
  'custom_aspect_ratios',
  'public_favicon',
  'default_appearance',
  'default_theme_light',
  'theme_light_overrides',
  'default_theme_dark',
  'theme_dark_overrides',
]

export const systemFields = {
  directus_dashboards: directusDashboardFields,
  directus_files: directusFileFields,
  directus_flows: directusFlowFields,
  directus_folders: directusFolderFields,
  directus_operations: directusOperationFields,
  directus_panels: directusPanelFields,
  directus_roles: directusRoleFields,
  directus_settings: directusSettingsFields,
  directus_users: directusUserFields,
}