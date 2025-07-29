import React from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from '@mui/material';
import {
	Add as AddIcon
} from '@mui/icons-material';

interface Education {
	qualification: string;
	institution: string;
	yearCompleted: string;
}

interface EducationSectionProps {
	education: Education[];
	yearOptions: number[];
	onUpdateEducation: (index: number, field: keyof Education, value: string) => void;
	onAddEducation: () => void;
	onRemoveEducation: (index: number) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({
	education,
	yearOptions,
	onUpdateEducation,
	onAddEducation,
	onRemoveEducation
}) => {
	return (
		<Card sx={{ mb: 3 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>Education</Typography>
				{education.map((edu, index) => (
					<Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Qualification"
									value={edu.qualification}
									onChange={(e) => onUpdateEducation(index, 'qualification', e.target.value)}
									required
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Institution"
									value={edu.institution}
									onChange={(e) => onUpdateEducation(index, 'institution', e.target.value)}
									required
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<FormControl fullWidth required>
									<InputLabel>Year Completed</InputLabel>
									<Select
										value={edu.yearCompleted}
										onChange={(e) => onUpdateEducation(index, 'yearCompleted', e.target.value as string)}
										label="Year Completed"
									>
										{yearOptions.map(year => (
											<MenuItem key={year} value={year}>{year}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>

						{education.length > 1 && (
							<Box sx={{ textAlign: 'right', mt: 2 }}>
								<Button
									variant="outlined"
									color="error"
									onClick={() => onRemoveEducation(index)}
								>
									Remove
								</Button>
							</Box>
						)}
					</Box>
				))}

				<Button
					variant="outlined"
					startIcon={<AddIcon />}
					onClick={onAddEducation}
				>
					Add Education
				</Button>
			</CardContent>
		</Card>
	);
};

export default React.memo(EducationSection);