/**
 * Deployment target detection.
 *
 * Resolves which Amplify app this build is running on. Driven by
 * NEXT_PUBLIC_AWS_APP_ID, injected from amplify.yml ($AWS_APP_ID).
 * Local dev (no app id) is treated as `local`.
 */

export const PROD_AWS_APP_ID = "d3tphwcexh4ipl";
export const PROD_SANDBOX_AWS_APP_ID = "d2ybqei9w8j7t5";

export type DeploymentTarget = "production" | "production-sandbox" | "local";

export function getDeploymentTarget(): DeploymentTarget {
  const id = process.env.NEXT_PUBLIC_AWS_APP_ID;
  if (id === PROD_AWS_APP_ID) return "production";
  if (id === PROD_SANDBOX_AWS_APP_ID) return "production-sandbox";
  return "local";
}

export const isProduction = (): boolean =>
  getDeploymentTarget() === "production";

export const isProductionSandbox = (): boolean =>
  getDeploymentTarget() === "production-sandbox";

export const isLocal = (): boolean => getDeploymentTarget() === "local";
