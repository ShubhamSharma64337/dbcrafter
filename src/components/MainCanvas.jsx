import React, { useEffect } from 'react'
import { useState } from 'react';
import background from '/graph-paper.svg';
import backgroundDark from '/graph-paper-dark.svg';
import CreateTableModal from './CreateTableModal';
import EditModal from './EditModal';
import CreateDiagramModal from './CreateDiagramModal';
import SqlModal from './SqlModal';
import { Link } from 'react-router-dom';
import GuestInfoModal from './GuestInfoModal';
import AutosaveLoader from './AutosaveLoader';
import ImportJsonModal from './ImportJsonModal';
export default function MainCanvas({showAlert, theme, authInfo, diagram, setDiagram, dtypes, setIsLoading, urls}) {
    window.addEventListener('resize',()=>{ //this helps in properly resizing the canvas whenever user resizes the window
        const canvas = document.getElementById("canvas");
        const ctxt = canvas.getContext("2d");
        
        ctxt.canvas.height = window.innerHeight - 0.1;
        ctxt.canvas.width = window.innerWidth;
        draw();
    })
    
    const [createTableModalShow, setCreateTableModalShow] = useState(false); //this is used to show or hide add table modal
    const [editTableModalShow, setEditTableModalShow] = useState(false); //this is used to show or hide edit table modal
    const [createDiagramModalShow, setCreateDiagramModalShow] = useState(false); //this is used to show or hide the create diagram modal
    const [sqlModalShow, setSqlModalShow] = useState(false);
    const [guestModalShow, setGuestModalShow] = useState(false);
    const [importJsonModalShow, setImportJsonModalShow] = useState(false);
    const [curveType, setCurveType] = useState('bezier');

    const [offset, setOffset] = useState({x: 0, y:0}); //this is used to pan the canvas by translating the origin by offset
    const [isPanning, setIsPanning] = useState(false) //this is used to check if user has clicked ang is dragging on the canvas (i.e not the table)
    const [commonProps, setCommonProps] = useState({rh: 20}); //this specifies the row height of the tables
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    //  selectedTbl is the index of the table which is currently selected
    //  is_dragging becomes true only when mousedown event is triggered on a particular table and is again set to false
    //  when the mouseup event is triggered
    const [selections, setSelections] = useState({ selectedTbl: null, is_dragging: false });

    // useEffect is used to trigger draw function every single time the component is rendered, mainly to run draw the first time this component is loaded
    useEffect(draw)
    useEffect(()=>{
        if(diagram.name && !selections.is_dragging){ // this checks if diagram is already created and saved in the server, if it is, only then we will autosave it
            // the !selections.is_dragging is used to avoid autosaving the diagram when only the arrangement of tables is changed as it leads to unnecessary load on server
            autosaveDiagram();
        }
    },[diagram]);
    //these are used to determine initial position of pointer (useful in implementing drag and drop)
    //when dragging a table.
    const [start, setStart] = useState({startX: null, startY: null});

    //this is used to remember the zoom state
    const [scale, setScale] = useState(1);

    //this is used to show or hide the auto saving loader beside the diagram name
    const [autoSaving, setAutoSaving] = useState(false);

    //COLORS
    const active_header_bg_light = '#0d6efd';
    const inactive_header_bg_light = 'grey';
    const active_header_text_light = 'white';
    const inactive_header_text_light = 'white';
    const body_bg_light = 'white';
    const body_text_light = 'black';
    const body_primary_text_light = '#0d6efd';
    
    const active_header_bg_dark = '#0d6efd';
    const inactive_header_bg_dark = 'grey';
    const active_header_text_dark = 'white';
    const inactive_header_text_dark = 'white';
    const body_bg_dark = '#313244';
    const body_text_dark = 'white';
    const body_primary_text_dark = '#89b4fa';

    //ARROWS
    const arrow_active_light = '#0d6efd';
    const arrow_inactive_light = 'grey'

    //TABLE SHADOWS
    const shadow_light = '#d0d0d0';
    const shadow_dark = 'black';

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
        if(!diagram.tbls){
            return;
        }
        //By default the clientY and clientX values will be relative to whole document
        //therefore we need to get offsets of the canvas relative to document(navbar height needs to be subtracted for example)
        //and subtract them from the clientX and clientY values.
        let clientX_correct = null, clientY_correct = null;
        clientX_correct = (event.clientX - event.target.getBoundingClientRect().left)/scale - offset.x; //do not divide offset by scale as it is already
        //calculated after dividing the pointer location by the scale
        clientY_correct = (event.clientY - event.target.getBoundingClientRect().top)/scale - offset.y;
        
        if(event.type == 'touchstart'){//if event is touchstart, we need to extract first touch using touches[0] and then use its clientX/Y properties
            clientX_correct = (event.touches[0].clientX - event.target.getBoundingClientRect().left)/scale - offset.x; //do not divide offset by scale as it is already
            clientY_correct = (event.touches[0].clientY - event.target.getBoundingClientRect().top)/scale - offset.y;

        }
        let mystart = {...start};
        mystart.startX = parseInt(clientX_correct);
        mystart.startY = parseInt(clientY_correct);
        setStart(mystart);
        let index_clicked = 0;
        let tableWasSelected = false; //this variable is used to check if user has not selected any table, so that we can reset selection
        for (let tb of diagram.tbls) {
            if (isPointerInTbl(clientX_correct, clientY_correct, tb)) {
                setSelections({selectedTbl: index_clicked, is_dragging: true});
                tableWasSelected = true;
                break;
            }
            index_clicked += 1;
        }
        if(!tableWasSelected){ //
            setSelections({...selections, selectedTbl: null} );
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
        let clientX_correct = null, clientY_correct = null;
        if (!(selections.is_dragging)) {
            if(isPanning){ //if this is placed outside this outer condition, trying to move table causes panning, yet to find out why?
                if(event.type == 'touchmove'){
                    clientX_correct = (event.touches[0].clientX - event.target.getBoundingClientRect().left)/scale - offset.x;
                    clientY_correct = (event.touches[0].clientY - event.target.getBoundingClientRect().top)/scale - offset.y;
                } else {
                    clientX_correct = (event.clientX - event.target.getBoundingClientRect().left)/scale - offset.x;
                    clientY_correct = (event.clientY - event.target.getBoundingClientRect().top)/scale - offset.y;
                }
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
            if(event.type == 'touchmove'){ //if event is touchmove, we need to extract first touch using touches[0] and then use its clientX/Y properties
                clientX_correct = (event.touches[0].clientX - event.target.getBoundingClientRect().left)/scale - offset.x;
                clientY_correct = (event.touches[0].clientY - event.target.getBoundingClientRect().top)/scale - offset.y;        
            } else {
                clientX_correct = (event.clientX - event.target.getBoundingClientRect().left)/scale - offset.x;
                clientY_correct = (event.clientY - event.target.getBoundingClientRect().top)/scale - offset.y;
            }
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
    function draw(bgWhite = false) { //the bgWhite parameter is used to create white background when downloading the canvas data as image
        const canvas = document.getElementById("canvas");
        const ctxt = canvas.getContext("2d");
        //setting width and height properly
        // const nav_height = document.querySelector(".navbar").clientHeight;
        ctxt.canvas.height = window.innerHeight - 0.1;
        ctxt.canvas.width = window.innerWidth;
        ctxt.font = '16px Segoe UI';
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
        if(bgWhite){ //if bgWhite argument is true, draw a white background before drawing anything
            ctxt.fillStyle = body_bg_light;
            ctxt.fillRect(0,0, canvas.width, canvas.height);
        }
        ctxt.scale(scale, scale);
        ctxt.translate(offset.x,offset.y);
        if(!diagram.tbls){
            return;
        }
        
        let index = 0;
        for (let tbl of diagram.tbls) {
            
            //filling background of table with white color
            
            let tbl_height = commonProps.rh + commonProps.rh * tbl.fields.length;

            if(theme==='dark'){
                ctxt.shadowBlur = 0; //setting fill shadow
                ctxt.shadowColor = shadow_dark; 
                ctxt.fillStyle = body_bg_dark;
            }  else {
                ctxt.shadowBlur = 20; //setting fill shadow
                ctxt.shadowColor = shadow_light; 
                ctxt.fillStyle = body_bg_light;
            }
            
            ctxt.beginPath(); //now filling the rounded white background
            ctxt.roundRect(tbl.x, tbl.y, tbl.w, tbl_height, 5);
            ctxt.fill();
            
            ctxt.shadowBlur = 0; //resetting fill shadow

            //The origin for the text to be drawn is at the bottom left corner of the string
            //filling the header
            ctxt.textAlign = 'center'; //this makes sure that the x,y coordinates supplied to fillText lie at center of the text

            if (index === selections.selectedTbl) { //this chooses the header bg color
                ctxt.fillStyle = active_header_bg_light;
            }else{
                ctxt.fillStyle = inactive_header_bg_light;
            }

            ctxt.beginPath();
            ctxt.roundRect(tbl.x, tbl.y, tbl.w, commonProps.rh, [5,5,0,0]); //we are making upper corners of header rounded
            ctxt.fill();

            ctxt.fillStyle = active_header_text_light;
            ctxt.fillText(tbl.name, tbl.x + tbl.w * 0.5, tbl.y + 16);
            ctxt.fillStyle = 'black';

            ctxt.textAlign = 'left';

            //now creating all other fields and their upper row borders
            let row_index = 1;
            for (let row of tbl.fields) {
                // creating the upper border
                // ctxt.beginPath();
                // ctxt.strokeStyle = 'grey';
                // ctxt.moveTo(tbl.x, tbl.y + commonProps.rh * (row_index));
                // ctxt.lineTo(tbl.x + tbl.w, tbl.y + commonProps.rh * (row_index))
                // ctxt.stroke();
                // ctxt.strokeStyle = 'black';
                //filling the text
                if(tbl.pKey === row.name){
                    if(theme==='dark'){
                        ctxt.fillStyle = body_primary_text_dark;
                    } else {
                        ctxt.fillStyle = body_primary_text_light;
                    }
                    ctxt.fillText(row.name , tbl.x + 3, tbl.y + 16 + commonProps.rh * (row_index));
                    
                } else {
                    if(theme==='dark'){
                        ctxt.fillStyle = body_text_dark;
                    } else {
                        ctxt.fillStyle = body_text_light;
                    }
                    ctxt.fillText(row.name, tbl.x + 3, tbl.y + 16 + commonProps.rh * (row_index));
                }
                ctxt.textAlign = 'right'; //this makes sure the datatype is aligned with last character just touching the right border...
                // doing this not only makes it look better, but makes better use of space between name and type
                if(row.size){
                    ctxt.fillText(row.type + "(" + row.size + ")", tbl.x + tbl.w - 3, tbl.y + 16 + commonProps.rh * (row_index));
                } else {
                    ctxt.fillText(row.type, tbl.x + tbl.w - 3, tbl.y + 16 + commonProps.rh * (row_index));
                }

                ctxt.textAlign = 'left';
                row_index += 1;
            }
            index += 1;
        }

        //this finds linked tables and calls drawArrow function to show their links
        diagram.tbls.map((tbl)=>{
            tbl.fields.map((field, fromIndex)=>{
                if(field.isFKey){
                    let second_tbl = diagram.tbls.find((tbl)=> tbl.name === field.refTbl);
                    let toIndex = 0;
                    for(let second_field of second_tbl.fields){
                        if(second_field.name === field.refField){
                            break;
                        }
                        toIndex++;
                    }
                    if(curveType === 'edge'){
                        drawCurveEdge(tbl,second_tbl, fromIndex, toIndex);
                    } else {
                        drawCurveBezier(tbl,second_tbl, fromIndex, toIndex);
                    }
                }
            })
        })
    }

    //Draw Curvy Arrows
    //this function is used to draw arrows between tables linked with foreign keys
    //we will use bezier curves to draw smooth curves using control points
    //fromIndex and toIndex are the indices of the fields which are linked
    function drawCurveBezier(tbl1, tbl2, fromIndex, toIndex){
        const canvas = document.getElementById("canvas");
        const ctxt = canvas.getContext("2d");
        ctxt.strokeStyle = arrow_active_light;
        ctxt.fillStyle = arrow_active_light;
        ctxt.lineWidth = '2';
        let tbl1_bottom = tbl1.y + commonProps.rh + commonProps.rh*tbl1.fields.length;
        let tbl2_bottom = tbl2.y + commonProps.rh + commonProps.rh*tbl2.fields.length;
        let tbl1_left = tbl1.x;
        let tbl2_left = tbl2.x;
        let tbl1_right = tbl1.x + tbl1.w;
        let tbl2_right = tbl2.x + tbl2.w;
        let tbl1_top = tbl1.y;
        let tbl2_top = tbl2.y;
        let ctrl_dist = 100, fromx, fromy, tox, toy; //ctrl_dist is used to calculate offsets for making control points
        let arrow_length = 11, arrow_width = 6;
        ctxt.beginPath();

        // To draw the relation curve, we will consider three main cases :
        // Case 1. When tbl2(containing primary key) is below tbl1(containing foregin key)
        // Case 2. When tbl2 is above, i.e its bottom edge is above top edge of tbl1
        // Case 3. When tbl2 is not completely above or below, but is on left or right of tbl1
        if(tbl2_top > tbl1_bottom){ //CASE 1: when tbl2 is below tbl1 (This will contain 4 cases)
            if(tbl2_right < tbl1_left){ //Case 1: when tbl2's right edge is on left of left edge of upper table
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.bezierCurveTo(fromx - ctrl_dist, fromy, tox + ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_left && tbl2_right <= tbl1_right){ //Case 2: when tbl2's right edge is within the width of tbl1
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.bezierCurveTo(fromx - ctrl_dist, fromy, tox - ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_right && tbl2_left < tbl1_right){ //Case 3: when tbl2's right edge is on right of tbl1's right edge, but left edge of tbl2 is
                //still within the width of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.bezierCurveTo(fromx + ctrl_dist, fromy, tox + ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_right && tbl2_left > tbl1_right){//Case 4: when both right and left edge of tbl2 are on right of right edge of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.bezierCurveTo(fromx + ctrl_dist, fromy, tox - ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            }
            
        } else if (tbl2_bottom < tbl1_top){ //CASE 2: when tbl2 is above tbl1 (This will contain 4 cases)
            if(tbl2_right < tbl1_left){ //Case 1: when tbl2's right edge is on left of left edge of tbl1
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.bezierCurveTo(fromx - ctrl_dist, fromy, tox + ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_left && tbl2_right <= tbl1_right){ //Case 2: when tbl2's right edge is within the width of tbl1
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.bezierCurveTo(fromx - ctrl_dist, fromy, tox - ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_right && tbl2_left < tbl1_right){ //Case 3: when tbl2's right edge is on right of tbl1's right edge, but left edge of tbl2 is
                //still within the width of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.bezierCurveTo(fromx + ctrl_dist, fromy, tox + ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_right && tbl2_left > tbl1_right){//Case 4: when both right and left edge of tbl2 are on right of right edge of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.bezierCurveTo(fromx + ctrl_dist, fromy, tox - ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            }
        } else { //CASE 3: When tbl2 is either on left or right of tbl1
            if(tbl2_right < tbl1_left){ //tbl1 is on right of tbl2
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy); 
                ctxt.bezierCurveTo(fromx - ctrl_dist, fromy,  tox + ctrl_dist, toy, tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (leftwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_left > tbl1_right){ //tbl2 is on the right of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx,fromy);
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

    //Draw Edgy Arrows
    //this function is used to draw arrows between tables linked with foreign keys
    //we will use normal lineTo function of ctxt because this function creates edgy arrows
    //fromIndex and toIndex are the indices of the fields which are linked
    function drawCurveEdge(tbl1,tbl2,fromIndex, toIndex){
        const canvas = document.getElementById("canvas");
        const ctxt = canvas.getContext("2d");
        ctxt.strokeStyle = arrow_active_light;
        ctxt.fillStyle = arrow_active_light;
        ctxt.lineWidth = '2';
        let tbl1_bottom = tbl1.y + commonProps.rh + commonProps.rh*tbl1.fields.length;
        let tbl2_bottom = tbl2.y + commonProps.rh + commonProps.rh*tbl2.fields.length;
        let tbl1_left = tbl1.x;
        let tbl2_left = tbl2.x;
        let tbl1_right = tbl1.x + tbl1.w;
        let tbl2_right = tbl2.x + tbl2.w;
        let tbl1_top = tbl1.y;
        let tbl2_top = tbl2.y;
        let table_dist = 20, fromx, fromy, tox, toy; //ctrl_dist is used to calculate offsets for making control points
        let arrow_length = 11, arrow_width = 6;
        ctxt.beginPath();

        // To draw the relation curve, we will consider three main cases :
        // Case 1. When tbl2(containing primary key) is below tbl1(containing foregin key)
        // Case 2. When tbl2 is above, i.e its bottom edge is above top edge of tbl1
        // Case 3. When tbl2 is not completely above or below, but is on left or right of tbl1
        if(tbl2_top > tbl1_bottom){ //CASE 1: when tbl2 is below tbl1 (This will contain 4 cases)
            if(tbl2_right + arrow_length + table_dist < tbl1_left){ //Case 1: when tbl2's right edge is on left of left edge of upper table
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.lineTo(fromx-table_dist, fromy);
                ctxt.lineTo(fromx-table_dist, toy);
                ctxt.lineTo(tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right + table_dist + arrow_length > tbl1_left && tbl2_right <= tbl1_right){ //Case 2: when tbl2's right edge is within the width of tbl1
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.lineTo(tox - table_dist, fromy);
                ctxt.lineTo(tox - table_dist, toy);
                ctxt.lineTo(tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_right && tbl2_left - arrow_length - table_dist < tbl1_right){ //Case 3: when tbl2's right edge is on right of tbl1's right edge, but left edge of tbl2 is
                //still within the width of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.lineTo(tox+table_dist, fromy);
                ctxt.lineTo(tox+table_dist, toy);
                ctxt.lineTo(tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_right && tbl2_left > tbl1_right){//Case 4: when both right and left edge of tbl2 are on right of right edge of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.lineTo(fromx+table_dist, fromy);
                ctxt.lineTo(fromx+table_dist, toy);
                ctxt.lineTo(tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            }
            
        } else if (tbl2_bottom < tbl1_top){ //CASE 2: when tbl2 is above tbl1 (This will contain 4 cases)
            if(tbl2_right + arrow_length + table_dist < tbl1_left){ //Case 1: when tbl2's right edge is on left of left edge of upper table
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.lineTo(fromx-table_dist, fromy);
                ctxt.lineTo(fromx-table_dist, toy);
                ctxt.lineTo(tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right + table_dist + arrow_length > tbl1_left && tbl2_right <= tbl1_right){ //Case 2: when tbl2's right edge is within the width of tbl1
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.lineTo(tox - table_dist, fromy);
                ctxt.lineTo(tox - table_dist, toy);
                ctxt.lineTo(tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_right && tbl2_left - arrow_length - table_dist < tbl1_right){ //Case 3: when tbl2's right edge is on right of tbl1's right edge, but left edge of tbl2 is
                //still within the width of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.lineTo(tox+table_dist, fromy);
                ctxt.lineTo(tox+table_dist, toy);
                ctxt.lineTo(tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_right > tbl1_right && tbl2_left > tbl1_right){//Case 4: when both right and left edge of tbl2 are on right of right edge of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.lineTo(fromx+table_dist, fromy);
                ctxt.lineTo(fromx+table_dist, toy);
                ctxt.lineTo(tox, toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (downwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            }
            
        } else { //CASE 3: When tbl2 is either on left or right of tbl1
            if(tbl2_right + arrow_length + table_dist < tbl1_left){ //tbl1 is on right of tbl2
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy); 
                ctxt.lineTo(fromx - table_dist, fromy); 
                ctxt.lineTo(fromx - table_dist, toy); 
                ctxt.lineTo(tox, toy); 
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (leftwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox+arrow_length, toy-arrow_width);
                ctxt.lineTo(tox+arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_left - arrow_length - table_dist > tbl1_right){ //tbl2 is on the right of tbl1
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx,fromy);
                ctxt.lineTo(fromx+table_dist,fromy);
                ctxt.lineTo(fromx+table_dist,toy);
                ctxt.lineTo(tox,toy);
                ctxt.stroke();
                ctxt.beginPath(); //now drawing the arrowhead (rightwards)
                ctxt.moveTo(tox,toy);
                ctxt.lineTo(tox-arrow_length, toy-arrow_width);
                ctxt.lineTo(tox-arrow_length, toy+arrow_width);
                ctxt.fill();
            } else if(tbl2_left > tbl1_right){ //when table2 is very close on left side of table1, we draw a straight line and hide the arrow
                fromx = tbl1_right;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_left;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx,fromy);
                ctxt.lineTo(tox,toy);
                ctxt.stroke();
            } else if(tbl2_right < tbl1_left){
                fromx = tbl1_left;
                fromy = tbl1_top + commonProps.rh*(fromIndex+1) + commonProps.rh*0.5;
                tox = tbl2_right;
                toy = tbl2_top + commonProps.rh*(toIndex+1) + commonProps.rh*0.5;
                ctxt.moveTo(fromx, fromy);
                ctxt.lineTo(tox, toy); 
                ctxt.stroke();
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
        let max_width = 150;
        let table_name_length = ctxt.measureText(newTbl.name).width; //this contains the width on canvas of name of the table just added
        for(let field of newTbl.fields){
            var textMetrics = ctxt.measureText(field.name+field.type+"()"+(field.size?field.size.toString():''));
            if(textMetrics.width>max_width){
                max_width = textMetrics.width;
            }
        }
        if(table_name_length < max_width){ //if table field width is wider than table name
            all_tbls[sel.selectedTbl].w = max_width + ctxt.measureText("oo").width; //here we keep an extra space for two 'o' characters
        } else { //if table name is wider than table field
            all_tbls[sel.selectedTbl].w = table_name_length + ctxt.measureText("oo").width;
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
        if(selections.selectedTbl === null){
            showAlert("Please select a table to delete!","danger");
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

        let current_selections = {...selections};
        all_tbls.splice(current_selections.selectedTbl,1); //splice(index,number of items to be deleted)

       current_selections.selectedTbl = null; //whenever a table will be deleted from the diagram, 
        
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
        
        //Checking if duplicate field names are found
        let fieldNames = []
        for(let field of newTbl.fields){
            fieldNames.push(field.name);
        }
        let fieldNamesSet = new Set(fieldNames);
        if(fieldNames.length !== fieldNamesSet.size){
            showAlert('Duplicate field names are not allowed!','warning');
            return 1;
        }

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
        let max_width = 150;
        let table_name_length = ctxt.measureText(newTbl.name).width; //this contains the width on canvas of name of the table just updated
        for(let field of newTbl.fields){
            var textMetrics = ctxt.measureText(field.name+field.type+"()"+(field.size?field.size.toString():''));
            if(textMetrics.width>max_width){
                max_width = textMetrics.width;
            }
        }
        if(table_name_length < max_width){ //if table field width is wider than table name
            all_tbls[selections.selectedTbl].w = max_width + ctxt.measureText("oo").width; //here we keep an extra space for two 'o' characters
        } else { //if table name is wider than table field
            all_tbls[selections.selectedTbl].w = table_name_length + ctxt.measureText("oo").width;
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
    function toggleSqlModal(){
        sqlModalShow?setSqlModalShow(false):setSqlModalShow(true);
    }
    function toggleGuestModal(){
        guestModalShow?setGuestModalShow(false):setGuestModalShow(true);
    }
    function toggleImportJsonModal(){
        importJsonModalShow?setImportJsonModalShow(false):setImportJsonModalShow(true);
    }
    function toggleCurveType(){
        curveType==='edge'?setCurveType('bezier'):setCurveType('edge');
    }

    function saveDiagram() {
        setIsLoading(true);
        fetch(import.meta.env.PROD?urls.productionUrl+'/user/savediagram':urls.devUrl+'/user/savediagram', {
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
            .finally(()=>{
                setIsLoading(false);
            })
    }

    function autosaveDiagram() {
        setAutoSaving(true);
        fetch(import.meta.env.PROD?urls.productionUrl+'/user/savediagram':urls.devUrl+'/user/savediagram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', //this must be set in order to save the received session-cookie,
            //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
            body: JSON.stringify(diagram)
        })
            .then(response => response.json()) //response.json() or response.text() provides the 'data'
            .then((data)=>{
                if(data.success){
                    showAlert("Autosave Completed",'success')
                } else {
                    showAlert(data.message,'danger')
                }
            })
            .catch((error) => {
                showAlert('An error occured while trying to access the backend API', 'danger')
                console.log(error)
            })
            .finally(()=>{
                setAutoSaving(false);
            })
    }

    function imgDownload(){
        draw(true); //draw a white background
        let canvas = document.querySelector('canvas'); //retrieve the canvas element
        const link = document.createElement('a'); // create a hyperlink which will be used to download the image
        link.href = canvas.toDataURL(); //set the href of hyperlink to dataUrl created using canvas
        link.download = diagram.name + '_dbcrafter.png'; //setting the name of file which will be downloaded
        link.click(); //clicking the link to trigger the download
        draw();
    }

    function jsonDownload(){
        const link = document.createElement('a');
        link.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({...diagram}));
        link.download = diagram.name + "_dbcrafter.json";
        link.click();
    }

    function toggleIsPublic(){
        let diagramCopy = {...diagram};
        diagramCopy.isPublic = diagramCopy.isPublic ? false : true;
        setDiagram(diagramCopy);
    }

    function scrollZoomHandler(wheelEvent){
        let newScale = scale-wheelEvent.deltaY*0.001;
        if(newScale>0.25 && newScale<2){
            setScale(newScale);
        }
    }

    function zoomIn(){
        let newScale = scale+0.05;
        if(newScale>2){
            return;
        }
        setScale(newScale)
    }

    function zoomOut(){
        let newScale = scale-0.05;
        if(newScale<0.25){
            return;
        }
        setScale(newScale)
    }

    return (
            <div className={`bg-black canvas-div flex justify-center ${theme==='dark'?'bg-gray-900':'bg-white'}`} style={theme==='dark'?{ backgroundImage: `url(${backgroundDark})`}:{ backgroundImage: `url(${background})`}}>
                <p className={`guestmode-alert flex justify-center items-center gap-x-2 bg-white shadow opacity-75 text-slate-800 ring-1 text-center absolute rounded-b px-1 py-0.5 top-0 ${authInfo ? 'hidden scale-0' : ''}`}>
                    Guest Mode
                    <button onClick={toggleGuestModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </button>
                </p>
                <div className={`fixed flex gap-x-2 items-center top-4 left-1/2 -translate-x-1/2 bg-white border border-blue-500 px-2 py-1 rounded ${!authInfo? 'hidden':''}`}>
                    {diagram.name?diagram.name:'unnamed'}
                    <button className={`group ${diagram.name?'':'hidden'}`} onClick={toggleIsPublic}>
                        {
                            diagram.isPublic ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 open-eyes">
                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 close-eyes">
                                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                </svg>

}
                        <span className={`text-sm text-nowrap tooltip absolute left-full ms-2 top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Toggle Public/Private</span>
                    </button>
                    {
                        diagram.name?
                        <AutosaveLoader autoSave={autosaveDiagram} autoSaving={autoSaving}></AutosaveLoader>
                        :''
                    }
                </div>
                <canvas id='canvas' width={window.innerWidth} height={window.innerHeight} onTouchStart={handleMouseDown} onTouchMove={dragHandler} onTouchEnd={handleMouseUp} onMouseDown={handleMouseDown} onMouseMove={dragHandler} onMouseUp={handleMouseUp} onWheel={scrollZoomHandler}></canvas>
                <div className="top-right-buttons flex flex-col fixed top-4 right-4 gap-5">
                    <button type='button' className={`group relative bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110 ${authInfo ? '' : 'hidden'}`} onClick={() => { 
                        setDiagram({ name: null, tbls: null , isPublic: false}); 
                        setSelections({...selections, selectedTbl: null}); //this makes sure that the previous selected index is reset to null, if user creates a new diagram, else, out of bounds index will be accessed in the EditTable modal, which leads to error
                        }}>
                        <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>New Diagram</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
                <div className="top-left-buttons flex flex-col fixed top-4 left-4 gap-5">
                    <Link to={!authInfo?'/':'/diagrams'} type='button' className={`bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
                    
                <div className="bottom-right-buttons flex flex-col fixed bottom-4 right-4 gap-5">
                    <div className={`level1-menu ${moreOptionsVisible?'hidden':'flex flex-col gap-y-5'}`}>
                        <button type='button' className={`relative group bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110`} onClick={toggleCurveType}>
                            <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Change Curve Type</span>
                            { curveType==='bezier'?
                            <svg viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" enableBackground="new 0 0 76.00 76.00" xmlSpace="preserve" fill="#000000">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier"> 
                                    <path fill="none" fillOpacity="1" stroke="white" strokeWidth="3" strokeLinejoin="round" d="M 58,18C 58,18 33,24 33,33C 33,42 46,41 46,45C 46,49 22,55 18,56L 19,59C 19,59 49,53 49,45C 49,37 36,40 36,33C 36,26 59,21 59,21L 58,18 Z "></path>
                                </g>
                            </svg>
                            :
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 16.5L9 10L13 16L21 6.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        }
                        </button>
                        <button type='button' className={`relative group bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110 ${authInfo ? '' : 'hidden'}`} onClick={diagram.name?saveDiagram:toggleCreateDiagramModal}>
                            <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Save Changes</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                            </svg>
                        </button>
                        <button type='button' className='group relative bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={toggleCreateModal}>
                        <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>New Table</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                            </svg>
                        </button>
                    
                        <button type='button' className='group relative bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={()=>{
                            // diagram.tbls ? toggleEditModal : () => { showAlert("No tables exist!", "danger") }
                            if(!diagram.tbls){
                                showAlert("No tables exist!", "danger")
                                return;
                            }
                            if(selections.selectedTbl === null){
                                showAlert("Please select a table to edit!", "warning");
                                return;
                            }
                            toggleEditModal();
                        }}>
                        <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Edit Table</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <button type='button' className='group relative bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={delTbl}>
                        <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Delete Table</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                        <button type='button' className='group relative bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={()=>{
                            moreOptionsVisible?setMoreOptionsVisible(false):setMoreOptionsVisible(true);
                        }}>
                            <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>More</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className={`level2-menu flex-col gap-y-4 ${moreOptionsVisible?'flex':'hidden'}`}>
                        <button type='button' className={`group relative bg-blue-700 shadow-lg p-3   text-white transition-transform rounded-full hover:scale-110`} onClick={() => { toggleSqlModal() }}>
                            <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Get SQL</span>
                            <svg height="24" width="24" className='w-6 h-6' xmlns="http://www.w3.org/2000/svg">
                                <text x="0" fontSize="13" y="16" fill="white" fontWeight={'bold'}>SQL</text>
                            </svg>
                        </button>
                        <button type='button' className={`group relative bg-blue-700 shadow-lg p-3   text-white transition-transform rounded-full hover:scale-110`} onClick={() => { imgDownload() }}>
                            <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Export as Image</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button type='button' className={`group relative bg-blue-700 shadow-lg p-3   text-white transition-transform rounded-full hover:scale-110`} onClick={() => { jsonDownload() }}>
                            <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Export JSON</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button type='button' className={`group relative bg-blue-700 shadow-lg p-3   text-white transition-transform rounded-full hover:scale-110`} onClick={() => { toggleImportJsonModal(); }}>
                            <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Import JSON</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button type='button' className='group relative bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={()=>{
                            moreOptionsVisible?setMoreOptionsVisible(false):setMoreOptionsVisible(true);
                        }}>
                            <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
</svg>

                        </button>
                    </div>
                </div>
                <div className="bottom-left-buttons flex  fixed bottom-4 left-4 gap-5">
                    <button type='button' className='group relative bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={zoomOut}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
                        </svg>
                    </button>
                    <button type='button' className='group relative bg-blue-700 shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110' onClick={zoomIn}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                        </svg>
                    </button>
                </div>

                <CreateTableModal dtypes={dtypes} show={createTableModalShow} toggleCreateModal={toggleCreateModal} tbls={diagram.tbls?diagram.tbls:null} addTable={addTbl} showAlert={showAlert}/>
                <EditModal dtypes={dtypes} table={diagram.tbls && selections.selectedTbl !== null?diagram.tbls[selections.selectedTbl]:null} editShow={editTableModalShow} toggleEditModal={toggleEditModal} tbls={diagram.tbls?diagram.tbls:null} showAlert={showAlert} updateTbl={updateTbl}/>
                <CreateDiagramModal diagram={diagram} createDiagramModalShow={createDiagramModalShow} toggleModal={toggleCreateDiagramModal} showAlert={showAlert} setDiagram={setDiagram} setIsLoading={setIsLoading} urls={urls}></CreateDiagramModal>
                <SqlModal diagram={diagram} show={sqlModalShow} toggleModal={toggleSqlModal}></SqlModal>
                <GuestInfoModal visible={guestModalShow} toggleModal={toggleGuestModal}></GuestInfoModal>
                <ImportJsonModal visible={importJsonModalShow} toggleVisible={toggleImportJsonModal} showAlert={showAlert} setDiagram={setDiagram}/>
            </div>

    )
}