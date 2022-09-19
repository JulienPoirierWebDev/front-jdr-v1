import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"
import PlayerCharacterSlot from "./PlayerCharacterSlot";
import PlayerCharacterEmptySlot from "./PlayerCharacterEmptySlot";
import {logDOM} from "@testing-library/react";

import "../../../styles/PlayableCharacters.css"

const PlayableCharacters = ({jwt, adventureId, characterObject, characterId, playerPlayableCharacter}) => {

    const [loaded, setLoaded] = useState(false);
    const [characters, setCharacters] = useState([])
    const [otherPlayerCharacters, setOtherPlayerCharacters] = useState([])


    function dispatchData() {
        let data = [];
        if(Array.isArray(characterObject)){
        let map = characterObject.map((character) => {
            if(parseInt(character.id) !== parseInt(characterId)) {
               return data.push(character)
            }
        })
            setOtherPlayerCharacters(data)
        }
    }


    useEffect(() => {
        dispatchData()
    }, [characterObject, characterId])


    return (
        <div className={"playablecharacters"}>

            {otherPlayerCharacters[1] ?
                <PlayerCharacterSlot
                    name={otherPlayerCharacters[1].name}
                    avatarIcon={otherPlayerCharacters[1].avatarIcon.slug}
                    level={otherPlayerCharacters[1].caracteristics[10].value}
                    health={otherPlayerCharacters[1].caracteristics[6].value}
                    maxHealth={otherPlayerCharacters[1].caracteristics[7].value}
                    magic={otherPlayerCharacters[1].caracteristics[12].value}
                    maxMagic={otherPlayerCharacters[1].caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }

            {otherPlayerCharacters[0] ?
                <PlayerCharacterSlot
                    name={otherPlayerCharacters[0].name}
                    avatarIcon={otherPlayerCharacters[0].avatarIcon.slug}
                    level={otherPlayerCharacters[0].caracteristics[10].value}
                    health={otherPlayerCharacters[0].caracteristics[6].value}
                    maxHealth={otherPlayerCharacters[0].caracteristics[7].value}
                    magic={otherPlayerCharacters[0].caracteristics[12].value}
                    maxMagic={otherPlayerCharacters[0].caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }

            {playerPlayableCharacter ?
                <PlayerCharacterSlot
                    name={playerPlayableCharacter.name}
                    avatarIcon={playerPlayableCharacter.avatarIcon.slug}
                    level={playerPlayableCharacter.caracteristics[10].value}
                    health={playerPlayableCharacter.caracteristics[6].value}
                    maxHealth={playerPlayableCharacter.caracteristics[7].value}
                    magic={playerPlayableCharacter.caracteristics[12].value}
                    maxMagic={playerPlayableCharacter.caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }

            {otherPlayerCharacters[2] ?
                <PlayerCharacterSlot
                    name={otherPlayerCharacters[2].name}
                    avatarIcon={otherPlayerCharacters[2].avatarIcon.slug}
                    level={otherPlayerCharacters[2].caracteristics[10].value}
                    health={otherPlayerCharacters[2].caracteristics[6].value}
                    maxHealth={otherPlayerCharacters[2].caracteristics[7].value}
                    magic={otherPlayerCharacters[2].caracteristics[12].value}
                    maxMagic={otherPlayerCharacters[2].caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }

            {otherPlayerCharacters[3] ?
                <PlayerCharacterSlot
                    name={otherPlayerCharacters[3].name}
                    avatarIcon={otherPlayerCharacters[3].avatarIcon.slug}
                    level={otherPlayerCharacters[2].caracteristics[10].value}
                    health={otherPlayerCharacters[3].caracteristics[6].value}
                    maxHealth={otherPlayerCharacters[3].caracteristics[7].value}
                    magic={otherPlayerCharacters[3].caracteristics[12].value}
                    maxMagic={otherPlayerCharacters[3].caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }

        </div>
    )
}

export default PlayableCharacters;