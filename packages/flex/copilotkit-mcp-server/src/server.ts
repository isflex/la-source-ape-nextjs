/**
 * CopilotKit Integration MCP Server
 *
 * This MCP server provides tools for Claude Code to automatically
 * analyze React components and integrate CopilotKit patterns.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { toolDefinitions, handleToolCall } from './tools/index.js';

// Type definitions to avoid deep type instantiation issues with MCP SDK
interface ToolRequest {
  params: {
    name: string;
    arguments?: Record<string, unknown>;
  };
}

interface ToolListResponse {
  tools: typeof toolDefinitions;
}

interface ToolCallResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

/**
 * Create and configure the MCP server
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: 'copilotkit-integration',
      version: '0.0.1',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool listing handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (server as any).setRequestHandler(ListToolsRequestSchema, async (): Promise<ToolListResponse> => {
    return {
      tools: toolDefinitions,
    };
  });

  // Register tool execution handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (server as any).setRequestHandler(CallToolRequestSchema, async (request: ToolRequest): Promise<ToolCallResponse> => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleToolCall(name, args as Record<string, unknown>);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: errorMessage }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

/**
 * Start the MCP server with stdio transport
 */
export async function startServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Handle shutdown
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

export default createServer;
