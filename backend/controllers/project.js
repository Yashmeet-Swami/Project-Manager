import Project from "../models/project.js";
import Task from "../models/task.js";

const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const workspace = req.workspace;

    const tagArray = tags ? tags.split(",") : [];

    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      workspace: workspaceId,
      members,
      createdBy: req.user._id,
    });

    workspace.projects.push(newProject._id);
    await workspace.save();

    return res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const project = req.project;

    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await req.project.populate("members.user");

    const tasks = await Task.find({
      project: projectId,
      isArchived: false,
    })
      .populate("assignees", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      project,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { createProject, getProjectDetails, getProjectTasks };
