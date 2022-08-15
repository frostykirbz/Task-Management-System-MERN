import React from "react"
import Axios from "axios"
import { Button, Form, Modal, Row, Col } from "react-bootstrap"
import { useParams } from "react-router-dom"
import Select from "react-select"
import { toast, Zoom } from "react-toastify"

function ModalAddTaskPlan(props) {
  const {
    getTask,
    showTask,
    handleCloseTask,
    taskPlanList,
    task,
    setTask,
    taskPlan,
    setTaskPlan,
    updatedTaskPlan,
    setUpdatedTaskPlan,
    taskDescription,
    setTaskDescription,
    taskNotes,
    setTaskNotes,
    taskState,
    setTaskState,
    taskCreator,
    setTaskCreator,
    taskOwner,
    setTaskOwner
  } = props

  const { id } = useParams()

  function handleTaskPlan(updatedTaskPlan) {
    setUpdatedTaskPlan(updatedTaskPlan)
    setTaskPlan(updatedTaskPlan.value)
  }

  async function handleAddSubmit(e) {
    e.preventDefault()
    try {
      console.log(taskPlan)
      const response = await Axios.post("/api/user/task/plan/add", { task, taskDescription, taskNotes, taskPlan, id, taskState, taskCreator, taskOwner })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        toast.success("Task " + response.data.taskName + " has created successfully.", toastStyle)
        setTask("")
        setTaskPlan("")
        setUpdatedTaskPlan("")
        setTaskDescription("")
        setTaskNotes("")
        getTask()
      }
    } catch (e) {
      console.log("There is an error.")
    }
  }

  // toastify styling
  const toastStyle = {
    closeOnClick: false,
    autoClose: 500,
    closeButton: false,
    position: toast.POSITION.TOP_CENTER,
    hideProgressBar: true,
    transition: Zoom,
    theme: "colored"
  }

  return (
    <>
      <Modal show={showTask} onHide={handleCloseTask} size="xl" aria-labelledby="modalAddTaskPlan" className="ModalAddTaskPlan">
        <Modal.Header closeButton>
          <Modal.Title id="ModalAddTaskPlan">Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                {/* Task Name */}
                <Form.Group className="mb-3" id="TaskName">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control value={task} onChange={e => setTask(e.target.value)} type="text" placeholder="Task Name" autoFocus />
                </Form.Group>
              </Col>
              <Col>
                {/* Task Plan */}
                <Form.Group className="mb-3" id="TaskPlan">
                  <Form.Label>Task Plan</Form.Label>
                  <Select
                    isClearable
                    value={updatedTaskPlan}
                    onChange={handleTaskPlan}
                    options={taskPlanList.map(rows => {
                      return { label: rows.Plan_MVP_name, value: rows.Plan_MVP_name }
                    })}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: "#F7CE3E",
                        primary: "#1A2930"
                      }
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Task Description */}
            <Form.Group className="mb-3" id="TaskDescription">
              <Form.Label>Task Description</Form.Label>
              <Form.Control value={taskDescription} rows="3" onChange={e => setTaskDescription(e.target.value)} as="textarea" placeholder="Description of task" />
            </Form.Group>

            {/* Task Notes */}
            <Form.Group className="mb-3" id="TaskNotes">
              <Form.Label>Task Notes</Form.Label>
              <Form.Control value={taskNotes} rows="5" onChange={e => setTaskNotes(e.target.value)} as="textarea" placeholder="Task Notes" />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                {/* Task State */}
                <Form.Group className="mb-3" id="TaskState">
                  <Form.Label>Task State</Form.Label>
                  <Form.Control value={taskState} onChange={e => setTaskState(e.target.value)} readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* Task Creator */}
                <Form.Group className="mb-3" id="TaskCreator">
                  <Form.Label>Task Creator</Form.Label>
                  <Form.Control value={taskCreator} onChange={e => setTaskCreator(e.target.value)} type="text" placeholder="Task Creator" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* Task Owner */}
                <Form.Group className="mb-3" id="TaskOwner">
                  <Form.Label>Task Owner</Form.Label>
                  <Form.Control value={taskOwner} onChange={e => setTaskOwner(e.target.value)} type="text" placeholder="Task Owner" readOnly />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-outline-dark" style={{ backgroundColor: "#EAB126", border: "1px white" }} onClick={handleAddSubmit}>
            <i className="bi bi-plus-square"> </i>Task
          </Button>
          <Button variant="secondary" onClick={handleCloseTask}>
            <i className="bi bi-box-arrow-left"> </i>Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalAddTaskPlan
