/**
 * Type definitions for CopilotKit MCP Server
 */

/**
 * Analysis result for a React component
 */
export interface ComponentAnalysis {
  /** Component name */
  componentName: string;
  /** File path */
  filePath: string;
  /** Whether the component is a client component */
  isClientComponent: boolean;
  /** Whether the component already has CopilotKit integration */
  hasCopilotKitIntegration: boolean;
  /** Whether the component uses deprecated v1 patterns that need migration */
  needsV2Migration: boolean;
  /** State variables found in the component */
  stateVariables: StateVariable[];
  /** Props found in the component */
  props: PropDefinition[];
  /** API calls found in the component */
  apiCalls: ApiCall[];
  /** Existing CopilotKit hooks */
  existingReadables: ExistingReadable[];
  /** Recommendations for CopilotKit integration */
  recommendations: IntegrationRecommendation[];
  /** Migration recommendations for v1 to v2 patterns */
  migrations: MigrationRecommendation[];
}

/**
 * State variable found in a component
 */
export interface StateVariable {
  /** Variable name */
  name: string;
  /** Initial value (if determinable) */
  initialValue?: string;
  /** Line number where declared */
  line: number;
  /** Whether it's likely to be useful for AI context */
  isAIRelevant: boolean;
  /** Suggested description for useCopilotReadable */
  suggestedDescription?: string;
}

/**
 * Prop definition found in a component
 */
export interface PropDefinition {
  /** Prop name */
  name: string;
  /** Prop type (if TypeScript) */
  type?: string;
  /** Whether it's a required prop */
  required: boolean;
  /** Line number */
  line: number;
  /** Whether it represents user context */
  isUserContext: boolean;
}

/**
 * API call found in a component
 */
export interface ApiCall {
  /** Function/method being called */
  method: string;
  /** Endpoint or resource (if determinable) */
  endpoint?: string;
  /** Line number */
  line: number;
  /** Variable storing the result */
  resultVariable?: string;
}

/**
 * Existing CopilotKit readable hook
 */
export interface ExistingReadable {
  /** Hook type (useCopilotReadable, useReadableState, useSafeAgentContext, etc.) */
  hookType: string;
  /** Component type for v2 bridge components */
  componentType?: 'StoreContextBridge' | 'AuthContextBridge';
  /** Description provided */
  description?: string;
  /** Value being exposed */
  value?: string;
  /** Line number */
  line: number;
  /** Whether this is a v2 pattern */
  isV2?: boolean;
}

/**
 * Recommendation for CopilotKit integration
 */
export interface IntegrationRecommendation {
  /** Type of integration recommended (v2 patterns) */
  type:
    | 'useSafeAgentContext'      // v2: for state and API data
    | 'useSafeFrontendTool'     // v2: for actions/tools
    | 'AuthContextBridge'       // v2: for user auth context
    | 'StoreContextBridge';     // v2: for MobX store sync
  /** Target variable/prop name */
  target: string;
  /** Suggested description */
  description: string;
  /** Priority (1 = highest) */
  priority: 1 | 2 | 3;
  /** Reason for recommendation */
  reason: string;
  /** Code snippet to add */
  codeSnippet: string;
  /** Line number where to insert */
  insertAfterLine: number;
}

/**
 * Migration recommendation for v1 to v2 patterns
 */
export interface MigrationRecommendation {
  /** The deprecated v1 hook/pattern being used */
  fromPattern: 'useCopilotReadable' | 'useCopilotAction' | 'useReadableState' | 'useReadableUser' | 'useReadableApi' | 'useReadableStore';
  /** The v2 pattern to migrate to */
  toPattern: 'useSafeAgentContext' | 'useSafeFrontendTool' | 'AuthContextBridge' | 'StoreContextBridge';
  /** Line number of the deprecated usage */
  line: number;
  /** Migration description */
  description: string;
  /** Code snippet showing the migration */
  codeSnippet: string;
  /** Import changes needed */
  importChanges: {
    remove: string[];
    add: string[];
  };
}

/**
 * Readable definition for injection
 */
export interface ReadableDefinition {
  /** Variable/expression name */
  name: string;
  /** Description for the AI */
  description: string;
  /** Value expression (e.g., 'userData', 'items.length') */
  valueExpression: string;
  /** Pattern type for v2 patterns */
  patternType?: 'useSafeAgentContext' | 'useSafeFrontendTool' | 'AuthContextBridge' | 'StoreContextBridge';
  /** Categories for organization */
  categories?: string[];
}

/**
 * Integration report for a project
 */
export interface IntegrationReport {
  /** Total components analyzed */
  totalComponents: number;
  /** Components with full v2 integration */
  fullyIntegrated: ComponentSummary[];
  /** Components with partial integration */
  partiallyIntegrated: ComponentSummary[];
  /** Components using deprecated v1 patterns that need migration */
  needsMigration: ComponentSummary[];
  /** Components without integration */
  notIntegrated: ComponentSummary[];
  /** Components not applicable (presentational only) */
  notApplicable: ComponentSummary[];
  /** Overall coverage percentage (v2 only) */
  coveragePercentage: number;
  /** Quick wins (easy integrations) */
  quickWins: QuickWin[];
}

/**
 * Summary of a component's integration status
 */
export interface ComponentSummary {
  /** Component name */
  name: string;
  /** File path */
  filePath: string;
  /** Number of state variables */
  stateCount: number;
  /** Number of existing readables */
  readableCount: number;
  /** Integration score (0-100) */
  score: number;
  /** Whether this component needs v1 to v2 migration */
  needsMigration?: boolean;
  /** Number of v1 patterns to migrate */
  migrationCount?: number;
}

/**
 * Quick win recommendation
 */
export interface QuickWin {
  /** Component file path */
  filePath: string;
  /** Component name */
  componentName: string;
  /** What to integrate */
  target: string;
  /** Effort level */
  effort: 'low' | 'medium';
  /** Impact level */
  impact: 'high' | 'medium' | 'low';
  /** Description */
  description: string;
}

/**
 * Tool input for analyze_component
 */
export interface AnalyzeComponentInput {
  /** Path to the component file */
  filePath: string;
  /** Analysis depth */
  analysisDepth?: 'shallow' | 'deep';
}

/**
 * Tool input for inject_readable
 */
export interface InjectReadableInput {
  /** Path to the component file */
  filePath: string;
  /** Readables to inject */
  readables: ReadableDefinition[];
  /** Whether to only preview changes */
  dryRun?: boolean;
}

/**
 * Tool input for validate_integration
 */
export interface ValidateIntegrationInput {
  /** Path to the component file */
  filePath: string;
}

/**
 * Tool input for get_integration_report
 */
export interface GetIntegrationReportInput {
  /** Directory to analyze */
  directory: string;
  /** File pattern to match */
  pattern?: string;
}
