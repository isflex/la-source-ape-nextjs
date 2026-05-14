/**
 * @flexiness/copilotkit/federation
 *
 * Namespace re-exports of the CopilotKit v2 / AG-UI runtime packages, intended
 * for use as Module Federation `shared.lib` providers (see
 * `apps/gateway/src/components/web-app-mf.tsx`).
 *
 * Re-exporting through this package keeps `@ag-ui/*` and `@copilotkit/*` out
 * of gateway/package.json — they're already declared as dependencies here
 * (and pinned via root pnpm overrides), so the host bundle picks them up
 * transitively through `@flexiness/copilotkit`.
 */
export * as agUiClient from '@ag-ui/client';
export * as agUiCore from '@ag-ui/core';
export * as agUiEncoder from '@ag-ui/encoder';
export * as agUiProto from '@ag-ui/proto';
export * as copilotkitReactCoreV2 from '@copilotkit/react-core/v2';
