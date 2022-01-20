const socket = io('/chattings');
const getElementById = (id) => document.getElementById(id) || null;

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

const drawHelloStranger = (username) => helloStrangerElement.innerText = `Hello ${username} Stranger :)`;

const drawNewChat = (message, isMe = false) => {
    const wrapperChatBox = document.createElement('div');
    wrapperChatBox.className = 'clearfix';
    let chatBox; 
    if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
    wrapperChatBox.innerHTML = chatBox;
    chattingBoxElement.append(wrapperChatBox);
}


const handleSubmit = (event) => {
    event.preventDefault();
    const inputValue = event.target.elements[0].value;
    if(inputValue !== '') {
        socket.emit('submit_chat', inputValue);
        drawNewChat(`me: ${inputValue}`, true);
        event.target.elements[0].value = '';
    }
};

function helloUser() {
    const username = prompt('What is your name?');
    socket.emit('new_user', username, (data) => {
        drawHelloStranger(data);
    });
  }

socket.on('uesr_connected', (username) => {
    drawNewChat(`${username} connected`);
})

socket.on('new_chat', (data) => {
    const { chat, username } = data;
    drawNewChat(`${username}: ${chat}`);
})

socket.on('disconnected_user', (username) => drawNewChat(`${username}: bye...`));


function init() {
    helloUser();
    formElement.addEventListener('submit', handleSubmit);
}

init();