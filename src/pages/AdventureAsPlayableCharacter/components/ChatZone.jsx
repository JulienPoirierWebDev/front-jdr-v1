import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"
import Select from "react-select";
import MessageSlot from "./MessageSlot";

import "../../../styles/ChatZone.css"

const ChatZone = ({jwt, adventureId, adventureObject, messageObject, playerPlayableCharacter, characterId, changeUpdateItem, buttonImg1}) => {

    const [messageType, setMessageType] = useState("groupe");
    const [messageContent, setMessageContent] = useState("");
    const [target, setTarget] = useState("");
    const [groupOfMessages, setGroupOfMessages] = useState([]);


    function fetchInterlocutorTarget(){
        let result = [];
        if(adventureObject && adventureObject.npcOnAdventures){
            adventureObject.npcOnAdventures.map(npc => result.push({value:"npc " + npc.id,label:npc.npc.firstName + " " + npc.npc.lastName}))
        }
        if(adventureObject && adventureObject.playerCharacters) {
            adventureObject.playerCharacters.map((playerCharacter) => {
                if(playerCharacter.id !== characterId){
                result.push({value: "player " + playerCharacter.id, label: playerCharacter.name})
            }})
        }
        return result
    }

    function handleTargetSelectChange(event) {
        setTarget(event.value);
        console.log(event.value)
    }

    function handleRadioChange(event) {
        if (event.target.value === "toSomeone") {
            setMessageType(event.target.value);
        } else if (event.target.value === "groupe") {
            setMessageType(event.target.value);
            setTarget("");
        } else if (event.target.value === "privateToGM") {
            setMessageType(event.target.value);
            setTarget("");

        }
    }

    function handleChange(event) {
        if (event.target.name === "messageContent") {
            setMessageContent(functions.escapeHtmlV2(event.target.value));
        }
    }

    const sendMessage = async (event) => {
        event.preventDefault();

        let targetArray = target.split(" ");
        let targetNpc = targetArray[0] === "npc" ? "api/npc_on_adventures/" + parseInt(targetArray[1]) : null;
        let targetPlayer = targetArray[0] === "player" ? "api/player_characters/" + parseInt(targetArray[1]) : null;
        let gameMasterOnlyBool = messageType === "privateToGM";


        let dateTimeNow = Date.now();

        let user = playerPlayableCharacter.user.id
        let dataMessage = {
            adventure:"api/adventures/" + adventureId,
            user:"api/users/"+ user,
            content:messageContent,
            isPlayerMessage:true,
            dateTimeCreate: new Date(dateTimeNow),
            gameMasterOnly: gameMasterOnlyBool,
            targetPlayerCharacter:targetPlayer,
            playerCharacter:"api/player_characters/" + characterId,
            nameOfSpeaker:playerPlayableCharacter.name,
            isSystemMessage:false,
            npcReceiver:targetNpc,
            npcWhoSpeak:null,
            playerCharacterUniqueId: characterId
        }

        console.log(dataMessage)


        await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
            console.log(response)
            changeUpdateItem("messageUpdate");

            setMessageContent("");

        }).catch((error) => {
            console.log(error)
        })


    }

    function fetchMessage() {
        let data = []
        if(messageObject.messageInChats){
            messageObject.messageInChats.map((message) => {
                if(message.gameMasterOnly === true && message.playerCharacterUniqueId === playerPlayableCharacter.id)
                {
                    return data.push(message);
                } else if(message.gameMasterOnly === true && message.playerCharacterUniqueId === playerPlayableCharacter.id)
                {
                    return data.push(message);
                } else if(message.gameMasterOnly === false)
                {
                    return data.push(message);
                }

            })
        }
        setGroupOfMessages(data)
    }

    useEffect(() => {
        if(messageObject) {
            fetchMessage()
        }
    }, [messageObject])

    return (
        <div className={"chatzone-container"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/page.png"})`,     backgroundSize: `cover`}}>
            <div className={"chatzone-messages-container"}>
                {groupOfMessages ? groupOfMessages.map(message =>
                <div key={message.id}><MessageSlot message={message} privateItem={message.gameMasterOnly}/></div>) : ""}
            </div>
            <form className={"chatzone-writing-container"} action="">
            <div className={"chatzone-wrinting-target"} onChange={handleRadioChange}>
                <div className={"chatzone-writing-label-group"}>
                    <p><label className={messageType === "groupe" ? "specialActions-headers-active" : "chatzone-writing-label"} htmlFor="groupe"><input className={"chatzone-writing-input"} id={"groupe"} type="radio" value={"groupe"} name={"messageType"}/>S'adresser au groupe</label></p>
                    <p><label className={messageType === "toSomeone" ? "specialActions-headers-active" : "chatzone-writing-label"} htmlFor="toSomeone"><input className={"chatzone-writing-input"} id={"toSomeone"} type="radio" value={"toSomeone"} name={"messageType"}/>S'adresser a une personne en particulier</label></p>
                    <p><label className={messageType === "privateToGM" ? "specialActions-headers-active" : "chatzone-writing-label"} htmlFor="privateToGM"><input className={"chatzone-writing-input"} id={"privateToGM"} type="radio" value={"privateToGM"} name={"messageType"}/>Message privé au Maitre du Jeu</label></p>
                </div>
                <div className={"chatzone-writing-select"}>
                    {messageType === "toSomeone" ? <Select placeholder={"Choisissez votre interlocuteur"} options={fetchInterlocutorTarget()} onChange={handleTargetSelectChange} name={"targetSelected"} className="target-select"/> : ""}
                </div>
            </div>
            <div className={"chatzone-writing-textarea-div"}>
                <label className={"chatzone-writing-textarea-label"} htmlFor="messageContent"></label>
                <textarea className={"chatzone-writing-textarea-input"} name="messageContent" id="messageContent" cols="60" rows="10" onChange={handleChange} value={messageContent}/>
            </div>
                <button className={"submit-button-wooden chatzone-writing-textarea-button"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}}  onClick={sendMessage}>Envoyer le message</button>
            </form>
        </div>
    )
}

export default ChatZone;
