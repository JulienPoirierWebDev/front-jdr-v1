import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"

import PlayerCharacterSlot from "../../AdventureAsPlayableCharacter/components/PlayerCharacterSlot";
import PlayerCharacterEmptySlot from "../../AdventureAsPlayableCharacter/components/PlayerCharacterEmptySlot";

const GmPlayableCharacters = ({jwt, adventureId, characterObject, characterId, playerPlayableCharacter}) => {

    const [loaded, setLoaded] = useState(false);
    const [characters, setCharacters] = useState([])
    const [PlayerCharacters, setPlayerCharacters] = useState([])


    function dispatchData() {
        let data = [];
        if(Array.isArray(characterObject)){
        let map = characterObject.map((character) => {
               return data.push(character)
        })
            setPlayerCharacters(data)
        }
    }


    useEffect(() => {
        dispatchData()
    }, [characterObject])


    return (
        <div className={"playablecharacters"}>
            {PlayerCharacters[0] ?
                <PlayerCharacterSlot
                    name={PlayerCharacters[0].name}
                    avatarIcon={PlayerCharacters[0].avatarIcon.slug}
                    level={PlayerCharacters[0].caracteristics[10].value}
                    health={PlayerCharacters[0].caracteristics[6].value}
                    maxHealth={PlayerCharacters[0].caracteristics[7].value}
                    magic={PlayerCharacters[0].caracteristics[12].value}
                    maxMagic={PlayerCharacters[0].caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }

            {PlayerCharacters[1] ?
                <PlayerCharacterSlot
                    name={PlayerCharacters[1].name}
                    avatarIcon={PlayerCharacters[1].avatarIcon.slug}
                    level={PlayerCharacters[1].caracteristics[10].value}
                    health={PlayerCharacters[1].caracteristics[6].value}
                    maxHealth={PlayerCharacters[1].caracteristics[7].value}
                    magic={PlayerCharacters[1].caracteristics[12].value}
                    maxMagic={PlayerCharacters[1].caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }

            {PlayerCharacters[2] ?
                <PlayerCharacterSlot
                    name={PlayerCharacters[2].name}
                    avatarIcon={PlayerCharacters[2].avatarIcon.slug}
                    level={PlayerCharacters[2].caracteristics[10].value}
                    health={PlayerCharacters[2].caracteristics[6].value}
                    maxHealth={PlayerCharacters[2].caracteristics[7].value}
                    magic={PlayerCharacters[2].caracteristics[12].value}
                    maxMagic={PlayerCharacters[2].caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }

            {PlayerCharacters[3] ?
                <PlayerCharacterSlot
                    name={PlayerCharacters[3].name}
                    avatarIcon={PlayerCharacters[3].avatarIcon.slug}
                    level={PlayerCharacters[2].caracteristics[10].value}
                    health={PlayerCharacters[3].caracteristics[6].value}
                    maxHealth={PlayerCharacters[3].caracteristics[7].value}
                    magic={PlayerCharacters[3].caracteristics[12].value}
                    maxMagic={PlayerCharacters[3].caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }


            {PlayerCharacters[4] ?
                <PlayerCharacterSlot
                    name={PlayerCharacters[3].name}
                    avatarIcon={PlayerCharacters[3].avatarIcon.slug}
                    level={PlayerCharacters[2].caracteristics[10].value}
                    health={PlayerCharacters[3].caracteristics[6].value}
                    maxHealth={PlayerCharacters[3].caracteristics[7].value}
                    magic={PlayerCharacters[3].caracteristics[12].value}
                    maxMagic={PlayerCharacters[3].caracteristics[13].value}
                />:
                <PlayerCharacterEmptySlot/>
            }

        </div>
    )
}

export default GmPlayableCharacters;