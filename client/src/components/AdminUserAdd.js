import React, { useEffect, useState } from "react"
import { Form, Button } from "react-bootstrap"
import Axios from "axios"
import Page from "./Page"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import CreatableSelect from "react-select/creatable"

function AdminUserAdd() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [group, setGroup] = useState([])
  const [groupList, setGroupList] = useState([])
  const navigate = useNavigate()

  const toastStyle = {
    closeOnClick: false,
    autoClose: 3000,
    closeButton: false,
    position: toast.POSITION.TOP_CENTER
  }

  function handleChange(group) {
    setGroup(group)
  }

  async function getGroupList() {
    try {
      const response = await Axios.get("/api/group")

      if (response.data) {
        setGroupList(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  useEffect(() => {
    getGroupList()
  }, [])

  async function handleAddSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/api/admin/user/add", { username, password, email, group })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        console.log(response.data)
        toast.success("User " + response.data.username + " has created successfully.", toastStyle)
        setUsername("")
        setPassword("")
        setEmail("")
        setGroup([])
      }
    } catch (e) {
      console.log("There is an error.")
    }
  }

  function handleBackSubmit() {
    navigate("/admin-user-home")
  }

  return (
    <Page title="Add User">
      <h3>Add User</h3>
      <br />
      <Form>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control value={username} onChange={e => setUsername(e.target.value)} id="username-user-add" name="username-user-add" type="text" placeholder="Username" autoComplete="off" autoFocus="on" />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control value={password} onChange={e => setPassword(e.target.value)} id="password-user-add" name="password-user-add" type="password" placeholder="Password" autoComplete="off" />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={e => setEmail(e.target.value)} id="email-user-add" name="email-user-add" type="email" placeholder="Email" autoComplete="off" />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Group</Form.Label>
          <CreatableSelect
            isClearable
            isMulti
            value={group}
            options={groupList.map(rows => {
              return { label: rows.groupname, value: rows.groupname }
            })}
            onChange={handleChange}
          />
        </Form.Group>

        <br />

        <Form.Group>
          <Button onClick={(toast, handleAddSubmit)} variant="dark" type="submit">
            Confirm Add User
          </Button>

          <Button id="back-btn" onClick={handleBackSubmit} variant="secondary" type="submit">
            Back
          </Button>
        </Form.Group>
      </Form>
    </Page>
  )
}

export default AdminUserAdd
