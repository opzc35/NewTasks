var express = require('express');


module.exports = function(db) {
  const router = express.Router();
  router.get("/", async (req, res) => {
    res.render("index", { title: "Task Manager" });
  })
  router.get("/watch/:id", async (req, res) => {
    const { id } = req.params;
    res.render("watch", { title: "View Task", taskId: id });
  });
  router.get("/api/tasks", async (req, res) => {
    const tasks = await db.all(`
      SELECT title, description, id FROM tasks
    `);
    res.json(tasks);
  });
  router.get("/api/watch/:id", async (req, res) => {
    const { id } = req.params;
    const task = await db.get(`
      SELECT title, description, id FROM tasks WHERE id = ?` , [id]);
      res.json(task);
  });
  router.post("/api/add", async (req, res) => {
    const { title, description } = req.body;
    await db.run(`
      INSERT INTO tasks (title, description) VALUES (?, ?)
    `, [title, description]);
    res.status(201).send("Task added");
  });
  router.delete("/api/delete/:id", async (req, res) => {
    const { id } = req.params;
    await db.run(`
      DELETE FROM tasks WHERE id = ?
    `, [id]);
    res.status(200).send("Task deleted");
  });
  return router;
}
