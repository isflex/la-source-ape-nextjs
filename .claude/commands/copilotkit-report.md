# CopilotKit Integration Report

Generate a report of CopilotKit integration coverage across the project.

## Instructions

1. Search for React components in `apps/gateway/src/`

2. For each component, check for:
   - Existing CopilotKit imports (`@copilotkit/react-core` or `@flexiness/copilotkit`)
   - `useCopilotReadable` or wrapper hooks usage
   - `useCopilotAction` usage

3. Categorize components:
   - **Fully Integrated**: Has CopilotKit hooks
   - **Partially Integrated**: Has some hooks but missing opportunities
   - **Not Integrated**: No CopilotKit usage but has state/data
   - **Not Applicable**: Presentational only, no state

4. Generate summary report with:
   - Total components analyzed
   - Integration coverage percentage
   - Priority list for integration (based on complexity and importance)
   - Quick wins (easy integrations)

## Output Format
Present as a markdown table with component paths and status.
