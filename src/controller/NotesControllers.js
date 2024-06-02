const AppError = require("../utils/AppError");
const knex = require("../database/knex");


class NotesControllers {
  async create(request, response) {
    const { title, description, rating, tags} = request.body;
    const user_id = request.user.id;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      rating,
      user_id
    });

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        user_id,
        name
      }
    });
    await knex("tags").insert(tagsInsert);
    return response.json()
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes")
      .where({ id })
      .first();
    const tag = await knex("tags")
      .where({ note_id: id})
      .orderBy("name");
    
    return response.json({
      ...note,
      tag
    })
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const {title, tags } = request.query;

    const user_id = request.user.id;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map(tag => tag.trim());

      notes = await knex("tags")
        .select([
          "notes.id",
          "notes.title",
          "notes.user_id"
        ])
        .where("notes.user_id", user_id)
        .where("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .groupBy("notes.id")
        .orderBy("notes.title")
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title")
    }
      const userTags = await knex("tags").where({ user_id});
      const notesWithTags = notes.map(note => {
        const notetags = userTags.filter(tag => tag.note_id === note.id);

        return {
          ...note,
          tags: notetags
        }
      })
      return response.json(notesWithTags);
  }
}

module.exports = NotesControllers;