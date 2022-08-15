import React, { useEffect, useState } from "react"
import { Table, Button } from "react-bootstrap"
import Page from "./Page"
import Axios from "axios"
import { Link } from "react-router-dom"

function AdminGroupHome() {
  const [groupsList, setGroupsList] = useState([])

  async function getGroupsList() {
    try {
      const response = await Axios.get("/api/group")
      if (response.data) {
        setGroupsList(response.data)
        console.log(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  useEffect(() => {
    getGroupsList()
  }, [])

  return (
    <Page title="Edit User Home">
      <h3>Groups</h3>
      <br />
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Group</th>
              <th className="text-center">Is Active</th>
            </tr>
          </thead>
          <tbody>
            {groupsList.map((rows, rowNum) => {
              return (
                <tr key={rows.groupname}>
                  <td className="text-center">{rowNum + 1}</td>
                  <td className="text-center">{rows.groupname}</td>
                  <td className="text-center">{rows.isactive}</td>
                  <td className="text-center">
                    <Link to={`/admin-group-update/${rows.groupname}`}>
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

export default AdminGroupHome
