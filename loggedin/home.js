

window.onload = async function () {
    homePageDetail();
    getLesson();
    getRequestLesson();
    getRequestOriginDetail();

}

async function homePageDetail() {

    const res = await fetch('/getHomeDetail')
    const details = await res.json()

    const playerDetailContainer = document.querySelector('.participantContainer')

    let playerID = ''
    let lessonName = ''
    //This detail.id = participants.id
    for (let detail of details) {

        if (detail.player_id !== playerID) {

            playerDetailContainer.innerHTML +=
                `<div class="card mb-2" style="width:100%">
                    <h5 class="card-title participantName ms-4 mt-3">${detail.nick_name}</h5>
                    <div class="card-body lesson-content" id="${detail.player_id}">
                        <div class="accordion" id="accordion-${detail.player_id}${detail.id}">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${detail.player_id}${detail.id}" aria-expanded="false" aria-controls="collapseOne">
                                        <div class="lessonInformation-content">
                                            <div class="lessonName fs-6 fw-bold">${detail.name}</div>
                                            <div class="lessonDate">下一課日期 : ${detail.date.substring(0, 10)}</div>
                                            <div class="lessonTime">時間 : ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}</div>
                                            <div class="lessonVenus">地點 : ${detail.venue}</div>
                                        </div>
                                    </button>
                                </h2>
                                <div id="collapse-${detail.player_id}${detail.id}" class="accordion-collapse collapse" data-bs-parent="#accordion-${detail.player_id}${detail.id}" style="">
                                    <div class="accordion-body">
                                        <div action="/applyLeave" method="post">
                                        <input name="playerID" type="hidden" value="${detail.player_id}"></input>
                                            <div class="mb-2">
                                                <div class="card card-body">
                                                    <p>原訓練日期</p>
                                                    <select name="originLesson" class="form-select-sm originLessonSelect" id="${detail.name}${detail.player_id}" aria-label="Default select example" required>
                                                        <option selected disabled value="">...</option>
                                                        <option value="${detail.id}">${detail.name} -- ${detail.date.substring(0, 10)} -- ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)} -- ${detail.venue}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="mb-2">
                                                <div class="card card-body">
                                                    <p>更改日期</p>
                                                    <select name="applyLesson" class="form-select-sm applyLessonSelect"  id="${detail.name}" aria-label="Default select example" required>
                                                        <option selected disabled value="">...</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="mb-2">
                                                <div class="card card-body mb-2">
                                                    <p>原因</p>
                                                    <select name="reason" class="form-select-sm reasonSelect" aria-label="Default select example" required>
                                                        <option selected disabled value="">...</option>
                                                        <option value="天雨取消">天雨取消</option>
                                                        <option value="事假">事假</option>
                                                        <option value="病假">病假</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <button type="submit" class="btn btn-dark container-fluid mb-3 requestLeaveBtn">Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
            playerID = detail.player_id
            lessonName = detail.name

        } else if (lessonName !== detail.name) {

            const lessonContainerList = document.querySelectorAll('.lesson-content')

            lessonContainerList.forEach((lessonContainer) => {
                if (parseInt(lessonContainer.id) === detail.player_id) {

                    lessonContainer.innerHTML +=
                        `<div class="accordion mt-2" id="accordion-${detail.player_id}${detail.id}">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${detail.player_id}${detail.id}" aria-expanded="false" aria-controls="collapseOne">
                                        <div class="lessonInformation-content">
                                            <div class="lessonName fs-6 fw-bold">${detail.name}</div>
                                            <div class="lessonDate">下一課日期 : ${detail.date.substring(0, 10)}</div>
                                            <div class="lessonTime">時間 : ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}</div>
                                            <div class="lessonVenus">地點 : ${detail.venue}</div>
                                        </div>
                                    </button>
                                </h2>
                                <div id="collapse-${detail.player_id}${detail.id}" class="accordion-collapse collapse" data-bs-parent="#accordion-${detail.player_id}${detail.id}" style="">
                                    <div class="accordion-body">
                                        <div class="requestLeaveContainer">
                                            <input name="playerID" type="hidden" value="${detail.player_id}"></input>
                                            <div class="mb-2">
                                                <div class="card card-body">
                                                    <p>原訓練日期</p>
                                                    <select name="originLesson" class="form-select-sm originLessonSelect" id="${detail.name}${detail.player_id}" aria-label="Default select example" required>
                                                        <option selected disabled value="">...</option>
                                                        <option value="${detail.id}">${detail.name} -- ${detail.date.substring(0, 10)} -- ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)} -- ${detail.venue}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="mb-2">
                                                <div class="card card-body">
                                                    <p>更改日期</p>
                                                    <select name="applyLesson" class="form-select-sm applyLessonSelect" id="${detail.name}" aria-label="Default select example" required>
                                                        <option selected disabled value="">...</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="mb-2">
                                                <div class="card card-body mb-2">
                                                    <p>原因</p>
                                                    <select name="reason" class="form-select-sm reasonSelect" aria-label="Default select example" required>
                                                        <option selected disabled value="">...</option>
                                                        <option value="天雨取消">天雨取消</option>
                                                        <option value="事假">事假</option>
                                                        <option value="病假">病假</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <button type="submit" class="btn btn-dark container-fluid mb-3 requestLeaveBtn">Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    lessonName = detail.name
                }
            })
        } else {
            const originLessonList = document.querySelectorAll('.originLessonSelect')

            originLessonList.forEach((originLesson) => {
                if (originLesson.id === detail.name + detail.player_id) {
                    originLesson.innerHTML +=
                        `<option value="${detail.id}">${detail.name} -- ${detail.date.substring(0, 10)} -- ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)} -- ${detail.venue}</option>`
                }
            })
        }
    }
}


async function getLesson() {
    const res = await fetch('/getLesson') // Fetch from the correct url
    const details = await res.json()

    const applyLessonList = document.querySelectorAll('.applyLessonSelect')

    for (let detail of details) {

        applyLessonList.forEach((applyLesson) => {
            if (applyLesson.id !== detail.name) {

                applyLesson.innerHTML +=
                    `<option value="${detail.id}">${detail.name} -- ${detail.date.substring(0, 10)} -- ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)} -- ${detail.venue}</option>`
                // This detail.id = lessons.id
            }
        })
    }




}

async function getRequestLesson() {
    const res = await fetch('/getRequestLesson')
    const details = await res.json()

    const lessonContainerList = document.querySelectorAll('.lesson-content')

    for (let detail of details) {

        lessonContainerList.forEach((lessonContainer) => {
            if (parseInt(lessonContainer.id) === detail.player_id) {

                lessonContainer.innerHTML +=
                    `<div class="card mt-2" id="${detail.player_id}${detail.id}">
                        <div class="card-body">
                            <div class="requestLesson-content container-fluid row" id="${detail.id}">
                                <div class="col-md-1" style="font-size:medium">補堂</div>
                                <div class="col-md-9 d-flex justify-content-between align-items-center">
                                    <div class="originLessonInfo-content" id="${detail.id},${detail.player_id}">
                                        
                                    </div>
                                    <div class="mx-2">
                                        <i class="fa-solid fa-caret-right fa-2xl"></i>
                                    </div>
                                    <div class="requestLessonInfo-content" id="${detail.id},${detail.player_id}">
                                        <div class="lessonName fs-6 fw-bold">${detail.name}</div>
                                        <div class="lessonDate">下一課日期 : ${detail.date.substring(0, 10)}</div>
                                        <div class="lessonTime">時間 : ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}</div>
                                        <div class="lessonVenus">地點 : ${detail.venue}</div>
                                    </div>
                                </div>
                                <div class="requestStatus-content col-md-1 d-flex justify-content-center align-items-center">
                                    <div class="requestStatus fw-bold">Status : ${detail.status}</div>
                                </div>
                                <div class="col-md-1 d-flex align-items-center ">
                                    <button type="button" class="btn btn-sm btn-outline-danger " data-bs-toggle="modal" data-bs-target="#deleteRequest">
                                    Delete
                                    </button>
                                    <div class="modal fade" id="deleteRequest" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Delete request</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    Are you sure you want to delete this request?
                                                </div>
                                                <div class="modal-footer d-flex justify-content-between">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                    <button type="button" class="btn btn-danger confirmDeleteBtn">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                            </div>   
                        </div>
                    </div>`
                lessonName = detail.name
            }
        })
    }
}

async function getRequestOriginDetail() {
    const res = await fetch('/getHomeRequestDetail')
    const details = await res.json()

    const originLessonInfoList = document.querySelectorAll('.originLessonInfo-content')

    for (let detail of details) {

        originLessonInfoList.forEach((originLessonInfo) => {

            if (parseInt(originLessonInfo.id) === detail.id && detail.player_id) {

                originLessonInfo.innerHTML +=
                    `<div class="lessonName fs-6 fw-bold">${detail.name}</div>
                    <div class="lessonDate">下一課日期 : ${detail.date.substring(0, 10)}</div>
                    <div class="lessonTime">時間 : ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}</div>
                    <div class="lessonVenus">地點 : ${detail.venue}</div>`

            }
        })
    }
    const requestLeaveBtns = document.querySelectorAll('.requestLeaveBtn')
    const confirmDeleteBtns = document.querySelectorAll('.confirmDeleteBtn')
        console.log(confirmDeleteBtns)

    requestLeaveBtns.forEach((requestLeaveBtn, index) => {
        requestLeaveBtn.addEventListener('click', async () => {
            console.log(requestLeaveBtn)

            const originLesson = document.querySelectorAll('.originLessonSelect')
            const requestLesson = document.querySelectorAll('.applyLessonSelect')
            const requestReason = document.querySelectorAll('.reasonSelect')
            console.log(originLesson)
            console.log(requestLesson)
            console.log(requestReason)

            const res = await fetch(`/requestLeave`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participant_id: originLesson[index].value, lesson_id: requestLesson[index].value, reason: requestReason[index].value })
            });
            window.location.reload()
            console.log("submit")
        })
    })
    

    confirmDeleteBtns.forEach((confirmDeleteBtn, index) => {
        confirmDeleteBtn.addEventListener('click', async () => {
            console.log(confirmDeleteBtns)

            const requestLessonContent = document.querySelectorAll('.requestLesson-content')

            const res = await fetch(`/deleteRequest`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participant_id: requestLessonContent[index].id })
            });
            window.location.reload()
            console.log("Delete submit")
        })
    })
}


// const requestLeaveBtns = document.querySelectorAll('.requestLeaveBtn')
// console.log(requestLeaveBtns)

// requestLeaveBtns.forEach((requestLeaveBtn, index) =>{
//     requestLeaveBtn.addEventListener('click', async ()=> {
//         console.log(requestLeaveBtn)
//     })
// })