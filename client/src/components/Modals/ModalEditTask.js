import React from "react"
import Axios from "axios"
import { Button, Form, Modal, Row, Col } from "react-bootstrap"
import { useParams } from "react-router-dom"
import Select from "react-select"
import { toast, Zoom } from "react-toastify"

function ModalEditTask(props) {
  const {
    getTask,
    taskPlanList,
    showEditTask,
    handleCloseEditTask,
    taskEdit,
    taskPlanEdit,
    setTaskPlanEdit,
    updatedTaskPlanEdit,
    setUpdatedTaskPlanEdit,
    taskDescriptionEdit,
    setTaskDescriptionEdit,
    taskNotesEdit,
    setTaskNotesEdit,
    taskNotesUpdated,
    setTaskNotesUpdated,
    taskStateEdit,
    taskCreatorEdit,
    taskOwnerEdit,
    setTaskOwnerEdit
  } = props

  const { id } = useParams()
  function handleTaskPlan(plan) {
    setUpdatedTaskPlanEdit(plan)
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    try {
      let taskOwner = localStorage.getItem("username")
      const response = await Axios.post(`/api/user/app/${id}/task/edit`, { updatedTaskPlanEdit, taskEdit, taskDescriptionEdit, taskNotesUpdated, taskStateEdit, taskOwner })

      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        const response = await Axios.post(`/api/user/app/${id}/task/plan/updated`, { taskEdit })
        setTaskPlanEdit(response.data.taskPlan)
        setTaskDescriptionEdit(response.data.taskDescription)
        setTaskNotesEdit(response.data.taskNotes)
        setTaskOwnerEdit(response.data.taskOwner)
        toast.success("Task " + response.data.taskName + " has edited successfully.", toastStyle)
        setTaskNotesUpdated("")
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
      <Modal show={showEditTask} onHide={handleCloseEditTask} size="xl" aria-labelledby="modalEditTask" className="ModalEditTask">
        <Modal.Header closeButton>
          <Modal.Title id="ModalEditTask">Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                {/* Task Name */}
                <Form.Group className="mb-3" id="TaskName">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control value={taskEdit} type="text" placeholder="Task Name" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* Task Plan */}
                <Form.Group className="mb-3" id="TaskPlan">
                  <Form.Label>Task Plan</Form.Label>
                  <Select
                    isClearable
                    key={taskPlanEdit}
                    defaultValue={taskPlanEdit === null ? { label: "NIL", value: "NIL" } : { label: taskPlanEdit, value: taskPlanEdit }}
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

            <Row className="mb-3">
              <Col>
                {/* Task Description */}
                <Form.Group className="mb-3" id="TaskDescription">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control rows="5" value={taskDescriptionEdit} onChange={e => setTaskDescriptionEdit(e.target.value)} as="textarea" placeholder="Description of task" />
                </Form.Group>

                {/* Task State */}
                <Form.Group className="mb-3" id="TaskState">
                  <Form.Label>Task State</Form.Label>
                  <Form.Control value={taskStateEdit} type="text" placeholder="Task State" readOnly />
                </Form.Group>

                {/* Task Creator */}
                <Form.Group className="mb-3" id="TaskCreator">
                  <Form.Label>Task Creator</Form.Label>
                  <Form.Control value={taskCreatorEdit} type="text" placeholder="Task Creator" readOnly />
                </Form.Group>

                {/* Task Owner */}
                <Form.Group className="mb-3" id="TaskOwner">
                  <Form.Label>Task Owner</Form.Label>
                  <Form.Control value={taskOwnerEdit} type="text" placeholder="Task Owner" readOnly />
                </Form.Group>
              </Col>

              <Col>
                {/* Task Notes */}
                <Form.Group className="mb-3" id="TaskNotes">
                  <Form.Label>Task Notes Log</Form.Label>
                  <Form.Control style={{ fontSize: "15px" }} value={taskNotesEdit} as="textarea" rows="17" placeholder="Task Notes" readOnly />
                </Form.Group>
              </Col>

              {/* Task Notes Input */}
              <Form.Group className="mb-3" id="TaskNotesEdit">
                <Form.Label>Task Notes</Form.Label>
                <Form.Control rows="5" value={taskNotesUpdated} onChange={e => setTaskNotesUpdated(e.target.value)} as="textarea" placeholder="Task Notes" />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-outline-dark" style={{ backgroundColor: "#EAB126", border: "1px white" }} onClick={handleEditSubmit}>
            <i className="bi bi-pencil-square"> </i>Task
          </Button>
          <Button variant="secondary" onClick={handleCloseEditTask}>
            <i className="bi bi-box-arrow-left"> </i>Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalEditTask
