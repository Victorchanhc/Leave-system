window.onload = async () => {
    await loadParent();
    await loadPlayer();
};

async function loadParent() {
    const res = await fetch('/parent') // Fetch from the correct url
    const details = await res.json()
    const parentContent = document.querySelector('#parent-info-container')

    // parentContent.innerHTML = ''

    for (let detail of details) {
        parentContent.innerHTML =
            `<div class="card" id="parent-info">
                <div class="card-body px-4 py-4 d-flex justify-content-between">
                    <div id="parent-info-content">
                        <div class="parent-content mb-5 d-flex" >
                             <div class="pt-1" style="width: 50px">
                                <i class="fa-solid fa-user fa-lg"></i>
                            </div>
                            <div>
                                <label for="parent-name" class="form-label">Parent Name</label>
                                <input name="name" type="text" class="form-control" id="parent-name" value="${detail.name}" disabled>
                                <div class="parent-name" id="parent-name">${detail.name}</div>
                            </div>
                        </div>
                        <div class="parent-content mb-5 d-flex" >
                            <div style="width: 50px">
                                <i class="fa-solid fa-envelope fa-lg"></i>
                            </div>
                            <div>
                                <label for="parent-email" class="form-label">Parent Email</label>
                                <div class="parent-email" id="parent-email">${detail.email}</div>
                            </div>
                        </div>
                        <div class="parent-content d-flex">
                            <div style="width: 50px">
                                <i class="fa-solid fa-phone fa-lg"></i>
                            </div>
                            <div>
                                <label for="parent-phone" class="form-label">Mobile Phone</label>
                                <div class="parent-phone" id="parent-phone">${detail.phone}</div>
                            </div>
                        </div>
                    </div>
                    <div class="editButton-content">
                        <div type="button">
                            <i class="fa-solid fa-pen-to-square fa-lg" id="parent-EditButton"></i>
                        </div>
                    </div>
                </div>
            </div>`
    }
    const parentEdit = document.querySelector('#parent-info')

    document.querySelector('#parent-EditButton')
        .addEventListener('click', async function () {

            const res = await fetch('/parent') // Fetch from the correct url
            const parents = await res.json()

            // parentEdit.innerHTML = '';
            for (const parent of parents) {
                parentEdit.innerHTML =
                    `<div class="card-body px-4 py-4">
                        <div id="parent-info-content">
                            <div class="parent-content mb-5 d-flex">
                                <div class="pt-1" style="width: 50px">
                                    <i class="fa-solid fa-user fa-lg"></i>
                                </div>
                                <div">
                                    <label for="parent-name" class="form-label">Parent Name</label>
                                    <input name="name" type="text" class="form-control" id="parent-name" value="${parent.name}" required>
                                </div>
                            </div>
                            <div class="parent-content mb-5 d-flex">
                                <div style="width: 50px">
                                    <i class="fa-solid fa-envelope fa-lg"></i>
                                </div>
                                <div>
                                    <label for="parent-email" class="form-label">Parent Email</label>
                                    <input name="email" type="text" class="form-control" id="parent-email" value="${parent.email}" required>
                                </div>
                            </div>
                            <div class="parent-content d-flex">
                                <div style="width: 50px">
                                    <i class="fa-solid fa-phone fa-lg"></i>
                                </div>
                                <div>
                                    <label for="parent-phone" class="form-label">Mobile Phone</label>
                                    <input name="phone" type="text" class="form-control" id="parent-phone" value="${parent.phone}" required>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-5 updateParent-btn">
                                    <button type="submit" class="btn btn-primary btn-sm">Confirm</button>
                            </div>
                        </div>
                    </div>`;
            }
            document.querySelector('.updateParent-btn')
                .addEventListener('click', async function () {

                    const updateName = document.querySelector('#parent-name')
                    const updateEmail = document.querySelector('#parent-email')
                    const updatePhone = document.querySelector('#parent-phone')

                    const res = await fetch(`/parent`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: updateName.value, email: updateEmail.value, phone: updatePhone.value })
                    });
                    loadParent()
                })
        })
}

async function loadPlayer() {
    const res = await fetch('/player') // Fetch from the correct url
    const players = await res.json()
    const playerContent = document.querySelector('#player-info-container')

    playerContent.innerHTML = ''

    // Can use disabled input field to mimick the detail and edit transition.
    for (let player of players) {
        playerContent.innerHTML +=
            `<div class="card mb-3 player-info">
                <div class="card-body px-4 py-4 d-flex justify-content-between" >
                    <div class="player-info-content">
                        <div class="player-content mb-5 d-flex">
                            <div class="pt-1" style="width: 50px">
                                <i class="fa-solid fa-user fa-lg me-4"></i>
                            </div>
                            <div>
                                <label for="player-fullName" class="form-label">Full name</label>
                                <div class="player-fullName" id="player-fullName">${player.english_name}</div>
                            </div>
                        </div>
                        <div class="player-content mb-5 d-flex">
                            <div style="width: 50px">
                                <i class="fa-solid fa-envelope fa-lg me-4 text-white"></i>
                            </div>
                            <div>
                                <label for="player-nickName" class="form-label">Nick name</label>
                                <div class="player-nickName" id="player-nickName">${player.nick_name}</div>
                            </div>
                        </div>
                        <div class="player-content mb-5 d-flex">
                            <div style="width: 50px">
                                <i class="fa-solid fa-phone fa-lg me-4 text-white"></i>
                            </div>
                            <div>
                                <label for="player-chineseName" class="form-label">Chinese name</label>
                                <div class="player-chineseName" id="player-chineseName">${player.chinese_name}</div>
                            </div>
                        </div>
                        <div class="player-content mb-5 d-flex">
                            <div style="width: 50px">
                                <i class="fa-solid fa-calendar-days fa-lg me-4"></i>
                            </div>
                            <div>
                                <label for="player-dob" class="form-label">Date of birth</label>
                                <div class="player-dob" id="player-dob">${player.date_of_birth.substring(0, 10)}</div>
                            </div>
                        </div>
                        <div class="player-content d-flex">
                            <div style="width: 50px">
                                <i class="fa-solid fa-venus-mars fa-lg me-4"></i>
                            </div>
                            <div>
                                <label for="player-gen" class="form-label">Gender</label>
                                <div class="player-gen" id="player-gen">${player.gender}</div>
                            </div>
                        </div>
                    </div>
                    <div class="player-EditButton">
                        <div type="button">
                            <i class="fa-solid fa-pen-to-square fa-lg pen" id="player-EditButton"></i>
                        </div>
                    </div>
                </div>
            </div>`
    }
    const editButton = document.querySelectorAll(".player-info .player-EditButton")

    editButton.forEach((player, index) => {
        player.addEventListener('click', async () => {
            
            const editPlayerContainer = document.querySelectorAll('.player-info')
            const res = await fetch('/player') // Fetch from the correct url
            const players = await res.json()
            const id = players[index].id

            // Removed console.log
            console.log([index])
            console.log(players[index].english_name)
            console.log(players[index])
            console.log(id)


            editPlayerContainer[index].innerHTML =
                `<div class="card-body px-4 py-4" >
                    <div class="player-info-content">
                        <div class="player-content mb-5 d-flex">
                            <div class="pt-1" style="width: 50px">
                                <i class="fa-solid fa-user fa-lg me-4"></i>
                            </div>
                            <div>
                                <label for="newFullName" class="form-label">Full name</label>
                                <input type="text" class="form-control newFullName ${id}" id="newFullName" value="${players[index].english_name}" required>
                            </div>
                        </div>
                        <div class="player-content mb-5 d-flex">
                            <div style="width: 50px">
                            </div>
                            <div>
                                <label for="newNickName" class="form-label">Nick name</label>
                                <input type="text"  class="form-control newNickName ${id}" id="newNickName" value="${players[index].nick_name}" required>
                            </div>
                        </div>
                        <div class="player-content mb-5 d-flex">
                            <div style="width: 50px">    
                            </div>
                            <div>
                                <label for="newChineseName" class="form-label">Chinese name</label>
                                <input type="text" class="form-control newChineseName ${id}" id="newChineseName" value="${players[index].chinese_name}">
                            </div>
                        </div>
                        <div class="player-content mb-5 d-flex">
                            <div style="width: 50px">
                                <i class="fa-solid fa-calendar-days fa-lg me-4"></i>
                            </div>
                            <div>
                                <label for="newDob" class="form-label">Date of birth</label>
                                <input type="date" class="form-control newDob ${id}" id="newDob" value="${players[index].date_of_birth.substring(0, 10)}" required>
                            </div>
                        </div>
                        <div class="player-content d-flex">
                            <div style="width: 50px">
                                <i class="fa-solid fa-venus-mars fa-lg me-4"></i>
                            </div>
                            <div>
                                <label for="newGen" class="form-label">Gender</label>
                                <div>
                                    <select class="form-select newGen ${id}" id="newGen" aria-label="Default select example" required>
                                        <option selected value="${players[index].gender}">${players[index].gender}</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end mt-5 updatePlayer-btn">
                            <button type="submit" class="btn btn-primary btn-sm">Confirm</button>
                        </div>
                    </div>
                </div>`;

                const submitButton = document.querySelectorAll('.updatePlayer-btn')
                console.log(submitButton)

                submitButton.forEach((button, index)=>{
                    button.addEventListener('click', async function () {

                        // Use form to wrap all of the inputs
                        const updateEnglishName = document.querySelectorAll('.newFullName')
                        const updateNickName = document.querySelectorAll('.newNickName')
                        const updateChineseName = document.querySelectorAll('.newChineseName')
                        const updateDob = document.querySelectorAll('.newDob')
                        const updateGender = document.querySelectorAll('.newGen')
                        // const id = updateEnglishName[index].classList[2]
                        console.log([index])
                        console.log(updateEnglishName)
                        console.log(updateEnglishName[index])
                        console.log(id)

                        const res = await fetch(`/player/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ english_name: updateEnglishName[index].value, nick_name: updateNickName[index].value, chinese_name: updateChineseName[index].value, date_of_birth: updateDob[index].value, gender: updateGender[index].value })
                        });
                        loadPlayer()   
                })

                    
            })
        })
    })
}

document.querySelector('#updatePassword-btn')
    .addEventListener('click', async function () {

        const currentPassword = document.querySelector('#current-password')
        const newPassword = document.querySelector('#new-password')
        const confirmPassword = document.querySelector('#confirm-password')

        // avoid abbreviation
        const res = await fetch(`/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPW: currentPassword.value, newPW: newPassword.value, confirmPW: confirmPassword.value })
        });
        window.location.reload()
        alert ("Change password successful");
    })