import React, { useEffect, useState } from "react"
import { Form, Button } from "react-bootstrap"
import Axios from "axios"
import Page from "./Page"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import CreatableSelect from "react-select/creatable"

function AdminUserEdit() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isactive, setIsActive] = useState("")
  const [group, setGroup] = useState([])
  const [groupList, setGroupList] = useState([])
  const [selectedGroup, setSelectedGroup] = useState([])
  const { id } = useParams()
  const groupArray = group.map(rows => {
    return { label: rows, value: rows }
  })

  const navigate = useNavigate()

  const toastStyle = {
    closeOnClick: false,
    autoClose: 3000,
    closeButton: false,
    position: toast.POSITION.TOP_CENTER
  }

  function handleChange(selectedGroup) {
    // set initial default values (already existing groups)
    // onchange selected, set array = [] (if user selects - overwrites)
    // set array with selected values
    setSelectedGroup(selectedGroup)
  }

  async function getUserData() {
    const response = await Axios.get(`/api/admin/user/${id}`)
    setUsername(response.data.username)
    setEmail(response.data.email)
    setIsActive(response.data.isactive)
    if (response.data.usergroup !== "") {
      setGroup(response.data.usergroup.split(","))
    } else {
      setGroup([])
    }
  }

  async function getGroupList() {
    try {
      const response = await Axios.get("/api/group")
      if (response.data) {
        console.log(response.data)
        setGroupList(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  async function getUserGroup() {
    try {
      const response = await Axios.get(`/api/admin/user/group/${id}`)
      if (response.data) {
        setSelectedGroup(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  useEffect(() => {
    getUserData()
    getGroupList()
    getUserGroup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleEditSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post(`/api/admin/user/update/${id}`, { username, password, email, isactive, selectedGroup })
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
    navigate("/admin-user-home")
  }

  return (
    <Page title="Edit User">
      <h3>Edit User</h3>

      <br />

      <Form onSubmit={handleEditSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control value={id} id="username-user-edit" name="username-user-edit" type="text" placeholder="Username" autoComplete="off" readOnly />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={e => setPassword(e.target.value)}
            id="password-user-edit"
            name="password-user-edit"
            type="password"
            placeholder="Password"
            autoComplete="off"
            autoFocus="on"
          />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={e => setEmail(e.target.value)} id="email-user-edit" name="email-user-edit" type="email" autoComplete="off" />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Group</Form.Label>

          {/* You can add key props to Select to force remounting component and make it re-render */}
          <CreatableSelect
            key={groupArray}
            defaultValue={groupArray}
            isClearable
            isMulti
            options={groupList.map(rows => {
              return { label: rows.groupname, value: rows.groupname }
            })}
            onChange={handleChange}
          />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Is Active</Form.Label>
          <Form.Select value={isactive} onChange={e => setIsActive(e.target.value)} id="isactive-user-edit" name="isactive-user-edit">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Select>
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

export default AdminUserEdit
