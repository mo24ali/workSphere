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
    // fillTheUnassignedWorkersAuto();
})







// function updateEmployee(empId) {

// }

// function deleteEmployee(empId) {

// }





// function confirmExperience() {

// }


// function updateModalForm() {

// }



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

let experienceCount = 0;
let isEditMode = false;
let currentEmployeeId = null;
let experiencesArr = JSON.parse(localStorage.getItem("experiences")) || [];
function addDynamicField(experienceData = null, empId) {

    experienceCount++;

    let newField = document.createElement("div");
    newField.innerHTML = `
        <div class="experience-filed flex flex-col">
            <h3 class="font-medium mb-2">Experience #${experienceCount}</h3>
            <div class="experience-section flex flex-col">
                <label for="title${experienceCount}-empId">Title : </label>
                <input id="title${experienceCount}-empId" class="title-input border rounded p-1 mb-2">
                <label for="desc${experienceCount}-empId">Description : </label>
                <textarea id="desc${experienceCount}-empId" class="desc-input border rounded mb-2">
                
                </textarea> 
            </div>
            <div class="flex flex-row space-x-6">
                <div class="start-date flex flex-col">
                    <label for="start${experienceCount}-empId" class="mb-1">Start date : </label>
                    <input type="date" id="start${experienceCount}-empId" class="start-date-input border p-1 mb-3 w-40 rounded">
                </div>
                <div class="end-date flex flex-col">
                    <label for="end${experienceCount}-empId" class="mb-1">End date : </label>
                    <input type="date" id="end${experienceCount}-empId" class="end-date-input border p-1 mb-3 w-40 rounded">
                </div>
            </div>
            <div class="flex flex-row space-x-4">
                <button type="button" class="remove-btn rounded bg-red-500 hover:bg-red-700 w-24 text-white py-1 transform duration-300" onclick="removeExperience(this)">Remove</button>
            <button type="button" id="confirmExperienceBtn" class=" rounded bg-blue-500 hover:bg-blue-700 w-24 text-white py-1 transform duration-300" onclick="updateExperiences(empId,document.getElementById("title${experienceCount}-empId").value.trim(),
            ,document.getElementById("start${experienceCount}-empId").value.trim(), document.getElementById("end${experienceCount}-empId").value.trim())"
            >confirm</button>
            </div>
            
        </div>
    `;

    newField.classList.add('border', 'p-4', 'mb-3', 'rounded', 'experience-field');
    newField.setAttribute('data-exp-id', experienceCount);

    let dynamicDiv = document.getElementById("divForDynamicSection");
    dynamicDiv.appendChild(newField);


}

function removeExperience(button) {
    const experienceField = button.closest('.experience-field');
    experienceField.remove();
    experienceCount--;
    updateExperienceNumbers();
}

function updateExperienceNumbers() {
    const experienceFields = document.querySelectorAll('.experience-field');
    experienceFields.forEach((field, index) => {
        const title = field.querySelector('h3');
        title.textContent = `Experience #${index + 1}`;
    });
}

function validateExperience() {
    try {
        const experiences = document.querySelectorAll('.experience-field');

        for (let exp of experiences) {
            const title = exp.querySelector('.title-input').value.trim();
            const desc = exp.querySelector('.desc-input').value.trim();
            const startDate = exp.querySelector('.start-date-input').value;
            const endDate = exp.querySelector('.end-date-input').value;

            if (!title) {
                alert('Please enter a title for all experiences');
                return false;
            }

            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                alert('End date cannot be before start date');
                return false;
            }
        }
    } catch (e) {
        console.log("the experience is not fetched")
    }

    return true;
}



// LOCALSTORAGE FUNCTIONS

// dynamic form work with localstorage

function validateForm(name, firstname, email) {
    if (!validationName(name) || !validationFirstName(firstname) || !validationMail(email)) {
        return false;
    }

    const experiences = document.querySelectorAll('.experience-field');
    if (experiences.length === 0) {
        alert('Please add at least one experience');
        return false;
    }

    if (!validateExperience()) {
        return false;
    }

    return true;
}

function validationName(name) {
    if (!name) {
        alert('Please enter a last name');
        return false;
    }
    if (name.length < 2) {
        alert('Last name must be at least 2 characters long');
        return false;
    }
    return true;
}

function validationFirstName(firstname) {
    if (!firstname) {
        alert('Please enter a first name');
        return false;
    }
    if (firstname.length < 2) {
        alert('First name must be at least 2 characters long');
        return false;
    }
    return true;
}

function validationMail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) {
        alert('Please enter an email address');
        return false;
    }
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    return true;
}


function addEmployee(name, firstname, email, poste, description) {
    try {
        let employeeAray = JSON.parse(localStorage.getItem("employees")) || [];
        let id = generateId();
        let newEmployee = {
            ID: id,
            nom: name,
            prenom: firstname,
            mail: email,
            poste: poste,
            desc: description
        }

        employeeAray.push(newEmployee);

        let updatedUsersString = JSON.stringify(employeeAray);
        localStorage.setItem('employees', updatedUsersString);
        console.log("data recovered successfully");
        // updateExperiences(id)

    } catch (e) {
        alert("failed to fetch data");
        console.log(e.message);

    }

}

function generateId() {
    return 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
//form data recovery 
// let idCounter = 0;
function formDataRecovery() {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let name = document.getElementById("nom").value.trim();
        let firstname = document.getElementById("pnom").value.trim();
        let email = document.getElementById("mail").value.trim();
        let poste = document.getElementById("positionsSelector").value.trim();
        let desc = document.getElementById("desc").value.trim();
        validateForm(name, firstname, email);
        // validateExperience();
        addEmployee(name, firstname, email, poste, desc);
    })
}

addBtn.addEventListener('click', () => {

    formDataRecovery();
    console.log("clicked");

})
//used to load the list automatically from the localstorage
let arr = JSON.parse(localStorage.getItem("employees")) || [];
let fillTheUnassignedWorkersAuto = () => {
    return (
        employeeList.innerHTML = arr.map((element) => {
            return `
        <li draggable="true" class="bg-gray-50 rounded-lg border border-gray-200 p-3 employee-card">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <img src="assets/guy.png" alt="Employee" class="w-12 h-12 rounded-full">
                <div class="emp-info flex-1 min-w-0">
                    <div id="name" class="font-medium truncate">${element.nom} ${element.prenom}</div>
                    <div id="position" class="text-sm text-gray-600 truncate">${element.poste}</div>
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
        </li>
    `;
        }).join("")

    )
}
fillTheUnassignedWorkersAuto();

document.addEventListener('DOMContentLoaded', () => {
    fillTheUnassignedWorkersAuto();
})


let experiencesArray = JSON.parse(localStorage.getItem("employees_experiences")) || [];

// function updateExperiences(empId,newTitle, startDate , endDate, description) {
//     experiencesArray.forEach(element => {
//         if(element.id === empId){
//             let newExp = {
//                 title : newTitle,
//                 startDate : startDate,
//                 endDate : endDate,
//                 desc : description
//             }
//             element.push(newExp);
//         }
//         let newArrExperiences = JSON.stringify("experiencesArray");
//         localStorage.setItem("employees_experiences",newArrExperiences);

//     });

// }
let confirmExpBtn = document.getElementById("confirmExperienceBtn");
confirmExpBtn.addEventListener('click', () => {

})
addMoreExperience.addEventListener('click', () => {


})


let picUrl = document.getElementById("fileElem");
let picSelector = document.getElementById("fileSlect");



