/**
 * MCP Tools for CopilotKit Integration
 *
 * These tools are exposed via MCP for Claude Code to use
 * when analyzing and integrating CopilotKit into React components.
 */

import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { analyzeComponent } from '../analyzer/index.js';
import type {
  AnalyzeComponentInput,
  InjectReadableInput,
  ValidateIntegrationInput,
  GetIntegrationReportInput,
  ComponentAnalysis,
  IntegrationReport,
  ComponentSummary,
  QuickWin, // eslint-disable-line @typescript-eslint/no-unused-vars
} from '../types';

/**
 * Tool definitions for MCP
 */
export const toolDefinitions = [
  {
    name: 'analyze_component',
    description:
      'Analyze a React component file to identify state, props, and API data that should be exposed via CopilotKit v2 patterns (useSafeAgentContext, useSafeFrontendTool, or context bridges). Also detects deprecated v1 hooks (useCopilotReadable, useCopilotAction) and generates migration recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the component file',
        },
        analysisDepth: {
          type: 'string',
          enum: ['shallow', 'deep'],
          description: 'shallow: only this file, deep: include imports (default: shallow)',
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'inject_readable',
    description: 'Inject CopilotKit v2 patterns (useSafeAgentContext, AuthContextBridge, StoreContextBridge) into a component',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the component file',
        },
        readables: {
          type: 'array',
          description: 'List of readables to inject',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Variable name to expose' },
              description: { type: 'string', description: 'Description for the AI' },
              valueExpression: { type: 'string', description: 'Value expression to use' },
              categories: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional categories for organization',
              },
            },
            required: ['name', 'description', 'valueExpression'],
          },
        },
        dryRun: {
          type: 'boolean',
          description: 'If true, only preview changes without modifying the file (default: true)',
        },
      },
      required: ['filePath', 'readables'],
    },
  },
  {
    name: 'validate_integration',
    description: 'Validate that a component properly integrates CopilotKit v2 patterns. Detects deprecated v1 hooks and generates specific migration instructions with code snippets.',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the component file',
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'get_integration_report',
    description: 'Generate a report of CopilotKit v2 integration coverage across a directory. Identifies components using deprecated v1 patterns that need migration, components with full v2 integration, and components not yet integrated.',
    inputSchema: {
      type: 'object',
      properties: {
        directory: {
          type: 'string',
          description: 'Directory to analyze (e.g., apps/gateway/src/components)',
        },
        pattern: {
          type: 'string',
          description: 'Glob pattern to match files (default: **/*.tsx)',
        },
      },
      required: ['directory'],
    },
  },
  {
    name: 'suggest_actions',
    description: 'Suggest CopilotKit v2 frontend tools (useSafeFrontendTool) based on component functionality. Also detects v1 useCopilotAction hooks that should be migrated to useSafeFrontendTool.',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the component file',
        },
      },
      required: ['filePath'],
    },
  },
];

/**
 * Handle analyze_component tool call
 */
export async function handleAnalyzeComponent(input: AnalyzeComponentInput): Promise<ComponentAnalysis> {
  const { filePath, analysisDepth = 'shallow' } = input;

  try {
    const analysis = await analyzeComponent(filePath, analysisDepth);
    return analysis;
  } catch (error) {
    throw new Error(
      `Failed to analyze component: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Handle inject_readable tool call (v2 patterns)
 */
export async function handleInjectReadable(
  input: InjectReadableInput
): Promise<{ success: boolean; preview?: string; changes?: string[] }> {
  const { filePath, readables, dryRun = true } = input;

  try {
    // Read the current file
    const sourceCode = await readFile(filePath, 'utf-8');
    const lines = sourceCode.split('\n');

    // Check if 'use client' directive exists
    const hasUseClient =
      lines[0].includes("'use client'") || lines[0].includes('"use client"');

    // Check for existing @flexiness/copilotkit import
    const hasFlexinessImport = sourceCode.includes('@flexiness/copilotkit');

    // Build the changes
    const changes: string[] = [];

    // Determine what imports are needed based on pattern types
    const needsUseAgentContext = readables.some(
      r => !r.patternType || r.patternType === 'useSafeAgentContext'
    );
    const needsBridges = readables.some(
      r => r.patternType === 'AuthContextBridge' || r.patternType === 'StoreContextBridge'
    );

    // Find the last import line
    let lastImportLine = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportLine = i;
      }
    }

    // Add @flexiness/copilotkit import if needed for useSafeAgentContext and/or bridges
    if ((needsUseAgentContext || needsBridges) && !hasFlexinessImport) {
      const importNames: string[] = [];
      if (needsUseAgentContext) {
        importNames.push('useSafeAgentContext');
      }
      if (readables.some(r => r.patternType === 'AuthContextBridge')) {
        importNames.push('AuthContextBridge');
      }
      if (readables.some(r => r.patternType === 'StoreContextBridge')) {
        importNames.push('StoreContextBridge');
      }
      const importStatement = `import { ${importNames.join(', ')} } from '@flexiness/copilotkit';`;
      lines.splice(lastImportLine + 1, 0, importStatement);
      lastImportLine++;
      changes.push(`Added import for ${importNames.join(', ')} from @flexiness/copilotkit`);
    }

    // Add use client if needed
    if (!hasUseClient && readables.length > 0) {
      lines.unshift("'use client';");
      changes.push("Added 'use client' directive");
    }

    // Generate hook calls (v2 pattern: useSafeAgentContext)
    const hookCalls: string[] = [];
    for (const readable of readables) {
      // Only generate hook calls for useSafeAgentContext pattern (not bridges)
      if (!readable.patternType || readable.patternType === 'useSafeAgentContext') {
        const hookCall = `  useSafeAgentContext({
    description: '${readable.description}',
    value: ${readable.valueExpression},
  });`;
        hookCalls.push(hookCall);
        changes.push(`Added useSafeAgentContext for '${readable.name}'`);
      } else if (readable.patternType === 'AuthContextBridge') {
        changes.push(`Note: AuthContextBridge for '${readable.name}' should wrap component children manually`);
      } else if (readable.patternType === 'StoreContextBridge') {
        changes.push(`Note: StoreContextBridge for '${readable.name}' should wrap component children manually`);
      }
    }

    let modifiedCode = lines.join('\n');

    // Find the component function body to insert hooks
    // This is simplified - a full implementation would use AST
    if (hookCalls.length > 0) {
      const componentBodyRegex = /(?:function|const)\s+\w+\s*(?:<[^>]*>)?\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*{/;
      const match = modifiedCode.match(componentBodyRegex);
      if (match && match.index !== undefined) {
        const insertPosition = match.index + match[0].length;
        const beforeInsert = modifiedCode.substring(0, insertPosition);
        const afterInsert = modifiedCode.substring(insertPosition);
        modifiedCode = `${beforeInsert}\n${hookCalls.join('\n\n')}${afterInsert}`;
      }
    }

    if (dryRun) {
      return {
        success: true,
        preview: modifiedCode,
        changes,
      };
    }

    // Write the modified file
    await writeFile(filePath, modifiedCode, 'utf-8');

    return {
      success: true,
      changes,
    };
  } catch (error) {
    throw new Error(
      `Failed to inject readables: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Handle validate_integration tool call
 */
export async function handleValidateIntegration(
  input: ValidateIntegrationInput
): Promise<{
  valid: boolean;
  isV2Compliant: boolean;
  issues: string[];
  suggestions: string[];
  migrations: Array<{
    fromPattern: string;
    toPattern: string;
    line: number;
    description: string;
    codeSnippet: string;
    importChanges: { remove: string[]; add: string[] };
  }>;
}> {
  const { filePath } = input;

  try {
    const analysis = await analyzeComponent(filePath);
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for 'use client' directive if hooks are used
    if (analysis.existingReadables.length > 0 && !analysis.isClientComponent) {
      issues.push("Component uses CopilotKit hooks but missing 'use client' directive");
    }

    // Check for deprecated v1 import sources
    const v1Hooks = analysis.existingReadables.filter((r) => !r.isV2);
    if (v1Hooks.length > 0) {
      issues.push(
        `Component uses ${v1Hooks.length} deprecated v1 hook(s): ${v1Hooks.map((h) => h.hookType).join(', ')}. ` +
        `These must be migrated to v2 patterns.`
      );
    }

    // Check for direct @copilotkit/react-core imports (deprecated)
    if (analysis.hasCopilotKitIntegration && !analysis.existingReadables.some((r) => r.isV2)) {
      issues.push(
        'Component imports from @copilotkit/react-core which is deprecated. ' +
        'Use @flexiness/copilotkit (useSafeAgentContext, useSafeFrontendTool) or @copilotkitnext/react (useAgent) instead.'
      );
    }

    // Check for state without v2 readables
    const unexposedState = analysis.stateVariables.filter(
      (s) => s.isAIRelevant && !analysis.existingReadables.some((r) => r.isV2 && (r.value?.includes(s.name) || r.description?.includes(s.name)))
    );
    if (unexposedState.length > 0) {
      suggestions.push(
        `Consider exposing these state variables with useSafeAgentContext: ${unexposedState.map((s) => s.name).join(', ')}`
      );
    }

    // Check for user props without AuthContextBridge (v2 bridge only)
    const userProps = analysis.props.filter((p) => p.isUserContext);
    const hasUserBridge = analysis.existingReadables.some(
      (r) => r.isV2 && r.componentType === 'AuthContextBridge'
    );
    if (userProps.length > 0 && !hasUserBridge) {
      suggestions.push(
        `Consider wrapping with AuthContextBridge for user context props: ${userProps.map((p) => p.name).join(', ')}`
      );
    }

    const isV2Compliant = v1Hooks.length === 0 && issues.length === 0;

    return {
      valid: issues.length === 0,
      isV2Compliant,
      issues,
      suggestions,
      migrations: analysis.migrations,
    };
  } catch (error) {
    throw new Error(
      `Failed to validate integration: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Handle get_integration_report tool call
 */
export async function handleGetIntegrationReport(
  input: GetIntegrationReportInput
): Promise<IntegrationReport> {
  const { directory, pattern = '**/*.tsx' } = input;

  try {
    // Find all matching files
    const files = await glob(pattern, {
      cwd: directory,
      absolute: true,
      ignore: ['**/node_modules/**', '**/*.test.tsx', '**/*.spec.tsx'],
    });

    const report: IntegrationReport = {
      totalComponents: 0,
      fullyIntegrated: [],
      partiallyIntegrated: [],
      needsMigration: [],
      notIntegrated: [],
      notApplicable: [],
      coveragePercentage: 0,
      quickWins: [],
    };

    // Analyze each file
    for (const filePath of files) {
      try {
        const analysis = await analyzeComponent(filePath);

        // Skip non-client components (they can't use hooks)
        if (!analysis.isClientComponent) {
          report.notApplicable.push({
            name: analysis.componentName,
            filePath,
            stateCount: analysis.stateVariables.length,
            readableCount: 0,
            score: 0,
          });
          continue;
        }

        report.totalComponents++;

        const v2Readables = analysis.existingReadables.filter((r) => r.isV2);
        const v1Readables = analysis.existingReadables.filter((r) => !r.isV2);
        const v2Score = calculateIntegrationScore(analysis);

        const summary: ComponentSummary = {
          name: analysis.componentName,
          filePath,
          stateCount: analysis.stateVariables.length,
          readableCount: v2Readables.length,
          score: v2Score,
          needsMigration: v1Readables.length > 0,
          migrationCount: v1Readables.length,
        };

        // Categorize: prioritize migration detection over integration score
        if (v1Readables.length > 0) {
          // Component uses deprecated v1 hooks - needs migration regardless of score
          report.needsMigration.push(summary);

          // Also add as quick win for migration
          report.quickWins.push({
            filePath,
            componentName: analysis.componentName,
            target: v1Readables.map((r) => r.hookType).join(', '),
            effort: v1Readables.length <= 3 ? 'low' : 'medium',
            impact: 'high',
            description: `Migrate ${v1Readables.length} v1 hook(s) to v2: ${v1Readables.map((r) => `${r.hookType} → ${analysis.migrations.find((m) => m.line === r.line)?.toPattern || 'v2'}`).join(', ')}`,
          });
        } else if (v2Score >= 80) {
          report.fullyIntegrated.push(summary);
        } else if (v2Score > 0) {
          report.partiallyIntegrated.push(summary);
        } else if (analysis.stateVariables.some((s) => s.isAIRelevant)) {
          report.notIntegrated.push(summary);

          // Add to quick wins if low effort
          if (analysis.recommendations.length <= 3 && analysis.recommendations.length > 0) {
            report.quickWins.push({
              filePath,
              componentName: analysis.componentName,
              target: analysis.recommendations[0]?.target || 'state',
              effort: analysis.recommendations.length === 1 ? 'low' : 'medium',
              impact: analysis.stateVariables.filter((s) => s.isAIRelevant).length > 2 ? 'high' : 'medium',
              description: `Add ${analysis.recommendations.length} useSafeAgentContext hook(s) to expose component state`,
            });
          }
        } else {
          report.notApplicable.push(summary);
        }
      } catch {
        // Skip files that can't be analyzed
        continue;
      }
    }

    // Calculate coverage (only v2 patterns count as integrated)
    if (report.totalComponents > 0) {
      const integrated = report.fullyIntegrated.length + report.partiallyIntegrated.length * 0.5;
      report.coveragePercentage = Math.round((integrated / report.totalComponents) * 100);
    }

    // Sort quick wins by impact
    report.quickWins.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });

    return report;
  } catch (error) {
    throw new Error(
      `Failed to generate report: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Handle suggest_actions tool call (v2: useFrontendTool patterns)
 */
export async function handleSuggestActions(
  input: { filePath: string }
): Promise<{
  suggestions: Array<{
    name: string;
    description: string;
    reason: string;
    v2Pattern: string;
    codeSnippet: string;
  }>;
  migrations: Array<{
    fromPattern: string;
    toPattern: string;
    line: number;
    description: string;
    codeSnippet: string;
  }>;
}> {
  const { filePath } = input;

  try {
    const analysis = await analyzeComponent(filePath);
    const suggestions: Array<{
      name: string;
      description: string;
      reason: string;
      v2Pattern: string;
      codeSnippet: string;
    }> = [];

    // Check for v1 useCopilotAction that should be migrated to useFrontendTool
    const actionMigrations = analysis.migrations.filter((m) => m.fromPattern === 'useCopilotAction');

    // Suggest useSafeFrontendTool for API calls
    for (const api of analysis.apiCalls) {
      if (api.method.toLowerCase() === 'post' || api.method.toLowerCase() === 'put') {
        const toolName = `submit_${api.endpoint?.replace(/[^a-z0-9]/gi, '_') || 'form'}`;
        suggestions.push({
          name: toolName,
          description: `Submit data to ${api.endpoint || 'API'}`,
          reason: `Found ${api.method.toUpperCase()} call that could be triggered by AI agent`,
          v2Pattern: 'useSafeFrontendTool',
          codeSnippet: `useSafeFrontendTool({\n  name: '${toolName}',\n  description: 'Submit data to ${api.endpoint || 'API'}',\n  parameters: z.object({\n    // define parameters\n  }),\n  handler: async (args) => {\n    // call ${api.endpoint || 'API'}\n  },\n});`,
        });
      }
    }

    // Suggest navigation tools for pages
    if (analysis.filePath.includes('page') || analysis.filePath.includes('layout')) {
      suggestions.push({
        name: 'navigate_to_page',
        description: 'Navigate to a different page in the application',
        reason: 'Component appears to be a page that could benefit from AI-driven navigation',
        v2Pattern: 'useSafeFrontendTool',
        codeSnippet: `useSafeFrontendTool({\n  name: 'navigate_to_page',\n  description: 'Navigate to a different page',\n  parameters: z.object({\n    path: z.string().describe('The path to navigate to'),\n  }),\n  handler: async ({ path }) => {\n    router.push(path);\n  },\n});`,
      });
    }

    // Suggest search tools for list/data components
    const hasListState = analysis.stateVariables.some(
      (s) => s.name.includes('list') || s.name.includes('items') || s.name.includes('data')
    );
    if (hasListState) {
      suggestions.push({
        name: 'search_items',
        description: 'Search through the items/data in this component',
        reason: 'Component contains list data that could be searched via AI agent',
        v2Pattern: 'useSafeFrontendTool',
        codeSnippet: `useSafeFrontendTool({\n  name: 'search_items',\n  description: 'Search items by query',\n  parameters: z.object({\n    query: z.string().describe('Search query'),\n  }),\n  handler: async ({ query }) => {\n    // filter items by query\n  },\n});`,
      });
    }

    return {
      suggestions,
      migrations: actionMigrations,
    };
  } catch (error) {
    throw new Error(
      `Failed to suggest actions: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Calculate integration score for a component.
 * Only v2 patterns count towards the score - v1 hooks score 0.
 */
function calculateIntegrationScore(analysis: ComponentAnalysis): number {
  if (!analysis.isClientComponent) return 0;

  const aiRelevantState = analysis.stateVariables.filter((s) => s.isAIRelevant).length;
  const userProps = analysis.props.filter((p) => p.isUserContext).length;
  const totalTargets = aiRelevantState + userProps;

  if (totalTargets === 0) return 0;

  // Only count v2 patterns as covered
  const v2CoveredTargets = analysis.existingReadables.filter((r) => r.isV2).length;
  return Math.min(100, Math.round((v2CoveredTargets / totalTargets) * 100));
}

/**
 * Handle a tool call by name
 */
export async function handleToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case 'analyze_component':
      return handleAnalyzeComponent(args as unknown as AnalyzeComponentInput);
    case 'inject_readable':
      return handleInjectReadable(args as unknown as InjectReadableInput);
    case 'validate_integration':
      return handleValidateIntegration(args as unknown as ValidateIntegrationInput);
    case 'get_integration_report':
      return handleGetIntegrationReport(args as unknown as GetIntegrationReportInput);
    case 'suggest_actions':
      return handleSuggestActions(args as { filePath: string });
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
