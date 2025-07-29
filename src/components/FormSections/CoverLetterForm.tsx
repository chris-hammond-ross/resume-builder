import React from 'react';
import {
	Card,
	CardContent,
	TextField,
	Typography,
	Box,
	IconButton
} from '@mui/material';
import {
	Add as AddIcon,
	Remove as RemoveIcon
} from '@mui/icons-material';
import type { CoverLetterData } from '../../types';

interface CoverLetterFormProps {
	coverLetterData: CoverLetterData;
	onUpdateCoverLetter: (field: keyof Omit<CoverLetterData, 'content'>, value: string) => void;
	onUpdateContent: (index: number, value: string) => void;
	onAddParagraph: (index: number) => void; // Updated to accept index parameter
	onRemoveParagraph: (index: number) => void;
}

const CoverLetterForm: React.FC<CoverLetterFormProps> = ({
	coverLetterData,
	onUpdateCoverLetter,
	onUpdateContent,
	onAddParagraph,
	onRemoveParagraph
}) => {
	return (
		<Box>
			{/* Recipient Information */}
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>Recipient Information</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<TextField
							fullWidth
							label="Recipient Name"
							value={coverLetterData.recipientName}
							onChange={(e) => onUpdateCoverLetter('recipientName', e.target.value)}
							placeholder="e.g., Ms. Jennifer Parker, Hiring Manager"
						/>
						<TextField
							fullWidth
							label="Company"
							value={coverLetterData.company}
							onChange={(e) => onUpdateCoverLetter('company', e.target.value)}
							placeholder="e.g., TechVision Systems"
							required
						/>
						<TextField
							fullWidth
							label="Location"
							value={coverLetterData.location}
							onChange={(e) => onUpdateCoverLetter('location', e.target.value)}
							placeholder="e.g., San Francisco, CA"
						/>
						<TextField
							fullWidth
							label="Position"
							value={coverLetterData.position}
							onChange={(e) => onUpdateCoverLetter('position', e.target.value)}
							placeholder="e.g., Senior Full-Stack Developer"
							required
						/>
					</Box>
				</CardContent>
			</Card>

			{/* Cover Letter Content */}
			<Card>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 2 }}>Cover Letter Content</Typography>

					{coverLetterData.content.map((paragraph, index) => (
						<Box key={index} sx={{ mb: 2 }}>
							<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
								Paragraph {index + 1}
							</Typography>
							<Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
								<TextField
									fullWidth
									multiline
									rows={4}
									value={paragraph}
									onChange={(e) => onUpdateContent(index, e.target.value)}
									placeholder={`Enter paragraph ${index + 1} content...`}
									required
								/>
								<IconButton
									onClick={() => onAddParagraph(index)} // Pass current index
									color="primary"
								>
									<AddIcon />
								</IconButton>
								{coverLetterData.content.length > 1 && (
									<IconButton
										color="error"
										onClick={() => onRemoveParagraph(index)}
										aria-label={`Remove paragraph ${index + 1}`}
									>
										<RemoveIcon fontSize="small" />
									</IconButton>
								)}
							</Box>
						</Box>
					))}

					{coverLetterData.content.length === 0 && (
						<Typography color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
							No paragraphs added yet. Click "Add Paragraph" to get started.
						</Typography>
					)}

					{/*<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
						<Button
							variant="outlined"
							startIcon={<AddIcon />}
							onClick={onAddParagraph}
							size="small"
						>
							Add Paragraph
						</Button>
					</Box>*/}
				</CardContent>
			</Card>
		</Box>
	);
};

export default CoverLetterForm;