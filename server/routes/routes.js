const express = require("express")
const router = express.Router()

// import controller methods
const { loginAuth } = require("../controllers/LoginController")
const { getUsers, getUserUpdate, getUserGroup } = require("../controllers/AdminGetController")
const { getGroup } = require("../controllers/GroupGetController")
const { addUser } = require("../controllers/AdminAddController")
const { addGroup } = require("../controllers/GroupAddController")
const { editUserAdmin } = require("../controllers/AdminUpdateController")
const { editGroup } = require("../controllers/GroupUpdateController")
const { getUserDetails } = require("../controllers/UserGetController")
const { editUser } = require("../controllers/UserUpdateController")
const { checkGroup, checkUserGroup } = require("../controllers/GroupCheckController")
const { getApp, getEditApp, viewApp, getDashboardApp } = require("../controllers/AppGetController")
const { addApp } = require("../controllers/AppAddController")
const { editApp } = require("../controllers/AppUpdateController")
const { addPlan } = require("../controllers/PlanAddController")
const { getPlan } = require("../controllers/PlanGetController")
const { addTask } = require("../controllers/TaskAddController")
const { addTaskPlan } = require("../controllers/TaskPlanAddController")
const { getTask, getOneTask, getUpdatedTask, getUpdatedTaskPlan, viewTask } = require("../controllers/TaskGetController")
const { editTask } = require("../controllers/TaskUpdateController")
const { handleMoveState } = require("../controllers/TaskMoveController")
const { sendMail } = require("../controllers/TaskSendMailController")

/* ASSIGNMENT 3 */
const { CreateTaskAPI } = require("../rest-api/CreateTask")
const { GetTaskbyStateAPI } = require("../rest-api/GetTaskbyState")
const { PromoteTask2DoneAPI } = require("../rest-api/PromoteTaskToDone")

/* LOGIN */
router.route("/login").post(loginAuth)
router.route("/user/checkGroup").post(checkGroup)
router.route("/checkUserGroup").post(checkUserGroup)

/* ADMIN - GET */
router.route("/admin/user").get(getUsers)
router.route("/admin/user/:id").get(getUserUpdate)
router.route("/admin/user/group/:id").get(getUserGroup)
router.route("/group").get(getGroup)

/* ADMIN - ADD */
router.route("/admin/user/add").post(addUser)
router.route("/admin/group/add").post(addGroup)

/* ADMIN - UPDATE */
router.route("/admin/user/update/:id").post(editUserAdmin)
router.route("/admin/group/update/:id").post(editGroup)

/* USER - GET */
router.route("/user/details").post(getUserDetails)

/* USER - UPDATE */
router.route("/user/update").post(editUser)

/* ASSIGNMENT 2 */
/* PROJECT LEAD - GET */
router.route("/app").get(getApp)
router.route("/user/app/:id").get(getDashboardApp)
router.route("/user/app/get").post(getEditApp)
router.route("/user/app/view").post(viewApp)
router.route("/user/app/:id/task").get(getTask)
router.route("/user/app/:id/task/update").post(getOneTask)
router.route("/user/app/:id/task/updated").post(getUpdatedTask)
router.route("/user/app/:id/task/plan/updated").post(getUpdatedTaskPlan)
router.route("/user/app/:id/task/view").post(viewTask)
router.route("/user/task/state/update").post(handleMoveState)

/* PROJECT LEAD - ADD */
router.route("/user/app/add").post(addApp)
router.route("/user/task/add").post(addTask)
router.route("/user/task/plan/add").post(addTaskPlan)

/* PROJECT LEAD - UPDATE */
router.route("/user/app/update/:id").post(editApp)
router.route("/user/app/:id/task/edit").post(editTask)

/* PROJECT MANAGER - ADD */
router.route("/user/plan/add").post(addPlan)

/* PROJECT MANAGER - GET */
router.route("/user/app/:id/plan").get(getPlan)

/* SEND EMAIL */
router.route("/sendMail").post(sendMail)

/* ASSIGNMENT 3 */
router.route("/CreateTask").post(CreateTaskAPI)
router.route("/GetTaskbyState").get(GetTaskbyStateAPI)
router.route("/PromoteTask2Done").post(PromoteTask2DoneAPI)

module.exports = router
