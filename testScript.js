var myHeaders = new Headers();
myHeaders.append("x-auth-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ3MDE4MzgzMzUzZDJhYzNmMzRmNjEiLCJ1c2VyVHlwZSI6IkRvY3RvciIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2ODIzNzg3MjksImV4cCI6MTcxMzkxNDcyOX0.HTLoENAawicTRbEuSOK985ckJvgpTwv0_AqUXT-gJSQ");
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ3MDE4MzgzMzUzZDJhYzNmMzRmNjEiLCJ1c2VyVHlwZSI6IkRvY3RvciIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2ODIzNzg3MjksImV4cCI6MTcxMzkxNDcyOX0.HTLoENAawicTRbEuSOK985ckJvgpTwv0_AqUXT-gJSQ");
myHeaders.append("Cookie", "x-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ3MWIzN2JjNjUxNGVjMmFkMDI2MWUiLCJ1c2VyVHlwZSI6IkRvY3RvciIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2ODI0MjUzODMsImV4cCI6MTcxMzk2MTM4M30.l2kpskqA1lf6IisN41qSF4_lp5j28RmCwAsONZjRbIo");

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

fetch("http://localhost:4000/api/profile", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));