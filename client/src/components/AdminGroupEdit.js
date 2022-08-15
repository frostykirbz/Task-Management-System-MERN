import React, { useEffect, useState } from "react"
import { Form, Button } from "react-bootstrap"
import Axios from "axios"
import Page from "./Page"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

function AdminGroupEdit() {
  const [group, setGroup] = useState("")
  const [description, setDescription] = useState("")
  const [isactive, setIsActive] = useState("")
  const { id } = useParams()
  const navigate = useNavigate()

  const toastStyle = {
    closeOnClick: false,
    autoClose: 3000,
    closeButton: false,
    position: toast.POSITION.TOP_CENTER
  }

  async function getGroupData() {
    const response = await Axios.get(`/api/admin/group/${id}`)
    setGroup(response.data.group)
    setDescription(response.data.description)
    setIsActive(response.data.isactive)
  }

  useEffect(() => {
    getGroupData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleEditSubmit(e) {
    e.preventDefault()
    try {
      console.log(group)
      console.log(description)

      const response = await Axios.post(`/api/admin/group/update/${id}`, { group, description, isactive })
      if (response.data.errorMsg) {
        toast.error(response.data.errorMsg, toastStyle)
      } else {
        toast.success("Group " + response.data.group + " has been edited successfully.", toastStyle)
        setDescription("")
      }
    } catch (e) {
      console.log(e.response.data)
    }
  }

  function handleBackSubmit() {
    navigate("/admin-group-home")
  }

  return (
    <Page title="Edit Group">
      <h3>Edit Group</h3>

      <br />

      <Form onSubmit={handleEditSubmit}>
        <Form.Group>
          <Form.Label>Group</Form.Label>
          <Form.Control value={id} id="group-group-edit" name="group-group-edit" type="text" placeholder="Group" autoComplete="off" readOnly />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control value={description} onChange={e => setDescription(e.target.value)} as="textarea" rows={5} id="description-group-add" name="description-group-add" type="text" placeholder="Group Description" autoComplete="off" autoFocus="on" />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Is Active</Form.Label>
          <Form.Select value={isactive} onChange={e => setIsActive(e.target.value)} id="isactive-group-edit" name="isactive-group-edit">
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

export default AdminGroupEdit
