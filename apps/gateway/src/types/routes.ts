export interface RouteMetadata {
  emoji: string;
  navTitle: string;
  active?: boolean;  // Default: false (hidden)
  admin?: boolean;   // Default: false (public)
}

export type RoutesMetaConfig = Record<string, RouteMetadata>;
