export enum CloudProvider {
  UNSPECIFIED = 0,
  AWS = 1,
  AZURE = 2,
}

export enum RecommendationClass {
  UNSPECIFIED_RECOMMENDATION = 0,
  COMPUTE_RECOMMENDATION = 1,
  NETWORKING_RECOMMENDATION = 2,
  DATA_PROTECTION_RECOMMENDATION = 3,
  APPLICATION_RECOMMENDATION = 4,
  AUTHENTICATION_RECOMMENDATION = 5,
  COMPLIANCE_RECOMMENDATION = 6,
}

export interface Framework {
  name: string;
  section: string;
  subsection: string;
}

export interface URL {
  name: string;
  href: string;
}

export interface AffectedResource {
  name: string;
}

export interface ScopeImpact {
  name: string;
  type: string;
  count: number;
}

export interface ImpactAssessment {
  totalViolations: number;
  mostImpactedScope: ScopeImpact;
}

export interface Recommendation {
  tenantId: string;
  recommendationId: string;
  title: string;
  slug: string;
  description: string;
  score: number;
  provider: CloudProvider[];
  frameworks: Framework[];
  reasons: string[];
  furtherReading: URL[];
  totalHistoricalViolations: number;
  affectedResources: AffectedResource[];
  impactAssessment: ImpactAssessment;
  class: RecommendationClass;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    cursor: {
      next: string | null;
    };
    totalItems: number;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse {
  success: boolean;
}
