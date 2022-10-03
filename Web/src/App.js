import './App.scss';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import moment from 'moment/moment';
import io from "socket.io-client"
import { useEffect , useState , useRef } from 'react';

function App() {
  const [ state, setState ] = useState({ message: "", name: "", room : "" })
  const [chat, setChat] = useState([])
  const socket = io.connect("http://localhost:3001")
 
  const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
  }


  const sendMessage = () => {
    const { message, name, room } = state;
    socket.emit("send-message", { message , name , room });
    socket.emit("join_room", room)
    setState({ name , room , message : "" })
  }

  
  useEffect(() => {
    socket.on("received-message", ({name , room , message}) => {
      setChat([...chat, { name, message , room } ])	
    })
  }, [chat , socket])

  console.log("chat list --->", chat)


  return (
    <div className="chatApp"> 
      <div className="chatApp_heading">
        <h1>OzamApp</h1>
        <Button size="medium" className='logout' variant="contained">Logout</Button>
      </div>
      <div className="chatApp_messagesBox">
        {chat?.map((res) => {
          return (
      <div className="chatApp_contactInfo">
        <h2>{res?.name} :</h2>
        <p>{ res?.message}</p>
        <span>{moment().format('h:mm a')}</span>
            </div>
          )
        })}
     
      </div>
      <div className="chatApp_messageSend">
      <TextField name="room" value={state.room} onChange={(e) => onTextChange(e)} size="small" className='inputField' label="Enter a Room" variant="outlined" />
      <TextField name="name" value={state.name} onChange={(e) => onTextChange(e)} size="small" className='inputField' label="Enter Your Name" variant="outlined"/>
      <TextField name="message" value={state.message} onChange={(e) => onTextChange(e)} size="small" className='inputField' label="Send a Message" variant="outlined"/>
      <Button size="medium" onClick={sendMessage} variant="contained">Send</Button>
      </div>
    </div>
  );
}

export default App;
