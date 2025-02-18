const express = require("express");
const { body } = require("express-validator");
const prisma = require("./db/prisma.js");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.post(
	"/users/register",
	body("email")
		.notEmpty()
		.isEmail()
		.custom(async (value) => {
			const user = await prisma.user.findFirst({
				where: {
					email: value,
				},
			});
			if (user) {
				throw new Error("E-mail already in use");
			}
		}),
	body("password").notEmpty().isStrongPassword(),
	body("username").notEmpty(),
	async (req, res) => {
		console.log(req.body);
		const { username, password, email } = req.body;
		try {
			const newUser = await prisma.user.create({
				data: {
					email,
					name: username,
					password,
				},
			});
			return res.json({ message: "Create account success" });
		} catch (error) {
			console.log(error);
		}
	}
);

app.post(
	"/users/login",
	body("email").notEmpty().isEmail(),
	body("password").notEmpty().isStrongPassword(),
	async (req, res) => {
		const { password, email } = req.body;
		try {
			const user = await prisma.user.findFirst({
				where: {
					email,
					password,
				},
			});
			if (!user) {
				return res.json({ message: "email or password is not correct" });
			}
			const token = jwt.sign(
				{ id: user.id },
				"ai lớp diu bặc bặc",
				{ algorithm: "RS256", expiresIn: "90d" },

				function (err, token) {
					return token;
				}
			);
			return res.json({
				message: "Login success",
				token,
				user: {
					username: user.name,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}
);

app.get("/question/random", async (req, res) => {
	const listQuestion = await prisma.question.findMany({
		select: {
			id: true,
			title: true,
			answer: {
				select: {
					id: true,
					content: true,
					isCorrect: true,
				},
			},
		},
	});

	const random = Math.floor(Math.random() * listQuestion.length);
	return res.json({
		message: "Get question success",
		question: listQuestion[random],
	});
});

app.listen(7979, () => {
	console.log("Server run in port 7979");
});
