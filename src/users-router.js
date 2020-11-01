const express = require("express");
const jsonParser = express.json();
const usersRouter = express.Router();
const AuthService = require("./auth/auth-service.js");
const UsersService = require("./users-service");
const { requireAuth } = require("./middleware/jwt-auth");

usersRouter
  .route("/")
  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get("db"))
      .then((users) => {
        res.json(users);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { password, user_name, full_name, nickname } = req.body;

    for (const field of ["full_name", "user_name", "password"])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be longer than 8 characters",
      });
    }

    UsersService.hasUserWithUserName(req.app.get("db"), user_name)
      .then((hasUserWithUserName) => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` });
        return UsersService.hashPassword(password).then((hashedPassword) => {
          const newUser = {
            user_name,
            password: hashedPassword,
            full_name,
            nickname,
            date_created: "now()",
          };

          return UsersService.insertUser(req.app.get("db"), newUser).then(
            (user) => {
              res.status(201).json(user);
            }
          );
        });
      })
      .catch(next);
  });

module.exports = usersRouter;
