import React, { useState } from "react"
import { Navbar, Container, Form, Button, Card } from "react-bootstrap"
import Axios from "axios"
import Page from "./Page"
import { toast, Zoom } from "react-toastify"

function Login(props) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

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

  async function handleAuthSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/api/login", { username, password })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
        props.setLoggedIn(false)
      } else {
        localStorage.setItem("username", response.data.username)
        localStorage.setItem("admin", response.data.admin)
        toast.success("User " + response.data.username + " has logged in successfully.", toastStyle)
        props.setLoggedIn(true)
      }
    } catch (e) {
      console.log("There is an error.")
    }
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">TMS</Navbar.Brand>
        </Container>
      </Navbar>

      <Page title="Login">
        <Card id="card-login" style={{ backgroundColor: "#C5C1C0" }}>
          <Card.Header style={{ backgroundColor: "#1A2930", color: "white" }}>
            <h3>Task Management System</h3>
          </Card.Header>
          <Card.Body style={{ width: "75%", marginLeft: "13%" }}>
            <Form onSubmit={handleAuthSubmit}>
              <Form.Group id="username-user-login" name="username-user-login">
                <Form.Label>Username</Form.Label>
                <Form.Control onChange={e => setUsername(e.target.value)} type="text" placeholder="Username" autoComplete="off" autoFocus="on" />
              </Form.Group>

              <br />

              <Form.Group id="password-user-login" name="password-user-login">
                <Form.Label>Password</Form.Label>
                <Form.Control  onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" autoComplete="off" />
              </Form.Group>

              <br />

              <Form.Group>
                <Button onClick={toast} variant="dark" type="submit">
                  Login
                </Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Page>
    </div>
  )
}

export default Login
