import React from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	IconButton,
	Checkbox,
	FormControlLabel
} from '@mui/material';
import {
	Add as AddIcon,
	Remove as RemoveIcon
} from '@mui/icons-material';

interface TechnicalSkillsRow {
	category: string;
	technologies: string;
}

interface TechnicalSkillsData {
	headers: string[];
	rows: TechnicalSkillsRow[];
}

interface TechnicalSkillsSectionProps {
	includeTechnicalSkills: boolean;
	technicalSkills: TechnicalSkillsData;
	onToggleInclude: (checked: boolean) => void;
	onUpdateHeader: (index: number, value: string) => void;
	onUpdateRow: (index: number, field: 'category' | 'technologies', value: string) => void;
	onAddRow: (index: number) => void; // Updated to accept index parameter
	onRemoveRow: (index: number) => void;
}

const TechnicalSkillsSection: React.FC<TechnicalSkillsSectionProps> = ({
	includeTechnicalSkills,
	technicalSkills,
	onToggleInclude,
	onUpdateHeader,
	onUpdateRow,
	onAddRow,
	onRemoveRow
}) => {
	return (
		<Card sx={{ mb: 3 }}>
			<CardContent>
				<FormControlLabel
					control={
						<Checkbox
							checked={includeTechnicalSkills}
							onChange={(e) => onToggleInclude(e.target.checked)}
						/>
					}
					label="Include Technical Skills Section"
				/>

				{includeTechnicalSkills && (
					<Box sx={{ mt: 2 }}>
						<Typography variant="subtitle1" gutterBottom>Table Headers</Typography>
						{technicalSkills.headers.map((header, index) => (
							<TextField
								key={index}
								fullWidth
								label={`Header ${index + 1}`}
								value={header}
								onChange={(e) => onUpdateHeader(index, e.target.value)}
								sx={{ mb: 2 }}
							/>
						))}

						<Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Skills Data</Typography>
						{technicalSkills.rows.map((row, index) => (
							<Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<TextField
									label="Category"
									value={row.category}
									onChange={(e) => onUpdateRow(index, 'category', e.target.value)}
									sx={{ mr: 1, flex: 1 }}
								/>
								<TextField
									label="Technologies"
									value={row.technologies}
									onChange={(e) => onUpdateRow(index, 'technologies', e.target.value)}
									sx={{ mr: 1, flex: 2 }}
								/>
								<IconButton
									onClick={() => onAddRow(index)} // Pass current index
									color="primary"
								>
									<AddIcon />
								</IconButton>
								{technicalSkills.rows.length > 1 && (
									<IconButton
										onClick={() => onRemoveRow(index)}
										color="error"
									>
										<RemoveIcon />
									</IconButton>
								)}
							</Box>
						))}
					</Box>
				)}
			</CardContent>
		</Card>
	);
};

export default React.memo(TechnicalSkillsSection);