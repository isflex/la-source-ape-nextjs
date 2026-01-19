/**
 * Strands Agent Tools
 * Shared tool definitions for the APE assistant agent
 */
import { tool } from '@strands-agents/sdk';
import { z } from 'zod';

/**
 * Navigate to a page in the application
 */
export const navigateTool = tool({
  name: 'navigate',
  description: 'Navigate to a page in the application',
  inputSchema: z.object({
    page: z.enum(['home', 'newsletter', 'cagnotte', 'events', 'profile']).describe('The page to navigate to'),
  }),
  callback: (input) => {
    return { success: true, message: `Navigating to ${input.page} page` };
  },
});

/**
 * Search for content in the application
 */
export const searchTool = tool({
  name: 'search',
  description: 'Search for content in the application',
  inputSchema: z.object({
    query: z.string().describe('Search query'),
  }),
  callback: (input) => {
    return { success: true, message: `Searching for: ${input.query}` };
  },
});

/**
 * All available tools for the agent
 */
export const allTools = [navigateTool, searchTool];
