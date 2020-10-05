const EventsService = {
  getAllEvents(knex) {
    return knex.select("*").from("events");
  },

  insertEvent(knex, newEvent) {
    return knex
      .insert(newEvent)
      .into("events")
      .returning("*")
      .then((Event) => {
        return Event[0];
      });
  },

  getByEventId(knex, id) {
    return knex.from("events").select("*").where("id", id).first();
  },

  deleteEvent(knex, id) {
    return knex("events")
      .where({
        id,
      })
      .delete();
  },

  updateEvent(knex, id, newEventFields) {
    return knex("Events")
      .where({
        id,
      })
      .update(newEventFields);
  },
};

module.exports = EventsService;
