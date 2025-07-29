export const RESUME_CSS_STYLES = `
	@page {
		size: A4;
		margin: 1.4cm;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	@font-face {
		font-family: "Segoe UI WestEuropean";
		src: local("Segoe UI Light"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-light.woff2) format("woff2"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-light.woff) format("woff"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-light.ttf) format("truetype");
		font-weight: 100;
		font-style: normal
	}

	@font-face {
		font-family: "Segoe UI WestEuropean";
		src: local("Segoe UI"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-regular.woff2) format("woff2"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-regular.woff) format("woff"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-regular.ttf) format("truetype");
		font-weight: 400;
		font-style: normal
	}

	@font-face {
		font-family: "Segoe UI WestEuropean";
		src: local("Segoe UI Semibold"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semibold.woff2) format("woff2"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semibold.woff) format("woff"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semibold.ttf) format("truetype");
		font-weight: 600;
		font-style: normal
	}

	@font-face {
		font-family: "Segoe UI WestEuropean";
		src: local("Segoe UI Semilight"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semilight.woff2) format("woff2"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semilight.woff) format("woff"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semilight.ttf) format("truetype");
		font-weight: 200;
		font-style: normal
	}

	body {
		font-family: 'Segoe UI WestEuropean', sans-serif;
		line-height: 1.6;
		color: #333;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
		max-width: 794px;
		margin: 0 auto;
		padding: 20px;
	}

	.resume-container {
		background: white;
		border-radius: 10px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		padding: 40px;
		margin: 20px 0;
	}

	h1 {
		font-family: 'Roboto Mono', monospace;
		font-size: 2.8em;
		background: linear-gradient(45deg, #667eea, #764ba2);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 1.5em;
		page-break-after: avoid;
		break-after: avoid;
		font-weight: bold;
		letter-spacing: 2px;
	}

	h2 {
		font-family: 'Roboto Mono', monospace;
		font-size: 1.8em;
		background: linear-gradient(45deg, #4facfe, #00f2fe);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		border-bottom: 3px solid transparent;
		border-image: linear-gradient(45deg, #4facfe, #00f2fe) 1;
		padding-bottom: 0.3em;
		margin-top: 2em;
		margin-bottom: 1em;
		page-break-after: avoid;
		break-after: avoid;
		font-weight: bold;
		letter-spacing: 1px;
	}

	h3 {
		font-family: 'Roboto Mono', monospace;
		font-size: 1.4em;
		background: linear-gradient(45deg, #ff6b6b, #feca57);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-top: 1.5em;
		margin-bottom: 0.5em;
		page-break-after: avoid;
		break-after: avoid;
		font-weight: bold;
		letter-spacing: 0.5px;
	}

	h4 {
		font-size: 1.1em;
		color: #7f8c8d;
		font-weight: normal;
		margin-bottom: 1em;
		page-break-after: avoid;
		break-after: avoid;
	}

	p {
		margin-bottom: 1em;
		text-align: justify;
	}

	ul {
		margin-bottom: 1em;
		padding-left: 2em;
	}

	li {
		margin-bottom: 0.5em;
		page-break-inside: avoid;
		break-inside: avoid;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5em;
		page-break-inside: auto;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 12px;
		text-align: left;
		page-break-inside: avoid;
		break-inside: avoid;
	}

	th {
		/*background: linear-gradient(45deg, #667eea, #764ba2);*/
		background-color: #8697e34a;
		color: #5d75e1;
		font-weight: bold;
		font-family: 'Roboto Mono', monospace;
		letter-spacing: 0.5px;
	}

	tr:nth-child(even) {
		background-color: #f8f9fa;
	}

	.experience-item {
		margin-bottom: 2em;
		page-break-inside: avoid;
		break-inside: avoid;
	}

	.section {
		page-break-inside: avoid;
		break-inside: avoid;
	}

	.date-range {
		font-style: italic;
		color: #666;
	}

	.institution {
		font-weight: 600;
		color: #4facfe;
	}

	.key-accomplishments {
		background-color: #fff9e6;
		padding: 15px;
		border-radius: 5px;
		border-left: 4px solid #feca57;
		margin-bottom: 1em;
	}

	.key-accomplishments h4 {
		color: #f39c12;
		margin-bottom: 0.5em;
	}

	.education-item {
		margin-bottom: 0.5em;
		page-break-inside: avoid;
		break-inside: avoid;
	}

	.page-break {
		page-break-before: always;
		break-before: page;
	}

	.no-break {
		page-break-inside: avoid;
		break-inside: avoid;
	}

	td i {
		color: #999;
		font-size: 14px;
	}

	@media print {
		body {
			padding: 0;
			max-width: none;
			background: white !important;
		}

		.resume-container {
			box-shadow: none;
			border-radius: 0;
			margin: 0;
		}

		.page-break {
			page-break-before: always;
		}
	}
`;

export const COVER_CSS_STYLES = `
	@page {
		size: A4;
		margin: 1.4cm;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	@font-face {
		font-family: "Segoe UI WestEuropean";
		src: local("Segoe UI Light"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-light.woff2) format("woff2"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-light.woff) format("woff"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-light.ttf) format("truetype");
		font-weight: 100;
		font-style: normal
	}

	@font-face {
		font-family: "Segoe UI WestEuropean";
		src: local("Segoe UI"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-regular.woff2) format("woff2"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-regular.woff) format("woff"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-regular.ttf) format("truetype");
		font-weight: 400;
		font-style: normal
	}

	@font-face {
		font-family: "Segoe UI WestEuropean";
		src: local("Segoe UI Semibold"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semibold.woff2) format("woff2"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semibold.woff) format("woff"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semibold.ttf) format("truetype");
		font-weight: 600;
		font-style: normal
	}

	@font-face {
		font-family: "Segoe UI WestEuropean";
		src: local("Segoe UI Semilight"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semilight.woff2) format("woff2"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semilight.woff) format("woff"), url(https://spoprod-a.akamaihd.net/files/fabric/assets/fonts//segoeui-westeuropean/segoeui-semilight.ttf) format("truetype");
		font-weight: 200;
		font-style: normal
	}

	body {
		font-family: 'Segoe UI WestEuropean', sans-serif;
		line-height: 1.6;
		color: #333;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
		max-width: 794px;
		margin: 0 auto;
		padding: 20px;
	}

	.cover-letter-container {
		background: white;
		border-radius: 10px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		padding: 0 40px;
		margin: 0;
	}

	h1 {
		font-family: 'Roboto Mono', monospace;
		font-size: 2.8em;
		background: linear-gradient(45deg, #667eea, #764ba2);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		/*margin-bottom: 0.5em;*/
		page-break-after: avoid;
		break-after: avoid;
		font-weight: bold;
		letter-spacing: 2px;
	}

	.subtitle {
		font-family: 'Roboto Mono', monospace;
		font-size: 1.2em;
		color: #666;
		margin-bottom: 2em;
		font-style: italic;
	}

	h2 {
		font-family: 'Roboto Mono', monospace;
		font-size: 1.8em;
		background: linear-gradient(45deg, #4facfe, #00f2fe);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		border-bottom: 3px solid transparent;
		border-image: linear-gradient(45deg, #4facfe, #00f2fe) 1;
		padding-bottom: 0.3em;
		margin-top: 2em;
		margin-bottom: 1em;
		page-break-after: avoid;
		break-after: avoid;
		font-weight: bold;
		letter-spacing: 1px;
	}

	h3 {
		font-family: 'Roboto Mono', monospace;
		font-size: 1.4em;
		background: linear-gradient(45deg, #ff6b6b, #feca57);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-top: 1.5em;
		margin-bottom: 0.5em;
		page-break-after: avoid;
		break-after: avoid;
		font-weight: bold;
		letter-spacing: 0.5px;
	}

	.header-info {
		margin-bottom: 2em;
		color: #666;
	}

	.date {
		margin-bottom: 1em;
	}

	.recipient {
		margin-bottom: 2em;
	}

	.recipient strong {
		color: #333;
	}

	p {
		margin-bottom: 1.2em;
		text-align: justify;
		line-height: 1.7;
	}

	.salutation {
		margin-bottom: 1.5em;
		font-weight: 600;
	}

	.closing {
		margin-top: 2em;
		margin-bottom: 1em;
	}

	.signature {
		font-weight: 600;
		margin-bottom: 2em;
	}

	.highlight-section {
		background-color: #fff9e6;
		padding: 15px;
		border-radius: 5px;
		border-left: 4px solid #feca57;
		margin: 1.5em 0;
	}

	.highlight-section h4 {
		color: #f39c12;
		margin-bottom: 0.5em;
		font-family: 'Roboto Mono', monospace;
	}

	.section {
		page-break-inside: avoid;
		break-inside: avoid;
	}

	ul {
		margin-bottom: 1em;
		padding-left: 2em;
	}

	li {
		margin-bottom: 0.5em;
		page-break-inside: avoid;
		break-inside: avoid;
	}

	@media print {
		body {
			padding: 0;
			max-width: none;
			background: white !important;
		}

		.cover-letter-container {
			box-shadow: none;
			border-radius: 0;
			margin: 0;
		}
	}
`;