let workspace = document.getElementById("workspace");
let addEmployeeBtn = document.getElementById("add-employee-btn")
let employeeListElements = document.getElementsByClassName("list-el") //les li de ul
let employeeList = document.getElementById("employee-list") //la liste ul qui garde tous le employees
let rooms = document.getElementsByClassName("dragging-area")
let employeeTab = JSON.parse(localStorage.getItem("employees")) || [];
let receptionRoom = document.getElementById("reception-room");

function dragAndDrop(){
    let selected;
    for(let el of employeeList){
        el.addEventListener("dragstart", (e) => {
            selected = e.target;
        })
        receptionRoom.addEventListener("dragover", (e) => {
            e.preventDefault();
        })
         receptionRoom.addEventListener("drop",(e) => {
                r.appendChild(selected);
                selected = null;
            })
    }
}