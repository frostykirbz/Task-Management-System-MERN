import React, { useEffect, useState } from "react"
import { Card, Button, Row, Col } from "react-bootstrap"
import Axios from "axios"
import { useParams } from "react-router-dom"
import ModalAddTask from "../components/Modals/ModalAddTask"
import ModalEditTask from "../components/Modals/ModalEditTask"
import ModalViewTask from "../components/Modals/ModalViewTask"

function TaskManagement(props) {
  // props from DashBoard
  const { getPlan, getTask, getTaskPlanDetails, planList, taskList, taskPlanList, userGroup } = props

  // TaskManagement variables
  const { id } = useParams()

  // modal props vairables (view task)
  const [taskPlanView, setTaskPlanView] = useState("")
  const [taskView, setTaskView] = useState("")
  const [taskDescriptionView, setTaskDescriptionView] = useState("")
  const [taskNotesView, setTaskNotesView] = useState("")
  const [taskStateView, setTaskStateView] = useState("")
  const [taskCreatorView, setTaskCreatorView] = useState("")
  const [taskOwnerView, setTaskOwnerView] = useState("")

  // modal (view task)
  const [showViewTask, setShowViewTask] = useState(false)
  const handleShowViewTask = task => {
    setShowViewTask(true)
    setTaskView(task)
    getTaskViewDetails(task)
  }
  const handleCloseViewTask = () => setShowViewTask(false)

  async function getTaskViewDetails(task) {
    try {
      const response = await Axios.post(`/api/user/app/${id}/task/view`, { task })

      if (response.data) {
        setTaskPlanView(response.data.taskPlan)
        setTaskDescriptionView(response.data.taskDescription)
        setTaskNotesView(response.data.taskNotes)
        setTaskStateView(response.data.taskState)
        setTaskCreatorView(response.data.taskCreator)
        setTaskOwnerView(response.data.taskOwner)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  // modal props variables (add task)
  const [taskPlanAdd, setTaskPlanAdd] = useState("")
  const [taskAdd, setTaskAdd] = useState("")
  const [taskDescriptionAdd, setTaskDescriptionAdd] = useState("")
  const [taskNotesAdd, setTaskNotesAdd] = useState("")
  const [taskStateAdd, setTaskStateAdd] = useState("Open")
  const [taskCreatorAdd, setTaskCreatorAdd] = useState(localStorage.getItem("username"))
  const [taskOwnerAdd, setTaskOwnerAdd] = useState(localStorage.getItem("username"))

  // modal (add task)
  const [showAddTask, setShowAddTask] = useState(false)
  const handleShowAddTask = plan => {
    setShowAddTask(true)
    setTaskPlanAdd(plan)
  }
  const handleCloseAddTask = () => {
    setShowAddTask(false)
    setTaskAdd("")
    setTaskDescriptionAdd("")
    setTaskNotesAdd("")
  }

  //  modal props variables (edit task)
  const [taskEdit, setTaskEdit] = useState("")
  const [taskPlanEdit, setTaskPlanEdit] = useState("")
  const [updatedTaskPlanEdit, setUpdatedTaskPlanEdit] = useState()
  const [taskDescriptionEdit, setTaskDescriptionEdit] = useState("")
  const [taskNotesUpdated, setTaskNotesUpdated] = useState("")
  const [taskNotesEdit, setTaskNotesEdit] = useState("")
  const [taskStateEdit, setTaskStateEdit] = useState("")
  const [taskCreatorEdit, setTaskCreatorEdit] = useState("")
  const [taskOwnerEdit, setTaskOwnerEdit] = useState(localStorage.getItem("username"))

  // modal (edit task)
  const [showEditTask, setShowEditTask] = useState(false)
  const handleShowEditTask = task => {
    setShowEditTask(true)
    setTaskEdit(task)
    getTaskPlanDetails()
    getTaskUpdateDetails(task)
  }
  const handleCloseEditTask = () => {
    setShowEditTask(false)
    setTaskDescriptionEdit("")
    setTaskNotesUpdated("")
  }

  async function getTaskUpdateDetails(task) {
    try {
      const response = await Axios.post(`/api/user/app/${id}/task/updated`, { task })
      if (response.data) {
        setTaskPlanEdit(response.data.taskPlan)
        setUpdatedTaskPlanEdit({ label: response.data.taskPlan, value: response.data.taskPlan })
        setTaskDescriptionEdit(response.data.taskDescription)
        setTaskNotesEdit(response.data.taskNotes)
        setTaskStateEdit(response.data.taskState)
        setTaskCreatorEdit(response.data.taskCreator)
        setTaskOwnerEdit(response.data.taskOwner)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  useEffect(() => {
    getPlan()
    getTask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // functions (left/right button)
  // -> State (Open to To Do)
  async function handleOpenRightToDo(taskName, taskPlan, taskApp, taskState) {
    taskState = "To Do"
    let taskOwner = localStorage.getItem("username")
    try {
      const response = await Axios.post(`/api/user/task/state/update`, { taskName, taskPlan, taskApp, taskState, taskOwner })
      if (response.data) {
        getTask()
      }
    } catch (err) {
      console.log("Error")
    }
  }

  // -> State (To Do to Doing)
  async function handleToDoRightDoing(taskName, taskPlan, taskApp, taskState) {
    taskState = "Doing"
    let taskOwner = localStorage.getItem("username")
    try {
      const response = await Axios.post(`/api/user/task/state/update`, { taskName, taskPlan, taskApp, taskState, taskOwner })
      if (response.data) {
        getTask()
      }
    } catch (err) {
      console.log("Error")
    }
  }

  // <- State (Doing to To Do)
  async function handleDoingLeftToDo(taskName, taskPlan, taskApp, taskState) {
    taskState = "To Do"
    let taskOwner = localStorage.getItem("username")
    try {
      const response = await Axios.post(`/api/user/task/state/update`, { taskName, taskPlan, taskApp, taskState, taskOwner })
      if (response.data) {
        getTask()
      }
    } catch (err) {
      console.log("Error")
    }
  }

  // -> State (Doing to Done)
  async function handleDoingRightDone(taskName, taskPlan, taskApp, taskState) {
    taskState = "Done"
    let taskOwner = localStorage.getItem("username")
    try {
      const response = await Axios.post(`/api/user/task/state/update`, { taskName, taskPlan, taskApp, taskState, taskOwner })
      if (response.data) {
        getTask()
      }

      const responseEmail = await Axios.post("/api/sendMail", { taskOwner, taskName, taskApp })
      if (responseEmail.data) {
        console.log("Mail is sent.")
      }
    } catch (err) {
      console.log("Error")
    }
  }

  // <- State (Done to Doing)
  async function handleDoneLeftDoing(taskName, taskPlan, taskApp, taskState) {
    taskState = "Doing"
    let taskOwner = localStorage.getItem("username")
    try {
      const response = await Axios.post(`/api/user/task/state/update`, { taskName, taskPlan, taskApp, taskState, taskOwner })
      if (response.data) {
        getTask()
      }
    } catch (err) {
      console.log("Error")
    }
  }

  // -> State (Done to Close)
  async function handleDoneRightClose(taskName, taskPlan, taskApp, taskState) {
    taskState = "Close"
    let taskOwner = localStorage.getItem("username")
    try {
      const response = await Axios.post(`/api/user/task/state/update`, { taskName, taskPlan, taskApp, taskState, taskOwner })
      if (response.data) {
        getTask()
      }
    } catch (err) {
      console.log("Error")
    }
  }

  return (
    <Row>
      <Col>
        {/* PLAN  */}
        <Card className="mb-2">
          <Card.Header style={{ textAlign: "center", backgroundColor: "#1A2930", color: "white", borderBottom: "2px solid white" }}>
            <Card.Title>Plan</Card.Title>
          </Card.Header>
          <Card.Body style={{ backgroundColor: "#C5C1C0" }}>
            {planList.map(rows => {
              let colorInfo = {
                marginBottom: "15px",
                borderTop: `${rows.Plan_color}` !== "" ? `10px solid ${rows.Plan_color}` : `2px solid #C5C1C0`,
                borderRight: "2px solid #C5C1C0",
                borderLeft: "2px solid #C5C1C0",
                borderBottom: "2px solid #C5C1C0",
                textAlign: "center",
                fontSize: "90%"
              }

              return (
                <Card key={rows.Plan_MVP_name} style={colorInfo}>
                  <Card.Header>
                    <Card.Subtitle>{rows.Plan_MVP_name}</Card.Subtitle>
                  </Card.Header>
                  <Card.Body>
                    <Row style={{ fontSize: "85%" }}>
                      <Col>
                        <Card.Text>
                          <i className="bi bi-calendar"> </i>Start Date
                          <br />
                          {rows.startDate === null ? "NIL" : rows.startDate}
                        </Card.Text>
                      </Col>
                      <Col>
                        <Card.Text>
                          <i className="bi bi-calendar-fill"> </i>End Date
                          <br />
                          {rows.endDate === null ? "NIL" : rows.endDate}
                        </Card.Text>
                      </Col>
                    </Row>
                    <br />
                    {/* inline arrow function: create and pass a new function instance on each render */}
                    {userGroup.includes(rows.App_permit_Create) ? (
                      <Button variant="dark" style={{ fontSize: "85%" }} onClick={() => handleShowAddTask(rows.Plan_MVP_name)}>
                        <i className="bi bi-plus-square"> </i>Task
                      </Button>
                    ) : null}
                  </Card.Body>
                </Card>
              )
            })}
          </Card.Body>
        </Card>
      </Col>

      <Col>
        {/* OPEN TASK */}
        <Card className="mb-2">
          <Card.Header style={{ textAlign: "center", backgroundColor: "#1A2930", color: "white", borderBottom: "2px solid white" }}>
            <Card.Title>Open</Card.Title>
          </Card.Header>
          <Card.Body style={{ backgroundColor: "#C5C1C0" }}>
            {taskList.map(rows => {
              let colorInfo = {
                marginBottom: "15px",
                borderTop: `${rows.Task_plan_color}` !== "" ? `10px solid ${rows.Task_plan_color}` : `2px solid #C5C1C0`,
                borderRight: "2px solid #C5C1C0",
                borderLeft: "2px solid #C5C1C0",
                borderBottom: "2px solid #C5C1C0",
                fontSize: "90%"
              }

              if (rows.Task_state === "Open") {
                return (
                  <Card key={rows.Task_name} style={colorInfo}>
                    <Card.Header style={{ cursor: "pointer" }} onClick={() => handleShowViewTask(rows.Task_name)}>
                      <Card.Subtitle>{rows.Task_name}</Card.Subtitle>
                      <Card.Text style={{ fontSize: "75%" }}>
                        <i className="bi bi-eye"> </i>Click here To view
                      </Card.Text>
                    </Card.Header>

                    <Card.Body>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-file-text-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_description.length > 15 ? rows.Task_description.substring(0, 15) + "..." : rows.Task_description}</Card.Text>
                        </Col>
                      </Row>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-person-check-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_owner}</Card.Text>
                        </Col>
                      </Row>
                      <Row>
                        {userGroup.includes(rows.App_permit_Open) && rows.App_permit_Open !== "" ? (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button className="btn btn-outline-dark" style={{ visibility: "hidden", fontSize: "85%", backgroundColor: "#EAB126", border: "1px white" }}>
                              <i className="bi bi-arrow-left-square"></i>
                            </Button>
                            {/* inline arrow function: create and pass a new function instance on each render */}
                            <Button variant="dark" style={{ fontSize: "85%" }} onClick={() => handleShowEditTask(rows.Task_name)}>
                              <i className="bi bi-pencil-square"> </i>Task
                            </Button>
                            <Button
                              className="btn btn-outline-dark"
                              style={{ fontSize: "85%", backgroundColor: "#EAB126", border: "1px white" }}
                              onClick={() => handleOpenRightToDo(rows.Task_name, rows.Task_plan, rows.Task_app_Acronym, rows.Task_state)}
                            >
                              <i className="bi bi-arrow-right-square"></i>
                            </Button>
                          </div>
                        ) : null}
                      </Row>
                    </Card.Body>
                  </Card>
                )
              }
              return null
            })}
          </Card.Body>
        </Card>
      </Col>

      <Col>
        {/* TO DO TASK */}
        <Card className="mb-2">
          <Card.Header style={{ textAlign: "center", backgroundColor: "#1A2930", color: "white", borderBottom: "2px solid white" }}>
            <Card.Title>To Do</Card.Title>
          </Card.Header>
          <Card.Body style={{ backgroundColor: "#C5C1C0" }}>
            {taskList.map(rows => {
              let colorInfo = {
                marginBottom: "15px",
                borderTop: `${rows.Task_plan_color}` !== "" ? `10px solid ${rows.Task_plan_color}` : `2px solid #C5C1C0`,
                borderRight: "2px solid #C5C1C0",
                borderLeft: "2px solid #C5C1C0",
                borderBottom: "2px solid #C5C1C0",
                fontSize: "90%"
              }

              if (rows.Task_state === "To Do") {
                return (
                  <Card key={rows.Task_name} style={colorInfo}>
                    <Card.Header style={{ cursor: "pointer" }} onClick={() => handleShowViewTask(rows.Task_name)}>
                      <Card.Subtitle>{rows.Task_name}</Card.Subtitle>
                      <Card.Text style={{ fontSize: "75%" }}>
                        <i className="bi bi-eye"> </i>Click here To view
                      </Card.Text>
                    </Card.Header>

                    <Card.Body>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-file-text-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_description.length > 15 ? rows.Task_description.substring(0, 15) + "..." : rows.Task_description}</Card.Text>
                        </Col>
                      </Row>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-person-check-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_owner}</Card.Text>
                        </Col>
                      </Row>
                      <Row>
                        {userGroup.includes(rows.App_permit_toDoList) && rows.App_permit_toDoList !== "" ? (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button className="btn btn-outline-dark" style={{ visibility: "hidden", fontSize: "85%", backgroundColor: "#EAB126", border: "1px white" }}>
                              <i className="bi bi-arrow-left-square"></i>
                            </Button>
                            {/* inline arrow function: create and pass a new function instance on each render */}
                            <Button variant="dark" style={{ fontSize: "85%" }} onClick={() => handleShowEditTask(rows.Task_name)}>
                              <i className="bi bi-pencil-square"> </i>Task
                            </Button>
                            <Button
                              className="btn btn-outline-dark"
                              style={{ fontSize: "85%", backgroundColor: "#EAB126", border: "1px white" }}
                              onClick={() => handleToDoRightDoing(rows.Task_name, rows.Task_plan, rows.Task_app_Acronym, rows.Task_state)}
                            >
                              <i className="bi bi-arrow-right-square"></i>
                            </Button>
                          </div>
                        ) : null}
                      </Row>
                    </Card.Body>
                  </Card>
                )
              }
              return null
            })}
          </Card.Body>
        </Card>
      </Col>

      <Col>
        <Card className="mb-2">
          <Card.Header style={{ textAlign: "center", backgroundColor: "#1A2930", color: "white", borderBottom: "2px solid white" }}>
            <Card.Title>Doing</Card.Title>
          </Card.Header>
          <Card.Body style={{ backgroundColor: "#C5C1C0" }}>
            {taskList.map(rows => {
              let colorInfo = {
                marginBottom: "15px",
                borderTop: `${rows.Task_plan_color}` !== "" ? `10px solid ${rows.Task_plan_color}` : `2px solid #C5C1C0`,
                borderRight: "2px solid #C5C1C0",
                borderLeft: "2px solid #C5C1C0",
                borderBottom: "2px solid #C5C1C0",
                fontSize: "90%"
              }

              if (rows.Task_state === "Doing") {
                return (
                  <Card key={rows.Task_name} style={colorInfo}>
                    <Card.Header style={{ cursor: "pointer" }} onClick={() => handleShowViewTask(rows.Task_name)}>
                      <Card.Subtitle>{rows.Task_name}</Card.Subtitle>
                      <Card.Text style={{ fontSize: "75%" }}>
                        <i className="bi bi-eye"> </i>Click here To view
                      </Card.Text>
                    </Card.Header>

                    <Card.Body>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-file-text-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_description.length > 15 ? rows.Task_description.substring(0, 15) + "..." : rows.Task_description}</Card.Text>
                        </Col>
                      </Row>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-person-check-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_owner}</Card.Text>
                        </Col>
                      </Row>
                      <Row>
                        {userGroup.includes(rows.App_permit_Doing) && rows.App_permit_Doing !== "" ? (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                              className="btn btn-outline-dark"
                              style={{ fontSize: "85%", backgroundColor: "#EAB126", border: "1px white" }}
                              onClick={() => handleDoingLeftToDo(rows.Task_name, rows.Task_plan, rows.Task_app_Acronym, rows.Task_state)}
                            >
                              <i className="bi bi-arrow-left-square"></i>
                            </Button>
                            {/* inline arrow function: create and pass a new function instance on each render */}
                            <Button variant="dark" style={{ fontSize: "85%" }} onClick={() => handleShowEditTask(rows.Task_name)}>
                              <i className="bi bi-pencil-square"> </i>Task
                            </Button>
                            <Button
                              className="btn btn-outline-dark"
                              style={{ fontSize: "85%", backgroundColor: "#EAB126", border: "1px white" }}
                              onClick={() => handleDoingRightDone(rows.Task_name, rows.Task_plan, rows.Task_app_Acronym, rows.Task_state)}
                            >
                              <i className="bi bi-arrow-right-square"></i>
                            </Button>
                          </div>
                        ) : null}
                      </Row>
                    </Card.Body>
                  </Card>
                )
              }
              return null
            })}
          </Card.Body>
        </Card>
      </Col>

      <Col>
        <Card className="mb-2">
          <Card.Header style={{ textAlign: "center", backgroundColor: "#1A2930", color: "white", borderBottom: "2px solid white" }}>
            <Card.Title>Done</Card.Title>
          </Card.Header>
          <Card.Body style={{ backgroundColor: "#C5C1C0" }}>
            {taskList.map(rows => {
              let colorInfo = {
                marginBottom: "15px",
                borderTop: `${rows.Task_plan_color}` !== "" ? `10px solid ${rows.Task_plan_color}` : `2px solid black`,
                borderRight: "2px solid #C5C1C0",
                borderLeft: "2px solid #C5C1C0",
                borderBottom: "2px solid #C5C1C0",
                fontSize: "90%"
              }

              if (rows.Task_state === "Done") {
                return (
                  <Card key={rows.Task_name} style={colorInfo}>
                    <Card.Header style={{ cursor: "pointer" }} onClick={() => handleShowViewTask(rows.Task_name)}>
                      <Card.Subtitle>{rows.Task_name}</Card.Subtitle>
                      <Card.Text style={{ fontSize: "75%" }}>
                        <i className="bi bi-eye"> </i>Click here To view
                      </Card.Text>
                    </Card.Header>

                    <Card.Body>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-file-text-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_description.length > 15 ? rows.Task_description.substring(0, 15) + "..." : rows.Task_description}</Card.Text>
                        </Col>
                      </Row>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-person-check-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_owner}</Card.Text>
                        </Col>
                      </Row>
                      <Row>
                        {userGroup.includes(rows.App_permit_Done) && rows.App_permit_Done !== "" ? (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                              className="btn btn-outline-dark"
                              style={{ fontSize: "85%", backgroundColor: "#EAB126", border: "1px white" }}
                              onClick={() => handleDoneLeftDoing(rows.Task_name, rows.Task_plan, rows.Task_app_Acronym, rows.Task_state)}
                            >
                              <i className="bi bi-arrow-left-square"></i>
                            </Button>
                            {/* inline arrow function: create and pass a new function instance on each render */}
                            <Button variant="dark" style={{ fontSize: "85%" }} onClick={() => handleShowEditTask(rows.Task_name)}>
                              <i className="bi bi-pencil-square"> Task</i>
                            </Button>
                            <Button
                              className="btn btn-outline-dark"
                              style={{ fontSize: "85%", backgroundColor: "#EAB126", border: "1px white" }}
                              onClick={() => handleDoneRightClose(rows.Task_name, rows.Task_plan, rows.Task_app_Acronym, rows.Task_state)}
                            >
                              <i className="bi bi-arrow-right-square"></i>
                            </Button>
                          </div>
                        ) : null}
                      </Row>
                    </Card.Body>
                  </Card>
                )
              }
              return null
            })}
          </Card.Body>
        </Card>
      </Col>

      <Col>
        <Card className="mb-2">
          <Card.Header style={{ textAlign: "center", backgroundColor: "#1A2930", color: "white", borderBottom: "2px solid white" }}>
            <Card.Title>Close</Card.Title>
          </Card.Header>
          <Card.Body style={{ backgroundColor: "#C5C1C0" }}>
            {taskList.map(rows => {
              let colorInfo = {
                marginBottom: "15px",
                borderTop: `${rows.Task_plan_color}` !== "" ? `10px solid ${rows.Task_plan_color}` : `2px solid #C5C1C0`,
                borderRight: "2px solid #C5C1C0",
                borderLeft: "2px solid #C5C1C0",
                borderBottom: "2px solid #C5C1C0",
                fontSize: "90%"
              }

              if (rows.Task_state === "Close") {
                return (
                  <Card key={rows.Task_name} style={colorInfo}>
                    <Card.Header style={{ cursor: "pointer" }} onClick={() => handleShowViewTask(rows.Task_name)}>
                      <Card.Subtitle>{rows.Task_name}</Card.Subtitle>
                      <Card.Text style={{ fontSize: "75%" }}>
                        <i className="bi bi-eye"> </i>Click here To view
                      </Card.Text>
                    </Card.Header>

                    <Card.Body>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-file-text-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_description.length > 15 ? rows.Task_description.substring(0, 15) + "..." : rows.Task_description}</Card.Text>
                        </Col>
                      </Row>
                      <Row className="mb-2" style={{ fontSize: "85%" }}>
                        <Col xs={2}>
                          <i className="bi bi-person-check-fill"></i>
                        </Col>
                        <Col md={10}>
                          <Card.Text>{rows.Task_owner}</Card.Text>
                        </Col>
                      </Row>
                      <br />
                    </Card.Body>
                  </Card>
                )
              }
              return null
            })}
          </Card.Body>
        </Card>
      </Col>

      <ModalViewTask
        showViewTask={showViewTask}
        handleCloseViewTask={handleCloseViewTask}
        taskPlanView={taskPlanView}
        taskView={taskView}
        taskDescriptionView={taskDescriptionView}
        taskNotesView={taskNotesView}
        taskStateView={taskStateView}
        taskCreatorView={taskCreatorView}
        taskOwnerView={taskOwnerView}
      />

      <ModalAddTask
        getTask={getTask}
        showAddTask={showAddTask}
        handleCloseAddTask={handleCloseAddTask}
        taskPlanAdd={taskPlanAdd}
        taskAdd={taskAdd}
        setTaskAdd={setTaskAdd}
        taskDescriptionAdd={taskDescriptionAdd}
        setTaskDescriptionAdd={setTaskDescriptionAdd}
        taskNotesAdd={taskNotesAdd}
        setTaskNotesAdd={setTaskNotesAdd}
        taskStateAdd={taskStateAdd}
        setTaskStateAdd={setTaskStateAdd}
        taskCreatorAdd={taskCreatorAdd}
        setTaskCreatorAdd={setTaskCreatorAdd}
        taskOwnerAdd={taskOwnerAdd}
        setTaskOwnerAdd={setTaskOwnerAdd}
      />

      <ModalEditTask
        getTask={getTask}
        taskPlanList={taskPlanList}
        showEditTask={showEditTask}
        handleCloseEditTask={handleCloseEditTask}
        taskEdit={taskEdit}
        taskPlanEdit={taskPlanEdit}
        setTaskPlanEdit={setTaskPlanEdit}
        updatedTaskPlanEdit={updatedTaskPlanEdit}
        setUpdatedTaskPlanEdit={setUpdatedTaskPlanEdit}
        taskDescriptionEdit={taskDescriptionEdit}
        setTaskDescriptionEdit={setTaskDescriptionEdit}
        taskNotesEdit={taskNotesEdit}
        setTaskNotesEdit={setTaskNotesEdit}
        taskNotesUpdated={taskNotesUpdated}
        setTaskNotesUpdated={setTaskNotesUpdated}
        taskStateEdit={taskStateEdit}
        setTaskStateEdit={setTaskStateEdit}
        taskCreatorEdit={taskCreatorEdit}
        setTaskCreatorEdit={setTaskCreatorEdit}
        taskOwnerEdit={taskOwnerEdit}
        setTaskOwnerEdit={setTaskOwnerEdit}
      />
    </Row>
  )
}

export default TaskManagement
