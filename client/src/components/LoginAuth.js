import React from "react"
import LoggedInAdmin from "./LoggedInAdmin"
import LoggedInUser from "./LoggedInUser"
import Login from "./Login"

function LoginAuth(props) {
  return <div>{props.loggedIn ? localStorage.getItem("admin") === "true" ? <LoggedInAdmin setLoggedIn={props.setLoggedIn} /> : <LoggedInUser setLoggedIn={props.setLoggedIn} /> : <Login setLoggedIn={props.setLoggedIn} />}</div>
}

export default LoginAuth
