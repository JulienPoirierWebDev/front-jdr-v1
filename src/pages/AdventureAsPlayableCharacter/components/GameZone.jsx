import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"
import PlayableCharacters from "./PlayableCharacters";
import NonPlayableCharactersInScene from "./NonPlayableCharactersInScene";
import Equipments from "./Equipments";
import SpecialActions from "./SpecialActions";
import ChatZone from "./ChatZone";
import Quests from "./Quests";
import Inventory from "./Inventory";
import Places from "./Places";
import AskDiceThrow from "./AskDiceThrow";

import "../../../styles/app.css"
import "../../../styles/GameZone.css"

const GameZone = ({adventureId, jwt, characterId, adventureObject, characterObject, playerPlayableCharacter, messageObject, changeUpdateItem, buttonImg1}) => {


    return (
        <div className={"gamezone"}>
            <div>
                <PlayableCharacters
                    jwt={jwt}
                    adventureId={adventureId}
                    characterObject={characterObject}
                    characterId={characterId}
                    playerPlayableCharacter={playerPlayableCharacter}/>
            </div>

            <div className={"gamezone-center"}>
                <div className={"gamezone-center-column"}>
                    <NonPlayableCharactersInScene
                        jwt={jwt}
                        adventureId={adventureId}
                        adventureObject={adventureObject}/>
                    <SpecialActions
                        jwt={jwt}
                        adventureId={adventureId}
                        playerPlayableCharacter={playerPlayableCharacter}
                        adventureObject={adventureObject}
                        changeUpdateItem={changeUpdateItem}
                        buttonImg1={buttonImg1}/>
                </div>
                <div className={"gamezone-center-column"}>
                    <ChatZone
                        jwt={jwt}
                        adventureId={adventureId}
                        adventureObject={adventureObject}
                        messageObject={messageObject}
                        playerPlayableCharacter={playerPlayableCharacter}
                        characterId={characterId}
                        changeUpdateItem={changeUpdateItem}
                        buttonImg1={buttonImg1}/>
                </div>
                <div className={"gamezone-center-column"}>
                    <Places
                        jwt={jwt}
                        adventureId={adventureId}
                        adventureObject={adventureObject}/>
                    <Quests
                        jwt={jwt}
                        adventureId={adventureId}
                        adventureObject={adventureObject}/>
                </div>
            </div>

            <div className={"gamezone-footer"}>
                <Equipments
                    playerPlayableCharacter={playerPlayableCharacter}
                    changeUpdateItem={changeUpdateItem}/>
                <AskDiceThrow
                    jwt={jwt}
                    playerPlayableCharacter={playerPlayableCharacter}
                    adventureObject={adventureObject}
                    adventureId={adventureId}
                    buttonImg1={buttonImg1}/>
                <Inventory
                    playerPlayableCharacter={playerPlayableCharacter}
                    adventureObject={adventureObject}
                    changeUpdateItem={changeUpdateItem}
                    jwt={jwt}
                    buttonImg1={buttonImg1}/>
            </div>


        </div>
    )
}

export default GameZone;