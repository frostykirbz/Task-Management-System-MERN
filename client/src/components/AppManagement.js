import React, { useState } from "react"
import { Card, Button, Row, Col } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import ModalAddPlan from "../components/Modals/ModalAddPlan"
import ModalAddTaskPlan from "../components/Modals/ModalAddTaskPlan"

function AppManagement(props) {
  // props from DashBoard
  const { getPlan, getTask, getTaskPlanDetails, appList, taskPlanList, userGroup } = props
  const navigate = useNavigate()
  const { id } = useParams()

  // modal props variables (add plan)
  const [planMVPName, setPlanMVPName] = useState("")
  const [planStartDate, setPlanStartDate] = useState("")
  const [planEndDate, setPlanEndDate] = useState("")
  const [planAppAcronym, setPlanAppAcronym] = useState("")

  // modal (add plan)
  const [showPlan, setShowPlan] = useState(false)
  const handleShowPlan = () => setShowPlan(true)

  const handleClosePlan = () => {
    setShowPlan(false)
    setPlanMVPName("")
    setPlanStartDate("")
    setPlanEndDate("")
  }

  // modal props variables (add task with/without plan)
  const [task, setTask] = useState("")
  const [taskPlan, setTaskPlan] = useState("")
  const [updatedTaskPlan, setUpdatedTaskPlan] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskNotes, setTaskNotes] = useState("")
  const [taskState, setTaskState] = useState("Open")
  const [taskCreator, setTaskCreator] = useState(localStorage.getItem("username"))
  const [taskOwner, setTaskOwner] = useState(localStorage.getItem("username"))

  // modal (add task with/without plan)
  const [showTask, setShowTask] = useState(false)
  const handleShowTask = () => {
    setShowTask(true)
    getTaskPlanDetails()
  }

  const handleCloseTask = () => {
    setShowTask(false)
    setTask("")
    setTaskPlan("")
    setUpdatedTaskPlan("")
    setTaskDescription("")
    setTaskNotes("")
  }

  return (
    <>
      {appList.map(rows => {
        return (
          <Card key={id}>
            <Card.Header style={{ backgroundColor: "#1A2930" }}>
              <Row>
                <Col>
                  <Card.Title style={{ marginTop: "5px", color: "white" }}>Name: {id}</Card.Title>
                </Col>
                <Col style={{ textAlign: "right" }}>
                  {userGroup.includes(rows.App_permit_Create) ? (
                    <Button className="btn btn-outline-dark" style={{ marginRight: "10px", backgroundColor: "#EAB126", border: "1px white" }} onClick={() => handleShowTask()}>
                      <i className="bi bi-plus-square"> </i>Task
                    </Button>
                  ) : null}

                  {userGroup.includes("Project Manager") ? (
                    <Button className="btn btn-outline-dark" style={{ marginRight: "10px", backgroundColor: "#EAB126", border: "1px white" }} onClick={() => handleShowPlan()}>
                      <i className="bi bi-plus-square"> </i>Plan
                    </Button>
                  ) : null}

                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    <i className="bi bi-box-arrow-left"> </i>Back
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row className="text-center mb-3">
                <Col>
                  <Card.Title>Start Date</Card.Title>
                  <Card.Text>{rows.startDate === null ? "NIL" : rows.startDate}</Card.Text>
                </Col>
                <Col>
                  <Card.Title>End Date</Card.Title>
                  <Card.Text>{rows.endDate === null ? "NIL" : rows.endDate}</Card.Text>
                </Col>
                <Col>
                  <Card.Title>Permit Create</Card.Title>
                  <Card.Text>{rows.App_permit_Create === (null || "") ? "NIL" : rows.App_permit_Create}</Card.Text>
                </Col>
                <Col>
                  <Card.Title>Permit Open</Card.Title>
                  <Card.Text>{rows.App_permit_Open === (null || "") ? "NIL" : rows.App_permit_Open}</Card.Text>
                </Col>
                <Col>
                  <Card.Title>Permit ToDoList</Card.Title>
                  <Card.Text>{rows.App_permit_toDoList === (null || "") ? "NIL" : rows.App_permit_toDoList}</Card.Text>
                </Col>
                <Col>
                  <Card.Title>Permit Doing</Card.Title>
                  <Card.Text>{rows.App_permit_Doing === (null || "") ? "NIL" : rows.App_permit_Doing}</Card.Text>
                </Col>
                <Col>
                  <Card.Title>Permit Done</Card.Title>
                  <Card.Text>{rows.App_permit_Done === (null || "") ? "NIL" : rows.App_permit_Done}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )
      })}

      <ModalAddPlan
        getPlan={getPlan}
        showPlan={showPlan}
        handleClosePlan={handleClosePlan}
        planMVPName={planMVPName}
        setPlanMVPName={setPlanMVPName}
        planStartDate={planStartDate}
        setPlanStartDate={setPlanStartDate}
        planEndDate={planEndDate}
        setPlanEndDate={setPlanEndDate}
        planAppAcronym={planAppAcronym}
        setPlanAppAcronym={setPlanAppAcronym}
      />

      <ModalAddTaskPlan
        getTask={getTask}
        showTask={showTask}
        handleCloseTask={handleCloseTask}
        taskPlanList={taskPlanList}
        task={task}
        setTask={setTask}
        taskPlan={taskPlan}
        setTaskPlan={setTaskPlan}
        updatedTaskPlan={updatedTaskPlan}
        setUpdatedTaskPlan={setUpdatedTaskPlan}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
        taskNotes={taskNotes}
        setTaskNotes={setTaskNotes}
        taskState={taskState}
        setTaskState={setTaskState}
        taskCreator={taskCreator}
        setTaskCreator={setTaskCreator}
        taskOwner={taskOwner}
        setTaskOwner={setTaskOwner}
      />
    </>
  )
}

export default AppManagement
