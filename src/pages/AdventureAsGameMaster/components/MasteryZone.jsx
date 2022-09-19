import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"


import "../../../styles/app.css"
import "../../../styles/GameZone.css"

import GmPlayableCharacters from "./GmPlayableCharacters";
import GmPlayerCharacterManagement from "./GmPlayerCharacterManagement";
import GmNonPlayableCharacters from "./GmNonPlayableCharacters";
import GmChatZone from "./GmChatZone";
import GmPlaces from "./GmPlaces";
import GmQuests from "./GmQuests";
import GmActionsWaiting from "./GmActionsWaiting";

const MasteryZone = ({jwt, adventureObject, characterObject, messageObject, allNpc, changeUpdateItem, actions, payload, buttonImg1}) => {


    return (
        <div className={"gamezone"}>
            <div className={"gamezone-row"}>
                <GmPlayableCharacters characterObject={characterObject} jwt={jwt}/>
                <GmActionsWaiting adventureObject={adventureObject} actions={actions} characterObject={characterObject} allNpc={allNpc} jwt={jwt} changeUpdateItem={changeUpdateItem} buttonImg1={buttonImg1}/>
            </div>

            <div className={"gamezone-center"}>
                <div className={"gamezone-center-column"}>
                    <GmPlayerCharacterManagement/>
                    <GmNonPlayableCharacters jwt={jwt} adventureObject={adventureObject} allNpc={allNpc} changeUpdateItem={changeUpdateItem} buttonImg1={buttonImg1}/>
                </div>
                <div className={"gamezone-center-column"}>
                    <GmChatZone jwt={jwt} messageObject={messageObject} adventureObject={adventureObject} adventureId={adventureObject.id} payload={payload} changeUpdateItem={changeUpdateItem} buttonImg1={buttonImg1}/>
                </div>
                <div className={"gamezone-center-column"}>
                    <GmQuests adventureObject={adventureObject} adventureId={adventureObject.id} jwt={jwt}/>
                    <GmPlaces jwt={jwt} adventureObject={adventureObject} adventureId={adventureObject.id} />
                </div>
            </div>
        </div>

        /*

        <div className={"container-flex  column between border max"}>


            <div>
                <PlayableCharacters jwt={jwt} adventureId={adventureId} characterObject={characterObject} characterId={characterId} playerPlayableCharacter={playerPlayableCharacter}/>
            </div>

            <div className={"container-flex row between border max"}>
                <div className={"container-flex column between border max"}>
                    <NonPlayableCharactersInScene jwt={jwt} adventureId={adventureId} adventureObject={adventureObject}/>
                    <SpecialActions jwt={jwt} adventureId={adventureId} playerPlayableCharacter={playerPlayableCharacter} adventureObject={adventureObject}/>
                </div>
                <div className={"container-flex column between border max"}>
                    <ChatZone jwt={jwt} adventureId={adventureId} adventureObject={adventureObject} messageObject={messageObject} playerPlayableCharacter={playerPlayableCharacter} characterId={characterId}/>
                </div>
                <div className={"container-flex column between border max"}>
                    <Places jwt={jwt} adventureId={adventureId} adventureObject={adventureObject}/>
                    <Quests jwt={jwt} adventureId={adventureId} adventureObject={adventureObject}/>
                </div>
            </div>

            <div className={"container-flex row between border max"}>
                <Equipments playerPlayableCharacter={playerPlayableCharacter}/>
                <AskDiceThrow jwt={jwt} playerPlayableCharacter={playerPlayableCharacter} adventureObject={adventureObject} adventureId={adventureId}/>
                <Inventory playerPlayableCharacter={playerPlayableCharacter} adventureObject={adventureObject} fetchPlayablePlayerCharacter={fetchPlayablePlayerCharacter}/>
            </div>


        </div>
    */
    )
}

export default MasteryZone;