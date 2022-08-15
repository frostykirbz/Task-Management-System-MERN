import React, { useEffect, useState } from "react"
import { Table, Button } from "react-bootstrap"
import Page from "./Page"
import Axios from "axios"
import { Link } from "react-router-dom"

function AdminUserHome() {
  const [usersList, setUsersList] = useState([])
  //const [isactive, setIsActive] = useState()

  async function getUsersList() {
    try {
      const response = await Axios.get("/api/admin/user")
      if (response.data) {
        setUsersList(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  useEffect(() => {
    getUsersList()
  }, [])

  return (
    <Page title="Edit User Home">
      <h3>Users</h3>
      <br />
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Username</th>
              <th className="text-center">Group</th>
              <th className="text-center">Is Active</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((rows, rowNum) => {
              return (
                <tr key={rows.username}>
                  <td className="text-center">{rowNum + 1}</td>
                  <td className="text-center">{rows.username}</td>
                  <td className="text-center">{rows.usergroup}</td>
                  <td className="text-center">{rows.isactive}</td>
                  <td className="text-center">
                    <Link to={`/admin-user-update/${rows.username}`}>
                      <Button variant="dark">Edit</Button>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </Page>
  )
}

export default AdminUserHome
