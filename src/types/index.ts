// Core data structures
export interface TechnicalSkillsRow {
	category: string;
	technologies: string;
}

export interface TechnicalSkillsData {
	headers: string[];
	rows: TechnicalSkillsRow[];
}

export interface ProfessionalExperience {
	position: string;
	company: string;
	startYear: string;
	endYear: string;
	startMonth?: string;
	endMonth?: string;
	keyAccomplishments: string[];
	experienceSummary: string[];
}

export interface Education {
	qualification: string;
	institution: string;
	yearCompleted: string;
}

export interface Reference {
	name: string;
	position: string;
	contact: string;
}

export interface FormData {
	name: string;
	professionalSummary: string;
	skillsAndAbilities: string[];
	includeTechnicalSkills: boolean;
	technicalSkills: TechnicalSkillsData;
	professionalExperience: ProfessionalExperience[];
	education: Education[];
	includeHobbies: boolean;
	hobbies: string[];
	includeReferences: boolean;
	references: Reference[];
}

export interface CoverLetterData {
	recipientName: string;
	company: string;
	location: string;
	position: string;
	subtitle: string;
	content: string[];
}

// Hook-specific interfaces
export interface UseSampleDataProps {
	setFormData: (data: FormData) => void;
	setCoverLetterData: (data: CoverLetterData) => void;
}