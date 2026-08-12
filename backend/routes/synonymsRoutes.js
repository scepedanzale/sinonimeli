const express = require("express");

const synonymsController = require(
    "../controllers/synonymsController"
);

const router = express.Router();


router.get("/", synonymsController.getAll);

router.get("/search", synonymsController.search);

router.get("/:id", synonymsController.getById);

router.post("/", synonymsController.create);

router.put("/:id", synonymsController.update);

router.delete("/:id", synonymsController.remove);


module.exports = router;