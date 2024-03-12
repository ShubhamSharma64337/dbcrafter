import React, { useEffect } from 'react'
import { useState } from 'react';
import background from '/graph-paper.svg';
import backgroundDark from '/graph-paper-dark.svg';
import Modal from './Modal';
import EditModal from './EditModal';
export default function MainCanvas(props) {
    const [modalShow, setModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [offset, setOffset] = useState({x: 0, y:0});
    const [isPanning, setIsPanning] = useState(false)
    // tbls is an array of objects, each object represents a table on the canvas
    // each object has following members - 
    //      x - x coordinate of top left point of the table
    //      y - y coordinate of the top left point of the table
    //      w - width of the table
    //      fields - this is an array of objects, each of which is a field of the table
    const [tbls, setTbls] = useState([{ name: 'Table1', x: 20, y: 20, w: 150, pKey: 'id', fields: [{ name: 'id', type: 'INT', isFKey: false, refTbl: 'NONE', refField: 'NONE'}] }]);
    const [commonProps, setCommonProps] = useState({rh: 20});
    //  selectedTbl is the index of the table which is currently selected
    //  is_dragging becomes true only when mousedown event is triggered on a particular table and is again set to false
    //  when the mouseup event is triggered
    const [selections, setSelections] = useState({ selectedTbl: 0, is_dragging: false });
    // useEffect is used to trigger draw function every single time the component is rendered, mainly to run draw the first time this component is loaded
    useEffect(draw);
    const [start, setStart] = useState({startX: null, startY: null});
    //these are used to determine initial position of pointer (useful in implementing drag and drop)
    //when dragging a table.

    const [scale, setScale] = useState(1);
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
        let clientX_correct = (event.clientX - event.target.getBoundingClientRect().left)/scale - offset.x; //do not divide offset by scale as it is already
        //calculated after dividing the pointer location by the scale
        let clientY_correct = (event.clientY - event.target.getBoundingClientRect().top)/scale - offset.y;
        let mystart = {...start};
        mystart.startX = parseInt(clientX_correct);
        mystart.startY = parseInt(clientY_correct);
        setStart(mystart);
        let index_clicked = 0;
        for (let tb of tbls) {
            if (isPointerInTbl(clientX_correct, clientY_correct, tb)) {
                setSelections({selectedTbl: index_clicked, is_dragging: true});
            }
            index_clicked += 1;
        }
        if(!(selections.is_dragging)){
            setIsPanning(true);
        }
    }

    //this function sets the is_dragging value in selections state variable to false when the mouse button is lifted up
    function handleMouseUp(event) {
        event.preventDefault();
        let sel = {...selections, is_dragging: false};
        setSelections(sel);
        setIsPanning(false);
    }

    //implements drag and drop
    function tblDragHandler(event) {

        if (!(selections.is_dragging)) {
            if(isPanning){ //if this is placed outside this outer condition, trying to move table causes panning, yet to find out why?
                let clientX_correct = (event.clientX - event.target.getBoundingClientRect().left)/scale - offset.x;
                let clientY_correct = (event.clientY - event.target.getBoundingClientRect().top)/scale - offset.y;
                let mouseX = parseInt(clientX_correct);
                let mouseY = parseInt(clientY_correct);
                let dx = mouseX - start.startX;
                let dy = mouseY - start.startY;
                let newOffset = {...offset}
                newOffset.x += dx * 0.5;
                newOffset.y += dy * 0.5;
                setOffset(newOffset)
                let newstart = {...start};
                newstart.startX = mouseX;
                newstart.startY = mouseY;
                setStart(newstart);
                return;
            }
            return;
        }
        else {
            event.preventDefault();
            let clientX_correct = (event.clientX - event.target.getBoundingClientRect().left)/scale - offset.x;
            let clientY_correct = (event.clientY - event.target.getBoundingClientRect().top)/scale - offset.y;
            let mouseX = parseInt(clientX_correct);
            let mouseY = parseInt(clientY_correct);

            let dx = mouseX - start.startX;
            let dy = mouseY - start.startY;
            let all_tbls = tbls.map((tbl, index) => { //this is the actual correct way to copy the array of objects
                if(index === selections.selectedTbl){ //we cannot just use [...tbls] here because we want to modify objects inside it
                    return {...tbl, x: tbl.x+=dx, y: tbl.y+=dy}; //and using the spread operator causes a shallow copy in which inner object's ref is copied
                }                                     //this is very necessary to perform copying like this to avoid mutation and future problems like non-updation due to reference of object passed to setState being same as the old one
                else{
                    return tbl;
                }
            })
            setTbls(all_tbls);
            let newstart = {...start};
            newstart.startX = mouseX;
            newstart.startY = mouseY;
            setStart(newstart);
        }
    }


    //draw function draws all tables from the tbls state variable
    function draw() {
        const canvas = document.getElementById("canvas");
        const ctxt = canvas.getContext("2d");
        
        //setting width and height properly
        const nav_height = document.querySelector(".navbar").clientHeight;
        ctxt.canvas.height = window.innerHeight - nav_height - 0.1;
        ctxt.canvas.width = window.innerWidth;
        ctxt.font = '16px Segoe UI';
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
        ctxt.scale(scale, scale);
        ctxt.translate(offset.x,offset.y);
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
                ctxt.strokeStyle = '#0d6efd'; //this is actually bootstrap primary color
            }
            ctxt.strokeRect(tbl.x, tbl.y, tbl.w, tbl_height); //drawing the outer rectangle
            //The origin for the text to be drawn is at the bottom left corner of the string

            //filling the header
            ctxt.textAlign = 'center'; //this makes sure that the x,y coordinates supplied to fillText lie at center of the text

            if (index === selections.selectedTbl) { //this chooses the header bg color
                ctxt.fillStyle = '#0d6efd';
            }else{
                ctxt.fillStyle = 'grey';
            }
            ctxt.fillRect(tbl.x, tbl.y, tbl.w, commonProps.rh);

            ctxt.fillStyle = 'white';
            ctxt.fillText(tbl.name, tbl.x + tbl.w * 0.5, tbl.y + 16);
            ctxt.fillStyle = 'black';

            ctxt.textAlign = 'left';
            

            //creating the column seperator
            // ctxt.beginPath();
            // ctxt.moveTo(tbl.x + tbl.w * 0.5, tbl.y + commonProps.rh);
            // ctxt.lineTo(tbl.x + tbl.w * 0.5, tbl.y + tbl_height);
            // ctxt.stroke();

            //now creating all other fields and their upper row borders
            let row_index = 1;
            for (let row of tbl.fields) {
                // creating the upper border
                ctxt.beginPath();
                ctxt.strokeStyle = 'grey';
                ctxt.moveTo(tbl.x, tbl.y + commonProps.rh * (row_index));
                ctxt.lineTo(tbl.x + tbl.w, tbl.y + commonProps.rh * (row_index))
                ctxt.stroke();
                ctxt.strokeStyle = 'black';
                //filling the text
                if(tbl.pKey === row.name){
                    ctxt.fillStyle = '#0d6efd';
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

        //this finds linked tables and calls drawArrow function to show their links
        for(let tbl of tbls){
            for(let field of tbl.fields){
                if(field.isFKey){
                    let second_tbl = tbls.find((tbl)=> tbl.name === field.refTbl);
                    drawArrow(tbl,second_tbl);
                }
            }
        }
    }

    //this function is used to draw arrows between tables linked with foreign keys
    //we will use bezier curves to draw smooth curves using control points
    function drawArrow(tbl1,tbl2){
        const canvas = document.getElementById("canvas");
        const ctxt = canvas.getContext("2d");
        ctxt.strokeStyle = '#0d6efd';
        ctxt.fillStyle = '#0d6efd';
        ctxt.lineWidth = '2';
        let tbl1_bottom = tbl1.y + commonProps.rh + commonProps.rh*tbl1.fields.length;
        let tbl2_bottom = tbl2.y + commonProps.rh + commonProps.rh*tbl2.fields.length;
        let tbl1_left = tbl1.x;
        let tbl2_left = tbl2.x;
        let tbl1_right = tbl1.x + tbl1.w;
        let tbl2_right = tbl2.x + tbl2.w;
        let tbl1_top = tbl1.y;
        let tbl2_top = tbl2.y;
        let ctrl_dist, fromx, fromy, tox, toy; //ctrl_dist is used to calculate offsets for making control points
        let arrow_length = 11, arrow_width = 6;
        ctxt.beginPath();
        if(tbl2_top > tbl1_bottom){ //when tbl2 is below tbl1
            fromx = tbl1_left + tbl1.w*0.5;
            fromy = tbl1_bottom;
            tox = tbl2_left + tbl2.w*0.5;
            toy = tbl2_top;
            ctrl_dist = 200; 
            ctxt.moveTo(fromx, fromy);
            ctxt.bezierCurveTo(fromx, fromy+ctrl_dist, tox, toy-ctrl_dist, tox, toy);
            ctxt.stroke();
            ctxt.beginPath(); //now drawing the arrowhead (downwards)
            ctxt.moveTo(tox,toy);
            ctxt.lineTo(tox+arrow_width, toy-arrow_length);
            ctxt.lineTo(tox-arrow_width, toy-arrow_length);
            ctxt.fill();
            
        } else if (tbl2_bottom < tbl1_top){ //when tbl1 is below tbl2
            fromx = tbl1_left + tbl1.w*0.5;
            fromy = tbl1_top;
            tox = tbl2_left + tbl2.w*0.5;
            toy = tbl2_bottom;
            ctrl_dist = 200; 
            ctxt.moveTo(fromx, fromy);
            ctxt.bezierCurveTo(fromx, fromy - ctrl_dist, tox, toy + ctrl_dist, tox, toy);
            ctxt.stroke();
            ctxt.beginPath(); //now drawing the arrowhead (upward)
            ctxt.moveTo(tox,toy);
            ctxt.lineTo(tox+arrow_width, toy+arrow_length);
            ctxt.lineTo(tox-arrow_width, toy+arrow_length);
            ctxt.fill();
        } else { //when tbl2 is either on left or right of tbl1
            if(tbl2_right < tbl1_left){ //tbl1 is on right of tbl2
                fromx = tbl1_left;
                fromy = tbl1_top + (tbl1_bottom-tbl1_top)*0.5;
                tox = tbl2_right;
                toy = tbl2_top + (tbl2_bottom-tbl2_top)*0.5;
                ctrl_dist = 100;
                ctxt.moveTo(tbl1_left, tbl1_top + (tbl1_bottom - tbl1_top)*0.5); 
                ctxt.bezierCurveTo(fromx - ctrl_dist, fromy,  tox + ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (leftwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_left > tbl1_right){ //tbl2 is on the right of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + (tbl1_bottom-tbl1_top)*0.5;
                tox = tbl2_left;
                toy = tbl2_top + (tbl2_bottom-tbl2_top)*0.5;
                ctrl_dist = 100;
                ctxt.moveTo(tbl1.x + tbl1.w, tbl1.y + (tbl1_bottom-tbl1_top)*0.5);
                ctxt.bezierCurveTo(fromx + ctrl_dist, fromy,  tox - ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (rightwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            }
        }
        ctxt.stroke();
        ctxt.fillStyle = 'black';
        ctxt.strokeStyle = 'black';
    }

    //adds fields to the selectedTblIndex table
    function addRow() {
        if(!tbls){
            props.showAlert('No tables exist!','warning');
            return;
        }
        let key = document.querySelector("#fieldName").value;
        let val = document.querySelector("#fieldType").value;
        let pkey = document.querySelector("#isPKey").checked;
        let isFKey = document.querySelector("#isFKey").checked;
        let refTblName = document.querySelector("#refTblName").value;
        let refFieldName = document.querySelector("#refFieldName").value;
        if(key === ''){
            props.showAlert('Field name cannot be empty!','warning');
            return;
        }
        if(val === 'NONE'){
            props.showAlert('Datatype selected is invalid','warning');
            return;
        }
        document.querySelector("#fieldName").value = '';
        document.querySelector("#fieldType").value = 'NONE';
        for(let field of tbls[selections.selectedTbl].fields){ //do not add duplicate field names
            if(field.name === key){
                props.showAlert('A field with same name already exists!','warning');
                return;
            }
        }
        let all_tbls = tbls.map((tbl,index) => {            //performing deeper copy of the tbls state object
                if(index === selections.selectedTbl){
                    return {...tbl, fields: tbl.fields.map(
                        (row)=>{
                            return row
                        }
                    )}
                } else {
                    return tbl;
                }
        });
        if(pkey){
            all_tbls[selections.selectedTbl].pKey = key;
        }
        if(isFKey){
            if(refTblName==='NONE' || refFieldName === 'NONE'){
                props.showAlert('Referenced Table or Field cannot be NONE','warning');
                return;
            }
        }
        all_tbls[selections.selectedTbl].fields.push({ name: key, type: val, isFKey: isFKey, refTbl: refTblName, refField: refFieldName});
        
        //updating table width
        let canvas = document.getElementById('canvas');
        let ctxt = canvas.getContext("2d");
        let max_fname_length = 100;
        let max_ftype_length = 50;
        for(let tbl of all_tbls){
            for(let field of tbl.fields){
                var textMetrics = ctxt.measureText(field.name);
                if(textMetrics.width>max_fname_length){
                    max_fname_length = textMetrics.width;
                }
                textMetrics = ctxt.measureText(field.type);
                if(textMetrics.width>max_ftype_length){
                    max_ftype_length = textMetrics.width;
                }
            }
            all_tbls[selections.selectedTbl].w = max_fname_length + max_ftype_length + 5;
        }

        setTbls(all_tbls);
        
    }

    //deletes fields from the selectedTblIndex table
    function delRow() {
        if(!tbls){
            return;
        }
        let all_tbls = tbls.map((tbl,index) => {            //performing deeper copy of the tbls state object
            if(index === selections.selectedTbl){
                return {...tbl, fields: tbl.fields.map(
                    (row)=>{
                        return row
                    }
                )}
            } else {
                return tbl;
            }
        });
        let field_name = document.querySelector("#delFieldName").value;
        let element = all_tbls[selections.selectedTbl].fields.find(function(element){
            return element.name === field_name;
        });
        let del_index = all_tbls[selections.selectedTbl].fields.indexOf(element);
        if(del_index<0 || field_name === all_tbls[selections.selectedTbl].pKey){ //do not delete if element does not exist or if field is primary key
            props.showAlert('You cannot delete the primary key attribute','warning');
            return;
        }
        if(field_name === all_tbls[selections.selectedTbl].pKey){
            all_tbls[selections.selectedTbl].pKey = null;
        }
        all_tbls[selections.selectedTbl].fields.splice(del_index,1);

        //updating table widths
        //updating table width
        let canvas = document.getElementById('canvas');
        let ctxt = canvas.getContext("2d");
        let max_fname_length = 100;
        let max_ftype_length = 50;
        for(let tbl of all_tbls){
            for(let field of tbl.fields){
                var textMetrics = ctxt.measureText(field.name);
                if(textMetrics.width>max_fname_length){
                    max_fname_length = textMetrics.width;
                }
                textMetrics = ctxt.measureText(field.type);
                if(textMetrics.width>max_ftype_length){
                    max_ftype_length = textMetrics.width;
                }
            }
            all_tbls[selections.selectedTbl].w = max_fname_length + max_ftype_length + 5;
        }
        
        setTbls(all_tbls);
    }

    //this function is used to add new table to the canvas
    function addTbl(newTbl) {
        let all_tbls = tbls?[...tbls]:[]; //if we do not use conditional operator, [...tbls] will give null reference error
        
        //checking if table name is empty
        if(newTbl.name === ''){
            props.showAlert("Table name cannot be empty!","danger");
            return 1;
        }
        //checking if table name already exists
        if(tbls){
            for(let tbl of tbls){
                if(newTbl.name === tbl.name){
                    props.showAlert('Table name already exists!','warning');
                    return 1;
                }
            }
        }
        
        let fieldNames = []
        for(let field of newTbl.fields){
            fieldNames.push(field.name);
        }
        let fieldNamesSet = new Set(fieldNames);
        if(fieldNames.length !== fieldNamesSet.size){
            props.showAlert('Duplicate field names are not allowed!','warning');
            return 1;
        }
        // document.querySelector("#tblName").value = '';
        let new_element = null;
        if(!all_tbls){ //checking if there does not exist any prior table
            all_tbls = [{...newTbl, x: 50, y: 50, w: 150}];
        }else{
            let coords = nonCollapseFinder();
            new_element = { ...newTbl, x: coords.x, y: coords.y, w:150};
            all_tbls.push(new_element);
        }
        let sel = selections; //setting selected table to newly created one
        sel.selectedTbl = all_tbls.length - 1;

        //updating table width
        let canvas = document.getElementById('canvas');
        let ctxt = canvas.getContext("2d");
        let max_fname_length = 100;
        let max_ftype_length = 50;
        for(let tbl of all_tbls){
            for(let field of tbl.fields){
                var textMetrics = ctxt.measureText(field.name);
                if(textMetrics.width>max_fname_length){
                    max_fname_length = textMetrics.width;
                }
                textMetrics = ctxt.measureText(field.type);
                if(textMetrics.width>max_ftype_length){
                    max_ftype_length = textMetrics.width;
                }
            }
            all_tbls[selections.selectedTbl].w = max_fname_length + max_ftype_length + 5;
        }

        setTbls(all_tbls);
        setSelections(sel);
        return 0;
    }

    //this function finds a place in canvas such that it does not collapse with any previously drawn tables
    function nonCollapseFinder(){
        if(!tbls){
            return {x: 20, y: 20};
        }
        let rightMostX = 0;
        let rightMostY = 0;
        let rightEdge;
        for(let tbl of tbls){
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
            props.showAlert("No tables exist", "danger");
            return;
        }
        let all_tbls = tbls.map((tbl) => {            //performing deeper copy of the tbls state object
            return {...tbl, fields: tbl.fields.map(
                (row)=>{
                    return { ...row }
                }
                )}
        });

        //adding code to detect if any other table references this table, we need to delete the reference in the referencing table
        let old_name = all_tbls[selections.selectedTbl].name;
        let tblindex = 0;
        for(let tbl of all_tbls){ //of, not in :( wasted a lot of time due to this
            let rowindex = 0;
            for(let row of tbl.fields){
                if(row.refTbl === old_name){
                    all_tbls[tblindex].fields[rowindex].isFKey = null;
                    all_tbls[tblindex].fields[rowindex].refTbl = null;
                    all_tbls[tblindex].fields[rowindex].refField = null;

                }
                rowindex+=1;
            }
            tblindex+=1;
        }

        let current_count = tbls.length;
        let current_selections = {...selections};
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
    }

    

    //this changes the primary key
    function chgPKey(){
        if(!tbls){
            return;
        }
        let new_pkey = document.querySelector('#pKeyField').value;
        document.querySelector('#pKeyField').value = '';
        let all_tbls = tbls.map((tbl)=>{
            return {...tbl};
        });
        all_tbls[selections.selectedTbl].pKey = new_pkey;
        setTbls(all_tbls);
    }

    //this function edit the table
    function editTbl(newTbl){
        if(!tbls){
            props.showAlert("No tables exist!");
            return;
        }
        if(newTbl.name===''){
            props.showAlert('New name cannot be empty!','warning');
            return;
        }
        let all_tbls = tbls.map((tbl) => {            //performing deeper copy of the tbls state object
                return {...tbl, fields: tbl.fields.map(
                    (field, index)=>{
                        return { ...field }
                    }
                )}
        });
        //adding code to detect if any other table references this table, we need to change the name in the referencing table
        let old_tbl = all_tbls[selections.selectedTbl];
        let tblindex = 0;
        for(let tbl of all_tbls){ //of, not in :( wasted a lot of time due to this
            let rowindex = 0;
            for(let row of tbl.fields){
                if(row.refTbl === old_tbl.name){
                    all_tbls[tblindex].fields[rowindex].refTbl = newTbl.name;
                }
                rowindex+=1;
            }
            tblindex+=1;
        }
        all_tbls[selections.selectedTbl].name = newTbl.name;
        all_tbls[selections.selectedTbl].fields = newTbl.fields;
        all_tbls[selections.selectedTbl].pKey = newTbl.pKey;
        all_tbls[selections.selectedTbl].x = old_tbl.x;
        all_tbls[selections.selectedTbl].y = old_tbl.y;
        all_tbls[selections.selectedTbl].w = old_tbl.w;

        //updating table width
        let canvas = document.getElementById('canvas');
        let ctxt = canvas.getContext("2d");
        let max_fname_length = 100;
        let max_ftype_length = 50;
        for(let tbl of all_tbls){
            for(let field of tbl.fields){
                var textMetrics = ctxt.measureText(field.name);
                if(textMetrics.width>max_fname_length){
                    max_fname_length = textMetrics.width;
                }
                textMetrics = ctxt.measureText(field.type);
                if(textMetrics.width>max_ftype_length){
                    max_ftype_length = textMetrics.width;
                }
            }
            all_tbls[selections.selectedTbl].w = max_fname_length + max_ftype_length + 5;
        }

        props.showAlert("Updated table!");
        setTbls(all_tbls);
    }

    function toggleModal(){
        modalShow?setModalShow(false):setModalShow(true);
    }
    function toggleEditModal(){
        editModalShow?setEditModalShow(false):setEditModalShow(true);
    }

    return (

            <div className="canvas-div" style={props.theme==='dark'?{ backgroundImage: `url(${backgroundDark})`}:{ backgroundImage: `url(${background})`}}>
                <canvas id='canvas' width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMouseMove={tblDragHandler} onMouseUp={handleMouseUp}></canvas>
                <div className="flex flex-col  fixed bottom-4 right-4 gap-5">
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={delTbl}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={tbls?toggleEditModal:()=>{props.showAlert("No tables exist!","danger")}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>

                    </button>
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={toggleModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
                <div className="flex  fixed bottom-4 left-4 gap-5">
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={()=>{setScale(scale*1.25)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                        </svg>

                    </button>
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={()=>{setScale(scale/1.25)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
                        </svg>


                    </button>
                </div>
                <Modal show={modalShow} toggleModal={toggleModal} tbls={tbls?tbls:null} addTable={addTbl} showAlert={props.showAlert}/>
                <EditModal table={tbls?tbls[selections.selectedTbl]:null} editShow={editModalShow} toggleEditModal={toggleEditModal} tbls={tbls?tbls:null} showAlert={props.showAlert} editTbl={editTbl}/>
                
            </div>

    )
}