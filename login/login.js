
const logcontainer = document.querySelector('#loginContainer')

document.querySelector('#registerButton')
    .addEventListener('click', function () {
        logcontainer.innerHTML =
            `<form action="/parent" method="post" class="px-3">
                <div class="mb-3">
                    <label for="inputUsername" class="form-label">Username (Parent/Guest)</label>
                    <input name="name" type="text" class="form-control" placeholder="Enter your username"
                        id="inputUsername">
                </div>
                <div class="mb-3">
                    <label for="inputPhone" class="form-label">Mobile Number (Parent/Guest)</label>
                    <input name="phone" type="text" class="form-control" placeholder="Enter your mobile number"
                        id="inputPhone">
                </div>
                <div class="mb-3">
                    <label for="inputEmail" class="form-label">Email (Parent/Guest)</label>
                    <input name="email" type="email" class="form-control" placeholder="Enter your Email Address" 
                        id="inputEmail">
                </div>
                <div class="mb-3">
                    <label for="inputPassword" class="form-label">Password (Parent/Guest)</label>
                    <input name="password" type="password" class="form-control" placeholder="Enter your password"
                        id="inputPassword">
                </div>
                <div class="mb-3">
                    <label for="inputConfirmPassword" class="form-label">Confirm Password (Parent/Guest)</label>
                    <input name="confirmPassword" type="password" class="form-control" placeholder="Enter your password"
                        id="inputConfirmPassword">
                </div>
                <div class="row gap-1 px-2 mb-4">
                    <button type="submit" class="col btn btn-dark">Register</button>
                    <!-- <a href="#">Forget password?</a> -->
                </div>
            </form>
            <div class="px-3 gap-3 mb-4">
                You have an account ? Please Login !
                <a href="index.html" type="button" class="btn btn-outline-light btn-sm">Login <i
                        class="bi bi-arrow-right"></i></a>
            </div>`
    })



    // alert("Invalid username or password");
    //     document.querySelector("#form").reset();