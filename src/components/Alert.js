import React from 'react'

export default function Alert(props) {
    return (
        props.alert && <div class="toast-container position-fixed top-0 end-0 p-3">
                            <div class="toast d-block">
                                <div class={`toast-header bg-${props.alert.type}`}>
                                        <strong class="me-auto">Alert</strong>
                                        <button type="button" class="btn-close" onClick={props.closeAlert}></button>
                                </div>
                                <div class="toast-body">
                                    {props.alert.message}
                                </div>
                            </div>
                        </div>
    )
}
