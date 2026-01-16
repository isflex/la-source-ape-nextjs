/**
 * @flexiness/copilotkit-mcp-server
 *
 * MCP server for automated CopilotKit integration in React components.
 *
 * This package provides tools for Claude Code to:
 * - Analyze React components for CopilotKit integration opportunities
 * - Inject useCopilotReadable hooks into components
 * - Validate CopilotKit integration
 * - Generate integration coverage reports
 *
 * @example
 * ```json
 * // .claude/settings.json
 * {
 *   "mcpServers": {
 *     "copilotkit-integration": {
 *       "command": "node",
 *       "args": ["./packages/flex/copilotkit-mcp-server/dist/cli.js"]
 *     }
 *   }
 * }
 * ```
 */

// Server
export { createServer, startServer } from './server';

// Tools
export {
  toolDefinitions,
  handleToolCall,
  handleAnalyzeComponent,
  handleInjectReadable,
  handleValidateIntegration,
  handleGetIntegrationReport,
  handleSuggestActions,
} from './tools';

// Analyzer
export { analyzeComponent } from './analyzer';

// Types
export type {
  ComponentAnalysis,
  StateVariable,
  PropDefinition,
  ApiCall,
  ExistingReadable,
  IntegrationRecommendation,
  ReadableDefinition,
  IntegrationReport,
  ComponentSummary,
  QuickWin,
  AnalyzeComponentInput,
  InjectReadableInput,
  ValidateIntegrationInput,
  GetIntegrationReportInput,
} from './types';
