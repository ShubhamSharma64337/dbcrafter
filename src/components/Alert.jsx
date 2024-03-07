import React from 'react'

export default function Alert(props) {
    return (
        props.alert && <div className="toast-container position-fixed bottom-0 start-0 p-3">
                            <div className="toast d-block ">
                                <div className={`py-3 px-3 rounded d-flex justify-around align-items-center bg-${props.alert.type}`}>
                                        <strong className="me-auto text-light fs-5">{props.alert.message}</strong>
                                        <button type="button" className="btn-close font-medium" onClick={props.closeAlert}></button>
                                </div>
                            </div>
                        </div>
    )
}
