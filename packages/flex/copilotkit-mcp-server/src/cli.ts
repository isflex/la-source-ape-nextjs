#!/usr/bin/env node
/**
 * CopilotKit Integration MCP Server CLI
 *
 * Usage:
 *   npx @flexiness/copilotkit-mcp-server
 *   node dist/cli.js
 */

import { startServer } from './server.js';

// Start the server
startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
