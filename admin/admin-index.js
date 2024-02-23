window.onload = async function () {
    adminGetRequest();
    adminGetRequestOriginLesson();
}

async function adminGetRequest() {
    const res = await fetch('/adminGetRequest')
    const details = await res.json()

    const playerDetailContainer = document.querySelector('.participantContainer')

    let playerID = ''

    //This detail.id = participants.id
    for (let detail of details) {

        if (detail.player_id !== playerID) {

            playerDetailContainer.innerHTML +=
                `<div class="card mb-2" style="width:100%">
                    <h5 class="card-title participantName ms-4 mt-3">${detail.english_name} ${detail.nick_name}</h5>
                    <div class="card-body lesson-content" id="${detail.player_id}">
                        <div class="card mt-2" id="${detail.player_id}${detail.id}">
                            <div class="card-body">
                                <div class="requestLesson-content container-fluid row" style="width:100%" id="${detail.id}">
                                    <div class="col-md-1" style="font-size:medium">${detail.reason}</div>
                                    <div class="col-md-6 d-flex justify-content-between align-items-center">
                                        <div class="originLessonInfo-content" id="${detail.id},${detail.player_id}">
                                            
                                        </div>
                                        <div class="mx-2">
                                            <i class="fa-solid fa-caret-right fa-2xl"></i>
                                        </div>
                                        <div class="requestLessonInfo-content" id="${detail.id},${detail.player_id}">
                                            <div class="lessonName fs-6 fw-bold"}">${detail.name}</div>
                                            <div class="lessonDate">下一課日期 : ${detail.date.substring(0, 10)}</div>
                                            <div class="lessonTime">時間 : ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}</div>
                                            <div class="lessonVenus">地點 : ${detail.venue}</div>
                                        </div>
                                    </div>
                                    <div class="requestStatus-content col-md-3 d-flex justify-content-center align-items-center">
                                        <div class="requestStatus fw-bold">Status : ${detail.status}</div>
                                    </div>
                                    <div class="col-md-2 d-flex gap-3 align-items-center justify-content-between">
                                        <button class="btn btn-sm btn-primary approveRequestBtn">Approve</button>
                                        <button type="button" class="btn btn-sm btn-outline-danger " data-bs-toggle="modal" data-bs-target="#deleteRequest">
                                        Reject
                                        </button>
                                        <div class="modal fade" id="deleteRequest" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Delete request</h1>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        Please enter the message for rejection :
                                                        <div class="mb-3">
                                                            <label for="reject-message-text" class="col-form-label"></label>
                                                            <textarea class="form-control reject-message-text" id="reject-message-text"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer d-flex justify-content-between">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                        <button type="button" class="btn btn-danger confirmRejectBtn">Reject</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>  
                                </div>   
                            </div>
                        </div>`
        }
    }
}

async function adminGetRequestOriginLesson() {
    const res = await fetch('/adminGetRequestOriginLesson')
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

    const approveRequestBtns = document.querySelectorAll('.approveRequestBtn')
    const confirmRejectBtns =document.querySelectorAll('.confirmRejectBtn')

    approveRequestBtns.forEach((approveRequestBtn,index) => {
        approveRequestBtn.addEventListener('click', async () => {

            const requestLessonContent = document.querySelectorAll('.requestLesson-content')
            
            const res = await fetch(`/approveRequest`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participant_id: requestLessonContent[index].id})
            });
            window.location.reload()
            console.log("Approved")
        })
    })
    console.log(confirmRejectBtns)
    confirmRejectBtns.forEach((confirmRejectBtn,index) => {
        confirmRejectBtn.addEventListener('click', async () => {

            const requestLessonContent = document.querySelectorAll('.requestLesson-content')
            const rejectMessageContent = document.querySelectorAll('.reject-message-text')
            
            const res = await fetch(`/rejectRequest`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participant_id: requestLessonContent[index].id, text:rejectMessageContent[index].value})
            });
            window.location.reload()
            console.log("Rejected")
        })
    })
}
