/**
 * Component Analyzer
 *
 * Analyzes React components using TypeScript AST to identify
 * opportunities for CopilotKit integration.
 */

import { parse, AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/typescript-estree';
import { readFile } from 'fs/promises';
import type {
  ComponentAnalysis,
  StateVariable,
  PropDefinition,
  ApiCall,
  ExistingReadable,
  IntegrationRecommendation,
} from '../types';

type ASTNode = TSESTree.Node;

/**
 * Analyze a React component file for CopilotKit integration opportunities
 */
export async function analyzeComponent(
  filePath: string,
  _analysisDepth: 'shallow' | 'deep' = 'shallow' // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<ComponentAnalysis> {
  // Read the file
  const sourceCode = await readFile(filePath, 'utf-8');

  // Parse the AST
  const ast = parse(sourceCode, {
    jsx: true,
    loc: true,
    range: true,
    comment: true,
  });

  // Initialize analysis result
  const analysis: ComponentAnalysis = {
    componentName: extractComponentName(filePath, ast),
    filePath,
    isClientComponent: hasUseClientDirective(sourceCode),
    hasCopilotKitIntegration: hasCopilotKitImports(sourceCode),
    stateVariables: [],
    props: [],
    apiCalls: [],
    existingReadables: [],
    recommendations: [],
  };

  // Walk the AST to find relevant patterns
  walkAST(ast, {
    onUseState: (name, initialValue, line) => {
      const stateVar: StateVariable = {
        name,
        initialValue,
        line,
        isAIRelevant: isAIRelevantState(name, initialValue),
        suggestedDescription: generateStateDescription(name),
      };
      analysis.stateVariables.push(stateVar);
    },
    onProps: (props) => {
      analysis.props = props;
    },
    onApiCall: (call) => {
      analysis.apiCalls.push(call);
    },
    onCopilotHook: (readable) => {
      analysis.existingReadables.push(readable);
    },
  });

  // Generate recommendations
  analysis.recommendations = generateRecommendations(analysis);

  return analysis;
}

/**
 * Extract component name from file path and AST
 */
function extractComponentName(filePath: string, ast: TSESTree.Program): string {
  // Try to find export default function/const
  for (const node of ast.body) {
    if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
      if (node.declaration.type === AST_NODE_TYPES.FunctionDeclaration && node.declaration.id) {
        return node.declaration.id.name;
      }
      if (node.declaration.type === AST_NODE_TYPES.Identifier) {
        return node.declaration.name;
      }
    }
    if (node.type === AST_NODE_TYPES.ExportNamedDeclaration && node.declaration) {
      if (node.declaration.type === AST_NODE_TYPES.FunctionDeclaration && node.declaration.id) {
        return node.declaration.id.name;
      }
    }
  }

  // Fallback to file name
  const fileName = filePath.split('/').pop() || 'Unknown';
  return fileName.replace(/\.(tsx?|jsx?)$/, '');
}

/**
 * Check if file has 'use client' directive
 */
function hasUseClientDirective(sourceCode: string): boolean {
  const firstLine = sourceCode.trim().split('\n')[0];
  return firstLine.includes("'use client'") || firstLine.includes('"use client"');
}

/**
 * Check if file has CopilotKit imports
 */
function hasCopilotKitImports(sourceCode: string): boolean {
  return (
    sourceCode.includes('@copilotkit/react-core') ||
    sourceCode.includes('@flexiness/copilotkit') ||
    sourceCode.includes('useCopilotReadable') ||
    sourceCode.includes('useReadableState')
  );
}

/**
 * Walk the AST and call handlers for relevant nodes
 */
interface ASTWalkerHandlers {
  onUseState: (name: string, initialValue: string | undefined, line: number) => void;
  onProps: (props: PropDefinition[]) => void;
  onApiCall: (call: ApiCall) => void;
  onCopilotHook: (readable: ExistingReadable) => void;
}

function walkAST(ast: TSESTree.Program, handlers: ASTWalkerHandlers): void {
  const props: PropDefinition[] = [];

  function visit(node: ASTNode | null | undefined): void {
    if (!node || typeof node !== 'object') return;

    // Check for useState calls
    if (isUseStateCall(node)) {
      const { name, initialValue, line } = extractUseStateInfo(node);
      if (name) {
        handlers.onUseState(name, initialValue, line);
      }
    }

    // Check for function component props
    if (isFunctionComponent(node)) {
      const componentProps = extractComponentProps(node);
      props.push(...componentProps);
    }

    // Check for fetch/API calls
    if (isApiCall(node)) {
      const apiCall = extractApiCallInfo(node);
      if (apiCall) {
        handlers.onApiCall(apiCall);
      }
    }

    // Check for existing CopilotKit hooks
    if (isCopilotHook(node)) {
      const readable = extractCopilotHookInfo(node);
      if (readable) {
        handlers.onCopilotHook(readable);
      }
    }

    // Recursively visit children
    for (const key of Object.keys(node)) {
      if (key === 'parent') continue; // Skip parent references
      const child = (node as unknown as Record<string, unknown>)[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object' && 'type' in item) {
            visit(item as ASTNode);
          }
        }
      } else if (child && typeof child === 'object' && 'type' in child) {
        visit(child as ASTNode);
      }
    }
  }

  for (const node of ast.body) {
    visit(node);
  }

  handlers.onProps(props);
}

/**
 * Check if node is a useState call
 */
function isUseStateCall(node: ASTNode): node is TSESTree.CallExpression {
  return (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.Identifier &&
    node.callee.name === 'useState'
  );
}

/**
 * Extract useState information
 */
function extractUseStateInfo(
  node: TSESTree.CallExpression
): { name: string | undefined; initialValue: string | undefined; line: number } {
  const line = node.loc?.start.line ?? 0;

  // Try to find the variable declaration
  // useState is typically: const [name, setName] = useState(...)
  // We need to look at the parent VariableDeclarator
  return {
    name: undefined, // Would need parent context
    initialValue: undefined,
    line,
  };
}

/**
 * Check if node is a function component
 */
function isFunctionComponent(node: ASTNode): node is TSESTree.FunctionDeclaration | TSESTree.ArrowFunctionExpression {
  return (
    (node.type === AST_NODE_TYPES.FunctionDeclaration || node.type === AST_NODE_TYPES.ArrowFunctionExpression) &&
    node.params.length > 0
  );
}

/**
 * Extract component props
 */
function extractComponentProps(node: TSESTree.FunctionDeclaration | TSESTree.ArrowFunctionExpression): PropDefinition[] {
  const props: PropDefinition[] = [];

  if (node.params.length > 0) {
    const firstParam = node.params[0];

    // Destructured props: function Component({ prop1, prop2 })
    if (firstParam.type === AST_NODE_TYPES.ObjectPattern) {
      for (const prop of firstParam.properties) {
        if (prop.type === AST_NODE_TYPES.Property && prop.key.type === AST_NODE_TYPES.Identifier) {
          props.push({
            name: prop.key.name,
            required: true, // Simplified - would need type info
            line: prop.loc?.start.line ?? 0,
            isUserContext: isUserContextProp(prop.key.name),
          });
        }
      }
    }

    // Named props: function Component(props)
    if (firstParam.type === AST_NODE_TYPES.Identifier) {
      props.push({
        name: firstParam.name,
        required: true,
        line: firstParam.loc?.start.line ?? 0,
        isUserContext: firstParam.name.toLowerCase().includes('user'),
      });
    }
  }

  return props;
}

/**
 * Check if prop name suggests user context
 */
function isUserContextProp(name: string): boolean {
  const userPatterns = ['user', 'auth', 'session', 'profile', 'account', 'identity'];
  const lowerName = name.toLowerCase();
  return userPatterns.some((pattern) => lowerName.includes(pattern));
}

/**
 * Check if node is an API call
 */
function isApiCall(node: ASTNode): node is TSESTree.CallExpression {
  if (node.type !== AST_NODE_TYPES.CallExpression) return false;

  const {callee} = node;

  // Check for fetch()
  if (callee.type === AST_NODE_TYPES.Identifier && callee.name === 'fetch') {
    return true;
  }

  // Check for axios.get(), api.get(), etc.
  if (callee.type === AST_NODE_TYPES.MemberExpression) {
    const {object} = callee;
    const {property} = callee;

    if (object.type === AST_NODE_TYPES.Identifier && property.type === AST_NODE_TYPES.Identifier) {
      const objectName = object.name.toLowerCase();
      const methodName = property.name.toLowerCase();

      if (
        (objectName === 'axios' || objectName === 'api' || objectName === 'client') &&
        ['get', 'post', 'put', 'delete', 'patch'].includes(methodName)
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extract API call information
 */
function extractApiCallInfo(node: TSESTree.CallExpression): ApiCall | null {
  const {callee} = node;

  let method = 'unknown';
  let endpoint: string | undefined;

  if (callee.type === AST_NODE_TYPES.Identifier) {
    method = callee.name;
  } else if (callee.type === AST_NODE_TYPES.MemberExpression && callee.property.type === AST_NODE_TYPES.Identifier) {
    method = callee.property.name;
  }

  // Try to extract endpoint from first argument
  if (node.arguments[0]) {
    const firstArg = node.arguments[0];
    if (firstArg.type === AST_NODE_TYPES.Literal && typeof firstArg.value === 'string') {
      endpoint = firstArg.value;
    }
    if (firstArg.type === AST_NODE_TYPES.TemplateLiteral && firstArg.quasis[0]) {
      endpoint = firstArg.quasis[0].value.raw;
    }
  }

  return {
    method,
    endpoint,
    line: node.loc?.start.line ?? 0,
  };
}

/**
 * Check if node is a CopilotKit hook call
 */
function isCopilotHook(node: ASTNode): node is TSESTree.CallExpression {
  if (node.type !== AST_NODE_TYPES.CallExpression) return false;

  const {callee} = node;
  if (callee.type !== AST_NODE_TYPES.Identifier) return false;

  const copilotHooks = [
    'useCopilotReadable',
    'useCopilotAction',
    'useReadableState',
    'useReadableUser',
    'useReadableApi',
    'useReadableStore',
  ];

  return copilotHooks.includes(callee.name);
}

/**
 * Extract CopilotKit hook information
 */
function extractCopilotHookInfo(node: TSESTree.CallExpression): ExistingReadable | null {
  const {callee} = node;
  if (callee.type !== AST_NODE_TYPES.Identifier) return null;

  return {
    hookType: callee.name,
    line: node.loc?.start.line ?? 0,
  };
}

/**
 * Check if state variable is AI-relevant
 */
function isAIRelevantState(name: string, initialValue?: string): boolean {
  // Ignore internal state like loading, error flags
  const ignorePatterns = ['loading', 'isLoading', 'error', 'isError', 'isOpen', 'isVisible'];
  if (ignorePatterns.some((p) => name.toLowerCase().includes(p.toLowerCase()))) {
    return false;
  }

  // Empty arrays/objects are usually for data
  if (initialValue === '[]' || initialValue === '{}') {
    return true;
  }

  // Names suggesting data
  const dataPatterns = ['data', 'items', 'list', 'results', 'user', 'form', 'selected', 'current'];
  return dataPatterns.some((p) => name.toLowerCase().includes(p.toLowerCase()));
}

/**
 * Generate description for state variable
 */
function generateStateDescription(name: string): string {
  // Convert camelCase to words
  const words = name.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
  return `Current ${words} in the component`;
}

/**
 * Generate integration recommendations
 */
function generateRecommendations(analysis: ComponentAnalysis): IntegrationRecommendation[] {
  const recommendations: IntegrationRecommendation[] = [];

  // Skip if not a client component (hooks require 'use client')
  if (!analysis.isClientComponent) {
    return recommendations;
  }

  // Recommend useReadableState for AI-relevant state
  for (const state of analysis.stateVariables) {
    if (state.isAIRelevant && !hasExistingReadable(analysis, state.name)) {
      recommendations.push({
        type: 'useReadableState',
        target: state.name,
        description: state.suggestedDescription || `Current ${state.name}`,
        priority: 2,
        reason: `State variable '${state.name}' contains data that could provide useful context to the AI assistant`,
        codeSnippet: `useReadableState('${state.name}', ${state.name}, {\n  description: '${state.suggestedDescription || `Current ${state.name}`}',\n});`,
        insertAfterLine: state.line,
      });
    }
  }

  // Recommend useReadableUser for user-related props
  for (const prop of analysis.props) {
    if (prop.isUserContext && !hasExistingReadable(analysis, prop.name)) {
      recommendations.push({
        type: 'useReadableUser',
        target: prop.name,
        description: `User context from ${prop.name} prop`,
        priority: 1,
        reason: `Prop '${prop.name}' appears to contain user context that would help personalize AI responses`,
        codeSnippet: `useReadableUser(${prop.name});`,
        insertAfterLine: prop.line + 1,
      });
    }
  }

  // Recommend useReadableApi for API responses
  for (const api of analysis.apiCalls) {
    if (api.resultVariable && !hasExistingReadable(analysis, api.resultVariable)) {
      recommendations.push({
        type: 'useReadableApi',
        target: api.resultVariable,
        description: `API response from ${api.endpoint || api.method}`,
        priority: 2,
        reason: `API call result '${api.resultVariable}' could provide real-time data context to the AI`,
        codeSnippet: `useReadableApi('${api.resultVariable}', ${api.resultVariable}, {\n  description: 'Data from ${api.endpoint || 'API call'}',\n  loading: isLoading,\n});`,
        insertAfterLine: api.line + 1,
      });
    }
  }

  // Sort by priority
  recommendations.sort((a, b) => a.priority - b.priority);

  return recommendations;
}

/**
 * Check if a readable already exists for a variable
 */
function hasExistingReadable(analysis: ComponentAnalysis, variableName: string): boolean {
  return analysis.existingReadables.some(
    (r) => r.value?.includes(variableName) || r.description?.includes(variableName)
  );
}

export default analyzeComponent;
