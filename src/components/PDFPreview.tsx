import React, { useEffect, useState, useRef } from 'react';
import {
	CircularProgress,
	Alert,
	Box,
	Button,
	Switch,
	FormControlLabel,
	Chip,
	Paper,
	Typography,
	Grid
} from '@mui/material';
import {
	Refresh as RefreshIcon,
	Update as UpdateIcon
} from '@mui/icons-material';
import { RESUME_CSS_STYLES, COVER_CSS_STYLES } from '../constants/pdfStyles';
import type { FormData, CoverLetterData } from '../types';

interface PDFPreviewProps {
	formData: FormData;
	coverLetterData: CoverLetterData;
	activeTab: number;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ formData, coverLetterData, activeTab }) => {
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [autoPreview, setAutoPreview] = useState(true);
	const [hasChanges, setHasChanges] = useState(false);
	const timeoutRef = useRef<number>(null);
	const lastDataRef = useRef<string | null>(null);

	const SERVER_URL = 'http://localhost:3001';

	// Track data changes
	useEffect(() => {
		const currentData = JSON.stringify({ formData, coverLetterData, activeTab });
		const lastData = lastDataRef.current;

		if (lastData && lastData !== currentData) {
			setHasChanges(true);
		}

		lastDataRef.current = currentData;
	}, [formData, coverLetterData, activeTab]);

	// Auto preview logic (only if enabled)
	useEffect(() => {
		if (!autoPreview) return;

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			generatePreview();
		}, 500); // Wait 500ms after last change before updating preview

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [formData, coverLetterData, activeTab, autoPreview]);

	// Cleanup blob URL when component unmounts or PDF changes
	useEffect(() => {
		return () => {
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl);
			}
		};
	}, [pdfUrl]);

	const generatePreview = async () => {
		// Don't generate preview if essential data is missing
		if (!formData?.name?.trim()) {
			setPdfUrl(null);
			setError(null);
			setHasChanges(false);
			return;
		}

		setIsLoading(true);
		setError(null);
		setHasChanges(false);

		// Clean up previous URL
		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			setPdfUrl(null);
		}

		try {
			const endpoint = activeTab === 0 ? '/api/preview-resume-pdf' : '/api/preview-cover-letter-pdf';
			const payload = activeTab === 0
				? { formData, styles: RESUME_CSS_STYLES }
				: { formData, coverLetterData, styles: COVER_CSS_STYLES };

			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for preview

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
				throw new Error(errorData.error || `Server error: ${response.status}`);
			}

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			setPdfUrl(url);

		} catch (error) {
			const err = error as Error;
			console.error('Error generating PDF preview:', err);
			if (err.name === 'AbortError') {
				setError('Preview generation timed out. Please try again.');
			} else if (err.message.includes('Failed to fetch')) {
				setError('Cannot connect to preview server. Please check if the server is running.');
			} else {
				setError(`Failed to generate preview: ${err.message}`);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleManualRefresh = () => {
		generatePreview();
	};

	const handleAutoPreviewToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
		const enabled = event.target.checked;
		setAutoPreview(enabled);

		// If turning on auto preview and there are changes, generate preview immediately
		if (enabled && hasChanges) {
			generatePreview();
		}
	};

	const renderPreviewContent = () => {
		if (isLoading) {
			return (
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					height="400px"
					gap={2}
				>
					<CircularProgress size={40} />
					<div>Generating preview...</div>
				</Box>
			);
		}

		if (error) {
			return (
				<Box p={2}>
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						height="300px"
						bgcolor="#f5f5f5"
						borderRadius={1}
					>
						Preview unavailable
					</Box>
				</Box>
			);
		}

		if (!formData?.name?.trim()) {
			return (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					height="400px"
					bgcolor="#f5f5f5"
					borderRadius={1}
					color="#666"
				>
					Enter your name to see preview
				</Box>
			);
		}

		if (!pdfUrl) {
			return (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					height="400px"
					bgcolor="#f5f5f5"
					borderRadius={1}
					color="#666"
				>
					Preview loading...
				</Box>
			);
		}

		return (
			<iframe
				src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
				width="100%"
				height="100%"
				style={{
					border: 'none'
				}}
				title={activeTab === 0 ? 'Resume Preview' : 'Cover Letter Preview'}
			/>
		);
	};

	return (
		<Grid size={{ xs: 12, lg: 6 }} sx={{
			display: 'flex',
			flexGrow: 1,
			flexDirection: 'column',
			minHeight: 0,
			height: '100%'
		}}>
			<Paper
				elevation={3}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					position: 'sticky',
					top: 20,
					minHeight: 0,
					overflow: 'hidden'
				}}
			>
				{/* Header with controls */}
				<Box sx={{
					bgcolor: 'primary.main',
					color: 'primary.contrastText',
					p: 2,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexShrink: 0
				}}>
					{/* Left side controls */}
					<Box display="flex" alignItems="center" gap={2}>
						<Button
							variant="contained"
							size="small"
							startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
							onClick={handleManualRefresh}
							disabled={isLoading || !formData?.name?.trim()}
							sx={{
								bgcolor: 'common.white',
								color: 'primary.main',
								fontWeight: 600,
								'&:hover': {
									bgcolor: 'grey.100',
									boxShadow: 2
								},
								'&:disabled': {
									bgcolor: 'grey.300',
									color: 'grey.500'
								}
							}}
						>
							{isLoading ? 'Updating...' : 'Update'}
						</Button>
						{hasChanges && !autoPreview && (
							<Chip
								icon={<UpdateIcon />}
								label="Outdated"
								size="small"
								variant="filled"
								sx={{
									bgcolor: 'warning.main',
									color: 'common.black',
									fontWeight: 600,
									'& .MuiChip-icon': {
										color: 'common.black'
									},
									boxShadow: 1
								}}
							/>
						)}
					</Box>
					{/* Center title */}
					<Typography variant="h6" sx={{ fontWeight: 600 }}>
						{activeTab === 0 ? 'Resume Preview' : 'Cover Letter Preview'}
					</Typography>
					{/* Right side controls */}
					<FormControlLabel
						control={
							<Switch
								checked={autoPreview}
								onChange={handleAutoPreviewToggle}
								size="small"
								color="warning"
							/>
						}
						label="Auto Preview"
						sx={{
							margin: 0,
							color: 'primary.contrastText',
							'& .MuiFormControlLabel-label': {
								fontSize: '0.875rem',
								fontWeight: 500
							}
						}}
					/>
				</Box>

				{/* Preview Content */}
				<Box sx={{
					flexGrow: 1,
					// overflow: 'auto',
					minHeight: 0
				}}>
					{renderPreviewContent()}
				</Box>
			</Paper>
		</Grid>
	);
};

export default PDFPreview;