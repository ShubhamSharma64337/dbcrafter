import React from 'react'

export default function Alert(props) {
    return (
        props.alert && <div className="toast-container position-fixed top-0 end-0 p-3">
                            <div className="toast d-block">
                                <div className={`toast-header bg-${props.alert.type}`}>
                                        <strong className="me-auto text-white">Alert</strong>
                                        <button type="button" className="btn-close" onClick={props.closeAlert}></button>
                                </div>
                                <div className="toast-body">
                                    {props.alert.message}
                                </div>
                            </div>
                        </div>
    )
}
