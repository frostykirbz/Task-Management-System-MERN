import React, { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import Axios from "axios"
import Page from "./Page"
import { useParams } from "react-router-dom"
import TaskManagement from "./TaskManagement"
import AppManagement from "./AppManagement"

function DashBoard() {
  const [appList, setAppList] = useState([])
  const [planList, setPlanList] = useState([])
  const [taskList, setTaskList] = useState([])
  const [taskPlanList, setTaskPlanList] = useState([])
  const { id } = useParams()

  async function getApp() {
    try {
      const response = await Axios.get(`/api/user/app/${id}`)

      if (response.data) {
        setAppList(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  async function getPlan() {
    try {
      const response = await Axios.get(`/api/user/app/${id}/plan`)

      if (response.data) {
        setPlanList(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  async function getTask() {
    try {
      const response = await Axios.get(`/api/user/app/${id}/task`)

      if (response.data) {
        setTaskList(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  async function getTaskPlanDetails() {
    try {
      const response = await Axios.get(`/api/user/app/${id}/plan`)

      console.log(response.data)
      if (response.data) {
        setTaskPlanList(response.data)
      }
    } catch (err) {
      console.log("Error")
    }
  }

  const [userGroup, setUserGroup] = useState("")

  async function checkUserGroup() {
    let username = localStorage.getItem("username")
    const response = await Axios.post("/api/checkUserGroup", { username })
    if (response.data) {
      setUserGroup(response.data)
    }
  }

  useEffect(() => {
    getApp()
    checkUserGroup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Page title="TMS DashBoard">
      <Container fluid>
        <AppManagement getPlan={getPlan} getTask={getTask} getTaskPlanDetails={getTaskPlanDetails} appList={appList} taskPlanList={taskPlanList} userGroup={userGroup} />
      </Container>
      <br />
      <br />
      <Container fluid>
        <TaskManagement getPlan={getPlan} getTask={getTask} getTaskPlanDetails={getTaskPlanDetails} planList={planList} taskList={taskList} taskPlanList={taskPlanList} userGroup={userGroup} />
      </Container>
    </Page>
  )
}

export default DashBoard
