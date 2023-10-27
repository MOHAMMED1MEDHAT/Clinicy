var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    email: "mohamed.medhat2121@gmail.com",
    password: "123451",
});

var requestOptions = {
    method: "POST",
    headers: myHeaders,
    credentials: "include", // added this part
    body: raw,
    redirect: "follow",
};

fetch("http://localhost:3000/api/v1/user/login", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
const cookie = document.cookie;
console.log(cookie);
