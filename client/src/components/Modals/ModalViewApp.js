import React from "react"
import { Button, Form, Modal, Row, Col } from "react-bootstrap"

function ModalViewApp(props) {
  const {
    showViewApp,
    handleCloseViewApp,
    appAcronymView,
    appDescriptionView,
    appRNumberView,
    appStartDateView,
    appEndDateView,
    appPermitCreateView,
    appPermitOpenView,
    appPermitToDoView,
    appPermitDoingView,
    appPermitDoneView
  } = props

  return (
    <>
      <Modal show={showViewApp} onHide={handleCloseViewApp} size="xl" aria-labelledby="modalViewApp" className="ModalViewApp">
        <Modal.Header closeButton>
          <Modal.Title id="ModalViewApp">View App</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                {/* App Name */}
                <Form.Group className="mb-3" id="AppName">
                  <Form.Label>App Acronym</Form.Label>
                  <Form.Control value={appAcronymView} type="text" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* App Running Num */}
                <Form.Group className="mb-3" id="RunningNum">
                  <Form.Label>Running Num</Form.Label>
                  <Form.Control value={appRNumberView} type="text" readOnly />
                </Form.Group>
              </Col>
            </Row>

            {/* App Description */}
            <Form.Group className="mb-3" id="AppDescription">
              <Form.Label>App Description</Form.Label>
              <Form.Control rows="3" value={appDescriptionView} as="textarea" readOnly />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                {/* App Start Date */}
                <Form.Group className="mb-3" id="AppStartDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control value={appStartDateView === null ? "NIL" : appStartDateView} type="text" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* App End Date */}
                <Form.Group className="mb-3" id="AppEndDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control value={appEndDateView === null ? "NIL" : appEndDateView} type="text" readOnly />
                </Form.Group>
              </Col>
            </Row>
            {/* App Permit Create */}
            <Form.Group className="mb-3" id="AppPermitCreate">
              <Form.Label>Permit Create</Form.Label>
              <Form.Control value={appPermitCreateView} type="text" readOnly />
            </Form.Group>
            <Row className="mb-3">
              <Col>
                {/* App Permit Open */}
                <Form.Group className="mb-3" id="AppPermitOpen">
                  <Form.Label>Permit Open</Form.Label>
                  <Form.Control value={appPermitOpenView === "" ? "NIL" : appPermitOpenView} type="text" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* App Permit To Do */}
                <Form.Group className="mb-3" id="AppPermitToDo">
                  <Form.Label>Permit To Do</Form.Label>
                  <Form.Control value={appPermitToDoView === "" ? "NIL" : appPermitToDoView} type="text" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* App Permit Doing */}
                <Form.Group className="mb-3" id="AppPermitDoing">
                  <Form.Label>Permit Doing</Form.Label>
                  <Form.Control value={appPermitDoingView === "" ? "NIL" : appPermitDoingView} type="text" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* App Permit Done */}
                <Form.Group className="mb-3" id="AppPermitDone">
                  <Form.Label>Permit Done</Form.Label>
                  <Form.Control value={appPermitDoneView === "" ? "NIL" : appPermitDoneView} type="text" readOnly />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewApp}>
            Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalViewApp
