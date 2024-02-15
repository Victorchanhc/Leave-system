
window.onload = async function loadLesson() {

    const res = await fetch('/getLesson') // Fetch from the correct url
    const details = await res.json()
    const lessonContent = document.querySelector('.lessonList')

    lessonContent.innerHTML = '';
    let nameGuard = '';
    let timeGuard = '';
    
    for (let detail of details) {
        if (detail.name !== nameGuard) {
            lessonContent.innerHTML +=
            `<div class="col-md-3 mt-3">
                <div class="card card-body">
                    <div class="lessonInformation-content">
                        <h5 class="lessonName">${detail.name}</h5>
                        <div class="lessonVenue mb-1">${detail.venue}</div>
                        <form class="click-form" id="${detail.name}">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="lessonTimeRadio1"
                                    id="${detail.start_time.substring(0, 5)}" value="${detail.start_time}">
                                <label class="form-check-label" for="${detail.start_time.substring(0, 5)}">
                                    ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}
                                </label>
                            </div>
                        </form>
                        <div class="d-flex justify-content-end mt-3">
                            <a href="/apply-lesson.html" class="btn btn-primary btn-sm pointedSubmit" role="button">Join</a>
                        </div>
                    </div>
                </div>
            </div>`;
            nameGuard = detail.name;
            timeGuard = detail.start_time;

        } else if (detail.start_time !== timeGuard){

            const lessonTimeList = document.querySelectorAll('.click-form')
            console.log(lessonTimeList)

            lessonTimeList.forEach((lessonTime)=>{
                if (lessonTime.id === detail.name) {
                    lessonTime.innerHTML += 
                    `<div class="form-check">
                        <input class="form-check-input" type="checkbox" name="lessonTimeRadio1"
                            id="${detail.start_time.substring(0, 5)}" value="${detail.start_time}">
                        <label class="form-check-label" for="${detail.start_time.substring(0, 5)}">
                            ${detail.start_time.substring(0, 5)} - ${detail.end_time.substring(0, 5)}
                        </label>
                    </div>`
                    timeGuard = detail.start_time
                }
            })
          
        }
    }
    const pointed = document.querySelectorAll('.pointedSubmit')

    pointed.forEach((lesson,index)=>{
        lesson.addEventListener('click', async () => {
            const pointedTimeList = document.querySelectorAll('.form-check-input')
            const pointedName = document.querySelectorAll('.lessonName')
            console.log(pointedName)
            
            let Target = '';

            for (const pointedTime of pointedTimeList) {
                if (pointedTime.checked === true) {
                    Target = pointedTime.value
                }
                console.log(pointedTime)
                console.log(pointedTime.checked)    
                console.log(Target)
            }
            const res = await fetch(`/selectLesson`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: pointedName[index].innerText, start_time: Target})

            });
        })
    })
}


// function change() {
//     var x = document.getElementById("myCheck").value = "newCheckboxValue";
//     alert ("The value was changed to: " + x);
//   }
