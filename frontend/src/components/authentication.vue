<template>
  <div id="authentication">
    <form action="">
      <label class="labels" for="email">email</label>
      <input class="authInput" id="email" type="text" /><br />
      <label class="labels" for="password">password</label>
      <input class="authInput" id="password" type="password" /><br />
      <button v-on:click="login" class="signInButton">Me connecter</button
      ><br />
      <a class="forgottenId" href="">Indentifiants oubliés?</a><br />
      <span class="line"></span>
      <router-link to="/createAccount">
        <button class="signUpButton">Créer un compte</button>
      </router-link>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Authentication",
  data() {
    return {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
  },
  methods: {
    login() {
      let token = "";
      axios
        .post(
          "http://localhost:3000/api/auth/login",
          {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data.token);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userPseudonym", response.data.userPseudonym);
          localStorage.setItem("id", response.data.userId);
          window.location.href = "http://localhost:8080/?#/";
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style>
body {
  background: #f0f2f5;
}

#authentication {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  margin: -28vh 0 0 72vh;
  width: 42vh;
  height: 44vh;
  border: 1px solid black;
  border-radius: 15px;
  box-shadow: 0.5px 0.5px 3px #fd2d01, -0.5px -0.5px 3px #fd2d01;
  align-content: center;
}

label {
  margin-top: 12.5vh;
}

.authInput {
  background: #b1c8f0;
  margin-bottom: 2vh;
  width: 250px;
  height: 50px;
  border: none;
  border-radius: 10px;
}

.signInButton {
  cursor: pointer;
  width: 250px;
  height: 45px;
  border: none;
  border-radius: 10px;
  margin: 0vh 0 1vh 0;
  background: #288d14;
  color: white;
  font-weight: bold;
  font-size: 20px;
}

.signUpButton {
  cursor: pointer;
  width: 150px;
  height: 35px;
  border: none;
  border-radius: 10px;
  margin-top: 2.5vh;
  background: #206413;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.labels {
  display: none;
}

.forgottenId {
  text-decoration: none;
  font-size: 14px;
}

.line {
  display: block;
  border-bottom: 2px solid #dadde1;
  width: 185px;
  margin: auto;
  margin-top: 1.5vh;
}

@media only screen and (max-width: 600px) {
  #authentication {
    margin: auto;
    margin-top: 20vh;
    padding: 2vh 4vh 2vh 2vh;
  }
}
</style>