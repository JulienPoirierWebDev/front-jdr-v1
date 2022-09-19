import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"

const MessageSlot = ({message, privateItem}) => {
    const [header, setHeader] = useState("");
    const [styleName, setStyleName] = useState("");
    const [transmitter, setTransmitter] = useState("");
    const [receiver, setReceiver] = useState("");
    const [prereceiver, setPreeceiver] = useState("");

    function prepareData() {
        if(!message.isPlayerMessage && !message.isSystemMessage){
            setHeader("PNJ : ");
            setStyleName("message_npc");
        } else if(message.isSystemMessage){
            setHeader("Résultat d'action : ");
            setStyleName("message_system")
        } else if(message.isPlayerMessage) {
            setHeader("PJ : ");
            setStyleName("message_player")
        }
        setTransmitter(message.nameOfSpeaker);
        if(message.targetPlayerCharacter) {
            setPreeceiver(" s'adresse à ")
            setReceiver(<span>{message.targetPlayerCharacter.name}</span>);
            console.log(message.targetPlayerCharacter.name)
        } else if(message.npcReceiver){
            setPreeceiver(" s'adresse à ")
            setReceiver(<span>{message.npcReceiver.npc.firstName}{" "}{message.npcReceiver.npc.lastName}</span>);
        };

    }

    useEffect(()=> {
        prepareData()
    },[message])

    return (

        <div className={`messageslot-container ${styleName}`}>
            <p className={"messageslot-header"}>{privateItem ? <span className={"private_message"}>Message privé - </span> : ""}<span>{header}</span>{transmitter}{receiver ? prereceiver: ""}{receiver ? receiver: ""}</p>
            <p className={"messageslot-content"}>{message.content}</p>

        </div>
    )
}

export default MessageSlot;