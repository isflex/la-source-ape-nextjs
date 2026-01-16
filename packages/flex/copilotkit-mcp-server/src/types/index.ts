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
  /** Hook type (useCopilotReadable, useReadableState, etc.) */
  hookType: string;
  /** Description provided */
  description?: string;
  /** Value being exposed */
  value?: string;
  /** Line number */
  line: number;
}

/**
 * Recommendation for CopilotKit integration
 */
export interface IntegrationRecommendation {
  /** Type of integration recommended */
  type: 'useReadableState' | 'useReadableUser' | 'useReadableApi' | 'useReadableStore' | 'useCopilotAction';
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
 * Readable definition for injection
 */
export interface ReadableDefinition {
  /** Variable/expression name */
  name: string;
  /** Description for the AI */
  description: string;
  /** Value expression (e.g., 'userData', 'items.length') */
  valueExpression: string;
  /** Categories for organization */
  categories?: string[];
}

/**
 * Integration report for a project
 */
export interface IntegrationReport {
  /** Total components analyzed */
  totalComponents: number;
  /** Components with full integration */
  fullyIntegrated: ComponentSummary[];
  /** Components with partial integration */
  partiallyIntegrated: ComponentSummary[];
  /** Components without integration */
  notIntegrated: ComponentSummary[];
  /** Components not applicable (presentational only) */
  notApplicable: ComponentSummary[];
  /** Overall coverage percentage */
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
