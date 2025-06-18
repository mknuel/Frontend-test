// src/types/recommendation.ts

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
	id: string; // Changed from recommendationId for consistency with previous usage in React components
	tenantId: string;
	recommendationId: string; // Keep this if you need it separately
	title: string;
	slug: string;
	description: string;
	score: number;
	provider: number[]; // Assuming it's an array of numbers like [1] or [2]
	frameworks?: Framework[]; // Optional, as some might not have it or it could be empty
	reasons?: string[]; // Optional
	furtherReading?: FurtherReading[]; // Optional
	totalHistoricalViolations: number;
	affectedResources?: AffectedResource[]; // Optional
	impactAssessment?: ImpactAssessment; // Optional
	class: number; // Renamed from 'category' as per your data, using a number for 'class'
	severity: "Critical" | "High" | "Medium" | "Low"; // Added from card logic, assuming it's derived or implicit
	status: "Open" | "Resolved" | "Archived"; // Added from card logic, assuming it's derived or implicit
	dateCreated: string; // Added from card logic, assuming it exists or is derived
	lastUpdated: string; // Added from card logic, assuming it exists or is derived
	tags?: string[]; // Added from card logic, assuming it exists or is derived
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
