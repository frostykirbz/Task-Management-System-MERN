import React from "react"

function Container(props) {
  return <div className={"container-fluid py-lg-5 " + (props.wide ? "" : "container--narrow")}>{props.children}</div>
}

export default Container
