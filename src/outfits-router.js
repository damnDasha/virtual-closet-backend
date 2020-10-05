const express = require("express");
const jsonParser = express.json();
const outfitsRouter = express.Router();
const OutfitsService = require("./outfits-service.js");
const { requireAuth } = require("./middleware/jwt-auth");

const serializeOutfits = (outfit) => ({
  id: outfit.id,
  content: outfit.content,
  outfit_type: outfit.outfit_type,
  url: outfit.url,
  events_id: Number(outfit.events_id),
  // outfit_id: Number(outfit.outfit_id),
});

outfitsRouter
  .route("/")
  .get((req, res, next) => {
    outfitsService
      .getAllOutfits(req.app.get("db"))
      .then((outfits) => {
        res.json(outfits.map(serializeOutfits));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    req.app.get("db");

    const { content, events_id, outfit_type, url } = req.body;
    const outfit = {
      content,
      events_id,
      outfit_type,
      url,
      user_id: req.user.id,
    };

    OutfitsService.insertOutfit(req.app.get("db"), outfit)
      .then((outfit) => {
        return res.json(outfit);
      })
      .catch(next);
  });

//update, delete, later
outfitsRouter
  .route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;

    OutfitsService.getById(req.app.get("db"), id)
      .then((outfit) => {
        if (outfit) {
          return res.status(200).json(outfit);
        } else {
          return res.status(404).send("outfit not found");
        }
      })
      .catch(next);
  })
  .patch((req, res, next) => {
    const { id, content } = req.body;

    const outfitToUpdate = {
      id,

      content,
    };

    if (!title) {
      return res.status(404).json({ error: "must include title" });
    }

    if (!content) {
      return res.status(404).json({
        error: "must include content",
      });
    }

    OutfitsService.updateoutfit(req.app.get("db"), outfitToUpdate)
      .then((outfitToUpdate) => {
        res.json(outfitToUpdate);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    console.log(req.params.id);

    OutfitsService.deleteoutfit(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).json({});
      })
      .catch(next);
  });

module.exports = outfitsRouter;
