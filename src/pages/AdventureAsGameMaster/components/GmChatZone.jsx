import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"
import Select from "react-select";
import MessageSlot from "../../AdventureAsPlayableCharacter/components/MessageSlot";

const GmChatZone = ({jwt, adventureId, adventureObject, messageObject, playerPlayableCharacter, characterId, payload, changeUpdateItem, buttonImg1}) => {

    const [messageType, setMessageType] = useState("");
    const [messageContent, setMessageContent] = useState("");
    const [target, setTarget] = useState("");
    const [npcRole, setNpcRole] = useState("");

    const [thereIsFreeRoleForGm, setThereIsFreeRoleForGm] = useState(false);
    const [freeRoleForGmValue, setFreeRoleForGmValue] = useState(false);


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

    function fetchInterlocutorPlayersTarget(){
        let result = [];
        if(adventureObject && adventureObject.playerCharacters) {
            adventureObject.playerCharacters.map((playerCharacter) => {
                if(playerCharacter.id !== characterId){
                    result.push({value: "player " + playerCharacter.id, label: playerCharacter.name})
                }})
        }
        return result
    }

    function fetchInterlocutorRole(){
        let result = [];
        if(adventureObject && adventureObject.npcOnAdventures){
            adventureObject.npcOnAdventures.map(npc => result.push({value:"npc " + npc.id + " " + npc.npc.firstName + " " + npc.npc.lastName,label:npc.npc.firstName + " " + npc.npc.lastName}))
        }
        return result
    }

    function handleTargetSelectChange(event) {
        setTarget(event.value);
        console.log(event.value)
    }

    function handleRoleSelectChange(event) {
        setNpcRole(event.value);
    }

    function handleRadioChange(event) {
        if (event.target.value === "toSomeone") {
            setMessageType(event.target.value);
        } else if (event.target.value === "groupe") {
            setMessageType(event.target.value);
            setTarget("");
        } else if (event.target.value === "privateToGM") {
            setMessageType(event.target.value);
        }
    }

    function handleChange(event) {
        if (event.target.name === "messageContent") {
            setMessageContent(event.target.value);
        }
        if (event.target.name === "freeRoleForGmValue") {
            setFreeRoleForGmValue(event.target.value);
        }
    }

    const sendMessage = async (event) => {
        event.preventDefault();

        let targetArray = target.split(" ");
        let targetNpc = targetArray[0] === "npc" ? "api/npc_on_adventures/" + parseInt(targetArray[1]) : null;
        let targetPlayer = targetArray[0] === "player" ? "api/player_characters/" + parseInt(targetArray[1]) : null;
        let targetPlayerId = targetArray[0] === "player" ? parseInt(targetArray[1]) : null;
        let npcRoleArray = npcRole.split(" ");
        console.log("NPC ROLE ARRAY")
        console.log(npcRoleArray)
        let npcRoleName = !thereIsFreeRoleForGm ? npcRoleArray[2] + " " + npcRoleArray[3] : null;
        let npcRoleId = !thereIsFreeRoleForGm ? "api/npc_on_adventures/" + parseInt(npcRoleArray[1]) : null;
        let gameMasterOnlyBool = messageType === "privateToGM";

        let nameOfSpeaker = thereIsFreeRoleForGm ? freeRoleForGmValue : npcRoleName;
        let dateTimeNow = Date.now();

            let dataMessage = {
                adventure: "api/adventures/" + adventureId,
                user: "api/users/" + payload.id,
                content: messageContent,
                isPlayerMessage: false,
                dateTimeCreate: new Date(dateTimeNow),
                gameMasterOnly: gameMasterOnlyBool,
                targetPlayerCharacter: targetPlayer,
                playerCharacter: null,
                nameOfSpeaker: nameOfSpeaker,
                isSystemMessage: false,
                npcReceiver: targetNpc,
                npcWhoSpeak: npcRoleId,
                playerCharacterUniqueId: targetPlayerId

            }



        console.log(dataMessage)


        await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
            changeUpdateItem("messageUpdate");
            console.log(response)
            setMessageContent("");


        }).catch((error) => {
            console.log(error)
        })


    }

    function handleCheckboxChange(event) {
        console.log(messageObject.messageInChats)
        if(thereIsFreeRoleForGm) {
            setThereIsFreeRoleForGm(false)
        } else {setThereIsFreeRoleForGm(true)
            setFreeRoleForGmValue(null);
        }
    }



    return (
        <div className={"chatzone-container"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/page.png"})`,     backgroundSize: `cover`}}>
            <div className={"chatzone-messages-container"}>
                {messageObject ? messageObject.messageInChats.map(message =>
                <div key={message.id}><MessageSlot message={message} privateItem={message.gameMasterOnly}/></div>) : ""}
            </div>
            <form className={"chatzone-writing-container"} action="">
            <div className={"chatzone-wrinting-target"} onChange={handleRadioChange}>
                <div className={"chatzone-writing-label-group"}>
                    <p><label className={messageType === "groupe" ? "specialActions-headers-active" : "chatzone-writing-label"} htmlFor="groupe"><input  className={"chatzone-writing-input"} id={"groupe"} type="radio" value={"groupe"} name={"messageType"}/>S'adresser au groupe</label></p>
                    <p><label className={messageType === "toSomeone" ? "specialActions-headers-active" : "chatzone-writing-label"} htmlFor="toSomeone"><input  className={"chatzone-writing-input"} id={"toSomeone"} type="radio" value={"toSomeone"} name={"messageType"}/>S'adresser a une personne en particulier</label></p>
                    <p><label className={messageType === "privateToGM" ? "specialActions-headers-active" : "chatzone-writing-label"} htmlFor="privateToGM"><input  className={"chatzone-writing-input"} id={"privateToGM"} type="radio" value={"privateToGM"} name={"messageType"}/>Message privé à un personnage</label></p>
                </div>
                <div>
                    {messageType === "toSomeone" ? <Select placeholder={"Choisissez votre interlocuteur"} options={fetchInterlocutorTarget()} onChange={handleTargetSelectChange} name={"targetSelected"} className="target-select"/> : ""}
                    {messageType === "privateToGM" ? <Select placeholder={"Choisissez votre interlocuteur"} options={fetchInterlocutorPlayersTarget()} onChange={handleTargetSelectChange} name={"targetSelected"} className="target-select"/> : ""}
                </div>
                <label className={`chatzone-freerole-label ${thereIsFreeRoleForGm ? "chatzone-freerole-label-active" : ""}`} htmlFor="freeRoleForGm">{thereIsFreeRoleForGm ? "Prendre le rôle d'un PNJ de la scène":"Prendre un rôle libre"}</label>
                <input className={"chatzone-writing-input"}  onChange={handleCheckboxChange} type="checkbox" name={"freeRoleForGm"} id={"freeRoleForGm"}/>
                {!thereIsFreeRoleForGm ?
                    <Select placeholder={"Choisir le PNJ dont vous voulez endosser le rôle"} options={fetchInterlocutorRole()} onChange={handleRoleSelectChange} name={"handleRoleSelectChange"} className="role-select"/> : ""}
                <div className={"chatzone-freerole-choice-div"}>
                        {thereIsFreeRoleForGm ? <div>

                        <label className={"chatzone-freerole-choice-label"} htmlFor="freeRoleForGmValue">Rôle Libre : </label>
                        <input className={"chatzone-freerole-choice-input"} name={"freeRoleForGmValue"} type="text" onChange={handleChange} value={freeRoleForGmValue}/>
                    </div> : ""}
                </div>
            </div>
            <div className={"chatzone-writing-textarea-div"}>
                <label className={"chatzone-writing-textarea-label"} htmlFor="messageContent"></label>
                <textarea className={"chatzone-writing-textarea-input"} name="messageContent" id="messageContent" cols="60" rows="10" onChange={handleChange} value={messageContent}/>
            </div>
                <button className={"submit-button-wooden chatzone-writing-textarea-button"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={sendMessage}>Envoyer le message</button>
            </form>
        </div>
    )
}

export default GmChatZone;