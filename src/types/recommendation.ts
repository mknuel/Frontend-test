// Define interfaces for nested objects first
export interface Framework {
	name: string;
	section: string;
	subsection: string;
}

export interface FurtherReading {
	name: string;
	href: string;
}

export interface AffectedResource {
	name: string;
}

export interface MostImpactedScope {
	name: string;
	type: string;
	count: number;
}

export interface ImpactAssessment {
	totalViolations: number;
	mostImpactedScope: MostImpactedScope;
}

// Main Recommendation interface
export interface Recommendation {
	id: string;
	tenantId: string;
	recommendationId: string;
	title: string;
	slug: string;
	description: string;
	score: number;
	provider: number[];
	frameworks?: Framework[];
	reasons?: string[];
	furtherReading?: FurtherReading[];
	totalHistoricalViolations: number;
	affectedResources?: AffectedResource[];
	impactAssessment?: ImpactAssessment;
	class: number;
	severity: "Critical" | "High" | "Medium" | "Low";
	status: "Open" | "Resolved" | "Archived";
	dateCreated: string;
	lastUpdated: string;
	tags?: string[];
}

export interface ApiResponse {
	data: Recommendation[];
	pagination: {
		cursor: {
			next: string | null;
		};
		totalItems: number;
	};
	availableTags?: {
		frameworks?: string[];
		reasons?: string[];
		providers?: string[];
		classes?: string[];
	};
}
