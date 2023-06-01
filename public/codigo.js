function obterHoraAtual() {
  var dataAtual = new Date();
  var hora = dataAtual.getHours();
  var minutos = dataAtual.getMinutes();
  var segundos = dataAtual.getSeconds();

  return hora + ":" + minutos;
}
/////img user
const inputImg = document.querySelector("#imgUsuario");
const pictureImg = document.querySelector(".picture_img");
const textoImg = "Escolha uma foto";
pictureImg.innerHTML = textoImg;
var srcImgUser;
/////

var olaFulano = document.getElementsByClassName('logo')

inputImg.addEventListener("change", function (parametro) {
  const inputAlvo = parametro.target;
  const imagemArquivo = inputAlvo.files[0];

  if (imagemArquivo) {
    const leitor = new FileReader();

    leitor.addEventListener("load", function (parametro) {
      const leitorAlvo = parametro.target;

      const img = document.createElement("img");
      img.src = leitorAlvo.result;
      srcImgUser = leitorAlvo.result;
      img.classList.add("picture_img");

      pictureImg.innerHTML = "";
      pictureImg.appendChild(img);
    });

    leitor.readAsDataURL(imagemArquivo);
  } else {
    pictureImg.innerHTML = textoImg;
    
  }
});

const imagemUsuario = document.createElement("img");
/////

const socket = io();
(function () {
  const app = document.querySelector(".app");
  let uname;
  let colorUser;

  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;

      ////input color
      let colorInput = document.querySelector("#corInput").value;

      if (username.length == 0 || inputImg.files.length === 0) {
        alert('Preencha todos os campos.')
        return;
      }
      socket.emit("newuser", username);
      uname = username;
      colorUser = colorInput;

      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");

    });
  olaFulano.innerHTML = `Olá, ${uname}!`;

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }

      renderMessage("my", {
        username: uname,
        text: message,
        imgUser: srcImgUser,
        cor: colorUser
      });
      socket.emit("chat", {
        username: uname,
        text: message,
        imgUser: srcImgUser,
        cor: colorUser
      });

      app.querySelector(".chat-screen #message-input").value = "";
    });

  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });

  socket.on("chat", function (message) {
    renderMessage("other", message);
  });
  socket.on("uptade", function (uptade) {
    renderMessage("uptade", uptade);
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      var horaAtual = obterHoraAtual();
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
                <div class="message-container" style="border: 6px solid ${message.cor}; box-shadow:  10px 10px 18px 0px rgba(0,0,0,0.26);">
                   
                <div class="message-content">
                     <div class="user-info">
                         <div class="name">Você</div>
                         <div class="text">${horaAtual}</div>
                     </div>
                    <div class="text">${message.text}</div>
                 </div>
                 <div class="user-thumbnail">
                    <img src="${message.imgUser}" class="imgChat" alt="Imagem do Usuário">
                 </div>
              </div>
               

            `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      var horaAtual = obterHoraAtual();
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
      <div class="message-container"style="border: 6px solid ${message.cor}; box-shadow: -15px 10px 18px 0px rgba(0,0,0,0.26);">
        <div class="user-thumbnail">
            <img src="${message.imgUser}" class="imgChat" alt="Imagem do Usuário">
        </div>
      <div class="message-content">
          <div class="user-info">
              <div class="name">${message.username}</div>
              <div class="text">${horaAtual}</div>
          </div>
         <div class="text">${message.text}</div>
      </div>
      
     </div>
    
            `;
      messageContainer.appendChild(el);
    } else if (type == "uptade") {
      let el = document.createElement("div");
      el.setAttribute("class", "uptade");
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    //scroll
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
