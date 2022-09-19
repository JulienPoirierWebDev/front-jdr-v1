import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"
import Select from "react-select";

import "../../../styles/SpecialActions.css"

const SpecialActions = ({jwt, adventureId, playerPlayableCharacter, adventureObject, changeUpdateItem, buttonImg1}) => {

    const [loaded, setLoaded] = useState(false);
    const [spells, setSpells] = useState(false);
    const [select, setSelect] = useState("");
    const [thereIsTarget, setThereIsTarget] = useState(false);
    const [target, setTarget] = useState("");


    function fetchTarget(){
        let result = [];
        if(adventureObject && adventureObject.npcOnAdventures){
            adventureObject.npcOnAdventures.map(npc => result.push({value:"npc " + npc.id,label:npc.npc.firstName + " " + npc.npc.lastName}))
        }
        if(adventureObject && adventureObject.playerCharacters) {
            adventureObject.playerCharacters.map(playerCharacter => result.push({value:"player " + playerCharacter.id + " " + playerCharacter.name, label:playerCharacter.name}))
        }
        return result
    }

    const fetchSpells = async () => {
        if (!loaded){
            await api_roliste.getAllData(requests.requestSpell, jwt).then((res) => {
                    setSpells(res.data["hydra:member"]);
                    setLoaded(true)
                }
            ).catch((error) => { console.log(error)
                console.log(error)});
        }
    }


    useEffect(() => {
        //fetchSpells()
    })

    function handleSelectPowers() {
        if(select === "powers") {
            setSelect("")
        } else {
            setSelect("powers")
        }
    }

    function handleSelectSkills() {
        if(select === "skills") {
            setSelect("")
        } else {
            setSelect("skills")
        }
    }

    function handleSelectSpells() {
        if(select === "spells") {
            setSelect("")
        } else {
            setSelect("spells")
        }
    }

    const throwSpell = async (event) => {
        event.preventDefault();
        let spellId = event.target.value;

        let targetArray = target.split(" ");
        let targetNpc = targetArray[0] === "npc" ? "api/npc_on_adventures/" + parseInt(targetArray[1]) : null;
        let targetPlayer = targetArray[0] === "player" ? "api/player_characters/" + parseInt(targetArray[1]) : null;
        let targetPlayerName = targetArray[0] === "player" ? targetArray[2] : null;
        let targetPlayerId = targetArray[0] === "player" ? parseInt(targetArray[1]) : null;

        let dateTimeNow = Date.now();
        let dataSpell = "";
        console.log(targetNpc)
        console.log(targetPlayer)
        if(!targetNpc && !targetPlayer) {
            dataSpell = {
                spell:"api/spells/"+spellId,
                targetPlayerCharacter:"api/player_characters/" + playerPlayableCharacter.id,
                targetNpc:null,
                dateTimeCreate: new Date(dateTimeNow),
                dateTimeUpdate:new Date(dateTimeNow),
                gameMasterWaiting:true,
                gameMasterValidation:false,
                playerWhoLaunch: "api/player_characters/" + playerPlayableCharacter.id,
                targetPlayerCharacterUniqueId:playerPlayableCharacter.id,
                targetPlayerCharacterName:playerPlayableCharacter.name
            }
        } else {
            dataSpell = {
                spell:"api/spells/"+spellId,
                targetPlayerCharacter: targetPlayer,
                targetNpc: targetNpc,
                dateTimeCreate: new Date(dateTimeNow),
                dateTimeUpdate: new Date(dateTimeNow),
                gameMasterWaiting: true,
                gameMasterValidation: false,
                playerWhoLaunch: "api/player_characters/" + playerPlayableCharacter.id,
                targetPlayerCharacterUniqueId:targetPlayerId,
                targetPlayerCharacterName:targetPlayerName
            }
        }

        await api_roliste.postData(requests.requestSpellInAction, dataSpell, jwt).then((response) => {
            changeUpdateItem("playerUpdate");
            setSelect(false)


            }
        ).catch((error) => {
            console.log(error)
        })


    }

    const usePower = async (event) => {
        event.preventDefault();

        let powerDevelopedId = event.target.value;

        let targetArray = target.split(" ");
        let targetNpc = targetArray[0] === "npc" ? "api/npc_on_adventures/" + parseInt(targetArray[1]) : null;
        let targetPlayer = targetArray[0] === "player" ? "api/player_characters/" + parseInt(targetArray[1]) : null;
        let targetPlayerName = targetArray[0] === "player" ? targetArray[2] : null;
        let targetPlayerId = targetArray[0] === "player" ? parseInt(targetArray[1]) : null;

        let dateTimeNow = Date.now();
        let dataPower = "";
        if(!targetNpc && !targetPlayer) {
            dataPower = {
                powerDeveloped:"api/power_developeds/"+ powerDevelopedId,
                targetPlayerCharacter:"api/player_characters/" + playerPlayableCharacter.id,
                targetNpc:null,
                dateTimeCreate: new Date(dateTimeNow),
                dateTimeUpdate:new Date(dateTimeNow),
                gameMasterWaiting:true,
                gameMasterValidation:false,
                playerWhoLaunch:"api/player_characters/" + playerPlayableCharacter.id,
                targetPlayerCharacterUniqueId:playerPlayableCharacter.id,
                targetPlayerCharacterName:playerPlayableCharacter.name,


            }
        } else {
            dataPower = {
                powerDeveloped:"api/power_developeds/"+ powerDevelopedId,
                targetPlayerCharacter: targetPlayer,
                targetNpc: targetNpc,
                dateTimeCreate: new Date(dateTimeNow),
                dateTimeUpdate: new Date(dateTimeNow),
                gameMasterWaiting: true,
                gameMasterValidation: false,
                playerWhoLaunch:"api/player_characters/" + playerPlayableCharacter.id,
                targetPlayerCharacterUniqueId:targetPlayerId,
                targetPlayerCharacterName:targetPlayerName
            }
        }

        await api_roliste.postData(requests.requestPowerInAction, dataPower, jwt).then((response) => {
            changeUpdateItem("playerUpdate");
            setSelect(false)


            }
        ).catch((error) => {
            console.log(error)
        })


    }

    const useSkill = async (event) => {
        event.preventDefault();

        let skillDevelopedId = event.target.value;

        let targetArray = target.split(" ");
        console.log(targetArray)
        let targetNpc = targetArray[0] === "npc" ? "api/npc_on_adventures/" + parseInt(targetArray[1]) : null;
        let targetPlayer = targetArray[0] === "player" ? "api/player_characters/" + parseInt(targetArray[1]) : null;
        let targetPlayerName = targetArray[0] === "player" ? targetArray[2] : null;
        let targetPlayerId = targetArray[0] === "player" ? parseInt(targetArray[1]) : null;

        let dateTimeNow = Date.now();
        let dataSkill = "";
        if(!targetNpc && !targetPlayer) {
            dataSkill = {
                skillDeveloped:"api/skill_developeds/"+ skillDevelopedId,
                targetPlayerCharacter:"api/player_characters/" + playerPlayableCharacter.id,
                targetNpc:null,
                dateTimeCreate: new Date(dateTimeNow),
                dateTimeUpdate:new Date(dateTimeNow),
                gameMasterWaiting:true,
                gameMasterValidation:false,
                playerWhoLaunch:"api/player_characters/" + playerPlayableCharacter.id,
                targetPlayerCharacterUniqueId:playerPlayableCharacter.id,
                targetPlayerCharacterName:playerPlayableCharacter.name
            }
        } else {
            dataSkill = {
                skillDeveloped:"api/skill_developeds/"+ skillDevelopedId,
                targetPlayerCharacter: targetPlayer,
                targetNpc: targetNpc,
                dateTimeCreate: new Date(dateTimeNow),
                dateTimeUpdate: new Date(dateTimeNow),
                gameMasterWaiting: true,
                gameMasterValidation: false,
                playerWhoLaunch:"api/player_characters/" + playerPlayableCharacter.id,
                targetPlayerCharacterUniqueId:targetPlayerId,
                targetPlayerCharacterName:targetPlayerName

            }
        }

        await api_roliste.postData(requests.requestSkillInAction, dataSkill, jwt).then((response) => {
            changeUpdateItem("playerUpdate");
            setSelect(false)


            }
        ).catch((error) => {
            console.log(error)
        })


    }


    useEffect(() => {
        fetchSpells()
    }, [loaded])


    function handleCheckboxChange(event) {
        if(thereIsTarget) {
            setThereIsTarget(false)
        } else {setThereIsTarget(true)}
        setTarget("");
    }

    function handleTargetSelectChange(event) {
        setTarget(event.value);
    }

    return (
        <div className={"specialActions-container"}>
            <div className={"specialActions-headers"}>
                <div className={select === "powers" ? "specialActions-headers-active" : ""} onClick={handleSelectPowers}><h2 className={"div-title"}>Pouvoirs</h2></div>
                <div className={select === "skills" ? "specialActions-headers-active" : ""} onClick={handleSelectSkills}><h2 className={"div-title"}>Compétences</h2></div>
                <div className={select === "spells" ? "specialActions-headers-active" : ""} onClick={handleSelectSpells}><h2 className={"div-title"}>Sorts</h2></div>
            </div>
            <div className={"specialActions-target-div"}>
                <input
                    onChange={handleCheckboxChange}
                    type="checkbox" name={"thereIsTarget"}
                    id={"thereIsTarget"}/>
                <label htmlFor="thereIsTarget">
                    Cibler un être vivant (ou non) en particulier
                </label>
            </div>
            {thereIsTarget ?
                <Select
                    placeholder={"Choisissez votre cible"}
                    options={fetchTarget()}
                    onChange={handleTargetSelectChange}
                    name={"targetSelected"}
                    className="target-select"/> : ""}
            <div className={"specialActions-options-container"}>
                {select === "spells" ?
                    <div>
                        {spells.map(spell =>
                            <div className={"specialActions-options"}><p className={"specialActions-options-title"}>{spell.name} | Coût en PM : {spell.level}</p>
                                <p>{spell.description}</p>
                                <button className={"submit-button-wooden specialActions-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={throwSpell} value={spell.id}>Utiliser</button>
                            </div>)}
                    </div>
                    : ""}

                {select === "skills" ?
                    <div>
                        {playerPlayableCharacter.skillDevelopeds.map(skill =>
                            <div className={"specialActions-options"}><p className={"specialActions-options-title"}>{skill.skill.name}</p>
                                <p>{skill.skill.description}</p>
                                <button className={"submit-button-wooden specialActions-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={useSkill} value={skill.id}>Utiliser</button>
                            </div>)}

                    </div>
                    : ""}
                {select === "powers" ?
                    <div>
                        {playerPlayableCharacter.powerDevelopeds.map(power =>
                            <div className={"specialActions-options"}><p className={"specialActions-options-title"}>{power.power.name}</p>
                                <p>{power.power.description}</p>
                                <button className={"submit-button-wooden specialActions-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={usePower} value={power.id}>Utiliser</button>
                            </div>)}
                    </div>
                    : ""}
            </div>
        </div>
    )
}

export default SpecialActions;