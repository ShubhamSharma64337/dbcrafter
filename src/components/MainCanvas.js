import React, { useEffect } from 'react'
import { useState } from 'react';
import background from './../graph-paper.svg';
import ActionBar from './ActionBar';
export default function MainCanvas(props) {
    // tbls is an array of objects, each object represents a table on the canvas
    // each object has following members - 
    //      x - x coordinate of top left point of the table
    //      y - y coordinate of the top left point of the table
    //      w - width of the table
    //      h - height of the table
    //      rh - row height
    //      fields - this is an array of objects, each of which is a field of the table
    const [tbls, setTbls] = useState([{ name: 'Table1', x: 20, y: 20, w: 150, pKey: 'id', fields: [{ name: 'id', type: 'INT'}] }]);
    const [commonProps, setCommonProps] = useState({rh: 20});
    //  selectedTbl is the index of the table which is currently selected
    //  is_dragging becomes true only when mousedown event is triggered on a particular table and is again set to false
    //  when the mouseup event is triggered
    const [selections, setSelections] = useState({ selectedTbl: 0, is_dragging: false });
    // useEffect is used to trigger draw function every single time the component is rendered, mainly to run draw the first time this component is loaded
    useEffect(draw);
    let startX; //these are used to determine initial position of pointer (useful in implementing drag and drop)
    let startY; //when dragging a table. It needs to be global because
    //initially, the values will be set by handleMouseDown and then modified
    //by tblDragHandler
    //this function checks if the value of arguments x,y lies in the table
    //represented by tbl argument and returns true or false accordingly
    function isPointerInTbl(x, y, tbl) {
        let top = tbl.y;
        let left = tbl.x;
        let right = tbl.x + tbl.w;
        let tbl_height = commonProps.rh +  commonProps.rh * tbl.fields.length;
        let bottom = tbl.y + tbl_height;
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
        if(!tbls){
            return;
        }
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

    //this function sets the is_dragging value in selections state variable to false when the mouse button is lifted up
    function handleMouseUp(event) {
        event.preventDefault();
        let sel = selections;
        sel.is_dragging = false;
        setSelections(sel);
    }

    //implements drag and drop
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
        ctxt.font = '16px Segoe UI';
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
        if(!tbls){
            return;
        }
        let index = 0;
        for (let tbl of tbls) {
            //filling background of table with white color
            ctxt.fillStyle = 'white';
            let tbl_height = commonProps.rh + commonProps.rh * tbl.fields.length;
            ctxt.fillRect(tbl.x, tbl.y, tbl.w, tbl_height);
            ctxt.fillStyle = 'black';

            ctxt.strokeStyle = "grey";
            if (index === selections.selectedTbl) {
                ctxt.strokeStyle = 'orange';
            }
            ctxt.strokeRect(tbl.x, tbl.y, tbl.w, tbl_height); //drawing the outer rectangle
            //The origin for the text to be drawn is at the bottom left corner of the string

            //filling the header
            ctxt.textAlign = 'center'; //this makes sure that the x,y coordinates supplied to fillText lie at center of the text

            if (index === selections.selectedTbl) { //this chooses the header bg color
                ctxt.fillStyle = 'orange';
            }else{
                ctxt.fillStyle = 'grey';
            }
            ctxt.fillRect(tbl.x, tbl.y, tbl.w, commonProps.rh);

            ctxt.fillStyle = 'white';
            ctxt.fillText(tbl.name, tbl.x + tbl.w * 0.5, tbl.y + 16);
            ctxt.fillStyle = 'black';

            ctxt.textAlign = 'left';
            

            //creating the column seperator
            ctxt.beginPath();
            ctxt.moveTo(tbl.x + tbl.w * 0.5, tbl.y + commonProps.rh);
            ctxt.lineTo(tbl.x + tbl.w * 0.5, tbl.y + tbl_height);
            ctxt.stroke();

            //now creating all other fields and their upper row borders
            let row_index = 1;
            for (let row of tbl.fields) {
                // creating the upper border
                ctxt.beginPath();
                ctxt.moveTo(tbl.x, tbl.y + commonProps.rh * (row_index));
                ctxt.lineTo(tbl.x + tbl.w, tbl.y + commonProps.rh * (row_index))
                ctxt.stroke();
                //filling the text
                if(tbl.pKey === row.name){
                    ctxt.fillStyle = 'orange';
                    ctxt.fillText(row.name , tbl.x + 3, tbl.y + 16 + commonProps.rh * (row_index));
                    ctxt.fillStyle = 'black';
                } else {
                    ctxt.fillText(row.name, tbl.x + 3, tbl.y + 16 + commonProps.rh * (row_index));
                }
                ctxt.textAlign = 'right'; //this makes sure the datatype is aligned with last character just touching the right border...
                // doing this not only makes it look better, but makes better use of space between name and type
                ctxt.fillText(row.type, tbl.x + tbl.w - 3, tbl.y + 16 + commonProps.rh * (row_index));
                ctxt.textAlign = 'left';
                row_index += 1;
            }
            index += 1;
        }
    }

    //adds fields to the selectedTblIndex table
    function addRow() {
        if(!tbls){
            return;
        }
        let key = document.querySelector("#fieldName").value;
        let val = document.querySelector("#fieldType").value;
        let pkey = document.querySelector("#isPkey").checked;
        document.querySelector("#fieldName").value = '';
        document.querySelector("#fieldType").value = 'NONE';
        for(let field of tbls[selections.selectedTbl].fields){ //do not add duplicate field names
            if(field.name === key){
                return;
            }
        }
        let all_tbls = tbls;
        if(pkey){
            all_tbls[selections.selectedTbl].pKey = key;
        }
        all_tbls[selections.selectedTbl].fields.push({ name: key, type: val});
        setTbls(all_tbls);
        draw();
    }

    //deletes fields from the selectedTblIndex table
    function delRow() {
        if(!tbls){
            return;
        }
        let all_tbls = tbls;
        let field_name = document.querySelector("#delFieldName").value;
        let element = all_tbls[selections.selectedTbl].fields.find(function(element){
            return element.name === field_name;
        });
        let del_index = all_tbls[selections.selectedTbl].fields.indexOf(element);
        if(del_index<0 || field_name === 'id'){ //do not delete if element does not exist or if field is id
            props.showAlert('You cannot delete the primary key attribute','warning');
            return;
        }
        if(field_name === all_tbls[selections.selectedTbl].pKey){
            all_tbls[selections.selectedTbl].pKey = null;
        }
        all_tbls[selections.selectedTbl].fields.splice(del_index,1);
        setTbls(all_tbls);
        draw();
    }

    //this function is used to add new table to the canvas
    function addTbl() {
        let all_tbls = tbls;
        let tblName = document.querySelector("#tblName").value;
        //checking if table name already exists
        if(all_tbls){
            for(let tbl of tbls){
                if(tblName === tbl.name){
                    return;
                }
            }
        }
        document.querySelector("#tblName").value = '';
        let new_element = null;
        if(!all_tbls){ //checking if there does not exist any prior table
            all_tbls = [{ name: tblName, x: 20, y: 20, w: 150, pKey: 'id', fields: [{ name: 'id', type: 'int' }] }];
        }else{
            let coords = nonCollapseFinder();
            new_element = { name: tblName, x: coords.x, y: coords.y, pKey: 'id', w: 150, fields: [{ name: 'id', type: 'int' }] };
            all_tbls.push(new_element);
        }
        let sel = selections; //setting selected table to newly created one
        sel.selectedTbl = all_tbls.length - 1;
        setTbls(all_tbls);
        setSelections(sel);
        draw();
    }

    //this function finds a place in canvas such that it does not collapse with any previously drawn tables
    function nonCollapseFinder(){
        if(!tbls){
            return {x: 20, y: 20};
        }
        let all_tbls = tbls;
        let rightMostX = 0;
        let rightMostY = 0;
        let rightEdge;
        for(let tbl of all_tbls){
            rightEdge = tbl.x + tbl.w;
            if(rightEdge > rightMostX){
                rightMostX = rightEdge;
                rightMostY = tbl.y;
            }
        }
        return {x: rightMostX + 20, y: rightMostY} ;
    }

    //delete the selected table
    function delTbl(){
        if(!tbls){
            return;
        }
        let all_tbls = tbls;
        let current_count = tbls.length;
        let current_selections = selections;
        console.log(current_selections.selectedTbl);
        all_tbls.splice(current_selections.selectedTbl,1); //splice(index,number of items to be deleted)

       // if the table to be deleted is the last one, then, we will 
        if(current_selections.selectedTbl === current_count-1){
                current_selections.selectedTbl -= 1;
            }
        

        setSelections(current_selections);

        if(all_tbls.length < 1){
            all_tbls = null;
        }
        setTbls(all_tbls);
        draw();
    }

    

    //this changes the primary key
    function chgPKey(){
        if(!tbls){
            return;
        }
        let new_pkey = document.querySelector('#pKeyField').value;
        document.querySelector('#pKeyField').value = '';
        let all_tbls = tbls;
        all_tbls[selections.selectedTbl].pKey = new_pkey;
        setTbls(all_tbls);
        draw();
    }

    //this function renames the table
    function renameTbl(){
        if(!tbls){
            return;
        }
        let newName = document.querySelector("#newTblName").value;
        document.querySelector("#newTblName").value = '';
        let all_tbls = tbls;
        all_tbls[selections.selectedTbl].name = newName;
        setTbls(all_tbls);
        draw();
    }

    return (
        <div className='canvas-div' style={{ backgroundImage: `url(${background})`}}>
            <canvas id='canvas' width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMouseMove={tblDragHandler} onMouseUp={handleMouseUp}></canvas>
            <ActionBar tbls = {tbls} selections={selections} addTbl = {addTbl} delTbl = {delTbl} delRow = {delRow} addRow = {addRow} renameTbl = {renameTbl} chgPKey = {chgPKey} showAlert={props.showAlert}/>
        </div>
    )
}