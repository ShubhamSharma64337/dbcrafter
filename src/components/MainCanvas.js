import React, { useEffect } from 'react'
import { useState } from 'react';
import background from './../graph-paper.svg';

export default function MainCanvas() {
    const [tbls, setTbls] = useState([{ name: 'table1', x: 20, y: 20, w: 150, h: 40, rh: 20, fields: [{ name: 'id', type: 'int' }] }]);
    const [selections, setSelections] = useState({ selectedTbl: 0, is_dragging: false });
    useEffect(draw);
    let startX; //these are used to determine initial position of pointer
    let startY; //when dragging a table. It needs to be global because
    //initially, the values will be set by handleMouseDown and then modified
    //by tblDragHandler
    //this function checks if the value of arguments x,y lies in the table
    //represented by tbl argument and returns true or false accordingly
    function isPointerInTbl(x, y, tbl) {
        let top = tbl.y;
        let left = tbl.x;
        let right = tbl.x + tbl.w;
        let bottom = tbl.y + tbl.h;
        if (x >= left && x <= right && y >= top && y <= bottom) {
            return true;
        }
        return false;
    }

    //handleMouseDown checks if the click on canvas is on any of the 
    // tables in the state and sets the selectedTblIndex state variable
    // to the index of the table on which mouse button is down
    function handleMouseDown(event) {
        event.preventDefault();
        //By default the clientY and clientX values will be relative to whole document
        //therefore we need to get offsets of the canvas relative to document
        //and subtract them from the clientX and clientY values.
        let clientX_correct = event.clientX - event.target.getBoundingClientRect().left;
        let clientY_correct = event.clientY - event.target.getBoundingClientRect().top;
        startX = parseInt(clientX_correct);
        startY = parseInt(clientY_correct);
        let index_clicked = 0;
        let sel = selections;
        for (let tb of tbls) {
            if (isPointerInTbl(clientX_correct, clientY_correct, tb)) {
                sel.is_dragging = true;
                sel.selectedTbl = index_clicked;
                setSelections(sel);
            }
            index_clicked += 1;
        }
        draw();
    }

    function handleMouseUp(event) {
        event.preventDefault();
        let sel = selections;
        sel.is_dragging = false;
        setSelections(sel);
    }

    function tblDragHandler(event) {

        if (!(selections.is_dragging)) {
            return;
        }
        else {
            event.preventDefault();
            let clientX_correct = event.clientX - event.target.getBoundingClientRect().left;
            let clientY_correct = event.clientY - event.target.getBoundingClientRect().top;
            let mouseX = parseInt(clientX_correct);
            let mouseY = parseInt(clientY_correct);

            let dx = mouseX - startX;
            let dy = mouseY - startY;
            let all_tbls = tbls;
            all_tbls[selections.selectedTbl].x += dx;
            all_tbls[selections.selectedTbl].y += dy;
            setTbls(all_tbls);

            draw();
            startX = mouseX;
            startY = mouseY;
        }
    }


    //draw function draws all tables from the tbls state variable
    function draw() {
        const canvas = document.getElementById("canvas");
        const ctxt = canvas.getContext("2d");
        //setting width and height properly
        const nav_height = document.querySelector(".navbar").clientHeight;
        ctxt.canvas.height = window.innerHeight - nav_height;
        ctxt.canvas.width = window.innerWidth;
        ctxt.font = '20px serif';
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
        let index = 0;
        if(tbls == null){
            return;
        }
        for (let tbl of tbls) {
            ctxt.strokeStyle = "grey";
            if (index === selections.selectedTbl) {
                ctxt.strokeStyle = 'orange';
            }
            ctxt.strokeRect(tbl.x, tbl.y, tbl.w, tbl.h); //drawing the outer rectangle
            //The origin for the text to be drawn is at the bottom left corner of the string

            //filling the header
            ctxt.fillText("Name", tbl.x + 3, tbl.y + 16);
            ctxt.fillText("Type", tbl.x + 3 + tbl.w / 2, tbl.y + 16);

            //creating the column seperator
            ctxt.beginPath();
            ctxt.moveTo(tbl.x + tbl.w * 0.5, tbl.y);
            ctxt.lineTo(tbl.x + tbl.w * 0.5, tbl.y + tbl.h);
            ctxt.stroke();

            //printing the table name
            ctxt.fillText(tbl.name, tbl.x, tbl.y - tbl.rh*0.2);

            //now creating all other fields and their upper row borders
            let row_index = 1;
            for (let row of tbl.fields) {
                ctxt.beginPath();
                ctxt.moveTo(tbl.x, tbl.y + tbl.rh * (row_index));
                ctxt.lineTo(tbl.x + tbl.w, tbl.y + tbl.rh * (row_index))
                ctxt.stroke();
                ctxt.fillText(row.name, tbl.x + 3, tbl.y + 16 + tbl.rh * (row_index));
                ctxt.fillText(row.type, tbl.x + 3 + tbl.w * 0.5, tbl.y + 16 + tbl.rh * (row_index));
                row_index += 1;
            }
            index += 1;
        }
    }

    //adds fields to the selectedTblIndex table
    function addRow() {
        let key = document.querySelector("#fieldName").value;
        let val = document.querySelector("#fieldType").value;
        document.querySelector("#fieldName").value = '';
        document.querySelector("#fieldType").value = '';
        let all_tbls = tbls;
        all_tbls[selections.selectedTbl].h += 20;
        all_tbls[selections.selectedTbl].fields.push({ name: key, type: val });
        setTbls(all_tbls);
        draw();
    }

    //deletes fields from the selectedTblIndex table
    function delRow() {
        let all_tbls = tbls;
        if (all_tbls[selections.selectedTbl].fields.length < 2) {
            return;
        }
        all_tbls[selections.selectedTbl].h -= 20;
        all_tbls[selections.selectedTbl].fields.pop();
        setTbls(all_tbls);
        draw();
    }

    //this function is used to add new table to the canvas
    function addTbl() {
        let all_tbls = tbls;
        let tblName = document.querySelector("#tblName").value;
        //checking if table name already exists
        for(let tbl of tbls){
            if(tblName == tbl.name){
                return;
            }
        }
        document.querySelector("#tblName").value = '';
        let new_element = null, last_element = null;
        if(all_tbls == null || all_tbls.length < 1){ // second condition is necessary after deleting all tables, state doesn't become null but empty array
            all_tbls = [{ name: tblName, x: 20, y: 20, w: 150, h: 40, rh: 20, fields: [{ name: 'id', type: 'int' }] }];
        }else{
            last_element = all_tbls[all_tbls.length - 1];
            new_element = { name: tblName, x: last_element.x + 50, y: last_element.y + 50, w: 150, h: 40, rh: 20, fields: [{ name: 'id', type: 'int' }] };
            new_element.x = last_element.x + 50;
            new_element.y = last_element.y + 50;
            all_tbls.push(new_element);
        }
        setTbls(all_tbls);
        draw();
    }

    //delete the selected table
    function delTbl(){
        if(tbls == null){
            return;
        }
        let all_tbls = tbls;
        let current_selections = selections;
        if(selections.selectedTbl>-1){
            all_tbls.splice(current_selections.selectedTbl,1); //splice(index,number of items to be deleted)
            current_selections.selectedTbl -= 1;
            setSelections(current_selections);
        }
        setTbls(all_tbls);
        draw();
    }

    return (
        <div className='canvas-div' style={{ backgroundImage: `url(${background})`}}>
            <canvas id='canvas' width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMouseMove={tblDragHandler} onMouseUp={handleMouseUp}></canvas>
            <div class='action-bar fixed-bottom d-flex justify-content-center align-items-center'>
                <ul className='border border-warning my-3 p-0 bg-white rounded-3 d-flex align-items-center' style={{listStyle: 'none'}}>
                    <div class='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target='#addTblModal' data-bs-toggle='modal' data-bs-dismiss='modal'><i class="bi bi-file-plus-fill text-warning fs-3"></i></button>
                    </div>
                    <div class='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target='#delTblModal' data-bs-toggle='modal' data-bs-dismiss='modal'><i class="bi bi-file-minus-fill fs-3 text-warning"></i></button>
                    </div>
                    <div class='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target='#addRowModal' data-bs-toggle='modal' data-bs-dismiss='modal'><i class="bi bi-node-plus-fill fs-3 text-warning"></i></button>
                    </div>
                </ul>
            </div>
            <div className="modal fade" id="addTblModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addTblModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5"  id="addTblModalLabel">Add Table</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label for="tblName" className="form-label">Table Name</label>
                                <input type="text" className="form-control" id="tblName" placeholder="Enter name of table"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"  onClick={addTbl}>Create</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addRowModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addRowModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addRowModalLabel">New Field</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label for="fieldName" className="form-label">Field Name</label>
                                <input type="text" className="form-control" id="fieldName" placeholder="Enter name of field"/>
                            </div>
                            <div className="mb-3">
                                <label for="fieldType" className="form-label">Data Type</label>
                                <input type="text" className="form-control" id="fieldType" placeholder="Enter type of field"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={addRow}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="delTblModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="delTblModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="delTblModalLabel">Delete Table</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Do you want to delete the selected table?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={delTbl}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}