const express = require("express");
const jsonParser = express.json();
const eventsRouter = express.Router();
const { requireAuth } = require("./middleware/jwt-auth");
const EventsService = require("./events-service");

const serializeEvents = (event) => ({
  id: event.id,
  title: event.title,
});

eventsRouter
  .route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    EventsService
      // .getAllEvents(req.app.get('db'))
      .getByeventId(req.app.get("db"), req.params.id)
      .then((event) => {
        if (!event)
          return res.status(404).json({
            error: {
              message: "event does not exist...time is not linear",
            },
          });
        else {
          res.status(201).json(event);
        }
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const { title } = req.body;
    const event = {
      title,
    };
    if (!title) {
      return res.status(404).json({
        error: "must include event",
      });
    }
    EventsService.updateevent(req.app.get("db"), event).catch(next);
  })

  .delete((req, res, next) => {
    console.log(req.params.id);

    EventsService.deleteevent(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

eventsRouter
  .route("/")
  .get((req, res, next) => {
    EventsService.getAllevents(req.app.get("db"))
      .then((events) => {
        res.json(events.map(serializeEvents));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { title } = req.body;
    const newevent = {
      title,
    };
    if (!title) {
      return res.status(404).json({
        error: {
          message: "must include event",
        },
      });
    }
    newevent.title = title;

    EventsService.insertevent(req.app.get("db"), newevent)
      .then((event) => {
        res.status(201).json(serializeEvents(event));
      })
      .catch(next);
  });

module.exports = eventsRouter;
