import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"
import Select from "react-select";

const AskDiceThrow = ({jwt, playerPlayableCharacter, adventureObject, adventureId}) => {

    function dispatchData() {
        console.log(adventureObject)
        /*
        let data = [];
        let data2 = []
        if(Array.isArray(adventureObject.)){
            let map = npcOnAdventure.map((npc) => {
                    if(npc.presentOnScene) {
                        return data.push(npc)
                    } else {
                        return data2.push(npc)
                    }
                }
            )
            setNpcOnScene(data);
            setNpcNotOnScene(data2)
        }

         */
    }
    useEffect(() => {
        if(adventureObject) {
            dispatchData()
        }
    }, [adventureObject])
    return (
        <div >

        </div>
    )
}

export default AskDiceThrow;