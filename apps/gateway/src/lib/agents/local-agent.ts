/**
 * Local Strands Agent with AG-UI Adapter
 *
 * This module creates an in-process Strands Agent using AWS Bedrock
 * and adapts it to the AG-UI protocol for CopilotKit integration.
 */
import { Observable } from 'rxjs';
import { AbstractAgent, type AgentConfig } from '@ag-ui/client';
import {
  type BaseEvent,
  type RunAgentInput,
  EventType,
} from '@ag-ui/core';
import { Agent } from '@strands-agents/sdk';
import { BedrockModel } from '@strands-agents/sdk/bedrock';
import { allTools } from './tools';

/**
 * Configuration for the Strands Agent Adapter
 */
interface StrandsAgentAdapterConfig extends AgentConfig {
  systemPrompt?: string;
  modelId?: string;
  region?: string;
}

/**
 * Adapter that wraps a Strands Agent to work with AG-UI/CopilotKit
 */
export class StrandsAgentAdapter extends AbstractAgent {
  private strandsAgent: Agent;
  private config: StrandsAgentAdapterConfig;

  constructor(config: StrandsAgentAdapterConfig = {}) {
    super({
      agentId: config.agentId ?? 'ape_assistant',
      description: config.description ?? 'La Source APE Assistant',
      threadId: config.threadId,
      initialMessages: config.initialMessages,
      initialState: config.initialState,
      debug: config.debug,
    });

    this.config = config;

    // Create the Bedrock model
    const model = new BedrockModel({
      modelId: config.modelId || process.env.FLEX_AI_LLM_MODEL || 'anthropic.claude-3-haiku-20240307-v1:0',
      region: config.region || process.env.AWS_REGION || 'eu-west-3',
    });

    // Create the Strands Agent
    this.strandsAgent = new Agent({
      model,
      systemPrompt: config.systemPrompt || `Tu es un assistant pour le site La Source APE.
Tu aides les utilisateurs à naviguer sur le site, créer des newsletters,
gérer des cagnottes, et comprendre les fonctionnalités disponibles.
Réponds toujours en français.`,
      tools: allTools,
    });
  }

  /**
   * Run the agent with the given input and return an Observable of AG-UI events
   */
  run(input: RunAgentInput): Observable<BaseEvent> {
    return new Observable<BaseEvent>((subscriber) => {
      this.executeAgent(input, subscriber).catch((error) => {
        subscriber.next({
          type: EventType.RUN_ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        subscriber.complete();
      });
    });
  }

  /**
   * Execute the Strands Agent and emit AG-UI events
   */
  private async executeAgent(
    input: RunAgentInput,
    subscriber: {
      next: (event: BaseEvent) => void;
      complete: () => void;
      error: (err: unknown) => void;
    }
  ): Promise<void> {
    const runId = input.runId || crypto.randomUUID();

    // Emit run started event
    subscriber.next({
      type: EventType.RUN_STARTED,
      runId,
      threadId: this.threadId,
    });

    // Extract the user message from input
    const userMessage = this.extractUserMessage(input);

    if (!userMessage) {
      subscriber.next({
        type: EventType.RUN_ERROR,
        message: 'No user message provided',
      });
      subscriber.complete();
      return;
    }

    const messageId = crypto.randomUUID();

    try {
      // Start text message
      subscriber.next({
        type: EventType.TEXT_MESSAGE_START,
        messageId,
        role: 'assistant',
      });

      // Invoke the Strands Agent
      const result = await this.strandsAgent.invoke(userMessage);

      // Extract text from the result
      const responseText = this.extractResponseText(result);

      // Send the content
      subscriber.next({
        type: EventType.TEXT_MESSAGE_CONTENT,
        messageId,
        delta: responseText,
      });

      // End text message
      subscriber.next({
        type: EventType.TEXT_MESSAGE_END,
        messageId,
      });

      // Emit run finished event
      subscriber.next({
        type: EventType.RUN_FINISHED,
        runId,
        threadId: this.threadId,
      });
    } catch (error) {
      subscriber.next({
        type: EventType.RUN_ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
    }

    subscriber.complete();
  }

  /**
   * Extract the user message from AG-UI input
   */
  private extractUserMessage(input: RunAgentInput): string | null {
    if (!input.messages || input.messages.length === 0) {
      return null;
    }

    // Find the last user message
    for (let i = input.messages.length - 1; i >= 0; i--) {
      const msg = input.messages[i];
      if (msg.role === 'user' && msg.content) {
        return msg.content;
      }
    }

    return null;
  }

  /**
   * Extract response text from Strands Agent result
   */
  private extractResponseText(result: unknown): string {
    if (typeof result === 'string') {
      return result;
    }

    // Handle AgentResult type from Strands
    if (result && typeof result === 'object') {
      const agentResult = result as { message?: { content?: unknown[] } };
      if (agentResult.message?.content) {
        const textBlocks = agentResult.message.content.filter(
          (block: unknown) => block && typeof block === 'object' && (block as { type?: string }).type === 'textBlock'
        );
        return textBlocks
          .map((block: unknown) => (block as { text?: string }).text || '')
          .join('\n');
      }
    }

    return JSON.stringify(result);
  }

  /**
   * Clone this agent
   */
  clone(): StrandsAgentAdapter {
    return new StrandsAgentAdapter(this.config);
  }
}

/**
 * Create and export a pre-configured local agent instance
 */
export function createLocalAgent(config?: Partial<StrandsAgentAdapterConfig>): StrandsAgentAdapter {
  return new StrandsAgentAdapter({
    agentId: 'ape_assistant',
    description: 'La Source APE Assistant - helps users navigate the site and manage content',
    ...config,
  });
}
