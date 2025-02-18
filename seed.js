const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding database...");

	const questions = await prisma.$transaction([
		prisma.question.create({
			data: { title: "What is an SQL Injection attack?" },
		}),
		prisma.question.create({ data: { title: "What does DDoS stand for?" } }),
		prisma.question.create({
			data: {
				title:
					"Which programming language is used for writing smart contracts on Ethereum?",
			},
		}),
		prisma.question.create({
			data: { title: "What is the main purpose of a VPN?" },
		}),
		prisma.question.create({
			data: { title: "Which hashing algorithm is used in Bitcoin?" },
		}),
		prisma.question.create({
			data: { title: "What does the acronym XSS stand for in cybersecurity?" },
		}),
		prisma.question.create({
			data: { title: "Which HTTP method is used to update a resource?" },
		}),
		prisma.question.create({
			data: { title: "What is the primary purpose of the HTTPS protocol?" },
		}),
		prisma.question.create({
			data: {
				title:
					"Which of the following is a type of symmetric encryption algorithm?",
			},
		}),
		prisma.question.create({
			data: { title: "What is the default port number for SSH connections?" },
		}),
	]);

	const answersData = [
		{
			questionId: questions[0].id,
			answers: [
				{
					content: "A technique to inject malicious SQL queries",
					isCorrect: true,
				},
				{ content: "A method for encrypting SQL databases", isCorrect: false },
				{ content: "A new type of NoSQL database", isCorrect: false },
				{ content: "A technique to speed up queries", isCorrect: false },
			],
		},
		{
			questionId: questions[1].id,
			answers: [
				{ content: "Distributed Denial of Service", isCorrect: true },
				{ content: "Domain Data Optimization Service", isCorrect: false },
				{ content: "Digital Data Output System", isCorrect: false },
				{ content: "Data Driven Online System", isCorrect: false },
			],
		},
		{
			questionId: questions[2].id,
			answers: [
				{ content: "Solidity", isCorrect: true },
				{ content: "Python", isCorrect: false },
				{ content: "Java", isCorrect: false },
				{ content: "C++", isCorrect: false },
			],
		},
		{
			questionId: questions[3].id,
			answers: [
				{
					content: "To encrypt internet traffic and provide anonymity",
					isCorrect: true,
				},
				{ content: "To speed up internet browsing", isCorrect: false },
				{ content: "To block malware on a computer", isCorrect: false },
				{ content: "To provide free internet access", isCorrect: false },
			],
		},
		{
			questionId: questions[4].id,
			answers: [
				{ content: "SHA-256", isCorrect: true },
				{ content: "MD5", isCorrect: false },
				{ content: "AES-128", isCorrect: false },
				{ content: "RSA", isCorrect: false },
			],
		},
		{
			questionId: questions[5].id,
			answers: [
				{ content: "Cross-Site Scripting", isCorrect: true },
				{ content: "XML Security Standard", isCorrect: false },
				{ content: "Extended Secure Sockets", isCorrect: false },
				{ content: "External System Security", isCorrect: false },
			],
		},
		{
			questionId: questions[6].id,
			answers: [
				{ content: "PUT", isCorrect: true },
				{ content: "GET", isCorrect: false },
				{ content: "DELETE", isCorrect: false },
				{ content: "HEAD", isCorrect: false },
			],
		},
		{
			questionId: questions[7].id,
			answers: [
				{
					content: "To encrypt data transmitted over the web",
					isCorrect: true,
				},
				{ content: "To speed up website loading time", isCorrect: false },
				{ content: "To replace HTTP for all sites", isCorrect: false },
				{ content: "To bypass firewalls", isCorrect: false },
			],
		},
		{
			questionId: questions[8].id,
			answers: [
				{ content: "AES", isCorrect: true },
				{ content: "RSA", isCorrect: false },
				{ content: "ECC", isCorrect: false },
				{ content: "SHA-512", isCorrect: false },
			],
		},
		{
			questionId: questions[9].id,
			answers: [
				{ content: "22", isCorrect: true },
				{ content: "443", isCorrect: false },
				{ content: "80", isCorrect: false },
				{ content: "3306", isCorrect: false },
			],
		},
	];

	for (const { questionId, answers } of answersData) {
		await prisma.answer.createMany({
			data: answers.map((answer) => ({
				...answer,
				questionId,
			})),
		});
	}

	console.log("Seeding completed!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
