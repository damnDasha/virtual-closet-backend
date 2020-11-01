const bcrypt = require("bcryptjs");

const UsersService = {
  getAllUsers(knex) {
    return knex.select("*").from("virtual_users");
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("virtual_users")
      .returning("*")
      .then(([user]) => user);
  },

  hasUserWithUserName(db, user_name) {
    return db("virtual_users")
      .where({ user_name })
      .first()
      .then((user) => !!user);
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
};

module.exports = UsersService;
