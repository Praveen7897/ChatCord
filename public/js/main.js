const chatForm = document.getElementById('chat-form')
const chatmessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const leavebtn = document.getElementById('leave-btn')
//get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

const socket = io('ws://localhost:3000/')

socket.emit('joinRoom', { username, room })

//get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room)
  outputUsers(users)
})

//Message from server
socket.on('message', (message) => {
  console.log(message)

  outputMessage(message)
  //Scroll to bottom
  chatmessage.scrollTop = chatmessage.scrollHeight
})

//Message event
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  msg = e.target.elements.msg.value
  //emit message to server
  socket.emit('chatmessage', msg)

  //clear message
  e.target.msg.value = ''
  e.target.msg.focus() = ''
})

//output message to DOM
function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`
  document.querySelector('.chat-messages').append(div)
}

//Add Room name to Dom
function outputRoomName(room) {
  roomName.innerText = room
}

//Add users to Dom
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join('')}`
}

//redirect to login
