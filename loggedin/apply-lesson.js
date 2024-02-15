
window.onload = async () => {
    getApplyLesson();
    getPlayer();

}

async function getApplyLesson() {
    // should be inside window.onload
    const searchParams = new URLSearchParams(location.search)
    const userID = searchParams.get('user_id')
    console.log(userID)
    // // Use the id to fetch data from
    const res = await fetch(`/applyLesson`)
    const lessons = await res.json()

    const lessonContent = document.querySelector('.lessonInformation-content')

    lessonContent.innerHTML = ''
    let nameGuard = ''

    for (let lesson of lessons) {

        if (lesson.name !== nameGuard) {

            lessonContent.innerHTML =
                `<h5 class="lessonName">${lesson.name}</h5>
                <div hidden class="lessonID">${lesson.id}</div>
                <div class="lessonDate">日期 : ${lesson.date.substring(5, 10)}</div>
                <div class="lessonTime">時間 : ${lesson.start_time.substring(0, 5)} - ${lesson.end_time.substring(0, 5)}</div>
                <div class="lessonVenue">地點 : ${lesson.venue}</div>`
            nameGuard = lesson.name
        } else {
            const lessonDateContent = document.querySelector('.lessonDate')
            const lessonIDContent = document.querySelector('.lessonID')

            lessonDateContent.innerHTML +=
                `,   ${lesson.date.substring(5, 10)}`;
            lessonIDContent.innerHTML +=
                `,${lesson.id}`

        }
    }
}

async function getPlayer() {
    const res = await fetch('/getPlayer')
    const playerList = await res.json()

    const participantsContainer = document.querySelector('.participantContainer')

    participantsContainer.innerHTML = ''

    for (let player of playerList) {

        participantsContainer.innerHTML +=
        `<div class="card mt-2">
            <div class="card-body d-flex justify-content-between">
                <div class="participantInformation-content">
                    <div class="form-check ">
                        <input class="form-check-input" type="radio" name="lessonTimeRadio1"
                            id="${player.english_name}" value="${player.id}">
                        <label class="form-check-label container-fluid" for="${player.english_name}">
                            ${player.english_name}
                        </label>
                    </div>
                </div>
            </div>
        </div>`
    }
}

document.querySelector('.joinButton')
    .addEventListener('click', async function () {

        const checkInputList = document.querySelectorAll('.form-check-input')
        const lessonsIDList = document.querySelector('.lessonID')
        const lessonsID = lessonsIDList.innerHTML.split(',')

        console.log(lessonsID)
        
        let playerID = '';

        for (let checkInput of checkInputList) {
            if (checkInput.checked === true) {
                playerID = checkInput.value
            }
        }
        const res = await fetch(`/joinLesson`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ player: playerID, lessons: lessonsID})

        });
    })