import { useState, useCallback, useMemo, useReducer } from 'react';
import {
	Box,
	Container,
	Grid,
	Paper,
	Tabs,
	Tab,
	Button,
	TextField,
	Typography,
	Card,
	CardContent,
	Alert,
	CircularProgress,
	Snackbar,
	Alert as MuiAlert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions
} from '@mui/material';
import {
	PictureAsPdf as PdfIcon,
	AutoFixHigh as SampleIcon,
	Clear as ClearIcon
} from '@mui/icons-material';
import PDFPreview from './PDFPreview';
import SkillsSection from './FormSections/SkillsSection';
import TechnicalSkillsSection from './FormSections/TechnicalSkillsSection';
import ExperienceSection from './FormSections/ExperienceSection';
import EducationSection from './FormSections/EducationSection';
import OptionalSections from './FormSections/OptionalSections';
import CoverLetterForm from './FormSections/CoverLetterForm';
import useSampleData from '../hooks/useSampleData';
import { RESUME_CSS_STYLES, COVER_CSS_STYLES } from '../constants/pdfStyles';
import type {
	FormData,
	CoverLetterData,
	ProfessionalExperience,
	Education,
	Reference
} from '../types';

// Split state into smaller, independent pieces
interface BasicInfoState {
	name: string;
	professionalSummary: string;
}

interface SkillsState {
	skillsAndAbilities: string[];
	includeTechnicalSkills: boolean;
	technicalSkills: {
		headers: string[];
		rows: { category: string; technologies: string; }[];
	};
}

interface ExperienceState {
	professionalExperience: ProfessionalExperience[];
}

interface EducationState {
	education: Education[];
}

interface OptionalState {
	includeHobbies: boolean;
	hobbies: string[];
	includeReferences: boolean;
	references: Reference[];
}

// Action types for reducer
type FormAction =
	| { type: 'UPDATE_BASIC_INFO'; field: keyof BasicInfoState; value: string; }
	| { type: 'UPDATE_SKILLS'; payload: Partial<SkillsState>; }
	| { type: 'UPDATE_EXPERIENCE'; payload: ExperienceState; }
	| { type: 'UPDATE_EDUCATION'; payload: EducationState; }
	| { type: 'UPDATE_OPTIONAL'; payload: Partial<OptionalState>; }
	| { type: 'LOAD_SAMPLE_DATA'; payload: FormData; }
	| { type: 'CLEAR_FORM'; };

// Initial form state
const initialFormState: FormData = {
	name: '',
	professionalSummary: '',
	skillsAndAbilities: [''],
	includeTechnicalSkills: false,
	technicalSkills: {
		headers: ['Skill Category', 'Technologies/Tools'],
		rows: [{ category: '', technologies: '' }]
	},
	professionalExperience: [{
		position: '',
		company: '',
		startYear: '',
		endYear: '',
		startMonth: '',
		endMonth: '',
		keyAccomplishments: [''],
		experienceSummary: ['']
	}],
	education: [{
		qualification: '',
		institution: '',
		yearCompleted: ''
	}],
	includeHobbies: false,
	hobbies: [''],
	includeReferences: false,
	references: [{
		name: '',
		position: '',
		contact: ''
	}]
};

const formReducer = (state: FormData, action: FormAction): FormData => {
	switch (action.type) {
		case 'UPDATE_BASIC_INFO':
			return {
				...state,
				[action.field]: action.value
			};
		case 'UPDATE_SKILLS':
			return {
				...state,
				...action.payload
			};
		case 'UPDATE_EXPERIENCE':
			return {
				...state,
				...action.payload
			};
		case 'UPDATE_EDUCATION':
			return {
				...state,
				...action.payload
			};
		case 'UPDATE_OPTIONAL':
			return {
				...state,
				...action.payload
			};
		case 'LOAD_SAMPLE_DATA':
			return action.payload;
		case 'CLEAR_FORM':
			return initialFormState;
		default:
			return state;
	}
};

const ResumeGenerator = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);
	const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
	const [clearModalOpen, setClearModalOpen] = useState(false);

	// Use reducer for complex form state
	const [formData, dispatch] = useReducer(formReducer, initialFormState);

	const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
		recipientName: 'Hiring Manager',
		company: '',
		location: '',
		position: '',
		subtitle: '',
		content: ['']
	});

	const {
		fillWithSampleData: originalFillWithSampleData
	} = useSampleData({
		setFormData: (data: FormData) => dispatch({ type: 'LOAD_SAMPLE_DATA', payload: data }),
		setCoverLetterData
	});

	const fillWithSampleData = useCallback(() => {
		originalFillWithSampleData();
	}, [originalFillWithSampleData]);

	// Check if form has been modified from initial state
	const isFormModified = useMemo(() => {
		// Check form data
		const formModified = (
			formData.name !== initialFormState.name ||
			formData.professionalSummary !== initialFormState.professionalSummary ||
			formData.skillsAndAbilities.some((skill, index) => skill !== (initialFormState.skillsAndAbilities[index] || '')) ||
			formData.skillsAndAbilities.length !== initialFormState.skillsAndAbilities.length ||
			formData.includeTechnicalSkills !== initialFormState.includeTechnicalSkills ||
			formData.professionalExperience.some((exp, index) => {
				const initial = initialFormState.professionalExperience[index];
				return !initial ||
					exp.position !== initial.position ||
					exp.company !== initial.company ||
					exp.startYear !== initial.startYear ||
					exp.endYear !== initial.endYear ||
					exp.startMonth !== (initial.startMonth || '') ||
					exp.endMonth !== (initial.endMonth || '') ||
					exp.keyAccomplishments.some((acc, accIndex) => acc !== (initial.keyAccomplishments[accIndex] || '')) ||
					exp.experienceSummary.some((sum, sumIndex) => sum !== (initial.experienceSummary[sumIndex] || ''));
			}) ||
			formData.professionalExperience.length !== initialFormState.professionalExperience.length ||
			formData.education.some((edu, index) => {
				const initial = initialFormState.education[index];
				return !initial ||
					edu.qualification !== initial.qualification ||
					edu.institution !== initial.institution ||
					edu.yearCompleted !== initial.yearCompleted;
			}) ||
			formData.education.length !== initialFormState.education.length ||
			formData.includeHobbies !== initialFormState.includeHobbies ||
			formData.includeReferences !== initialFormState.includeReferences
		);

		// Check cover letter data
		const coverLetterModified = (
			coverLetterData.company !== '' ||
			coverLetterData.location !== '' ||
			coverLetterData.position !== '' ||
			coverLetterData.content.some((content, index) => content !== (index === 0 ? '' : undefined)) ||
			coverLetterData.content.length > 1
		);

		return formModified || coverLetterModified;
	}, [formData, coverLetterData]);

	// Clear form handler
	const handleClearForm = useCallback(() => {
		dispatch({ type: 'CLEAR_FORM' });
		setCoverLetterData({
			recipientName: 'Hiring Manager',
			company: '',
			location: '',
			position: '',
			subtitle: '',
			content: ['']
		});
		setClearModalOpen(false);
		showNotification('Form cleared successfully', 'success');
	}, []);

	// Modal handlers
	const handleOpenClearModal = useCallback(() => {
		setClearModalOpen(true);
	}, []);

	const handleCloseClearModal = useCallback(() => {
		setClearModalOpen(false);
	}, []);

	// Memoize year options
	const yearOptions = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return Array.from({ length: 50 }, (_, i) => currentYear - i);
	}, []);

	// Basic info handlers with direct state updates
	const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		dispatch({ type: 'UPDATE_BASIC_INFO', field: 'name', value });
	}, []);

	const handleProfessionalSummaryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		dispatch({ type: 'UPDATE_BASIC_INFO', field: 'professionalSummary', value });
	}, []);

	// Skills handlers
	const skillsHandlers = useMemo(() => ({
		handleSkillUpdate: (index: number, value: string) => {
			const newSkills = [...formData.skillsAndAbilities];
			newSkills[index] = value;
			dispatch({ type: 'UPDATE_SKILLS', payload: { skillsAndAbilities: newSkills } });
		},
		handleAddSkill: (index: number) => { // Updated to accept index
			const newSkills = [...formData.skillsAndAbilities];
			newSkills.splice(index + 1, 0, ''); // Insert at current position + 1
			dispatch({ type: 'UPDATE_SKILLS', payload: { skillsAndAbilities: newSkills } });
		},
		handleRemoveSkill: (index: number) => {
			if (formData.skillsAndAbilities.length > 1) {
				const newSkills = formData.skillsAndAbilities.filter((_, i) => i !== index);
				dispatch({ type: 'UPDATE_SKILLS', payload: { skillsAndAbilities: newSkills } });
			}
		}
	}), [formData.skillsAndAbilities]);

	// Technical skills handlers
	const technicalSkillsHandlers = useMemo(() => ({
		handleTechnicalSkillsToggle: (checked: boolean) => {
			dispatch({ type: 'UPDATE_SKILLS', payload: { includeTechnicalSkills: checked } });
		},
		handleTechnicalSkillsHeaderUpdate: (index: number, value: string) => {
			const newHeaders = [...formData.technicalSkills.headers];
			newHeaders[index] = value;
			dispatch({
				type: 'UPDATE_SKILLS',
				payload: {
					technicalSkills: { ...formData.technicalSkills, headers: newHeaders }
				}
			});
		},
		handleTechnicalSkillsRowUpdate: (index: number, field: 'category' | 'technologies', value: string) => {
			const newRows = [...formData.technicalSkills.rows];
			newRows[index][field] = value;
			dispatch({
				type: 'UPDATE_SKILLS',
				payload: {
					technicalSkills: { ...formData.technicalSkills, rows: newRows }
				}
			});
		},
		handleAddTechnicalSkillsRow: (index: number) => { // Updated to accept index
			const newRows = [...formData.technicalSkills.rows];
			newRows.splice(index + 1, 0, { category: '', technologies: '' }); // Insert at current position + 1
			dispatch({
				type: 'UPDATE_SKILLS',
				payload: {
					technicalSkills: { ...formData.technicalSkills, rows: newRows }
				}
			});
		},
		handleRemoveTechnicalSkillsRow: (index: number) => {
			if (formData.technicalSkills.rows.length > 1) {
				const newRows = formData.technicalSkills.rows.filter((_, i) => i !== index);
				dispatch({
					type: 'UPDATE_SKILLS',
					payload: {
						technicalSkills: { ...formData.technicalSkills, rows: newRows }
					}
				});
			}
		}
	}), [formData.technicalSkills]);

	// Experience handlers
	const experienceHandlers = useMemo(() => ({
		handleExperienceUpdate: (index: number, field: keyof ProfessionalExperience, value: unknown) => {
			const newExperiences = [...formData.professionalExperience];
			newExperiences[index] = { ...newExperiences[index], [field]: value };
			dispatch({ type: 'UPDATE_EXPERIENCE', payload: { professionalExperience: newExperiences } });
		},
		handleAddExperience: (index: number) => { // Updated to accept index
			const newExperiences = [...formData.professionalExperience];
			newExperiences.splice(index + 1, 0, { // Insert at current position + 1
				position: '',
				company: '',
				startYear: '',
				endYear: '',
				startMonth: '',
				endMonth: '',
				keyAccomplishments: [''],
				experienceSummary: ['']
			});
			dispatch({ type: 'UPDATE_EXPERIENCE', payload: { professionalExperience: newExperiences } });
		},
		handleRemoveExperience: (index: number) => {
			if (formData.professionalExperience.length > 1) {
				const newExperiences = formData.professionalExperience.filter((_, i) => i !== index);
				dispatch({ type: 'UPDATE_EXPERIENCE', payload: { professionalExperience: newExperiences } });
			}
		}
	}), [formData.professionalExperience]);

	// Education handlers
	const educationHandlers = useMemo(() => ({
		handleEducationUpdate: (index: number, field: keyof Education, value: string) => {
			const newEducation = [...formData.education];
			newEducation[index] = { ...newEducation[index], [field]: value };
			dispatch({ type: 'UPDATE_EDUCATION', payload: { education: newEducation } });
		},
		handleAddEducation: () => {
			const newEducation = [...formData.education, { qualification: '', institution: '', yearCompleted: '' }];
			dispatch({ type: 'UPDATE_EDUCATION', payload: { education: newEducation } });
		},
		handleRemoveEducation: (index: number) => {
			if (formData.education.length > 1) {
				const newEducation = formData.education.filter((_, i) => i !== index);
				dispatch({ type: 'UPDATE_EDUCATION', payload: { education: newEducation } });
			}
		}
	}), [formData.education]);

	// Optional sections handlers
	const optionalSectionHandlers = useMemo(() => ({
		handleHobbiesToggle: (checked: boolean) => {
			dispatch({ type: 'UPDATE_OPTIONAL', payload: { includeHobbies: checked } });
		},
		handleHobbyUpdate: (index: number, value: string) => {
			const newHobbies = [...formData.hobbies];
			newHobbies[index] = value;
			dispatch({ type: 'UPDATE_OPTIONAL', payload: { hobbies: newHobbies } });
		},
		handleAddHobby: (index: number) => { // Updated to accept index
			const newHobbies = [...formData.hobbies];
			newHobbies.splice(index + 1, 0, ''); // Insert at current position + 1
			dispatch({ type: 'UPDATE_OPTIONAL', payload: { hobbies: newHobbies } });
		},
		handleRemoveHobby: (index: number) => {
			if (formData.hobbies.length > 1) {
				const newHobbies = formData.hobbies.filter((_, i) => i !== index);
				dispatch({ type: 'UPDATE_OPTIONAL', payload: { hobbies: newHobbies } });
			}
		},
		handleReferencesToggle: (checked: boolean) => {
			dispatch({ type: 'UPDATE_OPTIONAL', payload: { includeReferences: checked } });
		},
		handleReferenceUpdate: (index: number, field: keyof Reference, value: string) => {
			const newReferences = [...formData.references];
			newReferences[index] = { ...newReferences[index], [field]: value };
			dispatch({ type: 'UPDATE_OPTIONAL', payload: { references: newReferences } });
		},
		handleAddReference: (index: number) => { // Updated to accept index
			const newReferences = [...formData.references];
			newReferences.splice(index + 1, 0, { name: '', position: '', contact: '' }); // Insert at current position + 1
			dispatch({ type: 'UPDATE_OPTIONAL', payload: { references: newReferences } });
		},
		handleRemoveReference: (index: number) => {
			if (formData.references.length > 1) {
				const newReferences = formData.references.filter((_, i) => i !== index);
				dispatch({ type: 'UPDATE_OPTIONAL', payload: { references: newReferences } });
			}
		}
	}), [formData.hobbies, formData.references]);

	// Cover letter handlers
	const coverLetterHandlers = useMemo(() => ({
		handleCoverLetterUpdate: (field: keyof Omit<CoverLetterData, 'content'>, value: string) => {
			setCoverLetterData(prev => ({ ...prev, [field]: value }));
		},
		handleContentUpdate: (index: number, value: string) => {
			setCoverLetterData(prev => ({
				...prev,
				content: prev.content.map((paragraph, i) => i === index ? value : paragraph)
			}));
		},
		handleAddParagraph: (index: number) => { // Updated to accept index
			setCoverLetterData(prev => {
				const newContent = [...prev.content];
				newContent.splice(index + 1, 0, ''); // Insert at current position + 1
				return {
					...prev,
					content: newContent
				};
			});
		},
		handleRemoveParagraph: (index: number) => {
			setCoverLetterData(prev => {
				if (prev.content.length > 1) {
					return {
						...prev,
						content: prev.content.filter((_, i) => i !== index)
					};
				}
				return prev;
			});
		}
	}), []);

	// Memoized validation
	const isFormValid = useMemo(() => {
		if (!formData.name || !formData.professionalSummary) return false;
		if (formData.skillsAndAbilities.some(skill => !skill.trim())) return false;

		for (const exp of formData.professionalExperience) {
			if (!exp.position || !exp.company || !exp.startYear) return false;

			if (exp.startMonth && !exp.endMonth) return false;
			if (exp.endMonth && !exp.startMonth) return false;

			if (exp.keyAccomplishments.some(acc => !acc.trim())) return false;
			if (exp.experienceSummary.some(sum => !sum.trim())) return false;
		}

		for (const edu of formData.education) {
			if (!edu.qualification || !edu.institution || !edu.yearCompleted) return false;
		}

		return true;
	}, [formData]);

	const isCoverLetterValid = useMemo(() => {
		if (!coverLetterData.company || !coverLetterData.position) return false;
		if (coverLetterData.content.length === 0) return false;
		if (coverLetterData.content.some(paragraph => !paragraph.trim())) return false;
		return true;
	}, [coverLetterData]);

	const SERVER_URL = 'http://localhost:3001';

	const showNotification = useCallback((message: string, severity = 'info') => {
		setNotification({ open: true, message, severity });
	}, []);

	const closeNotification = useCallback(() => {
		setNotification(prev => ({ ...prev, open: false }));
	}, []);

	const handleGeneratePDF = useCallback(async () => {
		const isValid = activeTab === 0 ? isFormValid : isCoverLetterValid;

		if (!isValid) {
			showNotification('Please fill in all required fields', 'error');
			return;
		}

		setIsGenerating(true);
		showNotification('Generating PDF...', 'info');

		try {
			const endpoint = activeTab === 0 ? '/api/generate-resume-pdf' : '/api/generate-cover-letter-pdf';
			const payload = activeTab === 0
				? { formData, styles: RESUME_CSS_STYLES }
				: { formData, coverLetterData, styles: COVER_CSS_STYLES };

			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 30000);

			const response = await fetch(`${SERVER_URL}${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `Server error: ${response.status}`);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			const filename = activeTab === 0
				? `${formData.name} - Resume.pdf`
				: `${formData.name} - Cover Letter.pdf`;

			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			showNotification('PDF generated and downloaded successfully!', 'success');

		} catch (error) {
			const err = error as Error;
			console.error('Error generating PDF:', err);
			if (err.name === 'AbortError') {
				showNotification('PDF generation timed out. Please try again.', 'error');
			} else if (err.message.includes('Failed to fetch')) {
				showNotification('Cannot connect to PDF server. Please check if the server is running.', 'error');
			} else {
				showNotification(`Failed to generate PDF: ${err.message}`, 'error');
			}
		} finally {
			setIsGenerating(false);
		}
	}, [isFormValid, isCoverLetterValid, activeTab, formData, coverLetterData, showNotification]);

	const handleTabChange = useCallback((_e: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	}, []);

	return (
		<Container sx={{
			py: 3,
			maxWidth: '100vw !important',
			width: '100vw !important',
			height: '100vh',
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden'
		}}>
			<Grid container spacing={3} sx={{ flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
				{/* Form Section */}
				<Grid size={{ xs: 12, lg: 6 }} sx={{
					display: 'flex',
					flexGrow: 1,
					flexDirection: 'column',
					minHeight: 0,
					height: '100%'
				}}>
					<Paper elevation={3} sx={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
						minHeight: 0,
						overflow: 'hidden'
					}}>
						{/* Header with buttons */}
						<Box sx={{
							pt: 2,
							pl: 3,
							pr: 3,
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'baseline',
							flexShrink: 0,
							backgroundColor: '#eee'
						}}>
							<Tabs value={activeTab} onChange={handleTabChange}>
								<Tab label="Resume" />
								<Tab label="Cover Letter" />
							</Tabs>
							<Box sx={{ display: 'flex', gap: 1 }}>
								<Button
									variant="outlined"
									startIcon={<SampleIcon />}
									onClick={fillWithSampleData}
									sx={{ ml: 2 }}
								>
									Fill Sample Data
								</Button>
								<Button
									variant="outlined"
									color="warning"
									startIcon={<ClearIcon />}
									onClick={handleOpenClearModal}
									disabled={!isFormModified}
								>
									Clear
								</Button>
								<Button
									variant="contained"
									startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <PdfIcon />}
									onClick={handleGeneratePDF}
									disabled={activeTab === 0 ? (!isFormValid || isGenerating) : (!isCoverLetterValid || isGenerating)}
								>
									{isGenerating ? 'Generating...' : 'Save PDF'}
								</Button>
							</Box>
						</Box>

						{/* Form Content */}
						<Box sx={{
							p: 3,
							flexGrow: 1,
							overflow: 'auto',
							minHeight: 0,
						}}>
							{/* Basic Information */}
							<Card sx={{ mb: 3 }}>
								<CardContent>
									<Typography variant="h6" gutterBottom>Name</Typography>
									<TextField
										fullWidth
										label="Full Name"
										value={formData.name}
										onChange={handleNameChange}
										required
										sx={{ mb: 2 }}
									/>
								</CardContent>
							</Card>

							{activeTab === 0 ? (
								// Resume Form
								<Box>
									{/* Professional Summary */}
									<Card sx={{ mb: 3 }}>
										<CardContent>
											<Typography variant="h6" gutterBottom>Basic Information</Typography>
											<TextField
												fullWidth
												label="Professional Summary"
												value={formData.professionalSummary}
												onChange={handleProfessionalSummaryChange}
												multiline
												rows={4}
												required
											/>
										</CardContent>
									</Card>

									{/* Skills Section */}
									<SkillsSection
										skills={formData.skillsAndAbilities}
										onUpdateSkill={skillsHandlers.handleSkillUpdate}
										onAddSkill={skillsHandlers.handleAddSkill}
										onRemoveSkill={skillsHandlers.handleRemoveSkill}
									/>

									{/* Technical Skills Section */}
									<TechnicalSkillsSection
										includeTechnicalSkills={formData.includeTechnicalSkills}
										technicalSkills={formData.technicalSkills}
										onToggleInclude={technicalSkillsHandlers.handleTechnicalSkillsToggle}
										onUpdateHeader={technicalSkillsHandlers.handleTechnicalSkillsHeaderUpdate}
										onUpdateRow={technicalSkillsHandlers.handleTechnicalSkillsRowUpdate}
										onAddRow={technicalSkillsHandlers.handleAddTechnicalSkillsRow}
										onRemoveRow={technicalSkillsHandlers.handleRemoveTechnicalSkillsRow}
									/>

									{/* Experience Section */}
									<ExperienceSection
										experiences={formData.professionalExperience}
										yearOptions={yearOptions}
										onUpdateExperience={experienceHandlers.handleExperienceUpdate}
										onAddExperience={experienceHandlers.handleAddExperience}
										onRemoveExperience={experienceHandlers.handleRemoveExperience}
									/>

									{/* Education Section */}
									<EducationSection
										education={formData.education}
										yearOptions={yearOptions}
										onUpdateEducation={educationHandlers.handleEducationUpdate}
										onAddEducation={educationHandlers.handleAddEducation}
										onRemoveEducation={educationHandlers.handleRemoveEducation}
									/>

									{/* Optional Sections */}
									<OptionalSections
										includeHobbies={formData.includeHobbies}
										hobbies={formData.hobbies}
										includeReferences={formData.includeReferences}
										references={formData.references}
										onToggleHobbies={optionalSectionHandlers.handleHobbiesToggle}
										onUpdateHobby={optionalSectionHandlers.handleHobbyUpdate}
										onAddHobby={optionalSectionHandlers.handleAddHobby}
										onRemoveHobby={optionalSectionHandlers.handleRemoveHobby}
										onToggleReferences={optionalSectionHandlers.handleReferencesToggle}
										onUpdateReference={optionalSectionHandlers.handleReferenceUpdate}
										onAddReference={optionalSectionHandlers.handleAddReference}
										onRemoveReference={optionalSectionHandlers.handleRemoveReference}
									/>
								</Box>
							) : (
								// Cover Letter Form
								<CoverLetterForm
									coverLetterData={coverLetterData}
									onUpdateCoverLetter={coverLetterHandlers.handleCoverLetterUpdate}
									onUpdateContent={coverLetterHandlers.handleContentUpdate}
									onAddParagraph={coverLetterHandlers.handleAddParagraph}
									onRemoveParagraph={coverLetterHandlers.handleRemoveParagraph}
								/>
							)}
						</Box>

						{/* Validation Message */}
						{!isFormValid && (
							<Alert severity="warning" sx={{ mt: 2, flexShrink: 0 }}>
								Please fill in all required fields to enable PDF generation.
							</Alert>
						)}
					</Paper>
				</Grid>

				{/* Preview Section */}
				<PDFPreview
					formData={formData}
					coverLetterData={coverLetterData}
					activeTab={activeTab}
				/>
			</Grid>

			{/* Clear Confirmation Dialog */}
			<Dialog
				open={clearModalOpen}
				onClose={handleCloseClearModal}
				aria-labelledby="clear-dialog-title"
				aria-describedby="clear-dialog-description"
			>
				<DialogTitle id="clear-dialog-title">
					Clear Form Data
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="clear-dialog-description">
						Are you sure you want to clear all form data? This action cannot be undone and you will lose all your current work.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseClearModal} color="primary">
						Cancel
					</Button>
					<Button onClick={handleClearForm} color="warning" variant="contained">
						Clear All Data
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={notification.open}
				autoHideDuration={6000}
				onClose={closeNotification}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<MuiAlert
					onClose={closeNotification}
					severity={notification.severity}
					sx={{ width: '100%' }}
				>
					{notification.message}
				</MuiAlert>
			</Snackbar>
		</Container>
	);
};

export default ResumeGenerator;