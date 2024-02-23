window.onload = async function loadAttendants() {
    const res = await fetch('/getAttendant')
    const details = await res.json()
    const lessonContent = document.querySelector('.lessonList-content')

    lessonContent.innerHTML = '';
    let nameGuard = '';
    let dateGuard = '';
    let timeGuard = '';

    //This detail.id is participants.id
    for (let detail of details) {
        if (detail.name !== nameGuard) {

            lessonContent.innerHTML +=
            `<div class="accordion mb-2" id="${detail.name}">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#lesson-collapse${detail.id}" aria-expanded="true" aria-controls="lesson-collapse">
                        <div class="lessonInformation-content">
                            <!-- import the lesson information -->
                            <h5 class="lessonName">${detail.name}</h5>
                            <div class="lessonVenus">地點 : 城門谷五人場</div>
                        </div>
                        </button>
                    </h2>
                    <div id="lesson-collapse${detail.id}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <div class="accordion lessonBox" id="${detail.name}">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#lesson-${detail.lesson_id}" aria-expanded="true" aria-controls="lesson-${detail.lesson_id}">
                                            <div class="container-fluid d-flex justify-content-between" style="font-size: small;">
                                                <div class="lessonDate">
                                                    <i class="fa-regular fa-calendar fa-sm"></i>
                                                    ${detail.date.substring(0, 10)}
                                                </div>
                                                <div class="lessonTime">
                                                    <i class="fa-regular fa-clock fa-sm"></i>
                                                    ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}
                                                </div>
                                                <div class="lessonPeople d-flex align-items-center">
                                                    <i class="fa-solid fa-user fa-sm"></i>
                                                    <div class="peopleCounter ms-2">1</div>
                                                </div>
                                            </div>
                                        </button>
                                    </h2>
                                    <div id="lesson-${detail.lesson_id}" class="accordion-collapse collapse">
                                        <div class="accordion-body">
                                            <div class="list-group playerList" id="${detail.lesson_id}">
                                                <div class="list-group-item playerCheckBox" id="${detail.id}">
                                                    <input class="form-check-input me-1" type="checkbox" value="${detail.id}" id="checkbox-${detail.id}">
                                                    <label class="form-check-label" for="checkbox-${detail.id}">${detail.english_name},${detail.nick_name}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            nameGuard = detail.name;
            dateGuard = detail.date;
            timeGuard = detail.start_time;

        } else if (detail.date != dateGuard) {

            const lessonBoxs = document.querySelectorAll('.lessonBox')

            lessonBoxs.forEach((lessonBox) => {
                if (lessonBox.id === detail.name) {
                    lessonBox.innerHTML += 
                    `<div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#lesson-${detail.lesson_id}" aria-expanded="true" aria-controls="lesson-${detail.lesson_id}">
                                <div class="container-fluid d-flex justify-content-between" style="font-size: small;">
                                    <div class="lessonDate">
                                        <i class="fa-regular fa-calendar fa-sm"></i>
                                        ${detail.date.substring(0, 10)}
                                    </div>
                                    <div class="lessonTime">
                                        <i class="fa-regular fa-clock fa-sm"></i>
                                        ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}
                                    </div>
                                    <div class="lessonPeople d-flex align-items-center">
                                        <i class="fa-solid fa-user fa-sm"></i>
                                        <div class="peopleCounter ms-2">1</div>
                                    </div>
                                </div>
                            </button>
                        </h2>
                        <div id="lesson-${detail.lesson_id}" class="accordion-collapse collapse">
                            <div class="accordion-body">
                                <div class="list-group playerList" id="${detail.lesson_id}">
                                    <div class="list-group-item playerCheckBox" id="${detail.id}">
                                        <input class="form-check-input me-1" type="checkbox" value="${detail.id}" id="checkbox-${detail.id}">
                                        <label class="form-check-label" for="checkbox-${detail.id}">${detail.english_name},${detail.nick_name}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                    nameGuard = detail.name;
                    dateGuard = detail.date;
                    timeGuard = detail.start_time;
                }
            })
        } else if (detail.start_time != timeGuard) {

            const lessonContents = document.querySelectorAll('.lessonContent')

            lessonContents.forEach((lessonContent) => {
                if (lessonContent.id === detail.name) {
                    lessonContent.innerHTML += 
                    `<div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#${detail.lesson_id}" aria-expanded="true" aria-controls="lesson-${detail.lesson_id}">
                                <div class="container-fluid d-flex justify-content-between" style="font-size: small;">
                                    <div class="lessonDate">
                                        <i class="fa-regular fa-calendar fa-sm"></i>
                                        ${detail.date.substring(0, 10)}
                                    </div>
                                    <div class="lessonTime">
                                        <i class="fa-regular fa-clock fa-sm"></i>
                                        ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}
                                    </div>
                                    <div class="lessonPeople d-flex align-items-center">
                                        <i class="fa-solid fa-user fa-sm"></i>
                                        <div class="peopleCounter ms-2">1</div>
                                    </div>
                                </div>
                            </button>
                        </h2>
                        <div id="lesson-${detail.lesson_id}" class="accordion-collapse collapse">
                            <div class="accordion-body">
                                <div class="list-group playerList" id="${detail.lesson_id}">
                                    <div class="list-group-item playerCheckBox" id="${detail.id}">
                                        <input class="form-check-input me-1" type="checkbox" value="${detail.id}" id="checkbox-${detail.id}">
                                        <label class="form-check-label" for="checkbox-${detail.id}">${detail.english_name},${detail.nick_name}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                    nameGuard = detail.name;
                    dateGuard = detail.date;
                    timeGuard = detail.start_time;
                }
            }) 
        } else {
            const playerLists = document.querySelectorAll('.playerList')
            const lessonPeoples = document.querySelectorAll('.peopleCounter')

            playerLists.forEach((playerList) => {
                if (parseInt(playerList.id) === detail.lesson_id) {

                    playerList.innerHTML += 
                    `<div class="list-group-item playerCheckBox" id="${detail.id}">
                        <input class="form-check-input me-1" type="checkbox" value="${detail.id}" id="checkbox-${detail.id}">
                        <label class="form-check-label " for="checkbox-${detail.id}">${detail.english_name},${detail.nick_name}</label>
                    </div>`
                    nameGuard = detail.name;
                    dateGuard = detail.date;
                    timeGuard = detail.start_time;
                }
            })
            lessonPeoples.forEach((lessonPeople,index) => {
                lessonPeople.innerHTML = playerLists[index].childElementCount
            })
        }
    }//end of for loop
    checkAttendant();
}

async function checkAttendant(){

    const res = await fetch('/getAttendant')
    const details = await res.json()

    for (let detail of details) {
        if (detail.attendant === true) {

            const playerCheckBoxes = document.querySelectorAll('.playerCheckBox')
            console.log(playerCheckBoxes)

            playerCheckBoxes.forEach((playerCheckBox) => {
                if (parseInt(playerCheckBox.id) === detail.id) {
                    console.log(playerCheckBox.id)
                    console.log(detail.id)

                    playerCheckBox.innerHTML = 
                    `<input class="form-check-input me-1" type="checkbox" value="${detail.id}" id="checkbox-${detail.id}" checked>
                    <label class="form-check-label " for="checkbox-${detail.id}">${detail.english_name},${detail.nick_name}</label>
                    `
                }
            })
        }
    }
    submitAttendant();
}

async function submitAttendant () {

    const attendants = document.querySelectorAll('.form-check-input')

    attendants.forEach((attendant) => {
        attendant.addEventListener('change', async ()=>{

            const participantID = attendant.value
            
            if (attendant.checked) {

                const participantAttendant = true

                const res = await fetch(`/updateAttendant`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: participantID, attendant: participantAttendant})
    
                });
                alert ("Update successful");

            } else {
                const participantAttendant = false

                const res = await fetch(`/updateAttendant`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: participantID, attendant: participantAttendant})
    
                });
                alert ("Update successful");

            }
        })
    })
}