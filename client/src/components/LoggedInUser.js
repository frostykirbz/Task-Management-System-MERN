import React from "react"
import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function LoggedInUser(props) {
  const navigate = useNavigate()

  function handleLogout() {
    props.setLoggedIn(false)
    localStorage.removeItem("username")
    localStorage.removeItem("admin")
    navigate("/")
    componentDidUpdate()
  }

  // handled/disabled go back functionality in browser
  // calls automatically when component got updated
  // uses current page as reference for history object
  // (if user clicks on back button of browser, cant enter previous page)
  function componentDidUpdate() {
    window.history.pushState(null, document.title, window.location.href)
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href)
    })
  }

  return (
    <>
      <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/">TMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Item>
                <Nav.Link href="/user-update">User Management</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav>
              <Navbar.Text id="nav-username">Logged in as: {localStorage.getItem("username")}</Navbar.Text>
              <Button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Log Out
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default LoggedInUser
