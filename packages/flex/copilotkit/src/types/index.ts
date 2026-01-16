/**
 * @flexiness/copilotkit - Type definitions
 */

// Readable options for useCopilotReadable wrappers
export interface ReadableOptions {
  description?: string;
  categories?: string[];
  parentId?: string;
}

// Store readable options for MobX integration
export interface StoreReadableOptions extends ReadableOptions {
  selector?: (store: unknown) => unknown;
}

// User context for useReadableUser
export interface UserContext {
  id?: string;
  email?: string;
  name?: string;
  roles?: string[];
  preferences?: Record<string, unknown>;
  [key: string]: unknown;
}

// API response readable options
export interface ApiReadableOptions extends ReadableOptions {
  endpoint?: string;
  method?: string;
}

// Action parameter types
export interface ActionParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  required?: boolean;
  default?: unknown;
}

// Action definition
export interface ActionDefinition {
  name: string;
  description: string;
  parameters: ActionParameter[];
  handler: (args: Record<string, unknown>) => Promise<unknown>;
  render?: (props: ActionRenderProps) => React.ReactNode;
}

// Action render props
export interface ActionRenderProps {
  status: 'pending' | 'executing' | 'complete' | 'error';
  args: Record<string, unknown>;
  result?: unknown;
  error?: Error;
}

// Provider configuration
export interface FlexCopilotProviderConfig {
  runtimeUrl?: string;
  publicApiKey?: string;
  showDevConsole?: boolean;
  chatLabel?: string;
  defaultOpen?: boolean;
  clickOutsideToClose?: boolean;
  instructions?: string;
}

// MCP Bridge client options
export interface MCPBridgeOptions {
  host: string;
  port?: number;
  timeout?: number;
  sessionId?: string;
}

// MCP tool call result
export interface MCPToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}
