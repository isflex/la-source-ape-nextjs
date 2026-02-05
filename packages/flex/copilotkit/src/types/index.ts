/**
 * @flexiness/copilotkit - Type definitions
 */

import type { ReactNode } from 'react';

// Readable options for useCopilotReadable wrappers
export interface ReadableOptions {
  description?: string;
  categories?: string[];
  parentId?: string;
}

// Store readable options for MobX integration
export interface StoreReadableOptions<T = unknown> extends ReadableOptions {
  selector?: (store: T) => unknown;
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

// Sidebar configuration
export interface FlexCopilotSidebarConfig {
  /** Stable thread ID for chat persistence across page reloads */
  threadId?: string;
  defaultOpen?: boolean;
  /** Custom header component for the sidebar */
  header?: ReactNode;
  /** Custom labels for the sidebar - uses v2 CopilotChatLabels keys */
  labels?: {
    modalHeaderTitle?: string;
    chatInputPlaceholder?: string;
    chatDisclaimerText?: string;
    [key: string]: string | undefined;
  };
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
