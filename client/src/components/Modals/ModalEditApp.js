import React from "react"
import Axios from "axios"
import { Button, Form, Modal, Row, Col } from "react-bootstrap"
import Select from "react-select"
import { toast, Zoom } from "react-toastify"

function ModalEditApp(props) {
  const {
    setAppList,
    groupList,
    showEditApp,
    handleCloseEditApp,
    appAcronymEdit,
    appRNumberEdit,
    appDescriptionEdit,
    setAppDescriptionEdit,
    appStartDateEdit,
    setAppStartDateEdit,
    appEndDateEdit,
    setAppEndDateEdit,
    appPermitCreateEdit,
    appPermitOpenEdit,
    appPermitToDoEdit,
    appPermitDoingEdit,
    appPermitDoneEdit,
    updatedAppPermitCreate,
    setUpdatedAppPermitCreate,
    updatedAppPermitOpen,
    setUpdatedAppPermitOpen,
    updatedAppPermitToDo,
    setUpdatedAppPermitToDo,
    updatedAppPermitDoing,
    setUpdatedAppPermitDoing,
    updatedAppPermitDone,
    setUpdatedAppPermitDone
  } = props

  function handlePermitCreateEdit(appPermit) {
    setUpdatedAppPermitCreate(appPermit)
  }

  function handlePermitOpenEdit(appPermit) {
    setUpdatedAppPermitOpen(appPermit)
  }

  function handlePermitToDoEdit(appPermit) {
    setUpdatedAppPermitToDo(appPermit)
  }

  function handlePermitDoingEdit(appPermit) {
    setUpdatedAppPermitDoing(appPermit)
  }

  function handlePermitDoneEdit(appPermit) {
    setUpdatedAppPermitDone(appPermit)
  }

  // modal edit button (Edit App)
  async function handleEditSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post(`/api/user/app/update/${appAcronymEdit}`, {
        appAcronymEdit,
        appDescriptionEdit,
        appRNumberEdit,
        appStartDateEdit,
        appEndDateEdit,
        updatedAppPermitCreate,
        updatedAppPermitOpen,
        updatedAppPermitToDo,
        updatedAppPermitDoing,
        updatedAppPermitDone
      })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        toast.success("Application " + response.data.appAcronym + " has edited successfully.", toastStyle)
        getAppDetails()
      }
    } catch (e) {
      console.log(e.response.data)
    }
  }

  // get app details
  async function getAppDetails() {
    try {
      const response = await Axios.get("/api/app")
      if (response.data) {
        setAppList(response.data)
      }
    } catch (err) {
      console.log("Error")
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
      <Modal show={showEditApp} onHide={handleCloseEditApp} size="xl" aria-labelledby="modalEditApp" className="ModalEditApp">
        <Modal.Header closeButton>
          <Modal.Title id="ModalEditApp">Edit Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                {/* App_Acronym */}
                <Form.Group className="mb-3" id="App_Acronym">
                  <Form.Label>App Acronym</Form.Label>
                  <Form.Control value={appAcronymEdit} type="text" placeholder="App Acronym" readOnly />
                </Form.Group>
              </Col>
              <Col>
                {/* App_Rnumber */}
                <Form.Group className="mb-3" id="App_Rnumber">
                  <Form.Label>Rnumber</Form.Label>
                  <Form.Control value={appRNumberEdit} type="number" placeholder="Rnumber" readOnly />
                </Form.Group>
              </Col>
            </Row>

            {/* App_Description */}
            <Form.Group className="mb-3" id="App_Description">
              <Form.Label>Description</Form.Label>
              <Form.Control value={appDescriptionEdit} onChange={e => setAppDescriptionEdit(e.target.value)} as="textarea" rows={3} placeholder="Description of App" autoFocus />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                {/* App_startDate */}
                <Form.Group className="mb-3" id="App_startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control value={appStartDateEdit === "" ? "" : appStartDateEdit} onChange={e => setAppStartDateEdit(e.target.value)} type="date" placeholder="Start Date" />
                </Form.Group>
              </Col>
              <Col>
                {/* App_endDate */}
                <Form.Group className="mb-3" id="App_endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control value={appEndDateEdit === "" ? "" : appEndDateEdit} onChange={e => setAppEndDateEdit(e.target.value)} type="date" placeholder="End Date" />
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
                    key={appPermitCreateEdit}
                    defaultValue={appPermitCreateEdit === (null || "") ? { label: "NIL", value: "NIL" } : { label: appPermitCreateEdit, value: appPermitCreateEdit }}
                    onChange={handlePermitCreateEdit}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: "#EAB126",
                        primary: "#1A2930"
                      }
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
                    key={appPermitOpenEdit}
                    defaultValue={appPermitOpenEdit === (null || "") ? { label: "NIL", value: "NIL" } : { label: appPermitOpenEdit, value: appPermitOpenEdit }}
                    onChange={handlePermitOpenEdit}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: "#EAB126",
                        primary: "#1A2930"
                      }
                    })}
                  />
                </Form.Group>
              </Col>

              <Col>
                {/* App_permit_toDoList */}
                <Form.Group className="mb-3" id="App_permit_toDoList">
                  <Form.Label>Permit ToDoList</Form.Label>
                  <Select
                    isClearable
                    key={appPermitToDoEdit}
                    defaultValue={appPermitToDoEdit === (null || "") ? { label: "NIL", value: "NIL" } : { label: appPermitToDoEdit, value: appPermitToDoEdit }}
                    onChange={handlePermitToDoEdit}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: "#EAB126",
                        primary: "#1A2930"
                      }
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
                    key={appPermitDoingEdit}
                    defaultValue={appPermitDoingEdit === (null || "") ? { label: "NIL", value: "NIL" } : { label: appPermitDoingEdit, value: appPermitDoingEdit }}
                    onChange={handlePermitDoingEdit}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: "#EAB126",
                        primary: "#1A2930"
                      }
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
                    key={appPermitDoneEdit}
                    defaultValue={appPermitDoneEdit === (null || "") ? { label: "NIL", value: "NIL" } : { label: appPermitDoneEdit, value: appPermitDoneEdit }}
                    onChange={handlePermitDoneEdit}
                    options={groupList.map(rows => {
                      return { label: rows.groupname, value: rows.groupname }
                    })}
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: "#EAB126",
                        primary: "#1A2930"
                      }
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-outline-dark" style={{ backgroundColor: "#EAB126", border: "1px white" }} onClick={handleEditSubmit}>
            <i className="bi bi-pencil-square"> </i>Application
          </Button>
          <Button variant="secondary" onClick={handleCloseEditApp}>
            <i className="bi bi-box-arrow-left"> </i>Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalEditApp
