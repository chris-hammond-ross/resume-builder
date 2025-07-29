import React from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	IconButton,
	Button,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from '@mui/material';
import {
	Add as AddIcon,
	Remove as RemoveIcon
} from '@mui/icons-material';

interface ProfessionalExperience {
	position: string;
	company: string;
	startYear: string;
	endYear: string;
	startMonth?: string;
	endMonth?: string;
	keyAccomplishments: string[];
	experienceSummary: string[];
}

interface ExperienceSectionProps {
	experiences: ProfessionalExperience[];
	yearOptions: number[];
	onUpdateExperience: (index: number, field: keyof ProfessionalExperience, value: any) => void;
	onAddExperience: (index: number) => void; // Updated to accept index parameter
	onRemoveExperience: (index: number) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
	experiences,
	yearOptions,
	onUpdateExperience,
	onAddExperience,
	onRemoveExperience
}) => {
	const monthOptions = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const updateExperienceField = (expIndex: number, field: keyof ProfessionalExperience, value: any) => {
		onUpdateExperience(expIndex, field, value);
	};

	const updateArrayField = (expIndex: number, field: 'keyAccomplishments' | 'experienceSummary', arrayIndex: number, value: string) => {
		const exp = experiences[expIndex];
		const newArray = [...exp[field]];
		newArray[arrayIndex] = value;
		updateExperienceField(expIndex, field, newArray);
	};

	const addArrayItem = (expIndex: number, field: 'keyAccomplishments' | 'experienceSummary', arrayIndex: number) => {
		const exp = experiences[expIndex];
		const newArray = [...exp[field]];
		newArray.splice(arrayIndex + 1, 0, ''); // Insert at current position + 1
		updateExperienceField(expIndex, field, newArray);
	};

	const removeArrayItem = (expIndex: number, field: 'keyAccomplishments' | 'experienceSummary', arrayIndex: number) => {
		const exp = experiences[expIndex];
		if (exp[field].length > 1) {
			const newArray = exp[field].filter((_, i) => i !== arrayIndex);
			updateExperienceField(expIndex, field, newArray);
		}
	};

	// Helper function to check if month fields should be required
	const isStartMonthRequired = (exp: ProfessionalExperience) => {
		return Boolean(exp.endMonth);
	};

	const isEndMonthRequired = (exp: ProfessionalExperience) => {
		return Boolean(exp.startMonth);
	};

	return (
		<Card sx={{ mb: 3 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>Professional Experience</Typography>
				{experiences.map((exp, expIndex) => (
					<Box key={expIndex} sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
						<Typography variant="subtitle1" gutterBottom>Experience {expIndex + 1}</Typography>

						<Grid container spacing={2} sx={{ mb: 2 }}>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Position Title"
									value={exp.position}
									onChange={(e) => updateExperienceField(expIndex, 'position', e.target.value)}
									required
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Company"
									value={exp.company}
									onChange={(e) => updateExperienceField(expIndex, 'company', e.target.value)}
									required
								/>
							</Grid>
						</Grid>

						{/* Start Date Section */}
						<Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1 }}>Start Date</Typography>
						<Grid container spacing={2} sx={{ mb: 2 }}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth required>
									<InputLabel>Start Year</InputLabel>
									<Select
										value={exp.startYear}
										onChange={(e) => updateExperienceField(expIndex, 'startYear', e.target.value)}
										label="Start Year"
										MenuProps={{
											PaperProps: {
												style: {
													maxHeight: 200, // Limit dropdown height
												},
											},
										}}
									>
										{yearOptions.map(year => (
											<MenuItem key={year} value={year}>{year}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth required={isStartMonthRequired(exp)}>
									<InputLabel>Start Month (Optional)</InputLabel>
									<Select
										value={exp.startMonth || ''}
										onChange={(e) => updateExperienceField(expIndex, 'startMonth', e.target.value)}
										label="Start Month (Optional)"
										MenuProps={{
											PaperProps: {
												style: {
													maxHeight: 200,
												},
											},
										}}
									>
										<MenuItem value="">None</MenuItem>
										{monthOptions.map(month => (
											<MenuItem key={month} value={month}>{month}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>

						{/* End Date Section */}
						<Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>End Date</Typography>
						<Grid container spacing={2} sx={{ mb: 2 }}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth>
									<InputLabel>End Year (Current if empty)</InputLabel>
									<Select
										value={exp.endYear}
										onChange={(e) => updateExperienceField(expIndex, 'endYear', e.target.value)}
										label="End Year"
										MenuProps={{
											PaperProps: {
												style: {
													maxHeight: 200, // Limit dropdown height
												},
											},
										}}
									>
										<MenuItem value="">Current</MenuItem>
										{yearOptions.map(year => (
											<MenuItem key={year} value={year}>{year}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth required={isEndMonthRequired(exp)}>
									<InputLabel>End Month (Optional)</InputLabel>
									<Select
										value={exp.endMonth || ''}
										onChange={(e) => updateExperienceField(expIndex, 'endMonth', e.target.value)}
										label="End Month (Optional)"
										MenuProps={{
											PaperProps: {
												style: {
													maxHeight: 200,
												},
											},
										}}
									>
										<MenuItem value="">None</MenuItem>
										{monthOptions.map(month => (
											<MenuItem key={month} value={month}>{month}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>

						<Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>Key Accomplishments</Typography>
						{exp.keyAccomplishments.map((acc, accIndex) => (
							<Box key={accIndex} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<TextField
									fullWidth
									label={`Accomplishment ${accIndex + 1}`}
									value={acc}
									onChange={(e) => updateArrayField(expIndex, 'keyAccomplishments', accIndex, e.target.value)}
									required
									sx={{ mr: 1 }}
								/>
								<IconButton
									onClick={() => addArrayItem(expIndex, 'keyAccomplishments', accIndex)} // Pass array index
									color="primary"
								>
									<AddIcon />
								</IconButton>
								{exp.keyAccomplishments.length > 1 && (
									<IconButton
										onClick={() => removeArrayItem(expIndex, 'keyAccomplishments', accIndex)}
										color="error"
									>
										<RemoveIcon />
									</IconButton>
								)}
							</Box>
						))}

						<Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1 }}>Experience Summary</Typography>
						{exp.experienceSummary.map((summary, sumIndex) => (
							<Box key={sumIndex} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
								<TextField
									fullWidth
									label={`Summary Paragraph ${sumIndex + 1}`}
									value={summary}
									onChange={(e) => updateArrayField(expIndex, 'experienceSummary', sumIndex, e.target.value)}
									multiline
									rows={3}
									required
									sx={{ mr: 1 }}
								/>
								<IconButton
									onClick={() => addArrayItem(expIndex, 'experienceSummary', sumIndex)} // Pass array index
									color="primary"
								>
									<AddIcon />
								</IconButton>
								{exp.experienceSummary.length > 1 && (
									<IconButton
										onClick={() => removeArrayItem(expIndex, 'experienceSummary', sumIndex)}
										color="error"
									>
										<RemoveIcon />
									</IconButton>
								)}
							</Box>
						))}

						{experiences.length > 1 && (
							<Box sx={{ textAlign: 'right', mt: 2 }}>
								<Button
									variant="outlined"
									color="error"
									onClick={() => onRemoveExperience(expIndex)}
								>
									Remove Experience
								</Button>
							</Box>
						)}
					</Box>
				))}

				<Button
					variant="outlined"
					startIcon={<AddIcon />}
					onClick={() => onAddExperience(experiences.length - 1)} // Add after last experience
				>
					Add Experience
				</Button>
			</CardContent>
		</Card>
	);
};

export default React.memo(ExperienceSection);