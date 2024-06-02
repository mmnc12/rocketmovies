const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");

class UsersControllers {
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex("users")
      .where("email", "=", email)
      .first();

    if (checkUserExists) {
      throw new AppError("Este E-mail já está em uso.");
    }

    const hashePassword = await hash(password, 8);
   
    await knex("users").insert({
      name,
      email,
      password: hashePassword
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const user = await knex("users")
    .where("id", "=", user_id).first();
    
    const id = `${user_id}`;
      
    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    const userWithUpdateEmail = await knex("users")
      .where("email", "=", email).first();
    
    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("Este E-mail já está em uso!")
    }
    
    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha!")
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.")
      }

      user.password = await hash(password, 8);

      await knex("users").where({id}).update({
        password: user.password
      })   
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    
    await knex("users").where({id}).update({
      name,
      email
    });

    await knex("users").where({id}).update({
      updated_at: knex.fn.now()
    });

    return response.json();
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("users").where({ id }).delete();

    return response.status(201).json();
  }
}

module.exports = UsersControllers;