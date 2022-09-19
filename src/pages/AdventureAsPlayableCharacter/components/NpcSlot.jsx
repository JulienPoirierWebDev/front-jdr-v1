import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"

const NpcSlot = ({jwt, firstName, lastName, isGm, job, strength, description, adventureId, npcOnAdventureId, npcId, npcStrength, changeUpdateItem, scene, health, buttonImg1}) => {

    const handleAddNpcToAdventure = async () => {

    let health = "";
    switch (npcStrength) {
        case 1 :
            health=1;
            break;
        case 2 :
            health = 2;
            break;
        case 3 :
            health = 4;
            break;
        case 4 :
            health = 10;
            break;
        case 5 :
            health = 15;
            break;
        case 6 :
            health = 25;
            break;
        case 7 :
            health = 40;
            break;
        case 8 :
            health = 60;
            break;
    }

        let dataNpcOnAdventure = {
            adventure:"api/adventures/" + adventureId,
            npc:"api/npcs/" + npcId,
            description:description,
            presentOnScene:false,
            health:health
        }

        await api_roliste.postData(requests.requestNpcOnAdventure, dataNpcOnAdventure, jwt).then((result) => {
            changeUpdateItem("adventureUpdate")
        })
    }

    const handleScene = async () =>  {
        let presentOnScene = false
        if(scene === "off") {
            presentOnScene = true;

        }

        let dataNpcOnAdventure = {
            adventure:"api/adventures/" + adventureId,
            npc:"api/npcs/" + npcId,
            description:description,
            presentOnScene:presentOnScene,
            health:health
        }
        let newUrl = requests.requestNpcOnAdventure + "/" + npcOnAdventureId
        await api_roliste.patchData(newUrl, dataNpcOnAdventure, jwt).then((response) => {
            changeUpdateItem("adventureUpdate")
        })
    }

    const handleDelete = async () => {
        let newUrl = requests.requestNpcOnAdventure + "/" + npcOnAdventureId

        await api_roliste.deleteData(newUrl, jwt).then((response) => {
            changeUpdateItem("adventureUpdate")
        })
    }

    return (

        <div>
            <p>{firstName}&nbsp;
                <span>{lastName}</span>
                {job && strength ? <span> | {job} | {strength} | {health ? "PV : " + health :""}</span> :<span> | {job} | PV : {health}</span>}
            </p>
            {isGm ? <button className={"submit-button-wooden npc-creation-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={handleAddNpcToAdventure}>Ajouter a l'aventure</button> :""}
            {scene === "in" ? <button className={"submit-button-wooden npc-creation-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={handleScene}>Sortir de la scène</button> :""}
            {scene === "off" ? <button className={"submit-button-wooden npc-creation-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={handleScene}>Entrer de la scène</button> :""}
            {scene === "off" ? <button className={"submit-button-wooden npc-creation-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={handleDelete}>Supprimer de l'aventure</button> :""}
            <hr className={"npc-separator"}/>

        </div>
    )
}

export default NpcSlot;

/*                 <button>Talk</button>
                <button>Fight</button>
                <button>Action</button>*/