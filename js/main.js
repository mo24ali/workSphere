let employeeList = document.getElementById("employee-list");
//add button in the aside section to open the form
let addForm = document.getElementById("add-employee-form");
//form buttons
let addEmployeeBtn = document.getElementById("add-employee-btn");
let form = document.getElementById("form");
let closeForm = document.getElementById("closeForm");
let dynamicDiv = document.getElementById("divForDynamicSection");
let addMoreExperience = document.getElementById("moreExperienceBtn");
//global variables

let experienceCount = 0;
let currentEmpID = null;
const roomLimits = {
    "conference-room": 4,
    "reception-room": 2,
    "servers": 3,
    "security-room": 2,
    "staff-room": 6,
    "archive": 1
};
//popup variables 
let employeeDetailsPopup = document.getElementById("employee-details-popup");
let employeeDetailsContent = document.getElementById("employee-details-content");
let closeDetailsPopup = document.getElementById("closeDetailsPopup");

function fillTheUnassignedWorkersAuto() {
    const arr = JSON.parse(localStorage.getItem("employees")) || [];

    const filterJob = document.getElementById("jobsFilter").value;
    const searchValue = document.getElementById("searchInput").value.toLowerCase();

    let result = arr.filter(emp => emp.currentLocation === "unassigned");
    //filter the workers based on their jobs
    if (filterJob !== "") {
        result = result.filter(emp => emp.poste === filterJob);
    }
    //filter the workers based on search of their names
    if (searchValue.trim() !== "") {
        result = result.filter(emp =>
            emp.nom.toLowerCase().includes(searchValue) ||
            emp.prenom.toLowerCase().includes(searchValue)
        );
    }

    employeeList.innerHTML = result.map((element) => {
        return `
        <li id="${element.poste}=${element.ID}" draggable="true" class="dragged-element bg-gray-50 rounded-lg border border-gray-200 p-3 employee-card hover:z-50">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <img src="${element.profilePicture}" alt="Employee" class="w-12 h-12 rounded-full">
                <div class="emp-info flex-1 min-w-0">
                    <div class="font-medium truncate">${element.nom} ${element.prenom}</div>
                    <div class="text-sm text-gray-600 truncate">${element.poste}</div>
                </div>
                <div class="employee-actions flex gap-2">
                    <div class="flex flex-col gap-2">
                        <button class="px-3 py-1 text-xs border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition duration-300" onclick="removeEmployee('${element.ID}')">Delete</button>
                    </div>
                    <button class="rounded-full border w-7 h-7 hover:bg-gray-500 hover:text-white justify-center items-center transform duration-300 text-center" title="Show employees info" onclick="showEmployeeDetails('${element.ID}')">...</button>
                </div>
            </div>
        </li>
        `;
    }).join("")
    enableDragAndDrop();
}

 //button class="px-3 py-1 text-xs border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition duration-300">Edit</button>

//initialize form functionality open and close

function initForm() {
    setupEventListeners();
    fillTheUnassignedWorkersAuto();
    enableDragAndDrop();
}
function setupEventListeners() {
    addEmployeeBtn.addEventListener('click', openForm);
    closeForm.addEventListener("click", closeFormHandler);
    addMoreExperience.addEventListener("click", addExperienceField);
    form.addEventListener("submit", handleFormSubmit);
    //to handle the close poopup by clicking on the lcose button
    closeDetailsPopup.addEventListener("click", closeEmployeeDetails);
    //to handle the close of popup when clicking on the outside of the details container
    employeeDetailsPopup.addEventListener("click", (e) => {
        if (e.target === employeeDetailsPopup) {
            closeEmployeeDetails();
        }
    });
}
function openForm() {
    addForm.classList.remove("hidden");
    //reset the form to clear the input for another adding operation
    resetForm();
}
function closeFormHandler() {
    resetForm();
    addForm.classList.add("hidden");
}
function resetForm() {
    //reset the form .reset() to clear the input for another adding operation
    form.reset();
    dynamicDiv.innerHTML = "";
    experienceCount = 0;
    currentEmpID = null;
}
//experience adding and deleting functions
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
    //validate this specific experience
    if (!expTitle) {
        alert('Please enter a title for this experience');
        return;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert('End date cannot be before start date');
        return;
    }
    //convert to read-only display
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
//validate form function
document.getElementById("profilePictureInput").addEventListener("input", previewProfilePictureURL);
function validateForm() {
    const name = document.getElementById("nom").value.trim();
    const firstname = document.getElementById("pnom").value.trim();
    const email = document.getElementById("mail").value.trim();
    const poste = document.getElementById("positionsSelector").value;

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

    const unconfirmedExperiences = document.querySelectorAll('.experience-field:has(.confirm-exp-btn)');
    if (unconfirmedExperiences.length > 0) {
        alert('Please confirm all experiences before submitting');
        return false;
    }

    return true;
}
function handleFormSubmit(e) {
    e.preventDefault(); //to prevent browser reload
    if (!validateForm()) {
        return;
    }
    addEmployee();
}
function naiveId() {
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    let id;
    //to verify that the ID is not duplicated
    do {
        id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    } while (employees.some(emp => emp.ID === id));
    return id;
}
function previewProfilePictureURL() {
    const url = document.getElementById("profilePictureInput").value.trim();
    const preview = document.getElementById("profilePreview");
    if (url && url.startsWith("http")) {
        preview.src = url;
        preview.classList.remove("hidden");
    } else {
        preview.classList.add("hidden");
    }
}
function addEmployee() {
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("pnom").value.trim();
    const email = document.getElementById("mail").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();
    const poste = document.getElementById("positionsSelector").value;
    const description = document.getElementById("desc").value.trim();
    const profileUrl = document.getElementById("profilePictureInput").value.trim();

    if (!validatePhone(phone)) {
        document.getElementById("phoneError").classList.remove("hidden");
        return;
    } else {
        document.getElementById("phoneError").classList.add("hidden");
    }
    //collect confirmed experiences
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
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const newEmployee = {
        ID: naiveId(),
        nom,
        prenom,
        email,
        phone,
        poste,
        description,
        profilePicture: profileUrl || "assets/guy.png",
        currentLocation: "unassigned",
        experiences
    };
    employees.push(newEmployee);
    localStorage.setItem("employees", JSON.stringify(employees));

    fillTheUnassignedWorkersAuto();
    // renderAllRooms();
    form.reset();
    document.getElementById("profilePreview").classList.add("hidden");
    addForm.classList.add("hidden");
}
addForm.addEventListener('click', (e) => {
    if (e.target == addForm) {
        addForm.classList.add("hidden");
    }
})
document.addEventListener("DOMContentLoaded", () => {
    initForm()
})
function removeEmployee(empId) {
    try {
        let employeeArray = JSON.parse(localStorage.getItem("employees")) || [];
        let isEmployee = (emp) => emp.ID === empId;
        let employeeIndex = employeeArray.findIndex(isEmployee);
        console.log(employeeIndex);
        employeeArray.splice(employeeIndex, 1);
        localStorage.setItem("employees", JSON.stringify(employeeArray));
        fillTheUnassignedWorkersAuto();
        renderAllRooms();
    } catch (e) {
        console.log("error deleting employee with id " + empId);
    }
}
function showEmployeeDetails(employeeId) {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const employee = employees.find(emp => emp.ID === employeeId);
    console.log(employee);

    const experiencesHTML = employee.experiences && employee.experiences.length > 0
        ? employee.experiences.map((exp, index) => `
            <div class="border rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-all bg-white">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-lg">Experience #${index + 1}</h4>
                    <span class="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                        ${exp.title || 'Experience'}
                    </span>
                </div>
                <p class="text-sm"><strong>Description:</strong> ${exp.desc || 'N/A'}</p>
                <div class="flex gap-3 mt-2 text-sm text-gray-700">
                    <p><strong>Start:</strong> ${exp.startDate || 'N/A'}</p>
                    <p><strong>End:</strong> ${exp.endDate || 'N/A'}</p>
                </div>
            </div>
        `).join("")
        : '<p class="text-gray-500 italic">No experiences added</p>';

    employeeDetailsContent.innerHTML = `
        <div class="bg-white p-6 rounded-2xl shadow-xl">
        
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
                <div class="flex flex-col items-center text-center border-r md:border-r-2 border-gray-200 pr-6">
                    <img src="${employee.profilePicture || 'assets/guy.png'}"
                        alt="${employee.nom} ${employee.prenom}"
                        class="w-36 h-36 rounded-full object-cover border-4 border-indigo-200 shadow-md mb-4">
                    
                    <h3 class="text-2xl font-bold text-gray-900">${employee.nom} ${employee.prenom}</h3>
                    <p class="text-indigo-600 font-medium mt-1">${employee.poste}</p>

                    <span class="mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        ${employee.currentLocation || 'No location'}
                    </span>
                </div>

                <div class="md:col-span-2 space-y-6">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Last Name</label>
                            <p class="detail-field">${employee.nom}</p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">First Name</label>
                            <p class="detail-field">${employee.prenom}</p>
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-sm font-semibold text-gray-600">Email</label>
                        <p class="detail-field">${employee.email}</p>
                    </div>
                    
                    <div>
                        <label class="text-sm font-semibold text-gray-600">Position</label>
                        <p class="detail-field">${employee.poste}</p>
                    </div>

                    <div>
                        <label class="text-sm font-semibold text-gray-600">Description</label>
                        <p class="detail-field min-h-[80px]">${employee.description || 'No description provided'}</p>
                    </div>
                    
                    <div>
                        <label class="text-sm font-semibold text-gray-700 mb-2 block">Work Experiences</label>
                        <div class="max-h-64 overflow-y-auto pr-2">
                            ${experiencesHTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    employeeDetailsPopup.classList.remove("hidden");
    console.log(employeeId);
}

//close employee details popup
function closeEmployeeDetails() {
    employeeDetailsPopup.classList.add("hidden");
}
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
let roomRoles = {
    /**
     *  Reception → Receptionist, Manager, Cleaning Staff 
        Server Room → IT Technician, Manager, Cleaning Staff 
        Security Room → Security Agent, Manager, Cleaning Staff 
        Archive Room → Manager only 
        Conference Room → ALL 6 roles 
        Staff Room → ALL 6 roles
     */
    "servers": ["technician", "manager", "cleaning"],
    "security-room": ["security", "cleaning", "manager"],
    "archive": ["manager"],
    "staff-room": ["manager", "cleaning", "security", "receptionist", "technician", "other"],
    "conference-room": ["manager", "cleaning", "security", "receptionist", "technician", "other"],
    "reception-room": ["receptionist", "manager", "cleaning"]
};
function fillEmployeesToAddLIst(room) {
    console.log(room);
    console.log("clicked");

    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const popup = document.getElementById("add-employee-popup");
    console.log(roomRoles[room]);
    let allowedRoles = [];
    allowedRoles = roomRoles[room];
    console.log(allowedRoles);
    const eligible = employees.filter(emp =>
        emp.currentLocation === "unassigned" && allowedRoles.includes(emp.poste)
    );
    console.log(eligible);

    listOfEmployeesToAdd.innerHTML = eligible.map(emp => `
        <li class="flex justify-between items-center border p-3 rounded mb-2">
            <img src="${emp.profilePicture}" class="rounded-full w-15 h-15">
            <span>${emp.nom} ${emp.prenom} - ${emp.poste}</span>
            <button class="bg-green-500 px-3 py-1 text-white rounded"
                onclick="assignEmployeeToRoom('${emp.ID}', '${room}')">
                Add
            </button>
        </li>
    `).join('');

    popup.classList.remove("hidden");
}

window.onload = () => {
    fillTheUnassignedWorkersAuto();
    renderAllRooms();
}
function validatePhone(phone) {
    const phoneRegex = /^(\+212|0)(5|6|7|8)[0-9]{8}$/;
    return phoneRegex.test(phone);
}
function removeEmployeeFromRoom(empId) {
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    let emp = employees.find(e => e.ID === empId);
    emp.currentLocation = "unassigned";
    localStorage.setItem("employees", JSON.stringify(employees));
    Toastify(
        {
            text: "removed from room",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            style: { background: "green" }
        }
    ).showToast();
    fillTheUnassignedWorkersAuto();
    renderAllRooms();
}
function assignEmployeeToRoom(empId, room) {
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    let emp = employees.find(e => e.ID === empId);
    if (!emp) {
        console.warn("assignEmployeeToRoom: employee not found", empId);
        return;
    }
    const assignedEmployees = employees.filter(e => e.currentLocation === room);
    const limit = (roomLimits && roomLimits[room]);
    if (assignedEmployees.length >= limit) {
        return Toastify({
            text: "Room is full",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            style: { background: "red" }
        }).showToast();
    }
    emp.currentLocation = room;
    localStorage.setItem("employees", JSON.stringify(employees));
    Toastify({
        text: emp.nom + " moved to " + room,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: { background: "linear-gradient(to right,#00b09b,#96c93d)" }
    }).showToast();
    fillTheUnassignedWorkersAuto();
    renderAllRooms();
    const popup = document.getElementById("add-employee-popup");
    if (popup) popup.classList.add("hidden");
}

function renderAllRooms() {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];

    const rooms = [
        "conference-room",
        "reception-room",
        "servers",
        "security-room",
        "staff-room",
        "archive"
    ];

    //list of room that must not be empty
    const requiredRooms = ["reception-room", "servers", "archive", "security-room"];

    rooms.forEach(room => {
        const roomContainer = document.getElementById(room);
        if (!roomContainer) {
            console.warn("room container not found:", room);
            return;
        }

        let employeeArea = roomContainer.querySelector(".room-employees");
        if (!employeeArea) {
            employeeArea = document.createElement("div");
            employeeArea.classList.add("room-employees", 'grid', 'grid-cols-2', 'grid-rows-2');

            const addBtn = roomContainer.querySelector(".add-btn");
            if (addBtn) {
                roomContainer.insertBefore(employeeArea, addBtn);
            } else {
                roomContainer.appendChild(employeeArea);
            }
        }

        employeeArea.innerHTML = "";
        const assignedEmployees = employees.filter(e => e.currentLocation === room);
        const roomLimit = roomLimits[room];

        if (assignedEmployees.length === 0) {

            if (requiredRooms.includes(room)) {
                roomContainer.classList.add("bg-red-500/50");
            } else {
                roomContainer.classList.remove("bg-red-500/50");
            }

            employeeArea.innerHTML = `
                <p class="text-sm italic opacity-75 text-center">Empty zone</p>
            `;
        } else {
            roomContainer.classList.remove("bg-red-500/50");

            assignedEmployees.forEach(emp => {
                const card = document.createElement("div");
                card.className = "employee-card bg-white border rounded-sm p-2 text-xs flex flex-col items-center gap-1";

                card.innerHTML = `
                    <div class="flex items-center gap-2">
                        <img src="${emp.profilePicture}" alt="${emp.nom}"
                        class="w-8 h-8 rounded-full object-cover">
                    </div>
                    <div class="flex flex-row gap-2">
                        <button onclick="removeEmployeeFromRoom('${emp.ID}')"
                        class="text-red-500 font-bold hover:text-red-700">X</button>
                        <button class="rounded-full border w-7 h-7 hover:bg-gray-500 hover:text-white justify-center items-center transform duration-300 text-center" title="Show employee info" onclick="showEmployeeDetails('${emp.ID}')">...</button>
                    </div>
                `;
                employeeArea.appendChild(card);
            });
        }

        roomContainer.querySelector(".room-capacity")?.remove();
        const cap = document.createElement("p");
        cap.className = "room-capacity text-[10px] text-gray-600 mt-1 text-center";
        cap.textContent = `${assignedEmployees.length}/${roomLimit}`;
        employeeArea.insertAdjacentElement("afterend", cap);
    });
}

document.getElementById("jobsFilter").addEventListener("change", fillTheUnassignedWorkersAuto);
document.getElementById("searchInput").addEventListener("input", fillTheUnassignedWorkersAuto);

fillTheUnassignedWorkersAuto();
enableDragAndDrop();





document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("jobsFilter").value = "";
    initForm();
    renderAllRooms();
    enableDragAndDrop();
    makeRoomsDroppable();
})
function enableDragAndDrop() {
    let draggableElements = document.querySelectorAll(".dragged-element");
    let draggableAreas = document.querySelectorAll(".dragging-area");

    draggableElements.forEach(emp => {
        emp.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("ID", emp.id);
            let empID = emp.id;
            let role = empID.split('=')[0];

            draggableAreas.forEach(room => {
                let allowedRoles = roomRoles[room.id] || [];
                if (allowedRoles.includes(role)) {
                    room.classList.add("bg-green-500/50");
                    room.classList.remove("bg-red-500/50");
                } else {
                    room.classList.add("bg-red-500/50");
                    room.classList.remove("bg-green-500/50");
                }
            });
        });

        emp.addEventListener("dragend", () => {
            draggableAreas.forEach(room => {
                room.classList.remove("bg-green-500/50", "bg-red-500/50");
            });
            renderAllRooms();
        });
    });


    draggableAreas.forEach(room => {
        room.addEventListener("dragover", (e) => e.preventDefault());
        room.addEventListener("drop", (e) => {
            e.preventDefault();
            const empId = e.dataTransfer.getData("ID");
            const role = employeeRoles[empId];
            const allowedRoles = roomRoles[room.id] || [];
            if (allowedRoles.includes(role)) {
                room.appendChild(document.getElementById(empId));
            } else {
                alert("You cannot drop this employee here!");
            }
        });
    });
}

function makeRoomsDroppable() {

    let listOfdraggableRooms = document.querySelectorAll('.dragging-area')
    listOfdraggableRooms.forEach(room => {
        let roomId = room.id;
        room.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        room.addEventListener('drop', (e) => {
            let empId = e.dataTransfer.getData('ID').split('=')[1];
            console.log(empId);

            let employees = JSON.parse(localStorage.getItem("employees")) || [];
            let employee = employees.find(emp => emp.ID === empId);

            if (!roomRoles[roomId].includes(employee.poste)) {
                Toastify({
                    text: "This employee cannot go to this room",
                    duration: 2000,
                    style: { background: "red" }
                }).showToast();
                return;
            }
            assignEmployeeToRoom(employee.ID, room.id)
            fillTheUnassignedWorkersAuto();
        });
    });
}
