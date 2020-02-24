const express = require("express");
const path = require("path");
const UsersService = require("./users-service");
const usersRouter = express.Router();
const bodyParser = express.json();

usersRouter.post("/", bodyParser, (req, res, next) => {
  const { user_name, first_name, password } = req.body;

  for (const field of ["user_name", "first_name", "password"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Please fill in all fields`
      });

  const passwordError = UsersService.validatePassword(password);
  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUser(req.app.get("db"), user_name)
    .then(user => {
      if (user) return res.status(400).json({ error: "Username taken" });

      return UsersService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          user_name,
          first_name,
          password: hashedPassword
        };

        return UsersService.insertUser(req.app.get("db"), newUser).then(
          user => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

module.exports = usersRouter;
