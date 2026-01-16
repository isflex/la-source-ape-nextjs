/**
 * MCP Tool Definitions
 *
 * Standard tool definitions for MCP Bridge integration.
 */

import type { ActionDefinition } from '../types';
import { createAction, param } from '../actions/createAction';
import { MCPBridgeClient } from './bridge-client';

/**
 * Create MCP Bridge actions for CopilotKit
 *
 * These actions delegate to the MCP Bridge server for execution.
 */
export function createMCPBridgeActions(client: MCPBridgeClient): ActionDefinition[] {
  return [
    // Authentication actions
    createAction({
      name: 'mcp_auth_status',
      description: 'Check the current authentication status',
      parameters: [],
      handler: async () => {
        const result = await client.callTool('auth_status', {});
        return result.success ? result.data : { error: result.error };
      },
    }),

    // General query action
    createAction({
      name: 'mcp_query',
      description: 'Send a query to the MCP Bridge for processing by specialized tools',
      parameters: [
        param('query', 'string', { required: true, description: 'The query to process' }),
        param('context', 'object', { description: 'Additional context for the query' }),
      ],
      handler: async ({ query, context }) => {
        const result = await client.callTool('copilot_query', {
          query: query as string,
          context: context as Record<string, unknown>,
        });
        return result.success ? result.data : { error: result.error };
      },
    }),

    // GraphQL actions
    createAction({
      name: 'mcp_graphql_query',
      description: 'Execute a GraphQL query via MCP Bridge',
      parameters: [
        param('operation', 'string', { required: true, description: 'GraphQL operation name' }),
        param('variables', 'object', { description: 'GraphQL variables' }),
      ],
      handler: async ({ operation, variables }) => {
        const result = await client.callTool(`graphql_${operation}`, {
          ...(variables as Record<string, unknown>),
        });
        return result.success ? result.data : { error: result.error };
      },
    }),

    // UI interaction action
    createAction({
      name: 'mcp_ui_interact',
      description: 'Interact with UI elements via MCP Bridge',
      parameters: [
        param('action_type', 'string', {
          required: true,
          description: 'Type of interaction: click, type, navigate, scroll, screenshot, extract, wait',
        }),
        param('selector', 'string', { description: 'CSS selector for the element' }),
        param('value', 'string', { description: 'Value for type actions' }),
        param('url', 'string', { description: 'URL for navigate actions' }),
      ],
      handler: async (args) => {
        const result = await client.callTool('ui_interact', args as Record<string, unknown>);
        return result.success ? result.data : { error: result.error };
      },
    }),
  ];
}

export default createMCPBridgeActions;
