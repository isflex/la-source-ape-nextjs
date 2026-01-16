/**
 * Action Factory
 *
 * Utilities for creating CopilotKit actions with type safety.
 */

import type { ActionDefinition, ActionParameter } from '../types';

/**
 * Helper to create a typed action parameter
 */
export function param(
  name: string,
  type: ActionParameter['type'],
  options?: Omit<ActionParameter, 'name' | 'type'>
): ActionParameter {
  return {
    name,
    type,
    required: options?.required ?? false,
    description: options?.description,
    default: options?.default,
  };
}

/**
 * Create a CopilotKit action with type safety
 *
 * @example
 * ```typescript
 * const createEventAction = createAction({
 *   name: 'create_event',
 *   description: 'Create a new event in the calendar',
 *   parameters: [
 *     param('title', 'string', { required: true, description: 'Event title' }),
 *     param('date', 'string', { required: true, description: 'Event date (ISO format)' }),
 *     param('description', 'string', { description: 'Event description' }),
 *   ],
 *   handler: async ({ title, date, description }) => {
 *     // Create the event
 *     return { success: true, eventId: '123' };
 *   },
 * });
 * ```
 */
export function createAction<T extends Record<string, unknown>>(
  definition: Omit<ActionDefinition, 'handler'> & {
    handler: (args: T) => Promise<unknown>;
  }
): ActionDefinition {
  return {
    name: definition.name,
    description: definition.description,
    parameters: definition.parameters,
    handler: definition.handler as ActionDefinition['handler'],
    render: definition.render,
  };
}

/**
 * Create multiple actions at once
 */
export function createActions(
  definitions: ActionDefinition[]
): ActionDefinition[] {
  return definitions;
}

/**
 * Common action templates
 */
export const ActionTemplates = {
  /**
   * Create a navigation action
   */
  navigate: (
    name: string,
    description: string,
    handler: (args: { path: string }) => Promise<void>
  ): ActionDefinition =>
    createAction({
      name,
      description,
      parameters: [
        param('path', 'string', { required: true, description: 'Path to navigate to' }),
      ],
      handler,
    }),

  /**
   * Create a search action
   */
  search: (
    name: string,
    description: string,
    handler: (args: { query: string; filters?: Record<string, unknown> }) => Promise<unknown>
  ): ActionDefinition =>
    createAction({
      name,
      description,
      parameters: [
        param('query', 'string', { required: true, description: 'Search query' }),
        param('filters', 'object', { description: 'Optional search filters' }),
      ],
      handler,
    }),

  /**
   * Create a CRUD action
   */
  crud: {
    create: <T extends Record<string, unknown>>(
      entityName: string,
      fields: ActionParameter[],
      handler: (args: T) => Promise<unknown>
    ): ActionDefinition => ({
      name: `create_${entityName}`,
      description: `Create a new ${entityName}`,
      parameters: fields,
      handler: handler as ActionDefinition['handler'],
    }),

    read: <T>(
      entityName: string,
      handler: (args: { id: string }) => Promise<T>
    ): ActionDefinition => ({
      name: `get_${entityName}`,
      description: `Get a ${entityName} by ID`,
      parameters: [
        param('id', 'string', { required: true, description: `${entityName} ID` }),
      ],
      handler: handler as ActionDefinition['handler'],
    }),

    update: <T extends Record<string, unknown>>(
      entityName: string,
      fields: ActionParameter[],
      handler: (args: T & { id: string }) => Promise<unknown>
    ): ActionDefinition => ({
      name: `update_${entityName}`,
      description: `Update an existing ${entityName}`,
      parameters: [
        param('id', 'string', { required: true, description: `${entityName} ID` }),
        ...fields,
      ],
      handler: handler as ActionDefinition['handler'],
    }),

    delete: (
      entityName: string,
      handler: (args: { id: string }) => Promise<unknown>
    ): ActionDefinition => ({
      name: `delete_${entityName}`,
      description: `Delete a ${entityName}`,
      parameters: [
        param('id', 'string', { required: true, description: `${entityName} ID` }),
      ],
      handler: handler as ActionDefinition['handler'],
    }),
  },
};
