let workspace = document.getElementById("workspace");
let addEmployeeBtn = document.getElementById("add-employee-btn");
let employeeListElements = document.querySelectorAll("li");
let employeeList = document.getElementById("employee-list");
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

//global variables
let experienceCount = 0;
let currentEmpID = null;



//popup variables 
let employeeDetailsPopup = document.getElementById("employee-details-popup");
let employeeDetailsContent = document.getElementById("employee-details-content");
let closeDetailsPopup = document.getElementById("closeDetailsPopup");
// Initialize form functionality
function initForm() {
    setupEventListeners();
    fillTheUnassignedWorkersAuto();
}

function setupEventListeners() {
    // Open form
    addEmployeeBtn.addEventListener('click', openForm);

    // Close form
    closeForm.addEventListener("click", closeFormHandler);

    // Add experience button
    addMoreExperience.addEventListener("click", addExperienceField);

    // Form submission
    form.addEventListener("submit", handleFormSubmit);

    // File selector for profile picture
    document.getElementById("fileSlect").addEventListener("click", () => {
        document.getElementById("fileElem").click();
    });
    closeDetailsPopup.addEventListener("click", closeEmployeeDetails);

    // Close popup when clicking outside
    employeeDetailsPopup.addEventListener("click", (e) => {
        if (e.target === employeeDetailsPopup) {
            closeEmployeeDetails();
        }
    });
}

function openForm() {
    addForm.classList.remove("hidden");
    resetForm();
}

function closeFormHandler() {
    resetForm();
    addForm.classList.add("hidden");
}

function resetForm() {
    form.reset();
    dynamicDiv.innerHTML = "";
    experienceCount = 0;
    currentEmpID = null;
}

function addExperienceField() {
    experienceCount++;

    const experienceField = document.createElement("div");
    experienceField.className = "experience-field border p-4 mb-3 rounded";
    experienceField.innerHTML = `
        <div class="experience-filed flex flex-col">
            <h3 class="font-medium mb-2">Experience #${experienceCount}</h3>
            <div class="experience-section flex flex-col">
                <label for="title${experienceCount}">Title : </label>
                <input id="title${experienceCount}" class="title-input border rounded p-1 mb-2" required>
                
                <label for="desc${experienceCount}">Description : </label>
                <textarea id="desc${experienceCount}" class="desc-input border rounded mb-2"></textarea>
            </div>
            <div class="flex flex-row space-x-6">
                <div class="start-date flex flex-col">
                    <label for="start${experienceCount}" class="mb-1">Start date : </label>
                    <input type="date" id="start${experienceCount}" class="start-date-input border p-1 mb-3 w-40 rounded">
                </div>
                <div class="end-date flex flex-col">
                    <label for="end${experienceCount}" class="mb-1">End date : </label>
                    <input type="date" id="end${experienceCount}" class="end-date-input border p-1 mb-3 w-40 rounded">
                </div>
            </div>
            <div class="flex flex-row space-x-4">
                <button type="button" class="remove-btn rounded bg-red-500 hover:bg-red-700 w-24 text-white py-1" onclick="removeExperience(this)" >Remove</button>
                <button type="button" class="confirm-exp-btn rounded bg-blue-500 hover:bg-blue-700 w-24 text-white py-1" onclick="confirmExperience(this)">Confirm</button>
            </div>
        </div>
    `;

    dynamicDiv.appendChild(experienceField);
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

        // Update IDs to maintain consistency
        const inputs = field.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const oldId = input.id;
            const baseName = oldId.replace(/\d+$/, '');
            input.id = baseName + (index + 1);
        });

        const labels = field.querySelectorAll('label');
        labels.forEach(label => {
            const oldFor = label.getAttribute('for');
            if (oldFor) {
                const baseName = oldFor.replace(/\d+$/, '');
                label.setAttribute('for', baseName + (index + 1));
            }
        });
    });
}

function confirmExperience(button) {
    const experienceField = button.closest('.experience-field');
    const titleInput = experienceField.querySelector('.title-input');
    const descInput = experienceField.querySelector('.desc-input');
    const startInput = experienceField.querySelector('.start-date-input');
    const endInput = experienceField.querySelector('.end-date-input');

    const expTitle = titleInput.value.trim();
    const expDesc = descInput.value.trim();
    const startDate = startInput.value;
    const endDate = endInput.value;

    // Validate this specific experience
    if (!expTitle) {
        alert('Please enter a title for this experience');
        return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert('End date cannot be before start date');
        return;
    }

    // Convert to read-only display
    experienceField.innerHTML = `
        <h3 class="font-medium mb-2">Experience #${Array.from(document.querySelectorAll('.experience-field')).indexOf(experienceField) + 1}</h3>
        <p><strong>Title:</strong> ${expTitle}</p>
        <p><strong>Description:</strong> ${expDesc || 'N/A'}</p>
        <p><strong>Start:</strong> ${startDate || 'N/A'}</p>
        <p><strong>End:</strong> ${endDate || 'N/A'}</p>
        <button type="button" class="remove-btn rounded bg-red-500 hover:bg-red-700 w-24 text-white py-1 mt-2" onclick="removeExperience(this)">Remove</button>
    `;

    Toastify({
        text: "Experience added successfully!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: { background: "green" }
    }).showToast();
}

function validateForm() {
    const name = document.getElementById("nom").value.trim();
    const firstname = document.getElementById("pnom").value.trim();
    const email = document.getElementById("mail").value.trim();
    const poste = document.getElementById("positionsSelector").value;

    // Basic validations
    if (!name || name.length < 2) {
        alert('Please enter a valid last name (at least 2 characters)');
        return false;
    }

    if (!firstname || firstname.length < 2) {
        alert('Please enter a valid first name (at least 2 characters)');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (!poste) {
        alert('Please select a position');
        return false;
    }

    // Experience validation
    const experienceFields = document.querySelectorAll('.experience-field');
    // if (experienceFields.length === 0) {
    //     alert('Please add at least one experience');
    //     return false;
    // }

    // Check if all experiences are confirmed (converted to read-only)
    const unconfirmedExperiences = document.querySelectorAll('.experience-field:has(.confirm-exp-btn)');
    if (unconfirmedExperiences.length > 0) {
        alert('Please confirm all experiences before submitting');
        return false;
    }

    return true;
}

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const name = document.getElementById("nom").value.trim();
    const firstname = document.getElementById("pnom").value.trim();
    const email = document.getElementById("mail").value.trim();
    const poste = document.getElementById("positionsSelector").value;
    const desc = document.getElementById("desc").value.trim();

    // Collect experiences from read-only fields
    const experiences = [];
    const experienceFields = document.querySelectorAll('.experience-field');

    experienceFields.forEach(field => {
        const paragraphs = field.querySelectorAll('p');
        if (paragraphs.length >= 4) {
            experiences.push({
                title: paragraphs[0].textContent.replace('Title:', '').trim(),
                desc: paragraphs[1].textContent.replace('Description:', '').trim(),
                startDate: paragraphs[2].textContent.replace('Start:', '').trim(),
                endDate: paragraphs[3].textContent.replace('End:', '').trim()
            });
        }
    });

    addEmployee(name, firstname, email, poste, desc, experiences);
}

function naiveId() {
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    let id;

    do {
        id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    } while (employees.some(emp => emp.ID === id));

    return id;
}

function addEmployee(name, firstname, email, poste, description, experiences = []) {
    try {
        let employeeArray = JSON.parse(localStorage.getItem("employees")) || [];
        let id = naiveId();

        const profilePicInput = document.getElementById("fileElem");
        const profilePic = profilePicInput.files.length > 0
            ? URL.createObjectURL(profilePicInput.files[0])
            : null;

        const newEmployee = {
            ID: id,
            nom: name,
            prenom: firstname,
            mail: email,
            poste: poste,
            desc: description,
            currentLocation: "unassigned",
            expertise: experiences,
            profilePic: profilePic
        };

        employeeArray.push(newEmployee);
        localStorage.setItem("employees", JSON.stringify(employeeArray));

        Toastify({
            text: "Employee successfully added!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            style: { background: "linear-gradient(to right,#00b09b,#96c93d)" }
        }).showToast();

        fillTheUnassignedWorkersAuto();
        closeFormHandler();

    } catch (e) {
        console.error("Error adding employee:", e);
        Toastify({
            text: "Failed to save employee data",
            style: { background: "red" }
        }).showToast();
    }
}

document.addEventListener("DOMContentLoaded", initForm())
function removeEmployee(empId) {
    try {
        let employeeArray = JSON.parse(localStorage.getItem("employees")) || [];
        let isEmployee = (emp) => emp.ID === empId;
        let employeeIndex = employeeArray.findIndex(isEmployee);
        console.log(employeeIndex);
        employeeArray.splice(1, employeeIndex);
        localStorage.setItem("employees", JSON.stringify(employeeArray));
        console.log("emloyee with id " + empId + " is successfully deleted");

    } catch (e) {
        console.log("error deleting employee with id " + empId);

    }

}

// function generateId() {
//     return 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 3);
// }

function fillTheUnassignedWorkersAuto() {
    const arr = JSON.parse(localStorage.getItem("employees")) || [];
    employeeList.innerHTML = arr.map((element) => {
        return `
        <li id="emp=${element.ID}" draggable="true" class="bg-gray-50 rounded-lg border border-gray-200 p-3 employee-card hover:z-50" clickable="true">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3" clickable="false">
                <img src="" alt="Employee" class="w-12 h-12 rounded-full">
                <div class="emp-info flex-1 min-w-0" clickable="false">
                    <div id="name" class="font-medium truncate" clickable="false">${element.nom} ${element.prenom}</div>
                    <div id="position" class="text-sm text-gray-600 truncate" clickable="false">${element.poste}</div>
                </div>
                <div class="employee-actions flex gap-2" clickable="false">
                    <button
                        class="px-3 py-1 text-xs border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition duration-300"
                        onclick="removeEmployee('${element.ID}')">
                        Delete
                    </button>
                    <button
                        class="px-3 py-1 text-xs border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition duration-300">
                        Update
                    </button>
                    <button class="rounded-full border w-7 h-7 hover:bg-gray-500 hover:text-white justify-center items-center traonsform duration-300 text-center" title="Show employees info" onclick="showEmployeeDetails('${element.ID}')">
                        ...
                    </button>
                </div>
            </div>
        </li>
        `;
    }).join('');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initForm);

// Drag and drop functionality (keep your existing implementation)
function dragAndDrop() {
    let selected;
    for (let el of employeeListElements) {
        el.addEventListener("dragstart", (e) => {
            selected = e.target;
            console.log(selected);
        });

        receptionRoom.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        receptionRoom.addEventListener("drop", (e) => {
            receptionRoom.appendChild(selected);
            selected = null;
        });
    }
}


function showEmployeeDetails(employeeId) {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const employee = employees.find(emp => emp.ID === employeeId);

    const experiencesHTML = employee.expertise && employee.expertise.length > 0
        ? employee.expertise.map((exp, index) => `
            <div class="border rounded p-3 mb-3">
                <h4 class="font-medium mb-2">Experience #${index + 1}</h4>
                <p><strong>Title:</strong> ${exp.title || 'N/A'}</p>
                <p><strong>Description:</strong> ${exp.desc || 'N/A'}</p>
                <p><strong>Start Date:</strong> ${exp.startDate || 'N/A'}</p>
                <p><strong>End Date:</strong> ${exp.endDate || 'N/A'}</p>
            </div>
        `).join('')
        : '<p class="text-gray-500">No experiences added</p>';

    employeeDetailsContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-1 flex flex-col items-center">
                <img src="${employee.profilePic || 'assets/guy.png'}" 
                     alt="${employee.nom} ${employee.prenom}" 
                     class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4">
                <h3 class="text-xl font-bold">${employee.nom} ${employee.prenom}</h3>
                <p class="text-gray-600">${employee.poste}</p>
            </div>
            
            <div class="md:col-span-2 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name</label>
                        <p class="mt-1 p-2 bg-gray-50 rounded">${employee.nom}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">First Name</label>
                        <p class="mt-1 p-2 bg-gray-50 rounded">${employee.prenom}</p>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <p class="mt-1 p-2 bg-gray-50 rounded">${employee.mail}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Position</label>
                    <p class="mt-1 p-2 bg-gray-50 rounded">${employee.poste}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <p class="mt-1 p-2 bg-gray-50 rounded min-h-[80px]">${employee.desc || 'No description provided'}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Work Experiences</label>
                    <div class="max-h-60 overflow-y-auto">
                        ${experiencesHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
    console.log(employeeId);

    employeeDetailsPopup.classList.remove("hidden");
}

// Close employee details popup
function closeEmployeeDetails() {
    employeeDetailsPopup.classList.add("hidden");
}



//assign each employee to a room
let assignConferenceRoom = document.getElementById("listInConferenceRoom");
let assignedServersRoom = document.getElementById("listInServersRoom");
let assignedSecurityRoom = document.getElementById("listInSecurityRoom");
let assignedReceptionRoom = document.getElementById("listInReceptionRoom");
let assignedStaffRoom = document.getElementById("listInStaffnRoom");
let assignedArchiveRoom = document.getElementById("listInArchiveRoom");


let peopleInArchive = document.getElementById("peopleInArchiveRoom");
let peopleInStaffRoom = document.getElementById("peopleInStaffRoom");
let peopleInReceptionRoom = document.getElementById("peopleInReceptionRoom");
let peopleInSecurityRoom = document.getElementById("peopleInSecurityRoom");
let peopleInServersRoom = document.getElementById("peopleInServersRoom");
let peopleInCoferenceRoom = document.getElementById("peopleInConferenceRoom");

//add employee to room popup
let addEmployeePopup = document.getElementById("add-employee-popup");
let closeAddEmployeePopup = document.getElementById("closeAddEmployeePopup");
let listOfEmployeesToAdd = document.getElementById("add-employee-content");


closeAddEmployeePopup.addEventListener("click", () => {
    addEmployeePopup.classList.add("hidden");

})
addEmployeePopup.addEventListener("click", (e) => {
    if (e.target == addEmployeePopup) {
        addEmployeePopup.classList.add("hidden");
    }
})

assignConferenceRoom.addEventListener("click", () => {
    console.log("clicked assignConferenceRoom");
    addEmployeePopup.classList.remove("hidden");
    fillEmployeesToAddLIst();
    console.log("fillAssignEmployee");

})
assignedServersRoom.addEventListener("click", () => {
    console.log("clicked assignedServersRoom");
    addEmployeePopup.classList.remove("hidden");
    fillEmployeesToAddLIst();
    console.log("fillAssignEmployee");
})
assignedSecurityRoom.addEventListener("click", () => {
    console.log("clicked assignedSecurityRoom");
    addEmployeePopup.classList.remove("hidden");
    fillEmployeesToAddLIst();
    console.log("fillAssignEmployee");
})
assignedReceptionRoom.addEventListener("click", () => {
    console.log("clicked assignedReceptionRoom");
    addEmployeePopup.classList.remove("hidden");
    fillEmployeesToAddLIst();
    console.log("fillAssignEmployee");
})
assignedStaffRoom.addEventListener("click", () => {
    console.log("clicked assignedStaffRoom");
    addEmployeePopup.classList.remove("hidden");
    fillEmployeesToAddLIst();
    console.log("fillAssignEmployee");
})
assignedArchiveRoom.addEventListener("click", () => {
    console.log("clicked assignedArchiveRoom");
    addEmployeePopup.classList.remove("hidden");
    fillEmployeesToAddLIst();
    console.log("fillAssignEmployee");
})

function fillEmployeesToAddLIst() {



    const roomRoles = {
        "servers": ["technician", "manager", "cleaning"],
        "security-room": ["security", "cleaning"],
        "archive": ["manager"],
        "staff-room": ["technician", "manager", "cleaning", "security", "receptionist"],
        "conference-room": ["manager"],
        "reception-room": ["receptionist", "manager"]
    };

    let arr = JSON.parse(localStorage.getItem("employees"));
    let arrRec = arr.filter(worker => worker.poste === "receptionist");
    let arrIT = arr.filter(worker => worker.poste === "technician");
    let arrManager = arr.filter(worker => worker.poste === "manager");
    let arrSec = arr.filter(worker => worker.poste === "security");
    let arrClean = arr.filter(worker => worker.poste === "cleaning");
    console.log(arrManager);


    listOfEmployeesToAdd.innerHTML = arr.map((elm) => {
        return `
        <li id="emp-toadd=${elm.ID}" draggable="true" class="bg-gray-50 rounded-lg border border-gray-200 p-3 employee-card hover:z-50" clickable="true">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3" clickable="false">
                <img src="assets/guy.png" alt="Employee" class="w-12 h-12 rounded-full">
                <div class="emp-info flex-1 min-w-0" clickable="false">
                    <div id="name" class="font-medium truncate" clickable="false">${elm.nom} ${elm.prenom}</div>
                    <div id="position" class="text-sm text-gray-600 truncate" clickable="false">${elm.poste}</div>
                </div>
                <div class="employee-actions flex gap-2" clickable="false">
                    <button
                        class="px-3 py-1 text-xs border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition duration-300">
                        Add
                    </button>
                    <button class="rounded-full border w-7 h-7 hover:bg-gray-500 hover:text-white justify-center items-center traonsform duration-300 text-center" title="Show employees info" onclick="showEmployeeDetails('${elm.ID}')">
                        ...
                    </button>
                </div>
            </div>
        </li>
        `;
    }).join('');
}
let roomNames = [
    {
        roomName: "Conference room",
        roomId: "conference-room",
        employees: []
    },
    {
        roomName: "Servers room",
        roomId: "servers",
        employees: []
    }
    , {
        roomName: "Security room",
        roomId: "security-room",
        employees: []
    }, {
        roomName: "Reception room",
        roomId: "reception-room",
        employees: []
    }, {
        roomName: "Staff room",
        roomId: "staff-room",
        employees: []
    }, {
        roomName: "Archive room",
        roomId: "archive",
        employees: []
    }

]
function assignEmployee(roomId, empId) {
    let arr = JSON.parse(localStorage.getItem("employees")) || [];
    let room = JSON.parse(localStorage.getItem("rooms")) || [];



}