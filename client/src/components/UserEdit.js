import React, { useEffect, useState } from "react"
import Page from "./Page"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import { toast } from "react-toastify"

function UserEdit() {
  const username = localStorage.getItem("username")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const toastStyle = {
    closeOnClick: false,
    autoClose: 3000,
    closeButton: false,
    position: toast.POSITION.TOP_CENTER
  }

  async function getUserData() {
    const response = await Axios.post("/api/user/details", { username })
    setEmail(response.data[0].email)
  }

  useEffect(() => {
    getUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleEditSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post(`/api/user/update`, { username, password, email })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        toast.success("User " + response.data.username + " has been edited successfully.", toastStyle)
        setPassword("")
      }
    } catch (e) {
      console.log(e.response.data)
    }
  }

  function handleBackSubmit() {
    navigate("/")
  }
  return (
    <Page title="User Management">
      <h3>Edit User</h3>
      <br />
      <Form onSubmit={handleEditSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control value={username} id="username-edit" name="username-edit" type="text" placeholder="Username" autoComplete="off" readOnly />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control value={password} onChange={e => setPassword(e.target.value)} id="password-edit" name="password-edit" type="password" placeholder="Password" autoComplete="off" autoFocus="on" />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={e => setEmail(e.target.value)} id="email-edit" name="email-edit" type="email" autoComplete="off" />
        </Form.Group>

        <br />

        <Form.Group>
          <Button onClick={toast} variant="dark" type="submit">
            Confirm Edit
          </Button>
          <Button id="back-btn" onClick={handleBackSubmit} variant="secondary" type="submit">
            Back
          </Button>
        </Form.Group>
      </Form>
    </Page>
  )
}

export default UserEdit
