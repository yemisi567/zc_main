import React, { useEffect, useState } from "react"
import styles from "../styles/purchaseModal.module.css"
import { authAxios } from "../Utils/Api"
import { getCurrentWorkspace } from "../Utils/Common"
import toast from "react-hot-toast"

function PurchaseModal({ setHelpModal }) {
  const currentWorkspace = getCurrentWorkspace()
  const [workspaceData, setWorkspaceData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentWorkspace) {
      authAxios
        .get(`/organizations/${currentWorkspace}`)
        .then(res => {
          setWorkspaceData(res.data.data)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }, [currentWorkspace])

  const addToken = number => {
    const token = { amount: number }
    authAxios
      .post(`/organizations/${currentWorkspace}/add-token`, token)
      .then(res => {
        setWorkspaceData(res.data.data)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const makePayment = () => {
    const request = { amount: 50022 }
    setLoading(true)
    authAxios
      .post(`/organizations/${currentWorkspace}/checkout-session`, request)
      .then(res => {
        setLoading(false)
        // console.log(res.data, 'to stripes')
        toast.success(res.data.message, {
          position: "top-center"
        })
      })
      .catch(err => {
        setLoading(false)
        console.error(err)
        toast.error("Oops, something went wrong check and try again", {
          position: "top-center"
        })
      })
  }

  return (
    <div className={styles.backDrop}>
      <div className={styles.helpContainer}>
        <div className="d-flex">
          <h6 className={styles.heading}>Token Purchased </h6>
          <p className={styles.token}>
            {workspaceData.tokens} &nbsp; Token left
          </p>
        </div>

        <p className={styles.para}>1 Token /$5</p>
        <form>
          <div className="form-group ">
            <label htmlFor="token">Token</label>
            <div>
              <input
                type="text"
                className="form-control"
                onInput={evt => {
                  addToken(evt.target.value)
                }}
              />
            </div>
          </div>

          <div className="form-group ">
            <label htmlFor="price">Price</label>
            <div>
              <input type="text" className="form-control" />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn"
              onClick={() => setHelpModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn" onClick={makePayment}>
              Buy 12 token
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PurchaseModal
