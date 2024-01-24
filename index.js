// const editlesson = document.querySelector('.editInformation-content')

// document.querySelector('.editButton')
//     .addEventListener('click', function () {
//         editlesson.innerHTML += `<div class="dropdown">
//         <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//           Dropdown button
//         </button>
//         <ul class="dropdown-menu">
//           <li><a class="dropdown-item" href="#">Action</a></li>
//           <li><a class="dropdown-item" href="#">Another action</a></li>
//           <li><a class="dropdown-item" href="#">Something else here</a></li>
//         </ul>
//       </div>`
// //     });
function playerautoputin() {
    const plfnInput = document.querySelector('#player-fullName')
    const plnnInput = document.querySelector('#player-nickName')
    const plcnInput = document.querySelector('#player-chineseName')
    const pldobInput = document.querySelector('#player-dob')
    const plgeInput = document.querySelector('#player-gen')

    plfnInput.value = `aeroplane`
    plnnInput.value = `aer`
    plcnInput.value = `陳大文`
    pldobInput.value = `18/04/2016`
    plgeInput.value = `option`
}

function autoputin() {
    const pnInput = document.querySelector('#parent-name')
    const peInput = document.querySelector('#parent-email')
    const ppInput = document.querySelector('#parent-phone')



    pnInput.value = "aeroplanec"
    peInput.value = "victorchan@gmail.com"
    ppInput.value = `64099717`


}
const parentEdit = document.querySelector('#parent-info')
const playerEdit = document.querySelector('#player-info')

document.querySelector('#parent-EditButton')
    .addEventListener('click', function () {

        // parentEdit.innerHTML = '';
        parentEdit.innerHTML =
            `<form class="parent-info-content">
            <div class="parent-content mb-5 d-flex">
                <div class="pt-1" style="width: 50px">
                    <i class="fa-solid fa-user fa-lg"></i>
                </div>
                <div">
                    <label for="parent-name" class="form-label">Parent Name</label>
                    <div>
                        <input type="text" class="form-control" id="parent-name"required>
                    </div>
                </div>
            </div>
            <div class="parent-content mb-5 d-flex">
                <div style="width: 50px">
                    <i class="fa-solid fa-envelope fa-lg"></i>
                </div>
                <div>
                    <label for="parent-email" class="form-label">Parent Email</label>
                    <div>
                        <input type="text" class="form-control" id="parent-email"required>
                    </div>
                </div>
            </div>
            <div class="parent-content d-flex">
                <div style="width: 50px">
                    <i class="fa-solid fa-phone fa-lg"></i>
                </div>
                <div>
                    <label for="parent-phone" class="form-label">Mobile Phone</label>
                    <div>
                        <input type="text" class="form-control" id="parent-phone" required>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end mt-5">
                <button type="submit" class="btn btn-primary btn-sm">Confirm</button>
            </div>
        </form>`;
        autoputin()

    })

document.querySelector('#player-EditButton')
    .addEventListener('click', function () {

        // parentEdit.innerHTML = '';
        playerEdit.innerHTML =
            `<form class="player-info-content">
                <div class="player-content mb-5 d-flex">
                    <div class="pt-1" style="width: 50px">
                        <i class="fa-solid fa-user fa-lg me-4"></i>
                    </div>
                    <div>
                        <label for="player-fullName" class="form-label">Full name</label>
                        <div><input type="text" class="form-control" id="player-fullName" required></div>
                    </div>
                </div>
                <div class="player-content mb-5 d-flex">
                    <div style="width: 50px">
                    </div>
                    <div>
                        <label for="player-nickName" class="form-label">Nick name</label>
                        <div><input type="text"  class="form-control" id="player-nickName" required></div>
                    </div>
                </div>
                <div class="player-content mb-5 d-flex">
                    <div style="width: 50px">    
                    </div>
                    <div>
                        <label for="player-chineseName" class="form-label">Chinese name</label>
                        <div><input type="text" class="form-control" id="player-chineseName"></div>
                    </div>
                </div>
                <div class="player-content mb-5 d-flex">
                    <div style="width: 50px">
                        <i class="fa-solid fa-calendar-days fa-lg me-4"></i>
                    </div>
                    <div>
                        <label for="player-dob" class="form-label">Date of birth</label>
                        <div><input type="date" class="form-control" id="player-dob" required></div>
                    </div>
                </div>
                <div class="player-content d-flex">
                    <div style="width: 50px">
                        <i class="fa-solid fa-venus-mars fa-lg me-4"></i>
                    </div>
                    <div>
                        <label for="player-gen" class="form-label">Gender</label>
                        <div>
                            <select class="form-select" aria-label="Default select example" id="player-gen required>
                                <option selected>Select...</option>
                                <option value="Boy">Male</option>
                                <option value="Girl">Female</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end mt-5">
                <button type="submit" class="btn btn-primary btn-sm">Confirm</button>
            </div>
    </form>`;
        playerautoputin()

    })
