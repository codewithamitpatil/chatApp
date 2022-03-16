import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer"


export const IoPractise = () => {

  const [myId,setMyId] = useState();
  const [connection,setConnection] = useState();
  const [msg,setMsg] = useState();

  const [callerId,setCallerId] = useState();
  const [msg1,setMsg1] = useState();

  const [messages,setMessages] = useState();

  const [recivingCall,setRecivingCall] = useState(false);
  const [callAccepted,setCallAccepted] = useState(false);
  const [callEnd,setCallEnd] = useState(false);
  const [caller,setCaller] = useState();
  const [idToCall,setIdToCall] = useState();
  const [startCalling,setStartCalling] = useState(true);
  	const [ callerSignal, setCallerSignal ] = useState()
  const [startCamera,setStartCamera]= useState(false);
  const [stream,setStream] = useState();
  const [stopCamera,setStopCamera] = useState();
  

  const myVideoRef = useRef();
  const userVideoRef = useRef();
	const connectionRef= useRef()

  const socket = useRef();
 

  useEffect(()=>{

   


  },[startCamera]);




  useEffect(()=>{

  socket.current = io.connect('https://amitvaishanvipatil.herokuapp.com');


  socket.current.on('myId',data=>{
       setMyId(data);
  });

  socket.current.on('callEnd',()=>{
  setCallAccepted(false);
        setCallEnd(true);
        setCaller('');
        console.log('call ended')
  });

  socket.current.on('reciveCall',data=>{
  setCallEnd(false);
  setRecivingCall(true);
  setCaller(data.from);
  setCallerSignal(data.signalData);
  console.log(data);
  });


  },[]);


const StartMedia = ()=>{
   navigator
   .mediaDevices
   .getUserMedia({video:true,audio:true})
   .then((stream)=>{
     setStream(stream);
    
      myVideoRef.current.srcObject = stream;


    });
}


const callUser = () => {
  StartMedia(); 
  setCallEnd(false);

	const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})

		peer.on("signal", (data) => {

      socket.current.emit('callUser',{
        to:idToCall,
        mes:"Amit is calling",
        from:myId,
        userToCall:idToCall,
          signalData: data,
        name:'amit'
      });

		})

  	peer.on("stream", (stream) => {
			userVideoRef.current.srcObject = stream
		})


    socket.current.on('callAccept',(data)=>{
       setCallAccepted(true);
       setCaller(data.from);
       console.log(data);
       peer.signal(data.signalData)
    });

    connectionRef.current = peer;
    
}

const callAccept = () => {
     StartMedia(); 
     setRecivingCall(false);
     setCallAccepted(true);
   

	const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		});

		peer.on("signal", (data) => {
		  socket.current.emit('callAccept',{
        from:myId,to:caller,signalData: data});
   	})
		peer.on("stream", (stream) => {
			userVideoRef.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer;


}

const callEndHandle = ()=> {
   
    socket.current.emit('callEnd',{from:myId,to:caller});
    
    setCallAccepted(false);
    setCallEnd(true);
    setCaller('');
}

  return (
    <div>IoPractise

<h1>my id ::  {myId}</h1>





     <div className='row p-0 m-0'>
     
     <div className='col-md-12'>
     
<input type="text"
 value={idToCall}
 placeholder='...id' 
 onChange={(e)=>{
   setIdToCall(e.target.value);
 }} 
 className="form-control"/>

<button className='btn btn-primary btn-lg'
onClick={callUser}
>
send messgae
</button>


     </div>
     
<div className='col-md-6'>
{startCalling &&<div className='container'> <div className='box shadow p-3 mt-4'>

<video playsInline muted ref={myVideoRef} autoPlay style={{ width: "300px",height:"300px"}} />

</div>

<button 
 className='btn btn-secondary m-1 btn-lg'
 onClick={()=>{
  let temp = stream.getVideoTracks()[0];
 temp.enabled = false;
// getTracks()[0].enabled = false
// MediaRecorder.pause()
}}>Stop Camera</button>
<button 
 className='btn btn-secondary m-1 btn-lg'
 onClick={()=>{
  let temp = stream.getVideoTracks()[0];
  temp.enabled = true;

}}>Start Camera</button>

<button 
 className='btn btn-primary btn-lg m-1 mt-3'
 onClick={()=>{
  let temp = stream.getAudioTracks()[0];
  temp.enabled = false;

}}>Mute Audio</button>
<button 
 className='btn btn-primary btn-lg m-1 mt-3'
 onClick={()=>{
  let temp = stream.getAudioTracks()[0];
  temp.enabled = true;

}}>Unmute Audio</button>
</div>

}



</div>
<br/><br/><br/>
<div className='col-md-6'>
{recivingCall && <div className='box shadow text-center p-3'>     
<h1>{caller} is calling</h1>
<button className='btn btn-primary btn-lg'
onClick={callAccept}
>
Accept Call
</button>

</div>}

{callAccepted && <div className='box  text-center p-3'>     


<div className='box shadow p-3 mt-4'>

<video playsInline muted ref={userVideoRef } autoPlay style={{ width: "300px",height:"300px"}} />

</div>



<button className='btn btn-secondary btn-lg'
onClick={callEndHandle}
>
End Call
</button>

</div>}

{callEnd && <div className='box shadow text-center p-3'>     
<h1>...call ended</h1>


</div>}



</div>

     </div>


    </div>
  )
}


export default IoPractise;
