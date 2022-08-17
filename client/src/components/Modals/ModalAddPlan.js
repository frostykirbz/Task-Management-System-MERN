import React, { useState } from "react"
import Axios from "axios"
import { Button, Form, Modal, Row, Col, OverlayTrigger, Popover } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { SketchPicker } from "react-color"
import { toast, Zoom } from "react-toastify"

function ModalAddPlan(props) {
  const { getPlan, showPlan, handleClosePlan, planMVPName, setPlanMVPName, planStartDate, setPlanStartDate, planEndDate, setPlanEndDate } = props
  const { id } = useParams()
  const [color, setColor] = useState("#ff0000")

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3" style={{ textAlign: "center" }}>
        Plan Color
      </Popover.Header>
      <Popover.Body>
        <SketchPicker
          color={color}
          onChangeComplete={color => {
            setColor(color.hex)
          }}
        />
      </Popover.Body>
    </Popover>
  )

  async function handleAddSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/api/user/plan/add", { planMVPName, planStartDate, planEndDate, id, color })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        toast.success("Plan " + response.data.planMVPName + " has created successfully.", toastStyle)
        setPlanMVPName("")
        setPlanStartDate("")
        setPlanEndDate("")
        getPlan()
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

  // date picker validation
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth()
  let yyyy = today.getFullYear()

  // day of date
  if (dd < 10) {
    dd = "0" + dd
  }

  // month of date
  if (mm < 10) {
    mm = "0" + mm
  }

  today = yyyy + "-" + mm + "-" + dd

  return (
    <>
      <Modal show={showPlan} onHide={handleClosePlan} size="xl" aria-labelledby="modalAddPlan" className="ModalAddPlan">
        <Modal.Header closeButton>
          <Modal.Title id="ModalAddPlan">Add Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              {/* Plan MVP Name */}
              <Col>
                <Form.Group className="mb-3" id="PlanMVPName">
                  <Form.Label>Plan MVP Name</Form.Label>
                  <Form.Control value={planMVPName} onChange={e => setPlanMVPName(e.target.value)} type="text" placeholder="Plan MVP Name" autoFocus />
                </Form.Group>
              </Col>
              <Col>
                {/* Plan App Acronym */}
                <Form.Group className="mb-3" id="PlanAppAcronym">
                  <Form.Label>Plan App Acronym</Form.Label>
                  <Form.Control value={id} type="text" placeholder="Plan App Acronym" readOnly />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" id="PlanColorPicker">
                  <Form.Label>Plan Color</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control style={{ width: "100%" }} value={color} type="color" placeholder="Plan Color" readOnly disabled />
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popover}>
                        <Button variant="dark">Change Plan Color</Button>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                {/* Plan Start Date */}
                <Form.Group className="mb-3" id="PlanStartDate">
                  <Form.Label>Plan Start Date</Form.Label>
                  <Form.Control value={planStartDate} min={today} max={planStartDate} onChange={e => setPlanStartDate(e.target.value)} type="date" placeholder="Plan Start Date" />
                </Form.Group>
              </Col>
              <Col>
                {/* Plan End Date */}
                <Form.Group className="mb-3" id="PlanEndDate">
                  <Form.Label>Plan End Date</Form.Label>
                  <Form.Control value={planEndDate} min={today || planStartDate} onChange={e => setPlanEndDate(e.target.value)} type="date" placeholder="Plan End Date" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-outline-dark" style={{ backgroundColor: "#EAB126", border: "1px white" }} onClick={handleAddSubmit}>
            <i className="bi bi-plus-square"> </i>Plan
          </Button>
          <Button variant="secondary" onClick={handleClosePlan}>
            <i className="bi bi-box-arrow-left"> </i>Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalAddPlan
