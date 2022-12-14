import { Request, Response } from "express";
import User from "../model/User";
import { tokenBearer } from "../middleware/verifyJWT";

export const getAllTasks = async (req: Request, res: Response) => {
  const foundUser = await User.findOne({
    username: tokenBearer.username,
  }).exec();
  if (!foundUser) return res.status(404).json({ message: "User not found" });
  const tasks = foundUser?.tasks;
  res.status(200).json({ tasks });
};

export const createNewTask = async (req: Request, res: Response) => {
  if (!req.body.title)
    return res.status(400).json({ message: "task title is required" });

  const { title, description, subtasks, status } = req.body;

  try {
    const foundUser = await User.findOne({
      username: tokenBearer.username,
    }).exec();

    await foundUser?.updateOne({
      $push: { tasks: { title, description, subtasks, status } },
    });

    await foundUser?.save();
    res.status(201).json({ message: "Task created" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  if (!req.body.taskId)
    return res.status(400).json({ message: "taskId parameter is required" });

  const { taskId, title, description, subtasks, status } = req.body;

  if (!taskId) return res.status(400).json({ message: "Task ID is required" });

  try {
    const foundUser = await User.findOne({
      username: tokenBearer.username,
    }).exec();

    const foundTask = foundUser?.tasks.find((task) => task._id == taskId);

    if (!foundTask) return res.status(404).json({ message: "Task not found" });

    await User?.findOneAndUpdate(
      { username: tokenBearer.username, "tasks._id": taskId },
      {
        $set: {
          "tasks.$.title": title,
          "tasks.$.description": description,
          "tasks.$.subtasks": subtasks,
          "tasks.$.status": status,
        },
      }
    );
    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  if (!req.params.id)
    return res.status(400).json({ message: "taskId parameter is required" });

  const taskId = req.params.id;
  try {
    await User?.findOneAndUpdate(
      { username: tokenBearer.username },
      { $pull: { tasks: { _id: taskId } } }
    );

    return res.status(200).json({ message: "Task successfully deleted" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
