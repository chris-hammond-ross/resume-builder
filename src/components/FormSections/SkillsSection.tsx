import React from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	IconButton
} from '@mui/material';
import {
	Add as AddIcon,
	Remove as RemoveIcon
} from '@mui/icons-material';

interface SkillsSectionProps {
	skills: string[];
	onUpdateSkill: (index: number, value: string) => void;
	onAddSkill: (index: number) => void; // Updated to accept index parameter
	onRemoveSkill: (index: number) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
	skills,
	onUpdateSkill,
	onAddSkill,
	onRemoveSkill
}) => {
	return (
		<Card sx={{ mb: 3 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>Skills & Abilities</Typography>
				{skills.map((skill, index) => (
					<Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
						<TextField
							fullWidth
							label={`Skill ${index + 1}`}
							value={skill}
							onChange={(e) => onUpdateSkill(index, e.target.value)}
							required
							sx={{ mr: 1 }}
						/>
						<IconButton
							onClick={() => onAddSkill(index)} // Pass current index
							color="primary"
						>
							<AddIcon />
						</IconButton>
						{skills.length > 1 && (
							<IconButton
								onClick={() => onRemoveSkill(index)}
								color="error"
							>
								<RemoveIcon />
							</IconButton>
						)}
					</Box>
				))}
			</CardContent>
		</Card>
	);
};

export default React.memo(SkillsSection);