import io from "socket.io-client"

const socket = io("https://mcq-ace.herokuapp.com/")

export default socket;