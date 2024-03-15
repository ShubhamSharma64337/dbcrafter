import React, { useEffect } from 'react'
import { useState } from 'react';
import background from '/graph-paper.svg';
import backgroundDark from '/graph-paper-dark.svg';
import CreateTableModal from './CreateTableModal';
import EditModal from './EditModal';
import CreateDiagramModal from './CreateDiagramModal';
import { Link } from 'react-router-dom';
export default function MainCanvas({showAlert, theme, authInfo, diagram, setDiagram}) {
    const [createTableModalShow, setCreateTableModalShow] = useState(false); //this is used to show or hide add table modal
    const [editTableModalShow, setEditTableModalShow] = useState(false); //this is used to show or hide edit table modal
    const [createDiagramModalShow, setCreateDiagramModalShow] = useState(false); //this is used to show or hide the create diagram modal
    const [offset, setOffset] = useState({x: 0, y:0}); //this is used to pan the canvas by translating the origin by offset
    const [isPanning, setIsPanning] = useState(false) //this is used to check if user has clicked ang is dragging on the canvas (i.e not the table)
    const [commonProps, setCommonProps] = useState({rh: 20}); //this specifies the row height of the tables

    //  selectedTbl is the index of the table which is currently selected
    //  is_dragging becomes true only when mousedown event is triggered on a particular table and is again set to false
    //  when the mouseup event is triggered
    const [selections, setSelections] = useState({ selectedTbl: 0, is_dragging: false });

    // useEffect is used to trigger draw function every single time the component is rendered, mainly to run draw the first time this component is loaded
    useEffect(draw);

    //these are used to determine initial position of pointer (useful in implementing drag and drop)
    //when dragging a table.
    const [start, setStart] = useState({startX: null, startY: null});

    //this is used to remember the zoom state
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
            return true; //pointer is in tbl
        }
        return false; //pointer is not in tbl
    }

    //handleMouseDown checks if the click on canvas is on any of the 
    // tables in the state and sets the selectedTblIndex state variable
    // to the index of the table on which mouse button is down
    function handleMouseDown(event) {
        
        event.preventDefault();
        if(!diagram.tbls){
            return;
        }
        //By default the clientY and clientX values will be relative to whole document
        //therefore we need to get offsets of the canvas relative to document(navbar height needs to be subtracted for example)
        //and subtract them from the clientX and clientY values.
        let clientX_correct = (event.clientX - event.target.getBoundingClientRect().left)/scale - offset.x; //do not divide offset by scale as it is already
        //calculated after dividing the pointer location by the scale
        let clientY_correct = (event.clientY - event.target.getBoundingClientRect().top)/scale - offset.y;
        let mystart = {...start};
        mystart.startX = parseInt(clientX_correct);
        mystart.startY = parseInt(clientY_correct);
        setStart(mystart);
        let index_clicked = 0;
        for (let tb of diagram.tbls) {
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
    function dragHandler(event) {

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
            let all_tbls = diagram.tbls.map((tbl, index) => { //this is the actual correct way to copy the array of objects
                if(index === selections.selectedTbl){ //we cannot just use [...tbls] here because we want to modify objects inside it
                    return {...tbl, x: tbl.x+=dx, y: tbl.y+=dy}; //and using the spread operator causes a shallow copy in which inner object's ref is copied
                }                                     //this is very necessary to perform copying like this to avoid mutation and future problems like non-updation due to reference of object passed to setState being same as the old one
                else{
                    return tbl;
                }
            })
            setDiagram({...diagram, tbls: all_tbls});
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
        // const nav_height = document.querySelector(".navbar").clientHeight;
        ctxt.canvas.height = window.innerHeight - 0.1;
        ctxt.canvas.width = window.innerWidth;
        ctxt.font = '16px Segoe UI';
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
        ctxt.scale(scale, scale);
        ctxt.translate(offset.x,offset.y);
        if(!diagram.tbls){
            return;
        }
        
        let index = 0;
        for (let tbl of diagram.tbls) {
            
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
        for(let tbl of diagram.tbls){
            for(let field of tbl.fields){
                if(field.isFKey){
                    let second_tbl = diagram.tbls.find((tbl)=> tbl.name === field.refTbl);
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

    //this function is used to add new table to the canvas
    function addTbl(newTbl) {
        let all_tbls = diagram.tbls?[...diagram.tbls]:[]; //if we do not use conditional operator, [...tbls] will give null reference error
        
        //checking if table name is empty
        if(newTbl.name === ''){
            showAlert("Table name cannot be empty!","danger");
            return 1;
        }
        //checking if table name already exists
        if(diagram.tbls){
            for(let tbl of diagram.tbls){
                if(newTbl.name === tbl.name){
                    showAlert('Table name already exists!','warning');
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
            showAlert('Duplicate field names are not allowed!','warning');
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

        setDiagram({...diagram, tbls: all_tbls});
        setSelections(sel);
        return 0;
    }

    //this function finds a place in canvas such that it does not collapse with any previously drawn tables
    function nonCollapseFinder(){
        if(!diagram.tbls){
            return {x: 20, y: 20};
        }
        let rightMostX = 0;
        let rightMostY = 0;
        let rightEdge;
        for(let tbl of diagram.tbls){
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
        if(!diagram.tbls){
            showAlert("No tables exist", "danger");
            return;
        }
        let all_tbls = diagram.tbls.map((tbl) => {            //performing deeper copy of the tbls state object
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

        let current_count = diagram.tbls.length;
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
        setDiagram({...diagram, tbls: all_tbls});
    }

    //this function edits the table
    function updateTbl(newTbl){
        if(!diagram.tbls){
            showAlert("No tables exist!");
            return;
        }
        if(newTbl.name===''){
            showAlert('New name cannot be empty!','warning');
            return;
        }
        let all_tbls = diagram.tbls.map((tbl) => {            //performing deeper copy of the tbls state object
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

        showAlert("Updated table!");
        setDiagram({...diagram, tbls: all_tbls});
    }

    function toggleCreateModal(){
        createTableModalShow?setCreateTableModalShow(false):setCreateTableModalShow(true);
    }
    function toggleEditModal(){
        editTableModalShow?setEditTableModalShow(false):setEditTableModalShow(true);
    }
    function toggleCreateDiagramModal(){
        createDiagramModalShow?setCreateDiagramModalShow(false):setCreateDiagramModalShow(true);
    }

    function saveDiagram() {
        fetch('http://localhost:3000/user/savediagram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', //this must be set in order to save the received session-cookie,
            //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
            body: JSON.stringify(diagram)
        })
            .then(response => response.json()) //response.json() or response.text() provides the 'data'
            .then((data) => {
                if (data.success) {
                    showAlert(data.message, 'success');
                } else {
                    showAlert(data.message, 'success');
                }
            })
            .catch((error) => {
                showAlert('An error occured while trying to access the backend API', 'danger')
                console.log(error)
            })
    }

    return (
            <div className="canvas-div flex justify-center" style={theme==='dark'?{ backgroundImage: `url(${backgroundDark})`}:{ backgroundImage: `url(${background})`}}>
                <p className={`guestmode-alert bg-blue-500 shadow opacity-75 text-white text-center absolute w-full top-0 ${authInfo ? 'hidden scale-0' : ''}`}>You are accessing this page in guest mode, you will not be able to save any changes. To unlock all features, please create an account and sign in!</p>
                <canvas id='canvas' width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMouseMove={dragHandler} onMouseUp={handleMouseUp}></canvas>
                <div className="top-right-buttons flex flex-col fixed top-4 right-4 gap-5">
                    <button type='button' className={`bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110 ${authInfo ? '' : 'hidden'}`} onClick={() => { setDiagram({ name: null, tbls: null }) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
                <div className="top-left-buttons flex flex-col fixed top-4 left-4 gap-5">
                    <Link to={'/'} type='button' className={`bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110`} onClick={() => { }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>

                    </Link>
                </div>
                <div className="bottom-right-buttons flex flex-col  fixed bottom-4 right-4 gap-5">
                    <button type='button' className={`bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110 ${authInfo ? '' : 'hidden'}`} onClick={diagram.name?saveDiagram:toggleCreateDiagramModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                        </svg>
                    </button>
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={delTbl}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={diagram.tbls ? toggleEditModal : () => { showAlert("No tables exist!", "danger") }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </button>
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={toggleCreateModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                        </svg>
                    </button>
                </div>
                <div className="bottom-left-buttons flex  fixed bottom-4 left-4 gap-5">
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={()=>{setScale(scale-0.05)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
                        </svg>
                    </button>
                    <button type='button' className='bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={()=>{setScale(scale+0.05)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                        </svg>
                    </button>
                </div>

                <CreateTableModal show={createTableModalShow} toggleCreateModal={toggleCreateModal} tbls={diagram.tbls?diagram.tbls:null} addTable={addTbl} showAlert={showAlert}/>
                <EditModal table={diagram.tbls?diagram.tbls[selections.selectedTbl]:null} editShow={editTableModalShow} toggleEditModal={toggleEditModal} tbls={diagram.tbls?diagram.tbls:null} showAlert={showAlert} updateTbl={updateTbl}/>
                <CreateDiagramModal diagram={diagram} createDiagramModalShow={createDiagramModalShow} toggleModal={toggleCreateDiagramModal} showAlert={showAlert} setDiagram={setDiagram}></CreateDiagramModal>
            </div>

    )
}