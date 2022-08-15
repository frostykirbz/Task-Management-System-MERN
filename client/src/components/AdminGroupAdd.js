import React, { useState } from "react"
import { Form, Button } from "react-bootstrap"
import Axios from "axios"
import Page from "./Page"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function AdminGroupAdd() {
  const [description, setDescription] = useState("")
  const [group, setGroup] = useState("")
  const navigate = useNavigate()

  const toastStyle = {
    closeOnClick: false,
    autoClose: 3000,
    closeButton: false,
    position: toast.POSITION.TOP_CENTER
  }

  async function handleAddSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/api/admin/group/add", { group, description })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        toast.success("Group " + response.data.group + " has created successfully.", toastStyle)
        setGroup("")
        setDescription("")
      }
    } catch (e) {
      console.log("There is an error.")
    }
  }

  function handleBackSubmit() {
    navigate("/admin-group-home")
  }

  return (
    <Page title="Add Group">
      <h3>Add Group</h3>
      <br />
      <Form onSubmit={handleAddSubmit}>
        <Form.Group>
          <Form.Label>Group</Form.Label>
          <Form.Control value={group} onChange={e => setGroup(e.target.value)} id="group-group-add" name="group-group-add" type="text" placeholder="Group" autoComplete="off" autoFocus="on" />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control value={description} onChange={e => setDescription(e.target.value)} as="textarea" rows={5} id="description-group-add" name="description-group-add" type="text" placeholder="Group Description" autoComplete="off" />
        </Form.Group>

        <br />

        <Form.Group>
          <Button onClick={toast} variant="dark" type="submit">
            Confirm Add Group
          </Button>
          <Button id="back-btn" onClick={handleBackSubmit} variant="secondary" type="submit">
            Back
          </Button>
        </Form.Group>
      </Form>
    </Page>
  )
}

export default AdminGroupAdd
