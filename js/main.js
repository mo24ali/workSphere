let workspace = document.getElementById("workspace");
let addEmployeeBtn = document.getElementById("add-employee-btn")
let employeeListElements = document.querySelectorAll("li") //les li de ul
let employeeList = document.getElementById("employee-list") //la liste ul qui garde tous le employees
//arrays to store the staff
let employeeTab = JSON.parse(localStorage.getItem("employees")) || [];
let receptArr = JSON.parse(localStorage.getItem("receptionists")) || [];
let techniciancsArr = JSON.parse(localStorage.getItem("technicians")) || [];
let secAgents = JSON.parse(localStorage.getItem("securityAgents")) || [];
//add button in the aside section to open the form
let addForm = document.getElementById("add-employee-form");

//form buttons
let form = document.getElementById("form");
let addBtn = document.getElementById("formBtn");
let editBtn = document.getElementById("formBtnEdit");
let closeForm = document.getElementById("closeForm");
let dynamicDiv = document.getElementById("divForDynamicSection");
let addMoreExperience = document.getElementById("moreExperienceBtn");
//rooms in the workplace
let receptionRoom = document.getElementById("reception-room");
let archive = document.getElementById("archive");
let confRoom = document.getElementById("conference-room");
let serversRoom = document.getElementById("servers");
let securityRoom = document.getElementById("security-room");
let staffRoom = document.getElementById("staff-room");


function dragAndDrop() {
    let selected;
    for (let el of employeeListElements) {

        el.addEventListener("dragstart", (e) => {
            selected = e.target;
            console.log(selected);
            console.log(selected.value);

            // console.log("the dragstart event");


        })
        receptionRoom.addEventListener("dragover", (e) => {
            e.preventDefault();
        })

        receptionRoom.addEventListener("drop", (e) => {
            receptionRoom.appendChild(selected);

            /**
             *  
             * still some logic to make each employee in it's place
             * 
             * */


            selected = null;
        })

    }
}


dragAndDrop();

//dynamic form handling
addEmployeeBtn.addEventListener('click', () => {
    // alert("add employee")
    addForm.classList.remove("hidden");
    fillTheUnassignedWorkersAuto();
})


closeForm.addEventListener('click', () => {
    addForm.classList.add("hidden");
})



function updateEmployee(empId) {

}

function deleteEmployee(empId) {

}


function addEmployee() {

}

function addDynamicField() {
    let newField = document.createElement("div");
    newField.innerHTML = `
    
       <div class="flex flex-col">
        <h3>add Experience</h3>
        <div id="experienceDescription" class="flex flex-col">
            <label for="title">Title : </label>
            <input id="title" class="border rounded p-1"></input>
            <label for="desc">Description : </label>
            <textarea id="desc" class="border rounded"></textarea> 
        </div>
        <div class="flex flex-row space-x-6">

            <div id="startDate" class="flex flex-col space-x-4">
                <label for="start" class="mb-1">Start date : </label>
                <input type="date" id="start" class="border p-1 mb-3 w-40 rounded">
            </div>
            <div id="endDate" class="flex flex-col">
                <label for="end" class="mb-1">End date : </label>
                <input type="date" id="end" class="border p-1 mb-3 w-40 rounded">
            </div>
            
        </div>
        <button id="addEperienceBtn"class="rounded bg-blue-500 hover:bg-blue-700 w-20 hover:text-white transform duration-300" onclick="confirmExperience()">Add +</button>
    </div>
    `
    newField.classList.add('border', 'p-1', 'mb-3');
    dynamicDiv.appendChild(newField);
}

function confirmExperience() {

}


function updateModalForm() {

}



let archiveAllowed = document.getElementById("listInArchiveRoom");
let staffAllowed = document.getElementById("listInStaffnRoom");
let receptionAllowed = document.getElementById("listInReceptionRoom");
let securityAllowed = document.getElementById("listInSecurityRoom");
let serversAllowed = document.getElementById("listInServersRoom");
let conferenceAllowed = document.getElementById("listInConferenceRoom");

conferenceAllowed.addEventListener('click', () => {
    document.getElementById("inConferenceRoom").classList.toggle("hidden")
})
serversAllowed.addEventListener("click", () => {
    document.getElementById("inServersRoom").classList.toggle("hidden")
})
securityRoom.addEventListener('click', () => {
    document.getElementById("inSecurityRoom").classList.toggle("hidden")
})
receptionAllowed.addEventListener('click', () => {
    document.getElementById("inReceptionRoom").classList.toggle("hidden")
})
staffAllowed.addEventListener('click', () => {
    document.getElementById("inStaffRoom").classList.toggle("hidden")
})
archiveAllowed.addEventListener('click', () => {
    document.getElementById("inArchiveRoom").classList.toggle("hidden")
})

function formDataRecovery(){
    
}
function fillTheUnassignedWorkersAuto(){
    let newLi = document.createElement("li");
    // newLi.setAttribute("draggable","true");
    newLi.classList.add('bg-gray-50','rounded-lg', 'border', 'border-gray-200','p-3' ,'employee-card');
    newLi.innerHTML = `
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <img src="assets/guy.png" alt="Employee" class="w-12 h-12 rounded-full">
                            <div class="emp-info flex-1 min-w-0">
                                <div id="name" class="font-medium truncate">Abdul Jableevland</div>
                                <div id="position" class="text-sm text-gray-600 truncate">Manager</div>
                            </div>
                            <div class="employee-actions flex gap-2">
                                <button
                                    class="px-3 py-1 text-xs border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition duration-300">
                                    Delete
                                </button>
                                <button
                                    class="px-3 py-1 text-xs border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition duration-300">
                                    Update
                                </button>
                            </div>
                        </div>
        `
    employeeList.appendChild(newLi);
        
}

document.addEventListener('DOMContentLoaded', ()=> {
    fillTheUnassignedWorkersAuto();
})