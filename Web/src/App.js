import './App.scss';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import moment from 'moment/moment';
import io from "socket.io-client"
import { useEffect , useState , useRef } from 'react';

function App() {
  const [state, setState] = useState({ message: "", room: "" })
  const [name, setName] = useState("")
  const [user, setUser] = useState("")
  const [chat, setChat] = useState([])
  const [start, setStart] = useState(true);
  const socket = io.connect("http://localhost:3001")
  const [update , setUpdate] = useState(false)
  
  // on text change saving values
  const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
  }

  // message send
  const sendMessage = () => {
    const { message , room } = state;
    socket.emit("send-message", { message , name , room });
    socket.emit("join_room", room)
    setState({ ...state, room, message: "" })
  }


  // logout 
  const logout = () => {
  setStart(true);  
  socket.on("disconnect")
  }

   
  // user join
  const join = () => {
    const { room } = state;
    setStart(false)
    socket.emit("join_room", room)
    socket.emit('new-user', { name })
  }


  // for getting values 
  
  useEffect(() => {
    socket.on("received-message", ({ name, message }) => {
    console.log("receiving ---->", { name, message });
    setChat([...chat, { name, message }])	
      
    })

  }, [socket])




  useEffect(() =>
  {
      socket.emit('new-user', { name })

      socket.on("user-connected", ( data ) =>
      {
          setUser(name)
      })
  }, [name])


   
  return (
    <div className="chatApp"> 
      <div className="chatApp_heading">
        <h1>OzamApp</h1>
       { start === true ? "" : <Button size="medium" onClick={() => logout()} className='logout' variant="contained">Logout</Button> }  
      </div>
      <div className="chatApp_messagesBox">
        {start === true ? <>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} className="mx-auto mt-5">
          <h4 className='text-center'>Join The Chat</h4>
          <TextField name="name" style={{margin: "40px 0px"}} value={name} onChange={(e) => setName(e.target.value)} size="small" className='inputField' label="Enter Your Name" variant="outlined" />
          <TextField name="room" value={state.room} onChange={(e) => onTextChange(e)} size="small" className='inputField' label="Enter a Room" variant="outlined" />  
          <Button size="medium" style={{margin: "40px 0px"}} onClick={() => join()} variant="contained">Join</Button>
          </div> </> : <>
            {/* <p style={{ margin: "5px 20px" }}>{name} Join The Chat</p>  */}
            <p style={{ margin: "5px 20px" }}>{user} Connected</p>      
            
          {
          chat?.map((res) => {
          return (
        <div className="chatApp_contactInfo">
        <h2>{res?.name} :</h2>
        <p>{ res?.message}</p>
        <span>{moment().format('h:mm a')}</span>
        </div>
          )
        })}
        </>}
    
     
      </div>
      <div className="chatApp_messageSend">
        {start === true ? "" : <>
      <TextField name="message" value={state.message} onChange={(e) => onTextChange(e)} size="small" className='inputField' label="Send a Message" variant="outlined"/>
      <Button size="medium" onClick={() => sendMessage()} variant="contained">Send</Button>
        </>}
      </div>
    </div>
  );
}

export default App;
