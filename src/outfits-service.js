const OutfitsService = {
  getAllOutfits(knex) {
    return knex.select("*").from("outfits");
  },

  insertOutfit(knex, newOutfit) {
    console.log("---insertOutfit---", newOutfit);
    return knex
      .insert(newOutfit)
      .into("outfits")
      .returning("*")
      .then((Outfit) => {
        return Outfit[0];
      });
  },

  getById(knex, id) {
    return knex.select("*").from("outfits").where("id", id).first();
  },

  deleteOutfit(knex, id) {
    return knex("outfits")
      .where({
        id,
      })
      .delete();
  },

  updateOutfit(knex, id, newOutfitFields) {
    return knex("outfits")
      .where({
        id,
      })
      .update(newOutfitFields);
  },
};

module.exports = OutfitsService;
