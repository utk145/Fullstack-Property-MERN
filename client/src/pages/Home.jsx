import React, { useEffect } from 'react'

const Home = () => {
  // useEffect(() => {
  //   async function currUser() {
  //     const resp = await fetch("/api/v1/users/current-user")
  //     const data = await resp.json()
  //     console.log("cuureent user is ", data)
  //   }
  //   currUser()
  // }, [])
  // useEffect(() => {
  //   async function currUser() {
  //     const resp = await fetch("/api/v1/users/current-user", {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //     })
  //     const data = await resp.json()
  //     console.log("cuureent user is ", data)
  //   }
  //   currUser()
  // }, [])

  return (
    <div>Home</div>
  )
}

export default Home