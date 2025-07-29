import React from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	IconButton,
	Button,
	Checkbox,
	FormControlLabel,
	Grid
} from '@mui/material';
import {
	Add as AddIcon,
	Remove as RemoveIcon
} from '@mui/icons-material';

interface Reference {
	name: string;
	position: string;
	contact: string;
}

interface OptionalSectionsProps {
	includeHobbies: boolean;
	hobbies: string[];
	includeReferences: boolean;
	references: Reference[];
	onToggleHobbies: (checked: boolean) => void;
	onUpdateHobby: (index: number, value: string) => void;
	onAddHobby: (index: number) => void; // Updated to accept index parameter
	onRemoveHobby: (index: number) => void;
	onToggleReferences: (checked: boolean) => void;
	onUpdateReference: (index: number, field: keyof Reference, value: string) => void;
	onAddReference: (index: number) => void; // Updated to accept index parameter
	onRemoveReference: (index: number) => void;
}

const OptionalSections: React.FC<OptionalSectionsProps> = ({
	includeHobbies,
	hobbies,
	includeReferences,
	references,
	onToggleHobbies,
	onUpdateHobby,
	onAddHobby,
	onRemoveHobby,
	onToggleReferences,
	onUpdateReference,
	onAddReference,
	onRemoveReference
}) => {
	return (
		<>
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<FormControlLabel
						control={
							<Checkbox
								checked={includeHobbies}
								onChange={(e) => onToggleHobbies(e.target.checked)}
							/>
						}
						label="Include Hobbies Section"
					/>

					{includeHobbies && (
						<Box sx={{ mt: 2 }}>
							{hobbies.map((hobby, index) => (
								<Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
									<TextField
										fullWidth
										label={`Hobby ${index + 1}`}
										value={hobby}
										onChange={(e) => onUpdateHobby(index, e.target.value)}
										multiline
										rows={2}
										required
										sx={{ mr: 1 }}
									/>
									<IconButton
										onClick={() => onAddHobby(index)} // Pass current index
										color="primary"
									>
										<AddIcon />
									</IconButton>
									{hobbies.length > 1 && (
										<IconButton
											onClick={() => onRemoveHobby(index)}
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

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<FormControlLabel
						control={
							<Checkbox
								checked={includeReferences}
								onChange={(e) => onToggleReferences(e.target.checked)}
							/>
						}
						label="Include References (default: available upon request)"
					/>

					{includeReferences && (
						<Box sx={{ mt: 2 }}>
							{references.map((ref, index) => (
								<Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
									<Typography variant="subtitle2" gutterBottom>Reference {index + 1}</Typography>
									<Grid container spacing={2}>
										<Grid size={{ xs: 12, md: 6 }}>
											<TextField
												fullWidth
												label="Name"
												value={ref.name}
												onChange={(e) => onUpdateReference(index, 'name', e.target.value)}
												required
											/>
										</Grid>
										<Grid size={{ xs: 12, md: 6 }}>
											<TextField
												fullWidth
												label="Position"
												value={ref.position}
												onChange={(e) => onUpdateReference(index, 'position', e.target.value)}
												required
											/>
										</Grid>
										<Grid size={{ xs: 12, md: 6 }}>
											<TextField
												fullWidth
												label="Contact"
												value={ref.contact}
												onChange={(e) => onUpdateReference(index, 'contact', e.target.value)}
												required
											/>
										</Grid>
									</Grid>

									{references.length > 1 && (
										<Box sx={{ textAlign: 'right', mt: 2 }}>
											<Button
												variant="outlined"
												color="error"
												onClick={() => onRemoveReference(index)}
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
								onClick={() => onAddReference(references.length - 1)} // Add after last reference
							>
								Add Reference
							</Button>
						</Box>
					)}
				</CardContent>
			</Card>
		</>
	);
};

export default React.memo(OptionalSections);