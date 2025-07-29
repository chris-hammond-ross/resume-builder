const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function formatDate(year, month) {
	if (!year) return 'Present';
	if (!month) return year;
	return `${year} ${month}`;
}

// Template for generating HTML from React component data
function generateResumeHTML(formData, styles) {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.name} - Resume</title>
    <style>
        ${styles}
        body { margin: 0; padding: 0; }
    </style>
</head>
<body>
    <div class="resume-preview-container">
        <div class="resume-content">
            <h1>${formData.name || 'Your Name Here'}</h1>

            <div class="section">
                <h2>Professional Summary</h2>
                <p>${formData.professionalSummary || 'Enter your professional summary here...'}</p>

                <h2>Skills & Abilities</h2>
                <ul>
                    ${formData.skillsAndAbilities
			.filter(skill => skill.trim())
			.map(skill => `<li>${skill}</li>`)
			.join('') || '<li>Add your skills and abilities...</li>'}
                </ul>
            </div>

            ${formData.includeTechnicalSkills && formData.technicalSkills.rows.some(row => row.category.trim() || row.technologies.trim()) ? `
            <div class="section">
                <h2>Technical Skills</h2>
                <table>
                    <thead>
                        <tr>
                            ${formData.technicalSkills.headers.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${formData.technicalSkills.rows
				.filter(row => row.category.trim() || row.technologies.trim())
				.map(row => `
                            <tr>
                                <td>${row.category || 'Category'}</td>
                                <td>${row.technologies || 'Technologies list'}</td>
                            </tr>
                          `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}

            <div class="section">
                <h2>Professional Experience</h2>
                ${formData.professionalExperience.map(exp => `
                    <div class="experience-item">
                        <h3>${exp.position || 'Position Title'}</h3>
                        <h4>
                            <span class="institution">${exp.company || 'Company Name'}</span>
                            <span class="date-range">(${formatDate(exp.startYear, exp.startMonth)} - ${formatDate(exp.endYear, exp.endMonth)})</span>
                        </h4>

                        ${exp.keyAccomplishments.some(acc => acc.trim()) ? `
                        <div class="key-accomplishments">
                            <h4>Key Accomplishments:</h4>
                            <ul>
                                ${exp.keyAccomplishments
							.filter(acc => acc.trim())
							.map(acc => `<li>${acc}</li>`)
							.join('')}
                            </ul>
                        </div>
                        ` : ''}

                        ${exp.experienceSummary
						.filter(sum => sum.trim())
						.map(summary => `<p>${summary}</p>`)
						.join('')}
                    </div>
                `).join('')}
            </div>

            <div class="section">
                <h2>Education</h2>
                ${formData.education.map(edu => `
                    <div class="education-item">
                        <strong>${edu.qualification || 'Qualification'} - ${edu.institution || 'Institution'}</strong><br>
                        <span class="date-range">Completed: ${edu.yearCompleted || '20XX'}</span>
                    </div>
                `).join('')}
            </div>

            ${formData.includeHobbies && formData.hobbies.some(hobby => hobby.trim()) ? `
            <div class="section">
                <h2>Hobbies</h2>
                ${formData.hobbies
				.filter(hobby => hobby.trim())
				.map(hobby => `<p>${hobby}</p>`)
				.join('')}
            </div>
            ` : ''}

            <div class="section">
                <h2>References</h2>
                ${formData.includeReferences && formData.references.some(ref => ref.name.trim() || ref.position.trim() || ref.contact.trim())
			? formData.references
				.filter(ref => ref.name.trim() || ref.position.trim() || ref.contact.trim())
				.map(ref => `
                        <div>
                            <div><strong>${ref.name || 'Reference Name'}</strong> - ${ref.position || 'Position'}</div>
                            ${ref.contact || 'Contact Info'}
                            <p></p>
                        </div>
                      `).join('')
			: '<p>References available upon request.</p>'}
            </div>
        </div>
    </div>
</body>
</html>`;
}

function generateCoverLetterHTML(formData, coverLetterData, styles) {
	const currentDate = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.name} - Cover Letter</title>
    <style>
        ${styles}
        body { margin: 0; padding: 0; }
    </style>
</head>
<body>
    <div class="resume-preview-container">
        <div class="resume-content">
            <div class="cover-letter-content">
                <h1>${formData.name || 'Your Name Here'}</h1>
                ${coverLetterData.subtitle ? `<div class="subtitle">${coverLetterData.subtitle}</div>` : ''}

                <p>${currentDate}</p>

                <p>
                    <strong>${coverLetterData.recipientName}</strong><br>
                    ${coverLetterData.company || 'Company Name'}<br>
                    ${coverLetterData.location || 'Location'}
                </p>

                <p><strong>Dear ${coverLetterData.recipientName},</strong></p>

                ${coverLetterData.content.map((paragraph, index) =>
		`<p style="text-align: justify;">${paragraph || `Paragraph ${index + 1} content goes here...`}</p>`
	).join('')}

                <p style="margin-top: 2em;">Sincerely,</p>
                <p><strong>${formData.name || 'Your Name Here'}</strong></p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// PDF generation function
async function generatePDF(html, filename, options = {}) {
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();

	await page.setViewport({
		width: 794,
		height: 1123,
		deviceScaleFactor: 1
	});

	await page.setContent(html, { waitUntil: 'networkidle0' });

	const pdfOptions = {
		format: 'A4',
		printBackground: true,
		preferCSSPageSize: true,
		margin: {
			top: '0mm',
			bottom: '0mm',
			left: '0mm',
			right: '0mm'
		},
		...options
	};

	const pdfBuffer = await page.pdf(pdfOptions);

	await browser.close();
	return pdfBuffer;
}

// Generate preview PDF (same as regular PDF but optimized for web viewing)
async function generatePreviewPDF(html, filename) {
	return generatePDF(html, filename, {
		// Add any preview-specific options here if needed
		tagged: false, // Faster generation for preview
		displayHeaderFooter: false
	});
}

// API endpoint for generating resume PDF
app.post('/api/generate-resume-pdf', async (req, res) => {
	try {
		const { formData, styles } = req.body;

		if (!formData || !formData.name) {
			return res.status(400).json({ error: 'Form data is required' });
		}

		const html = generateResumeHTML(formData, styles);
		const pdfBuffer = await generatePDF(html, `${formData.name} - Resume.pdf`);

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', `attachment; filename="${formData.name} - Resume.pdf"`);
		res.send(pdfBuffer);

	} catch (error) {
		console.error('Error generating resume PDF:', error);
		res.status(500).json({ error: 'Failed to generate PDF' });
	}
});

// API endpoint for generating cover letter PDF
app.post('/api/generate-cover-letter-pdf', async (req, res) => {
	try {
		const { formData, coverLetterData, styles } = req.body;

		if (!formData || !formData.name) {
			return res.status(400).json({ error: 'Form data is required' });
		}

		const html = generateCoverLetterHTML(formData, coverLetterData, styles);
		const pdfBuffer = await generatePDF(html, `${formData.name} - Cover Letter.pdf`);

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', `attachment; filename="${formData.name} - Cover Letter.pdf"`);
		res.send(pdfBuffer);

	} catch (error) {
		console.error('Error generating cover letter PDF:', error);
		res.status(500).json({ error: 'Failed to generate PDF' });
	}
});

// NEW: API endpoint for generating resume preview PDF (for browser viewing)
app.post('/api/preview-resume-pdf', async (req, res) => {
	try {
		const { formData, styles } = req.body;

		if (!formData) {
			return res.status(400).json({ error: 'Form data is required' });
		}

		const html = generateResumeHTML(formData, styles);
		const pdfBuffer = await generatePreviewPDF(html, 'resume-preview.pdf');

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'inline; filename="resume-preview.pdf"');
		res.setHeader('Cache-Control', 'no-cache');
		res.send(pdfBuffer);

	} catch (error) {
		console.error('Error generating resume preview PDF:', error);
		res.status(500).json({ error: 'Failed to generate preview PDF' });
	}
});

// NEW: API endpoint for generating cover letter preview PDF (for browser viewing)
app.post('/api/preview-cover-letter-pdf', async (req, res) => {
	try {
		const { formData, coverLetterData, styles } = req.body;

		if (!formData) {
			return res.status(400).json({ error: 'Form data is required' });
		}

		const html = generateCoverLetterHTML(formData, coverLetterData, styles);
		const pdfBuffer = await generatePreviewPDF(html, 'cover-letter-preview.pdf');

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'inline; filename="cover-letter-preview.pdf"');
		res.setHeader('Cache-Control', 'no-cache');
		res.send(pdfBuffer);

	} catch (error) {
		console.error('Error generating cover letter preview PDF:', error);
		res.status(500).json({ error: 'Failed to generate preview PDF' });
	}
});

app.listen(PORT, () => {
	console.log(`PDF generation server running on port ${PORT}`);
});