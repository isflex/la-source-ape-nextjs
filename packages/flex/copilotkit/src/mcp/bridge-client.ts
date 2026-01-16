/**
 * MCP Bridge Client
 *
 * Client for communicating with the MCP Bridge server.
 */

import type { MCPBridgeOptions, MCPToolResult } from '../types';

const DEFAULT_OPTIONS: Required<Omit<MCPBridgeOptions, 'host'>> = {
  port: 3000,
  timeout: 15000,
  sessionId: '',
};

/**
 * MCP Bridge Client for connecting to the MCP Bridge server
 *
 * @example
 * ```typescript
 * const client = new MCPBridgeClient({
 *   host: 'http://localhost',
 *   port: 3000,
 *   sessionId: 'user-session-123'
 * });
 *
 * const result = await client.callTool('auth_status', { sessionId: 'xxx' });
 * ```
 */
export class MCPBridgeClient {
  private baseUrl: string;

  private timeout: number;

  private sessionId: string;

  constructor(options: MCPBridgeOptions) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    this.baseUrl = `${opts.host}:${opts.port}`;
    this.timeout = opts.timeout;
    this.sessionId = opts.sessionId;
  }

  /**
   * Call an MCP tool
   */
  async callTool(toolName: string, args: Record<string, unknown> = {}): Promise<MCPToolResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: {
              ...args,
              ...(this.sessionId && { sessionId: this.sessionId }),
            },
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error.message || 'Unknown error',
        };
      }

      return {
        success: true,
        data: data.result,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if the MCP Bridge is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get server info
   */
  async getInfo(): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseUrl}/info`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  /**
   * Set the session ID for authenticated requests
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Get the current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
}

/**
 * Create an MCP Bridge client from environment variables
 */
export function createMCPBridgeClientFromEnv(): MCPBridgeClient {
  const host = process.env.FLEX_MCP_BRIDGE_HOST || 'http://localhost';
  const port = parseInt(process.env.FLEX_MCP_BRIDGE_PORT || '3000', 10);

  return new MCPBridgeClient({ host, port });
}

export default MCPBridgeClient;
