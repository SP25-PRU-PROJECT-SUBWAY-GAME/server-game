const express = require("express");
const { body } = require("express-validator");
const prisma = require("./db/prisma.js");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

/*
 name : register
 route: /users/register
 method: post
 body : {name: string, email: string, password : string}
*/

app.get("/", (req, res) => {
	res.send("Hello word!");
});

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

/*
 name : login
 route: /users/login
 method: post
 body : { email: string, password : string}
*/

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
				select: {
					id: true,
					name: true,
					fish: true,
					currentHatIndex: true,
					highScore: true,
					hats: {
						select: {
							hatId: true,
						},
					},
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
				user: user,
			});
		} catch (error) {
			console.log(error);
		}
	}
);
/*
 name : get question random
 route: /question/random
 method: get
*/
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

app.post("/users/save/:id", async (req, res) => {
	const { id } = req.params;
	const { fish, currentHatIndex, highScore } = req.body;

	const user = await prisma.user.update({
		where: {
			id,
		},
		data: {
			fish,
			currentHatIndex,
			highScore,
		},
		select: {
			id: true,
			name: true,
			fish: true,
			currentHatIndex: true,
			highScore: true,
			hats: {
				select: {
					hatId: true,
				},
			},
		},
	});
	return user;
});

app.post("/users/buy", async (req, res) => {
	const { fish, hatId, userId } = req.body;
	const user = await prisma.user.findFirst({
		where: {
			id,
		},
	});

	const [updateUser, newHat] = await Promise.all([
		prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				fish: user.fish - fish,
			},
			select: {
				id: true,
				name: true,
				fish: true,
				currentHatIndex: true,
				highScore: true,
				hats: {
					select: {
						hatId: true,
					},
				},
			},
		}),
		prisma.hat.create({
			data: {
				userId,
				hatId,
			},
		}),
	]);

	return res.json({
		message: "Buy hat success",
		user: updateUser,
	});
});

app.listen(7979, () => {
	console.log("Server run in port 7979");
});
