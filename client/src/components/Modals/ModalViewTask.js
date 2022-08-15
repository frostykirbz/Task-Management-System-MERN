import React from "react"
import { Button, Form, Modal, Row, Col } from "react-bootstrap"

function ModalViewTask(props) {
  const { showViewTask, handleCloseViewTask, taskPlanView, taskView, taskDescriptionView, taskNotesView, taskStateView, taskCreatorView, taskOwnerView } = props

  return (
    <>
      <Modal show={showViewTask} onHide={handleCloseViewTask} size="xl" aria-labelledby="modalViewTask" className="ModalViewTask">
        <Modal.Header closeButton>
          <Modal.Title id="ModalViewTask">View Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                {/* Task Name */}
                <Form.Group className="mb-3" id="TaskName">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control value={taskView} type="text" placeholder="Task Name" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* Task Plan */}
                <Form.Group className="mb-3" id="TaskPlan">
                  <Form.Label>Task Plan</Form.Label>
                  <Form.Control value={taskPlanView === null ? "NIL" : taskPlanView} type="text" placeholder="Task Plan" readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                {/* Task Description */}
                <Form.Group className="mb-3" id="TaskDescription">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control rows="5" value={taskDescriptionView} as="textarea" placeholder="Description of task" readOnly />
                </Form.Group>

                {/* Task State */}
                <Form.Group className="mb-3" id="TaskState">
                  <Form.Label>Task State</Form.Label>
                  <Form.Control value={taskStateView} type="text" placeholder="Task State" readOnly />
                </Form.Group>

                {/* Task Creator */}
                <Form.Group className="mb-3" id="TaskCreator">
                  <Form.Label>Task Creator</Form.Label>
                  <Form.Control value={taskCreatorView} type="text" placeholder="Task Creator" readOnly />
                </Form.Group>

                {/* Task Owner */}
                <Form.Group className="mb-3" id="TaskOwner">
                  <Form.Label>Task Owner</Form.Label>
                  <Form.Control value={taskOwnerView} type="text" placeholder="Task Owner" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* Task Notes */}
                <Form.Group className="mb-3" id="TaskNotes">
                  <Form.Label>Task Notes Log</Form.Label>
                  <Form.Control style={{fontSize: "15px"}} value={taskNotesView} as="textarea" rows="17" placeholder="Task Notes" readOnly />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewTask}>
            Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalViewTask
