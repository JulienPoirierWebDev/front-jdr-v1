import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/NonPlayableCharacterInScene.css"
import NpcSlot from "./NpcSlot";
import {use} from "bcrypt/promises";

const NonPlayableCharactersInScene = ({jwt, adventureId, adventureObject}) => {
    const [loaded, setLoaded] = useState(false);
    const [npcOnAdventure, setNpcOnAdventure] = useState()
    const [npcOnScene, setNpcOnScene] = useState([]);
    const [npcNotOnScene, setNpcNotOnScene] = useState([]);



    function dispatchData() {
        let data = [];
        let data2 = []
        if(Array.isArray(npcOnAdventure)){
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
    }

    useEffect(() => {
        if(adventureObject) {
        setNpcOnAdventure(adventureObject.npcOnAdventures)
        }
    }, [adventureObject])

    useEffect(() => {
        if(npcOnAdventure) {
            dispatchData()
        }
    }, [npcOnAdventure])

    useEffect(() => {
        if(npcOnAdventure) {
            dispatchData()
        }
    }, [npcOnAdventure])


    return (
        <div>
            <h2 className={"div-title"}>Personnages dans la scène</h2>
            <div className={"npc-container"}>
            {npcOnScene.map(npcOnScene =>
                <div className={"npc-div"} key={npcOnScene.id}>
                    <NpcSlot firstName={npcOnScene.npc.firstName} lastName={npcOnScene.npc.lastName} job={npcOnScene.npc.npcJob.name} health={npcOnScene.health}/>
                </div>
            )}
            </div>
        </div>
    )
}

export default NonPlayableCharactersInScene;