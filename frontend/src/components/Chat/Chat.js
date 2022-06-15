import './Chat.css'
import { Avatar } from '@material-ui/core'
import Picker from 'emoji-picker-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {BsEmojiSmileFill} from 'react-icons/bs'
import { useCookies } from "react-cookie";

function Chat() {
  const [data, setData] = useState([]);
  const [cookies, removeCookie] = useCookies([]);
  const [chatData, setChatData] = useState([]);
  const [typedText, setTypedText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  var userInfo;
  var tempdata = [];
  var mydata = {
    myid: cookies.userid

  }

  useEffect(() => {
    axios.get('http://localhost:5000/api/getmymessages/', { params: mydata }).then((response) => {
      if (response.data != undefined) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].members[0] !== mydata.myid) {
            userInfo = {
              name: response.data[i].members[0],
              message: response.data[i].messages,
              image: response.data[i].image,
              profileName: response.data[i].profilename
            }
          }
          else {
            userInfo = {
              name: response.data[i].members[1],
              message: response.data[i].messages,
              image: response.data[i].image,
              profileName: response.data[i].profilename
            }
          }
          if(i==0){
            getChatDetails(userInfo)
          }
          var found = tempdata.some(el => el.name === userInfo.name);
          if (!found)
            tempdata.push(userInfo);
        }
      }
      setData(tempdata);
    });
  }, [cookies, removeCookie]);


  const handleTypedText = async (e) => {
    e.preventDefault();
    try {
      setTypedText(e.target.value)
    } catch (err) {
      console.log(err);
    }
  };
  const getChatDetails = (data) => {
    setChatData(data);
  }

 const handleEmojiPickerHideShow = () => {
  setShowEmojiPicker(!showEmojiPicker);
 };

 const handleEmojiClick = (event,emoji) =>{
    let Emessage = typedText;
    Emessage += emoji.emoji;
    setTypedText(Emessage);
 };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    var sentMsgData = {
      myid: cookies.userid,
      profileid: chatData.name,
      text: typedText
    }
    try {
      await axios.post('http://localhost:5000/api/sendmessage', { sentMsgData }).then((response) => {
        setTypedText("");
      });
      
    await axios.get('http://localhost:5000/api/getmymessages/', { params: mydata }).then((response) => {
      if (response.data != undefined) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].members[0] !== mydata.myid) {
            userInfo = {
              name: response.data[i].members[0],
              message: response.data[i].messages,
              image: response.data[i].image,
              profileName: response.data[i].profilename
            }
          }
          else {
            userInfo = {
              name: response.data[i].members[1],
              message: response.data[i].messages,
              image: response.data[i].image,
              profileName: response.data[i].profilename
            }
          }
          if(userInfo.name===chatData.name){
            getChatDetails(userInfo)
          }
          var found = tempdata.some(el => el.name === userInfo.name);
          if (!found)
            tempdata.push(userInfo);
        }
      }
      setData(tempdata);
    });
    }
    catch (err) {
      console.log(err);
    }
  };



  return (
    <div className='chatContainer'>
      <div className='chatcontainer_body'>
        <div className='chat_list'>
          {data.map((object, i) => <div key={i} onClick={() => getChatDetails(object)} className='sidebarchat_container'>
            <div className='sidebarchat_innercontainer'>
              <div className='sidebarchat_info'>
                <Avatar src={`data:image/jpeg;base64,${object.image}`}/>
                <h3 className='sidebarchat_name'>{object.profileName}</h3>
              </div>
            </div>
          </div>)}

        </div>
        <div className='chat_details'>
          <div className='chatdetails_header'>
            <Avatar src={`data:image/jpeg;base64,${chatData.image}`}/>

            <div className='chatdetails_headerInfo'>
              <h3>{chatData.profileName}</h3>
              <div className='chatheader_timestamp'>
                <p>Last seen at: </p>
                <span>{new Date().toUTCString()}</span>
              </div>
            </div>
          </div>
          <div className='chatdetails_body'>
            {chatData.message?.map((object, i) =>
              object.senderid === cookies.userid ?
                <p className='chatmessage chat_received'>{object.text}
                </p> :
                <p className='chatmessage'>{object.text}
                </p>
            )}
          </div>


          <div className='chatdetails_footer'>
            <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>}
            <form>
              <input value={typedText}
                placeholder="Type a message and hit enter to send messages"
                onChange={handleTypedText}
                type="text" />
              <button className='sendbutton' onClick={handleSendMessage}
                type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Chat;