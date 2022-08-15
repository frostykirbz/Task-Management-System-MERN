import React from "react"
import Axios from "axios"
import { Button, Form, Modal, Row, Col } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { toast, Zoom } from "react-toastify"

function ModalAddTask(props) {
  const { id } = useParams()
  const {
    getTask,
    showAddTask,
    handleCloseAddTask,
    taskPlanAdd,
    taskAdd,
    setTaskAdd,
    taskDescriptionAdd,
    setTaskDescriptionAdd,
    taskNotesAdd,
    setTaskNotesAdd,
    taskStateAdd,
    setTaskStateAdd,
    taskCreatorAdd,
    setTaskCreatorAdd,
    taskOwnerAdd,
    setTaskOwnerAdd
  } = props

  async function handleAddSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/api/user/task/add", { taskAdd, taskDescriptionAdd, taskNotesAdd, taskPlanAdd, id, taskStateAdd, taskCreatorAdd, taskOwnerAdd })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        toast.success("Task " + response.data.taskName + " has created successfully.", toastStyle)
        setTaskAdd("")
        setTaskDescriptionAdd("")
        setTaskNotesAdd("")
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
      <Modal show={showAddTask} onHide={handleCloseAddTask} size="xl" aria-labelledby="modalAddTask" className="ModalAddTask">
        <Modal.Header closeButton>
          <Modal.Title id="ModalAddTask">Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                {/* Task Name */}
                <Form.Group className="mb-3" id="TaskName">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control value={taskAdd} onChange={e => setTaskAdd(e.target.value)} type="text" placeholder="Task Name" autoFocus />
                </Form.Group>
              </Col>
              <Col>
                {/* Task Plan */}
                <Form.Group className="mb-3" id="TaskPlan">
                  <Form.Label>Task Plan</Form.Label>
                  <Form.Control value={taskPlanAdd} type="text" placeholder="Task Plan" readOnly />
                </Form.Group>
              </Col>
            </Row>

            {/* Task Description */}
            <Form.Group className="mb-3" id="TaskDescription">
              <Form.Label>Task Description</Form.Label>
              <Form.Control value={taskDescriptionAdd} rows="3" onChange={e => setTaskDescriptionAdd(e.target.value)} as="textarea" placeholder="Description of task" />
            </Form.Group>

            {/* Task Notes */}
            <Form.Group className="mb-3" id="TaskNotesAdd">
              <Form.Label>Task Notes</Form.Label>
              <Form.Control value={taskNotesAdd} rows="5" onChange={e => setTaskNotesAdd(e.target.value)} as="textarea" placeholder="Task Notes" />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                {/* Task State */}
                <Form.Group className="mb-3" id="TaskState">
                  <Form.Label>Task State</Form.Label>
                  <Form.Control value={taskStateAdd} onChange={e => setTaskStateAdd(e.target.value)} readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* Task Creator */}
                <Form.Group className="mb-3" id="TaskCreator">
                  <Form.Label>Task Creator</Form.Label>
                  <Form.Control value={taskCreatorAdd} onChange={e => setTaskCreatorAdd(e.target.value)} type="text" placeholder="Task Creator" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* Task Owner */}
                <Form.Group className="mb-3" id="TaskOwner">
                  <Form.Label>Task Owner</Form.Label>
                  <Form.Control value={taskOwnerAdd} onChange={e => setTaskOwnerAdd(e.target.value)} type="text" placeholder="Task Owner" readOnly />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-outline-dark" style={{ backgroundColor: "#EAB126", border: "1px white" }} onClick={handleAddSubmit}>
            <i className="bi bi-plus-square"> </i>Task
          </Button>
          <Button variant="secondary" onClick={handleCloseAddTask}>
            <i className="bi bi-box-arrow-left"> </i>Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalAddTask
