

window.onload = async function () {
    loadLesson();
}

async function loadLesson() {

    const res = await fetch('/getLesson') // Fetch from the correct url
    const details = await res.json()
    const lessonContent = document.querySelector('.lessonList-content')

    lessonContent.innerHTML = '';
    let nameGuard = '';

    //This detail.id is lesson.id
    for (let detail of details) {
        if (detail.name !== nameGuard) {
            lessonContent.innerHTML +=
                `<div class="accordion-item" id="${detail.id}>
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${detail.id}" aria-expanded="false" aria-controls="collapse${detail.id}">
                            <div class="lessonInformation-content">
                                <h5 class="lessonName">${detail.name}</h5>
                                <div class="lessonVenus">地點 : ${detail.venue}</div>
                            </div>
                        </button>
                    </h2>
                </div>
                <div id="collapse${detail.id}" class="accordion-collapse collapse" data-bs-parent="#${detail.id}" style="">
                    <div class="accordion-body">
                        <div class="table-responsive-sm">
                            <table class="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Start</th>
                                        <th scope="col">End</th>
                                        <th scope="col">Venue</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody class="table-group-divider lessonTable" id="${detail.name}">
                                    <tr class="lessonContent" id="${detail.id}">
                                        <th scope="row lesson-date">${detail.date.substring(0, 10)}</th>
                                        <td class="lesson-start">${detail.start_time.substring(0, 5)}</td>
                                        <td class="lesson-end">${detail.end_time.substring(0, 5)}</td>
                                        <td class="lesson-venue">${detail.venue}</td>
                                        <td>
                                            <div class="d-flex justify-content-between ">
                                                <button class="btn btn-outline-dark btn-sm editButton" type="button">
                                                Edit
                                                </button>
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
                                                                Are you sure you want to delete this lesson?
                                                                <br> Please note that once deleted, the participation records of all participants will be cancelled !
                                                            </div>
                                                            <div class="modal-footer d-flex justify-content-between">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                <button type="button" class="btn btn-danger deleteButton">Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button class="btn btn-outline-dark btn-sm container-fluid addNewButton" type="button"
                            data-bs-toggle="collapse" data-bs-target="#addNewLesson" aria-expanded="false"
                            aria-controls="addNewLesson">
                            +Add
                        </button>
                        <form action="/adminLesson" method="post" class="collapse" id="addNewLesson">
                            <div class="card card-body my-3">
                                <div class="row">
                                    <input name="name" type="hidden" value="${detail.name}">
                                    <div class="col-md-3 mb-2">
                                        <div class="form-floating">
                                            <input name="date" type="date" class="form-control" required>
                                            <label for="exampleInputPassword1" class="form-label">Date of
                                                lesson</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3 mb-2">
                                        <div class="form-floating">
                                            <input name="start_time" type="time" class="form-control" placeholder="StartTime"
                                                required>
                                            <label for="exampleInputEmail1" class="form-label">Start
                                                Time</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3 mb-2">
                                        <div class="form-floating">
                                            <input name="end_time" type="time" class="form-control" placeholder="EndTime" required>
                                            <label for="exampleInputEmail1" class="form-label">End Time</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3 mb-2">
                                        <div class="form-floating">
                                            <input name="venue" type="text" class="form-control" placeholder="Venue" required>
                                            <label for="exampleInputEmail1" class="form-label">Venue</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type="submit" class="btn btn-dark container-fluid mb-3">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>`

            nameGuard = detail.name;
            console.log(nameGuard)

        } else {

            const lessonTableList = document.querySelectorAll('.lessonTable')
            console.log(lessonTableList)

            lessonTableList.forEach((lessonTable) => {
                if (lessonTable.id === detail.name) {

                    lessonTable.innerHTML +=
                        `<tr class="lessonContent" id="${detail.id}">
                    <th scope="row lesson-date">${detail.date.substring(0, 10)}</th>
                    <td class="lesson-start">${detail.start_time.substring(0, 5)}</td>
                    <td class="lesson-end">${detail.end_time.substring(0, 5)}</td>
                    <td class="lesson-venue">${detail.venue}</td>
                    <td>
                        <div class="d-flex justify-content-between ">
                            <button class="btn btn-outline-dark btn-sm editButton" type="button">
                            Edit
                            </button>
                            <button class="btn btn-outline-danger btn-sm deleteButton" type="button">
                            Delete
                            </button>
                        </div>
                    </td>
                </tr>`

                }
            })
        }

        const editButtons = document.querySelectorAll('.editButton')

        editButtons.forEach((editButton, index) => {
            editButton.addEventListener('click', async () => {

                const lessonContents = document.querySelectorAll('.lessonContent')
                const res = await fetch('/getLesson') // Fetch from the correct url
                const lessons = await res.json()

                lessonContents[index].innerHTML =
                    `<input type="hidden" class="form-control lessonID" value="${lessons[index].id}" required>
            <td>
                <input type="date" class="form-control lessonDate" value="${lessons[index].date.substring(0, 10)}" required>
            </td>
            <td>
                <input type="time" class="form-control lessonStart" value="${lessons[index].start_time}" required>
            </td>
            <td>
                <input type="time" class="form-control lessonEnd" value="${lessons[index].end_time}" required>
            </td>
            <td>
                <input type="text" class="form-control lessonVenue" style="min-width:100px" value="${lessons[index].venue}" required>
            </td>
            <td>
                <div class="lessonList-controlButton d-flex gap-1">
                    <button class="btn btn-sm btn-outline-dark saveEditBtn">Save</button>
                </div>
            </td>`;

                const saveEditBtns = document.querySelectorAll('.saveEditBtn')

                saveEditBtns.forEach((saveEditBtn, index) => {
                    saveEditBtn.addEventListener('click', async () => {

                        const lessonIDs = document.querySelectorAll('.lessonID')
                        const lessonDates = document.querySelectorAll('.lessonDate')
                        const lessonStarts = document.querySelectorAll('.lessonStart')
                        const lessonEnds = document.querySelectorAll('.lessonEnd')
                        const lessonVenues = document.querySelectorAll('.lessonVenue')

                        const res = await fetch(`/adminLesson`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id: lessonIDs[index].value, date: lessonDates[index].value, start_time: lessonStarts[index].value, end_time: lessonEnds[index].value, venue: lessonVenues[index].value })
                        });
                        window.location.reload()

                    })
                })

            })
        })

        const deleteButtons = document.querySelectorAll('.deleteButton')

        deleteButtons.forEach((deleteButton, index) => {
            deleteButton.addEventListener('click', async () => {

                const lessonID = document.querySelectorAll('.lessonContent')

                const res = await fetch(`/adminLesson`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: lessonID[index].id })
                })
                window.location.reload()
            })
        })



    }

}



