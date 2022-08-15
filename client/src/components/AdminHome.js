import React, { useEffect, useState } from "react"
import { Card, Button, Row, Col, Container } from "react-bootstrap"
import Axios from "axios"
import Page from "./Page"
import { Link } from "react-router-dom"
import ModalAddApp from "../components/Modals/ModalAddApp"
import ModalEditApp from "../components/Modals/ModalEditApp"
import ModalViewApp from "../components/Modals/ModalViewApp"

function AdminHome() {
  // declare variables (user/group/app details)
  const [username, setUsername] = useState(localStorage.getItem("username"))
  const [group, setGroup] = useState("")
  const [email, setEmail] = useState("")
  const [appList, setAppList] = useState([])
  const [groupList, setGroupList] = useState([])

  // modal props variables (view app)
  const [appAcronymView, setAppAcronymView] = useState("")
  const [appDescriptionView, setAppDescriptionView] = useState("")
  const [appRNumberView, setAppRNumberView] = useState("")
  const [appStartDateView, setAppStartDateView] = useState("")
  const [appEndDateView, setAppEndDateView] = useState("")
  const [appPermitCreateView, setAppPermitCreateView] = useState("")
  const [appPermitOpenView, setAppPermitOpenView] = useState("")
  const [appPermitToDoView, setAppPermitToDoView] = useState("")
  const [appPermitDoingView, setAppPermitDoingView] = useState("")
  const [appPermitDoneView, setAppPermitDoneView] = useState("")

  // modal (view app)
  const [showViewApp, setShowViewApp] = useState(false)
  const handleShowViewApp = app => {
    setShowViewApp(true)
    setAppAcronymView(app)
    getAppViewDetails(app)
  }
  const handleCloseViewApp = () => {
    setShowViewApp(false)
  }

  async function getAppViewDetails(app) {
    try {
      const response = await Axios.post(`/api/user/app/view`, { app })

      console.log(response.data)
      if (response.data) {
        setAppDescriptionView(response.data.appDescription)
        setAppRNumberView(response.data.appRNumber)
        setAppStartDateView(response.data.appStartDate)
        setAppEndDateView(response.data.appEndDate)
        setAppPermitCreateView(response.data.appPermitCreate)
        setAppPermitOpenView(response.data.appPermitOpen)
        setAppPermitToDoView(response.data.appPermitToDo)
        setAppPermitDoingView(response.data.appPermitDoing)
        setAppPermitDoneView(response.data.appPermitDone)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  // modal props variables (add app)
  const [appAcronymAdd, setAppAcronymAdd] = useState("")
  const [appRNumberAdd, setAppRNumberAdd] = useState("")
  const [appDescriptionAdd, setAppDescriptionAdd] = useState("")
  const [appStartDateAdd, setAppStartDateAdd] = useState("")
  const [appEndDateAdd, setAppEndDateAdd] = useState("")
  const [appPermitCreateAdd, setAppPermitCreateAdd] = useState("")
  const [appPermitOpenAdd, setAppPermitOpenAdd] = useState("")
  const [appPermitToDoAdd, setAppPermitToDoAdd] = useState("")
  const [appPermitDoingAdd, setAppPermitDoingAdd] = useState("")
  const [appPermitDoneAdd, setAppPermitDoneAdd] = useState("")
  const [appSelectedPermitCreateAdd, setAppSelectedPermitCreateAdd] = useState("")
  const [appSelectedPermitOpenAdd, setAppSelectedPermitOpenAdd] = useState("")
  const [appSelectedPermitToDoAdd, setAppSelectedPermitToDoAdd] = useState("")
  const [appSelectedPermitDoingAdd, setAppSelectedPermitDoingAdd] = useState("")
  const [appSelectedPermitDoneAdd, setAppSelectedPermitDoneAdd] = useState("")

  // modal (add app)
  const [showAddApp, setShowAddApp] = useState(false)
  const handleShowAddApp = () => {
    setShowAddApp(true)
    getGroup()
  }
  const handleCloseAddApp = () => {
    setShowAddApp(false)
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
    getAppDetails()
  }

  async function getGroup() {
    try {
      const response = await Axios.get("/api/group")

      if (response.data) {
        setGroupList(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  // modal props variables (edit app)
  const [appAcronymEdit, setAppAcronymEdit] = useState("")
  const [appRNumberEdit, setAppRNumberEdit] = useState("")
  const [appDescriptionEdit, setAppDescriptionEdit] = useState("")
  const [appStartDateEdit, setAppStartDateEdit] = useState("")
  const [appEndDateEdit, setAppEndDateEdit] = useState("")
  const [appPermitCreateEdit, setAppPermitCreateEdit] = useState("")
  const [appPermitOpenEdit, setAppPermitOpenEdit] = useState()
  const [appPermitToDoEdit, setAppPermitToDoEdit] = useState("")
  const [appPermitDoingEdit, setAppPermitDoingEdit] = useState("")
  const [appPermitDoneEdit, setAppPermitDoneEdit] = useState("")
  const [updatedAppPermitCreate, setUpdatedAppPermitCreate] = useState()
  const [updatedAppPermitOpen, setUpdatedAppPermitOpen] = useState()
  const [updatedAppPermitToDo, setUpdatedAppPermitToDo] = useState()
  const [updatedAppPermitDoing, setUpdatedAppPermitDoing] = useState()
  const [updatedAppPermitDone, setUpdatedAppPermitDone] = useState()

  // modal (edit app)
  const [showEditApp, setShowEditApp] = useState(false)
  const handleShowEditApp = app => {
    setShowEditApp(true)
    getGroup()
    setAppAcronymEdit(app)
    getAppEditDetails(app)
  }
  const handleCloseEditApp = () => {
    setShowEditApp(false)
  }

  async function getAppEditDetails(app) {
    try {
      const response = await Axios.post(`/api/user/app/get`, { app })

      if (response.data) {
        console.log(response.data)
        setAppDescriptionEdit(response.data.appDescription)
        setAppRNumberEdit(response.data.appRNumber)
        setAppStartDateEdit(response.data.appStartDate)
        setAppEndDateEdit(response.data.appEndDate)
        setAppPermitCreateEdit(response.data.appPermitCreate)
        setAppPermitOpenEdit(response.data.appPermitOpen)
        setAppPermitToDoEdit(response.data.appPermitToDo)
        setAppPermitDoingEdit(response.data.appPermitDoing)
        setAppPermitDoneEdit(response.data.appPermitDone)
        setUpdatedAppPermitCreate({ label: response.data.appPermitCreate, value: response.data.appPermitCreate })
        setUpdatedAppPermitOpen({ label: response.data.appPermitOpen, value: response.data.appPermitOpen })
        setUpdatedAppPermitToDo({ label: response.data.appPermitToDo, value: response.data.appPermitToDo })
        setUpdatedAppPermitDoing({ label: response.data.appPermitDoing, value: response.data.appPermitDoing })
        setUpdatedAppPermitDone({ label: response.data.appPermitDone, value: response.data.appPermitDone })
      }
    } catch (err) {
      console.log("Error")
    }
  }

  // get user details
  async function getUserDetails() {
    try {
      const response = await Axios.post("/api/user/details", { username })
      if (response.data) {
        setUsername(response.data[0].username)
        setGroup(response.data[0].usergroup)
        setEmail(response.data[0].email)
      }
    } catch (err) {
      console.log("Error")
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

  useEffect(() => {
    getUserDetails()
    getAppDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Page title="TMS Home">
      <Container fluid>
        {/* USER DETAILS */}
        <Card className="text-center">
          <Card.Header style={{ backgroundColor: "#1A2930", color: "white" }}>
            <Card.Title>Welcome to TMS</Card.Title>
          </Card.Header>
          <Card.Body style={{ fontSize: "90%" }}>
            <Card.Subtitle>Username</Card.Subtitle>
            <Card.Text>{username}</Card.Text>
            <Card.Subtitle>Group</Card.Subtitle>
            <Card.Text>{group}</Card.Text>
            <Card.Subtitle>Email</Card.Subtitle>
            <Card.Text>{email}</Card.Text>
          </Card.Body>
        </Card>

        <br />
        <br />

        <Card>
          <Card.Header style={{ backgroundColor: "#1A2930", color: "white", borderBottom: "2px solid white" }}>
            <Row>
              <Col>
                <Card.Title style={{ marginTop: "5px" }}>Application</Card.Title>
              </Col>
              <Col style={{ textAlign: "right" }}>
                {group.includes("Project Lead") ? (
                  <Button className="btn btn-outline-dark" style={{ marginRight: "10px", backgroundColor: "#EAB126", border: "1px white" }} onClick={() => handleShowAddApp()}>
                    <i className="bi bi-plus-square"></i> App
                  </Button>
                ) : null}
              </Col>
            </Row>
          </Card.Header>
          <Card.Body style={{ backgroundColor: "#C5C1C0" }}>
            {/* APPLICATIONS */}
            <Row>
              {appList.map(rows => {
                return (
                  <Col key={rows.App_Acronym} xs={12} md={4} lg={3}>
                    <Card variant="dark" style={{ border: "3px solid black", marginBottom: "15px" }}>
                      <Card.Header style={{ cursor: "pointer", textAlign: "center" }} onClick={() => handleShowViewApp(rows.App_Acronym)}>
                        <Card.Subtitle>{rows.App_Acronym}</Card.Subtitle>
                        <Card.Text style={{ fontSize: "85%" }}>
                          <i className="bi bi-eye"> </i>Click here To view
                        </Card.Text>
                      </Card.Header>
                      <Card.Body>
                        <Row style={{ fontSize: "85%" }}>
                          <Col xs={6} style={{ textAlign: "right" }}>
                            <i className="bi bi-tag-fill"> </i> Running Num
                          </Col>
                          <Col xs={6}>
                            <Card.Text className="text-muted">{rows.App_Rnumber}</Card.Text>
                          </Col>
                        </Row>
                        <Row className="mb-2" style={{ fontSize: "85%" }}>
                          <Col xs={6} style={{ textAlign: "right" }}>
                            <i className="bi bi-file-text-fill"></i> Description
                          </Col>
                          <Col xs={6}>
                            <Card.Text className="text-muted">{rows.App_Description.length > 20 ? rows.App_Description.substring(0, 20) + "..." : rows.App_Description}</Card.Text>
                          </Col>
                        </Row>
                        <Row className="mb-2" style={{ fontSize: "85%" }}>
                          <Col xs={6} style={{ textAlign: "right" }}>
                            <i className="bi bi-calendar"></i> Start Date
                            <Card.Text className="text-muted">{rows.startDate === null ? "NIL" : rows.startDate}</Card.Text>
                          </Col>
                          <Col xs={6}>
                            <i className="bi bi-calendar-fill"></i> End Date
                            <Card.Text className="text-muted">{rows.endDate === null ? "NIL" : rows.endDate}</Card.Text>
                          </Col>
                        </Row>
                        <hr />
                        {group.includes("Project Lead") ? (
                          <Row xs={2}>
                            <Col xs={6} style={{ textAlign: "right" }} sm>
                              {/* inline arrow function: create and pass a new function instance on each render */}
                              <Button variant="dark" style={{ fontSize: "85%" }} onClick={() => handleShowEditApp(rows.App_Acronym)}>
                                <i className="bi bi-pencil-square"></i> App
                              </Button>
                            </Col>
                            <Col xs={6} style={{ textAlign: "left" }} sm>
                              <Link to={`/dashboard/${rows.App_Acronym}`}>
                                <Button variant="dark" style={{ fontSize: "85%" }}>
                                  <i className="bi bi-box-arrow-right"></i> App
                                </Button>
                              </Link>
                            </Col>
                          </Row>
                        ) : (
                          <Row style={{ textAlign: "center" }}>
                            <Col xs={6} sm>
                              <Link to={`/dashboard/${rows.App_Acronym}`}>
                                <Button variant="dark" style={{ fontSize: "85%" }}>
                                  <i className="bi bi-box-arrow-right"> </i>App
                                </Button>
                              </Link>
                            </Col>
                          </Row>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </Card.Body>
        </Card>
      </Container>

      <ModalViewApp
        showViewApp={showViewApp}
        handleCloseViewApp={handleCloseViewApp}
        appAcronymView={appAcronymView}
        appDescriptionView={appDescriptionView}
        appRNumberView={appRNumberView}
        appStartDateView={appStartDateView}
        appEndDateView={appEndDateView}
        appPermitCreateView={appPermitCreateView}
        appPermitOpenView={appPermitOpenView}
        appPermitToDoView={appPermitToDoView}
        appPermitDoingView={appPermitDoingView}
        appPermitDoneView={appPermitDoneView}
      />

      <ModalAddApp
        getAppDetails={getAppDetails}
        groupList={groupList}
        showAddApp={showAddApp}
        handleCloseAddApp={handleCloseAddApp}
        appAcronymAdd={appAcronymAdd}
        setAppAcronymAdd={setAppAcronymAdd}
        appRNumberAdd={appRNumberAdd}
        setAppRNumberAdd={setAppRNumberAdd}
        appDescriptionAdd={appDescriptionAdd}
        setAppDescriptionAdd={setAppDescriptionAdd}
        appStartDateAdd={appStartDateAdd}
        setAppStartDateAdd={setAppStartDateAdd}
        appEndDateAdd={appEndDateAdd}
        setAppEndDateAdd={setAppEndDateAdd}
        appPermitCreateAdd={appPermitCreateAdd}
        setAppPermitCreateAdd={setAppPermitCreateAdd}
        appPermitOpenAdd={appPermitOpenAdd}
        setAppPermitOpenAdd={setAppPermitOpenAdd}
        appPermitToDoAdd={appPermitToDoAdd}
        setAppPermitToDoAdd={setAppPermitToDoAdd}
        appPermitDoingAdd={appPermitDoingAdd}
        setAppPermitDoingAdd={setAppPermitDoingAdd}
        appPermitDoneAdd={appPermitDoneAdd}
        setAppPermitDoneAdd={setAppPermitDoneAdd}
        appSelectedPermitCreateAdd={appSelectedPermitCreateAdd}
        setAppSelectedPermitCreateAdd={setAppSelectedPermitCreateAdd}
        appSelectedPermitOpenAdd={appSelectedPermitOpenAdd}
        setAppSelectedPermitOpenAdd={setAppSelectedPermitOpenAdd}
        appSelectedPermitToDoAdd={appSelectedPermitToDoAdd}
        setAppSelectedPermitToDoAdd={setAppSelectedPermitToDoAdd}
        appSelectedPermitDoingAdd={appSelectedPermitDoingAdd}
        setAppSelectedPermitDoingAdd={setAppSelectedPermitDoingAdd}
        appSelectedPermitDoneAdd={appSelectedPermitDoneAdd}
        setAppSelectedPermitDoneAdd={setAppSelectedPermitDoneAdd}
      />

      <ModalEditApp
        setAppList={setAppList}
        groupList={groupList}
        showEditApp={showEditApp}
        handleCloseEditApp={handleCloseEditApp}
        appAcronymEdit={appAcronymEdit}
        setAppAcronymEdit={setAppAcronymEdit}
        appRNumberEdit={appRNumberEdit}
        appDescriptionEdit={appDescriptionEdit}
        setAppDescriptionEdit={setAppDescriptionEdit}
        appStartDateEdit={appStartDateEdit}
        setAppStartDateEdit={setAppStartDateEdit}
        appEndDateEdit={appEndDateEdit}
        setAppEndDateEdit={setAppEndDateEdit}
        appPermitCreateEdit={appPermitCreateEdit}
        setAppPermitCreateEdit={setAppPermitCreateEdit}
        appPermitOpenEdit={appPermitOpenEdit}
        setAppPermitOpenEdit={setAppPermitOpenEdit}
        appPermitToDoEdit={appPermitToDoEdit}
        setAppPermitToDoEdit={setAppPermitToDoEdit}
        appPermitDoingEdit={appPermitDoingEdit}
        setAppPermitDoingEdit={setAppPermitDoingEdit}
        appPermitDoneEdit={appPermitDoneEdit}
        setAppPermitDoneEdit={setAppPermitDoneEdit}
        updatedAppPermitCreate={updatedAppPermitCreate}
        setUpdatedAppPermitCreate={setUpdatedAppPermitCreate}
        updatedAppPermitOpen={updatedAppPermitOpen}
        setUpdatedAppPermitOpen={setUpdatedAppPermitOpen}
        updatedAppPermitToDo={updatedAppPermitToDo}
        setUpdatedAppPermitToDo={setUpdatedAppPermitToDo}
        updatedAppPermitDoing={updatedAppPermitDoing}
        setUpdatedAppPermitDoing={setUpdatedAppPermitDoing}
        updatedAppPermitDone={updatedAppPermitDone}
        setUpdatedAppPermitDone={setUpdatedAppPermitDone}
      />
    </Page>
  )
}
export default AdminHome
