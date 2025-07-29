import { useCallback } from 'react';
import type {
	FormData,
	CoverLetterData,
	UseSampleDataProps
} from '../types';

const useSampleData = ({ setFormData, setCoverLetterData }: UseSampleDataProps) => {
	const getSampleFormData = useCallback((): FormData => ({
		name: 'Sarah Johnson',
		professionalSummary: 'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and mentoring junior developers. Passionate about emerging technologies and driving innovation in fast-paced environments.',
		skillsAndAbilities: [
			'Full-stack web development with modern frameworks',
			'Cloud architecture and DevOps implementation',
			'Team leadership and project management',
			'Agile methodologies and continuous integration',
			'Database design and optimization'
		],
		includeTechnicalSkills: true,
		technicalSkills: {
			headers: ['Skill Category', 'Technologies/Tools'],
			rows: [
				{ category: 'Programming Languages', technologies: 'JavaScript, TypeScript, Python, Java, C#' },
				{ category: 'Frontend Technologies', technologies: 'React, Vue.js, Angular, HTML5, CSS3, Tailwind CSS' },
				{ category: 'Backend Technologies', technologies: 'Node.js, Express, Django, Spring Boot, ASP.NET' },
				{ category: 'Databases', technologies: 'PostgreSQL, MongoDB, Redis, MySQL, DynamoDB' },
				{ category: 'Cloud & DevOps', technologies: 'AWS, Docker, Kubernetes, Jenkins, Terraform, GitHub Actions' },
				{ category: 'Tools & Others', technologies: 'Git, Jira, Figma, Postman, VS Code, IntelliJ IDEA' }
			]
		},
		professionalExperience: [
			{
				position: 'Senior Software Engineer',
				company: 'TechCorp Solutions',
				startYear: '2020',
				endYear: '',
				keyAccomplishments: [
					'Led development of microservices architecture serving 2M+ daily users',
					'Reduced application load time by 40% through optimization initiatives',
					'Mentored 6 junior developers and conducted technical interviews',
					'Implemented CI/CD pipeline reducing deployment time by 60%'
				],
				experienceSummary: [
					'Spearhead the development of scalable web applications using React, Node.js, and AWS cloud services. Collaborate with cross-functional teams to deliver high-quality software solutions that meet business objectives and user requirements.',
					'Drive technical decision-making for architecture improvements and technology stack upgrades. Lead code reviews, establish best practices, and ensure adherence to coding standards across the development team.'
				]
			},
			{
				position: 'Software Engineer',
				company: 'InnovateTech Inc.',
				startYear: '2019',
				endYear: '2020',
				keyAccomplishments: [
					'Developed REST APIs handling 500K+ requests per day',
					'Improved database query performance by 50% through optimization',
					'Collaborated with UX team to implement responsive web designs',
					'Contributed to open-source projects and internal tool development'
				],
				experienceSummary: [
					'Built and maintained full-stack web applications using modern JavaScript frameworks and cloud technologies. Worked closely with product managers and designers to translate business requirements into technical solutions.',
					'Participated in agile development processes, including sprint planning, daily standups, and retrospectives. Contributed to improving development workflows and team productivity through automation and tooling enhancements.'
				]
			},
			{
				position: 'Junior Developer',
				company: 'StartupXYZ',
				startYear: '2017',
				endYear: '2019',
				keyAccomplishments: [
					'Built responsive web interfaces using HTML, CSS, and JavaScript',
					'Integrated third-party APIs and payment processing systems',
					'Participated in debugging and troubleshooting production issues',
					'Contributed to mobile app development using React Native'
				],
				experienceSummary: [
					'Gained hands-on experience in web development while working in a fast-paced startup environment. Learned to adapt quickly to changing requirements and prioritize tasks effectively to meet tight deadlines.',
					'Developed strong problem-solving skills through debugging complex issues and implementing creative solutions. Built foundation in software engineering principles and collaborative development practices.'
				]
			}
		],
		education: [
			{
				qualification: 'Bachelor of Science in Computer Science',
				institution: 'University of Technology',
				yearCompleted: '2017'
			},
			{
				qualification: 'AWS Certified Solutions Architect',
				institution: 'Amazon Web Services',
				yearCompleted: '2021'
			}
		],
		includeHobbies: true,
		hobbies: [
			'Contributing to open-source projects and maintaining personal GitHub repositories with 500+ stars',
			'Photography and digital art creation, with work featured in local exhibitions',
			'Rock climbing and hiking, having completed several challenging multi-day trails',
			'Cooking international cuisines and experimenting with fusion recipes'
		],
		includeReferences: true,
		references: [
			{
				name: 'Michael Chen',
				position: 'Engineering Manager at TechCorp Solutions',
				contact: 'michael.chen@techcorp.com | (555) 123-4567'
			},
			{
				name: 'Dr. Amanda Rodriguez',
				position: 'Computer Science Professor at University of Technology',
				contact: 'a.rodriguez@university.edu | (555) 987-6543'
			},
			{
				name: 'James Wilson',
				position: 'CTO at InnovateTech Inc.',
				contact: 'james.wilson@innovatetech.com | (555) 456-7890'
			}
		]
	}), []);

	const getSampleCoverLetterData = useCallback((): CoverLetterData => ({
		recipientName: 'Ms. Jennifer Parker',
		company: 'TechVision Systems',
		location: 'San Francisco, CA',
		position: 'Senior Full-Stack Developer',
		subtitle: 'Senior Application Development Professional',
		content: [
			'I am writing to express my strong interest in the Senior Full-Stack Developer position at TechVision Systems. With over 8 years of experience in software engineering and a proven track record of delivering scalable solutions, I am excited about the opportunity to contribute to your innovative team and help drive TechVision\'s mission forward.',
			'In my current role as Senior Software Engineer at TechCorp Solutions, I have successfully led the development of microservices architecture serving over 2 million daily users, while mentoring junior developers and implementing CI/CD pipelines that reduced deployment time by 60%. My expertise spans across modern frontend frameworks like React and Vue.js, backend technologies including Node.js and Python, and cloud platforms such as AWS. I am particularly drawn to TechVision\'s commitment to cutting-edge technology and believe my experience with cloud architecture and team leadership would be valuable assets to your organization.',
			'I would welcome the opportunity to discuss how my technical expertise, leadership experience, and passion for innovation can contribute to TechVision Systems\' continued success. Thank you for considering my application, and I look forward to hearing from you soon.'
		]
	}), []);

	const fillWithSampleData = useCallback(() => {
		setFormData(getSampleFormData());
		setCoverLetterData(getSampleCoverLetterData());
	}, [setFormData, setCoverLetterData, getSampleFormData, getSampleCoverLetterData]);

	return {
		fillWithSampleData,
		getSampleFormData,
		getSampleCoverLetterData
	};
};

export default useSampleData;