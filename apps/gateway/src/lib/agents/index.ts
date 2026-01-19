/**
 * Agent Factory
 *
 * Provides a unified interface for creating agents based on deployment mode.
 * Supports three modes:
 * - local: In-process TypeScript agent (dev/simple deployments)
 * - lambda: Python agent on AWS Lambda (serverless)
 * - remote: Agent on EC2 or separate server project
 */
import type { AbstractAgent } from '@ag-ui/client';

/**
 * Agent deployment modes
 */
export type AgentMode = 'local' | 'lambda' | 'remote';

/**
 * Get the current agent mode from environment
 */
export function getAgentMode(): AgentMode {
  const mode = process.env.STRANDS_AGENT_MODE || 'local';
  if (mode !== 'local' && mode !== 'lambda' && mode !== 'remote') {
    console.warn(`Unknown STRANDS_AGENT_MODE: ${mode}, defaulting to 'local'`);
    return 'local';
  }
  return mode;
}

/**
 * Create a Strands Agent based on the configured deployment mode
 *
 * @returns An AG-UI compatible agent instance
 */
export async function getStrandsAgent(): Promise<AbstractAgent> {
  const mode = getAgentMode();

  switch (mode) {
    case 'local': {
      // In-process: create a local Strands agent with AG-UI adapter
      const { createLocalAgent } = await import('./local-agent');
      return createLocalAgent();
    }

    case 'lambda': {
      // Lambda: connect to Python Lambda via HTTP using AG-UI HttpAgent
      const { HttpAgent } = await import('@ag-ui/client');
      const url = process.env.STRANDS_LAMBDA_URL;
      if (!url) {
        throw new Error(
          'STRANDS_LAMBDA_URL environment variable is required for lambda mode. ' +
          'Set it to your Lambda API Gateway endpoint (e.g., https://xxxxx.execute-api.eu-west-3.amazonaws.com/prod)'
        );
      }
      return new HttpAgent({
        url,
        agentId: 'ape_assistant',
        description: 'La Source APE Assistant (Lambda)',
      });
    }

    case 'remote': {
      // EC2/Remote: connect to separate server project via HTTP
      const { HttpAgent } = await import('@ag-ui/client');
      const url = process.env.STRANDS_REMOTE_URL;
      if (!url) {
        throw new Error(
          'STRANDS_REMOTE_URL environment variable is required for remote mode. ' +
          'Set it to your remote agent server endpoint (e.g., http://ec2-xx-xx-xx-xx.compute.amazonaws.com:8000)'
        );
      }
      return new HttpAgent({
        url,
        agentId: 'ape_assistant',
        description: 'La Source APE Assistant (Remote)',
      });
    }

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = mode;
      throw new Error(`Unknown agent mode: ${_exhaustive}`);
    }
  }
}

// Re-export types and utilities
export { StrandsAgentAdapter, createLocalAgent } from './local-agent';
export { allTools, navigateTool, searchTool } from './tools';
