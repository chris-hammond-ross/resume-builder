import React, { useEffect, useRef, useState } from 'react';
import '../styles/preview.css';

const ResumePreview = ({ formData, coverLetterData, activeTab }) => {
	const [pages, setPages] = useState([]);
	const measureRef = useRef(null);

	const currentDate = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	// A4 dimensions at 96 DPI with 1.4cm margins
	const PAGE_HEIGHT = 1123 - (53 * 2); // 1017px usable height
	const MARGIN_BOTTOM = 40; // Space for page number and some buffer

	useEffect(() => {
		if (measureRef.current) {
			calculatePages();
		}
	}, [formData, coverLetterData, activeTab]);

	const calculatePages = () => {
		if (!measureRef.current) return;

		const content = activeTab === 0 ? renderResumeContent() : renderCoverLetterContent();
		const newPages = simulatePageBreaks(content);
		setPages(newPages);
	};

	const simulatePageBreaks = (content) => {
		// Create a hidden measuring container that exactly matches the PDF styling
		const measureContainer = document.createElement('div');
		measureContainer.style.position = 'absolute';
		measureContainer.style.left = '-9999px';
		measureContainer.style.width = '688px'; // 794px - 106px (margins)
		measureContainer.style.visibility = 'hidden';
		measureContainer.style.fontFamily = "'Segoe UI WestEuropean', 'Segoe UI', sans-serif";
		measureContainer.style.lineHeight = '1.6';
		measureContainer.className = 'pdf-page-content';

		// Add the same styles as the actual preview
		const styleSheet = document.createElement('style');
		styleSheet.textContent = `
			.pdf-page-content h1 {
				font-family: 'Roboto Mono', monospace;
				font-size: 2.8em;
				margin-bottom: 1.5em;
				font-weight: bold;
				letter-spacing: 2px;
			}
			.pdf-page-content h2 {
				font-family: 'Roboto Mono', monospace;
				font-size: 1.8em;
				padding-bottom: 0.3em;
				margin-top: 2em;
				margin-bottom: 1em;
				font-weight: bold;
				letter-spacing: 1px;
			}
			.pdf-page-content h3 {
				font-family: 'Roboto Mono', monospace;
				font-size: 1.4em;
				margin-top: 1.5em;
				margin-bottom: 0.5em;
				font-weight: bold;
				letter-spacing: 0.5px;
			}
			.pdf-page-content p {
				margin-bottom: 1em;
				line-height: 1.6;
			}
			.pdf-page-content ul {
				margin-bottom: 1em;
				padding-left: 2em;
			}
			.pdf-page-content li {
				margin-bottom: 0.5em;
			}
			.pdf-page-content table {
				width: 100%;
				border-collapse: collapse;
				margin-bottom: 1.5em;
			}
			.pdf-page-content th,
			.pdf-page-content td {
				border: 1px solid #ddd;
				padding: 12px;
				text-align: left;
			}
			.pdf-page-content .section {
				margin-bottom: 1em;
			}
		`;
		document.head.appendChild(styleSheet);
		document.body.appendChild(measureContainer);

		const pages = [];
		let currentPageContent = [];
		let currentHeight = 0;
		let pageNumber = 1;

		console.log('Starting page break simulation...');
		console.log('PAGE_HEIGHT:', PAGE_HEIGHT, 'MARGIN_BOTTOM:', MARGIN_BOTTOM);

		content.forEach((section, index) => {
			// Render section to measure its height
			measureContainer.innerHTML = section.html;
			const sectionHeight = measureContainer.offsetHeight;
			const availableSpace = PAGE_HEIGHT - MARGIN_BOTTOM - currentHeight;

			console.log(`Section ${index}:`, {
				sectionHeight,
				currentHeight,
				availableSpace,
				willFit: sectionHeight <= availableSpace,
				hasContentOnPage: currentPageContent.length > 0,
				avoidBreak: section.avoidBreak
			});

			// For text content that can be split, use a different strategy
			if (!section.avoidBreak && sectionHeight > availableSpace && currentPageContent.length > 0) {
				// Try to split the text content
				const splitResult = splitTextContent(section.html, availableSpace, measureContainer);

				if (splitResult.firstPart) {
					// Add the first part to current page
					currentPageContent.push({
						html: splitResult.firstPart,
						avoidBreak: false
					});

					// Start new page with remaining content
					pages.push({
						number: pageNumber,
						content: [...currentPageContent]
					});

					currentPageContent = splitResult.remainingPart ? [{
						html: splitResult.remainingPart,
						avoidBreak: false
					}] : [];
					currentHeight = splitResult.remainingHeight || 0;
					pageNumber++;
				} else {
					// Couldn't split effectively, move entire section to next page
					pages.push({
						number: pageNumber,
						content: [...currentPageContent]
					});

					currentPageContent = [section];
					currentHeight = sectionHeight;
					pageNumber++;
				}
			} else if (section.avoidBreak && sectionHeight > availableSpace && currentPageContent.length > 0) {
				// Section with avoid break doesn't fit, start a new page
				console.log(`Moving section ${index} to new page (avoid break)`);
				pages.push({
					number: pageNumber,
					content: [...currentPageContent]
				});

				// Start new page with this section
				currentPageContent = [section];
				currentHeight = sectionHeight;
				pageNumber++;
			} else {
				// Section fits on current page (or it's the first section on the page)
				console.log(`Adding section ${index} to current page`);
				currentPageContent.push(section);
				currentHeight += sectionHeight;
			}
		});

		// Add remaining content as final page
		if (currentPageContent.length > 0) {
			pages.push({
				number: pageNumber,
				content: currentPageContent
			});
		}

		// Cleanup
		document.body.removeChild(measureContainer);
		document.head.removeChild(styleSheet);

		console.log('Final pages:', pages.length);
		return pages.length > 0 ? pages : [{
			number: 1,
			content: content
		}];
	};

	// Helper function to split text content
	const splitTextContent = (html, availableSpace, measureContainer) => {
		// For paragraphs, try to split by sentences or words
		if (html.includes('<p>')) {
			const match = html.match(/<p>(.*?)<\/p>/s);
			if (match) {
				const text = match[1];
				const sentences = text.split(/(?<=[.!?])\s+/);

				let firstPart = '';
				let remainingPart = '';
				let currentTestHeight = 0;

				// Try adding sentences one by one until we exceed available space
				for (let i = 0; i < sentences.length; i++) {
					const testContent = firstPart + (firstPart ? ' ' : '') + sentences[i];
					measureContainer.innerHTML = `<p>${testContent}</p>`;
					const testHeight = measureContainer.offsetHeight;

					if (testHeight > availableSpace && firstPart) {
						// This sentence pushes us over, so stop here
						remainingPart = sentences.slice(i).join(' ');
						break;
					} else {
						firstPart = testContent;
						currentTestHeight = testHeight;
					}
				}

				if (firstPart && remainingPart) {
					measureContainer.innerHTML = `<p>${remainingPart}</p>`;
					const remainingHeight = measureContainer.offsetHeight;

					return {
						firstPart: `<p>${firstPart}</p>`,
						remainingPart: `<p>${remainingPart}</p>`,
						remainingHeight: remainingHeight
					};
				}
			}
		}

		// If we can't split effectively, return null
		return { firstPart: null, remainingPart: null, remainingHeight: 0 };
	};

	const renderResumeContent = () => {
		const sections = [];

		// Header section
		sections.push({
			html: `<h1>${formData?.name || 'Your Name Here'}</h1>`,
			avoidBreak: true
		});

		// Professional Summary - split header and content for long text
		sections.push({
			html: `<h2>Professional Summary</h2>`,
			avoidBreak: true
		});

		sections.push({
			html: `<p>${formData?.professionalSummary || 'Enter your professional summary here...'}</p>`,
			avoidBreak: false // Allow text to split across pages
		});

		// Skills & Abilities
		sections.push({
			html: `<h2>Skills & Abilities</h2>`,
			avoidBreak: true
		});

		const skillsHtml = formData?.skillsAndAbilities?.filter(skill => skill.trim()).length > 0
			? formData.skillsAndAbilities.filter(skill => skill.trim()).map(skill => `<li>${skill}</li>`).join('')
			: '<li>Add your skills and abilities...</li>';

		sections.push({
			html: `<ul>${skillsHtml}</ul>`,
			avoidBreak: true
		});

		// Technical Skills
		if (formData?.includeTechnicalSkills && formData?.technicalSkills?.rows?.some(row => row.category.trim() || row.technologies.trim())) {
			const technicalSkillsRows = formData.technicalSkills.rows
				.filter(row => row.category.trim() || row.technologies.trim())
				.map(row => `
					<tr>
						<td>${row.category || 'Category'}</td>
						<td>${row.technologies || 'Technologies list'}</td>
					</tr>
				`).join('');

			sections.push({
				html: `
					<div class="section">
						<h2>Technical Skills</h2>
						<table>
							<thead>
								<tr>
									${formData.technicalSkills.headers.map(header => `<th>${header}</th>`).join('')}
								</tr>
							</thead>
							<tbody>
								${technicalSkillsRows}
							</tbody>
						</table>
					</div>
				`,
				avoidBreak: true
			});
		}

		// Professional Experience - each experience as separate section
		if (formData?.professionalExperience?.length > 0) {
			sections.push({
				html: `<h2>Professional Experience</h2>`,
				avoidBreak: true
			});

			formData.professionalExperience.forEach(exp => {
				const accomplishments = exp.keyAccomplishments?.some(acc => acc.trim()) ? `
					<div class="key-accomplishments">
						<h4>Key Accomplishments:</h4>
						<ul>
							${exp.keyAccomplishments.filter(acc => acc.trim()).map(acc => `<li>${acc}</li>`).join('')}
						</ul>
					</div>
				` : '';

				const summaries = exp.experienceSummary?.filter(sum => sum.trim()).map(summary => `<p>${summary}</p>`).join('') || '';

				sections.push({
					html: `
						<div class="experience-item">
							<h3>${exp.position || 'Position Title'}</h3>
							<h4>
								<span class="institution">${exp.company || 'Company Name'}</span>
								<span class="date-range">(${exp.startYear || '20XX'} - ${exp.endYear || 'Present'})</span>
							</h4>
							${accomplishments}
							${summaries}
						</div>
					`,
					avoidBreak: true
				});
			});
		}

		// Education
		const educationItems = formData?.education?.map(edu => `
			<div class="education-item">
				<strong>${edu.qualification || 'Qualification'} - ${edu.institution || 'Institution'}</strong><br>
				<span class="date-range">Completed: ${edu.yearCompleted || '20XX'}</span>
			</div>
		`).join('') || '';

		sections.push({
			html: `
				<div class="section">
					<h2>Education</h2>
					${educationItems}
				</div>
			`,
			avoidBreak: true
		});

		// Hobbies
		if (formData?.includeHobbies && formData?.hobbies?.some(hobby => hobby.trim())) {
			const hobbiesHtml = formData.hobbies.filter(hobby => hobby.trim()).map(hobby => `<p>${hobby}</p>`).join('');
			sections.push({
				html: `
					<div class="section">
						<h2>Hobbies</h2>
						${hobbiesHtml}
					</div>
				`,
				avoidBreak: true
			});
		}

		// References
		const referencesHtml = formData?.includeReferences && formData?.references?.some(ref => ref.name.trim() || ref.position.trim() || ref.contact.trim())
			? formData.references.filter(ref => ref.name.trim() || ref.position.trim() || ref.contact.trim()).map(ref => `
				<div>
					<div><strong>${ref.name || 'Reference Name'}</strong> - ${ref.position || 'Position'}</div>
					${ref.contact || 'Contact Info'}
					<p></p>
				</div>
			`).join('')
			: '<p>References available upon request.</p>';

		sections.push({
			html: `
				<div class="section">
					<h2>References</h2>
					${referencesHtml}
				</div>
			`,
			avoidBreak: true
		});

		return sections;
	};

	const renderCoverLetterContent = () => {
		const sections = [];

		// Header
		sections.push({
			html: `
				<h1>${formData?.name || 'Your Name Here'}</h1>
				<div class="subtitle">Senior Application Development Professional</div>
			`,
			avoidBreak: true
		});

		// Date and recipient
		sections.push({
			html: `
				<p>${currentDate}</p>
				<p>
					<strong>${coverLetterData?.recipientName}</strong><br>
					${coverLetterData?.company || 'Company Name'}<br>
					${coverLetterData?.location || 'Location'}
				</p>
				<p><strong>Dear ${coverLetterData?.recipientName},</strong></p>
			`,
			avoidBreak: true
		});

		// Content paragraphs
		coverLetterData?.content?.forEach((paragraph, index) => {
			sections.push({
				html: `<p style="text-align: justify;">${paragraph || `Paragraph ${index + 1} content goes here...`}</p>`,
				avoidBreak: false
			});
		});

		// Closing
		sections.push({
			html: `
				<p style="margin-top: 2em;">Sincerely,</p>
				<p><strong>${formData?.name || 'Your Name Here'}</strong></p>
			`,
			avoidBreak: true
		});

		return sections;
	};

	const renderPagesFromCalculated = () => {
		return pages.map(page => (
			<div key={`page-${page.number}`} className="pdf-page">
				<div className="page-number">Page {page.number}</div>
				<div className="pdf-page-content">
					{page.content.map((section, index) => (
						<div key={index} dangerouslySetInnerHTML={{ __html: section.html }} />
					))}
				</div>
			</div>
		));
	};

	return (
		<div className="pdf-preview-container">
			{/* Hidden measuring container */}
			<div ref={measureRef} style={{ display: 'none' }} />

			{pages.length > 0 ? renderPagesFromCalculated() : (
				<div className="pdf-page">
					<div className="page-number">Page 1</div>
					<div className="pdf-page-content">
						<p>Loading preview...</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ResumePreview;