import React from "react"
import Axios from "axios"
import { Button, Modal, Form, Row, Col } from "react-bootstrap"
import Select from "react-select"
import { toast, Zoom } from "react-toastify"

function ModalAddApp(props) {
  const {
    getAppDetails,
    groupList,
    showAddApp,
    handleCloseAddApp,
    appAcronymAdd,
    setAppAcronymAdd,
    appRNumberAdd,
    setAppRNumberAdd,
    appDescriptionAdd,
    setAppDescriptionAdd,
    appStartDateAdd,
    setAppStartDateAdd,
    appEndDateAdd,
    setAppEndDateAdd,
    appPermitCreateAdd,
    setAppPermitCreateAdd,
    appPermitOpenAdd,
    setAppPermitOpenAdd,
    appPermitToDoAdd,
    setAppPermitToDoAdd,
    appPermitDoingAdd,
    setAppPermitDoingAdd,
    appPermitDoneAdd,
    setAppPermitDoneAdd,
    appSelectedPermitCreateAdd,
    setAppSelectedPermitCreateAdd,
    appSelectedPermitOpenAdd,
    setAppSelectedPermitOpenAdd,
    appSelectedPermitToDoAdd,
    setAppSelectedPermitToDoAdd,
    appSelectedPermitDoingAdd,
    setAppSelectedPermitDoingAdd,
    appSelectedPermitDoneAdd,
    setAppSelectedPermitDoneAdd
  } = props

  function handlePermitCreateAdd(appSelectedPermitCreateAdd) {
    setAppSelectedPermitCreateAdd(appSelectedPermitCreateAdd)
    setAppPermitCreateAdd(appSelectedPermitCreateAdd.value)
  }

  function handlePermitOpenAdd(appSelectedPermitOpenAdd) {
    setAppSelectedPermitOpenAdd(appSelectedPermitOpenAdd)
    setAppPermitOpenAdd(appSelectedPermitOpenAdd.value)
  }

  function handlePermitToDoAdd(appSelectedPermitToDoAdd) {
    setAppSelectedPermitToDoAdd(appSelectedPermitToDoAdd)
    setAppPermitToDoAdd(appSelectedPermitToDoAdd.value)
  }

  function handlePermitDoingAdd(appSelectedPermitDoingAdd) {
    setAppSelectedPermitDoingAdd(appSelectedPermitDoingAdd)
    setAppPermitDoingAdd(appSelectedPermitDoingAdd.value)
  }

  function handlePermitDoneAdd(appSelectedPermitDoneAdd) {
    setAppSelectedPermitDoneAdd(appSelectedPermitDoneAdd)
    setAppPermitDoneAdd(appSelectedPermitDoneAdd.value)
  }

  // modal add button (Add App)
  async function handleAddSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/api/user/app/add", {
        appAcronymAdd,
        appDescriptionAdd,
        appRNumberAdd,
        appStartDateAdd,
        appEndDateAdd,
        appPermitCreateAdd,
        appPermitOpenAdd,
        appPermitToDoAdd,
        appPermitDoingAdd,
        appPermitDoneAdd
      })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        toast.success("Application " + response.data.appAcronym + " has created successfully.", toastStyle)
        getAppDetails()
        setAppAcronymAdd("")
        setAppDescriptionAdd("")
        setAppRNumberAdd("")
        setAppStartDateAdd("")
        setAppEndDateAdd("")
        setAppPermitCreateAdd("")
        setAppPermitOpenAdd("")
        setAppPermitToDoAdd("")
        setAppPermitDoingAdd("")
        setAppPermitDoneAdd("")
        setAppSelectedPermitCreateAdd("")
        setAppSelectedPermitOpenAdd("")
        setAppSelectedPermitToDoAdd("")
        setAppSelectedPermitDoingAdd("")
        setAppSelectedPermitDoneAdd("")
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
      {/* MODAL : ADD APPLICATION */}
      <Modal show={showAddApp} onHide={handleCloseAddApp} size="xl" aria-labelledby="modalAddApp" className="ModalAddApp">
        <Modal.Header closeButton>
          <Modal.Title id="ModalAddApp">Add Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                {/* App_Acronym */}
                <Form.Group className="mb-3" id="App_Acronym">
                  <Form.Label>App Acronym</Form.Label>
                  <Form.Control value={appAcronymAdd} onChange={e => setAppAcronymAdd(e.target.value)} type="text" placeholder="App Acronym" autoFocus />
                </Form.Group>
              </Col>
              <Col>
                {/* App_Rnumber */}
                <Form.Group className="mb-3" id="App_Rnumber">
                  <Form.Label>Rnumber</Form.Label>
                  <Form.Control value={appRNumberAdd} onChange={e => setAppRNumberAdd(e.target.value)} type="number" placeholder="Rnumber" />
                </Form.Group>
              </Col>
            </Row>

            {/* App_Description */}
            <Form.Group className="mb-3" id="App_Description">
              <Form.Label>Description</Form.Label>
              <Form.Control value={appDescriptionAdd} onChange={e => setAppDescriptionAdd(e.target.value)} as="textarea" rows={3} placeholder="Description of App" />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                {/* App_startDate */}
                <Form.Group className="mb-3" id="App_startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control value={appStartDateAdd} min={today} max={appEndDateAdd} onChange={e => setAppStartDateAdd(e.target.value)} type="date" placeholder="Start Date" />
                </Form.Group>
              </Col>
              <Col>
                {/* App_endDate */}
                <Form.Group className="mb-3" id="App_endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control value={appEndDateAdd} min={today || appStartDateAdd} onChange={e => setAppEndDateAdd(e.target.value)} type="date" placeholder="End Date" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                {/* App_permit_Create */}
                <Form.Group className="mb-3" id="App_permit_Create">
                  <Form.Label>Permit Create</Form.Label>
                  <Select
                    isClearable
                    value={appSelectedPermitCreateAdd}
                    onChange={handlePermitCreateAdd}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                  />
                </Form.Group>
              </Col>
              <Col>
                {/* App_permit_Open */}
                <Form.Group className="mb-3" id="App_permit_Open">
                  <Form.Label>Permit Open</Form.Label>
                  <Select
                    isClearable
                    value={appSelectedPermitOpenAdd}
                    onChange={handlePermitOpenAdd}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                  />
                </Form.Group>
              </Col>

              <Col>
                {/* App_permit_toDoList */}
                <Form.Group className="mb-3" id="App_permit_toDoList">
                  <Form.Label>Permit To Do</Form.Label>
                  <Select
                    isClearable
                    value={appSelectedPermitToDoAdd}
                    onChange={handlePermitToDoAdd}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                  />
                </Form.Group>
              </Col>

              <Col>
                {/* App_permit_Doing */}
                <Form.Group className="mb-3" id="App_permit_Doing">
                  <Form.Label>Permit Doing</Form.Label>
                  <Select
                    isClearable
                    value={appSelectedPermitDoingAdd}
                    onChange={handlePermitDoingAdd}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                  />
                </Form.Group>
              </Col>

              <Col>
                {/* App_permit_Done */}
                <Form.Group className="mb-3" id="App_permit_Done">
                  <Form.Label>Permit Done</Form.Label>
                  <Select
                    isClearable
                    value={appSelectedPermitDoneAdd}
                    onChange={handlePermitDoneAdd}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-outline-dark" style={{ backgroundColor: "#EAB126", border: "1px white" }} onClick={handleAddSubmit}>
            <i className="bi bi-plus-square"> </i>Application
          </Button>
          <Button variant="secondary" onClick={handleCloseAddApp}>
            <i className="bi bi-box-arrow-left"> </i>Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalAddApp
