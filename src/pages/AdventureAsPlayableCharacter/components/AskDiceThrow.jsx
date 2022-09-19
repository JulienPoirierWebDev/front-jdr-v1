import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/AskDiceThrow.css"
import Select from "react-select";

const AskDiceThrow = ({jwt, playerPlayableCharacter, adventureObject, adventureId, buttonImg1}) => {
    const [select, setSelect] = useState("");
    const [action, setAction] = useState("");
    const [caracteristic, setCaracteristic] = useState("");
    const [target, setTarget] = useState("");
    const [actionDescription, setActionDescription] = useState("");


    function throwDice(min, max) {
        return Math.floor(Math.random()*max) + min
    }

    let doAttackThrow = async (event) => {
        event.preventDefault();
        let dateTimeNow = Date.now();
        let scoreTarget=12;
        let targetArray = target.split(" ");
        let targetNpc = targetArray[0] === "npc" ? "api/npc_on_adventures/" + parseInt(targetArray[1]) : null;
        let throw1 = throwDice(0,6);
        let throw2 = throwDice(0,6);
        let throw3 = throwDice(0,6);
        let score = throw1 + throw2 + throw3;
        console.log([throw1, throw2, throw3])
        console.log(score);
        let scoreCaracteristicBonus = 0;
        playerPlayableCharacter.caracteristics.map((carac) => {
            if(carac.caracteristicType.id === 1) {
                return scoreCaracteristicBonus += carac.value;
            }
        } )

        playerPlayableCharacter.equipment.map((equipment) => {
            if(equipment.itemInBag.item.caracteristicType.id === 1) {
                return scoreCaracteristicBonus += equipment.itemInBag.item.modifier;
            }
        } )
        let dataAttack = {
            dice:"api/dices/1",
            adventure:"api/adventures/" + adventureId,
            caracteristicType:"api/caracteristic_type/1",
            targetNpc:targetNpc,
            targetPlayerCharacter:null,
            score:score,
            throwDateTime: new Date(dateTimeNow),
            scoreTarget:parseInt(scoreTarget),
            action:actionDescription,
            byNpc:false,
            player_character_who_throw: "api/player_characters/" + playerPlayableCharacter.id,
            isAttack:true,
            gameMasterWaiting:true,
            gameMasterValidation:false,
            dateTimeUpdate:new Date(dateTimeNow)
        }
        await api_roliste.postData(requests.requestDiceThrow, dataAttack, jwt).then((response) => {
            console.log(response)
            setSelect("")
            setActionDescription("");
            setAction("")
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

    }

    let doFreeActionThrow = async (event) => {
        event.preventDefault();
        let targetArray = target.split(" ");
        let targetNpc = targetArray[0] === "npc" ? "api/npc_on_adventures/" + parseInt(targetArray[1]) : null;
        let targetPlayer = targetArray[0] === "player" ? "api/player_characters/" + parseInt(targetArray[1]) : null;
        console.log(target[1])
        let throw1 = throwDice(0,6);
        let throw2 = throwDice(0,6);
        let throw3 = throwDice(0,6);
        console.log([throw1, throw2, throw3])
        let scoreCaracteristicBonus = 0;

        playerPlayableCharacter.caracteristics.map((carac) => {
            if(carac.caracteristicType.id === caracteristic) {
                return scoreCaracteristicBonus += carac.value;
            }
        } )

        playerPlayableCharacter.equipment.map((equipment) => {
            if(equipment.itemInBag.item.caracteristicType.id === caracteristic) {
                return scoreCaracteristicBonus += equipment.itemInBag.item.modifier;
            }
        } )
        let score = throw1 + throw2 + throw3 + scoreCaracteristicBonus;
        console.log(score);

        let dateTimeNow = Date.now();



        let scoreTarget=12;

        console.log(caracteristic)
        let dataFreeAction = {
            dice:"api/dices/1",
            adventure:"api/adventures/" + adventureId,
            caracteristicType:"api/caracteristic_type/" + caracteristic,
            targetNpc:targetNpc,
            targetPlayerCharacter:targetPlayer,
            score:score,
            throwDateTime: new Date(dateTimeNow),
            scoreTarget:parseInt(scoreTarget),
            action:actionDescription,
            byNpc:false,
            player_character_who_throw: "api/player_characters/" + playerPlayableCharacter.id,
            isAttack:false,
            gameMasterWaiting:true,
            gameMasterValidation:false,
            dateTimeUpdate:new Date(dateTimeNow)
        }

        console.log(dataFreeAction)

        await api_roliste.postData(requests.requestDiceThrow, dataFreeAction, jwt).then((response) => {
            console.log(response)
            setSelect("")
            setActionDescription("");
            setAction("")
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });



    }


    function handleSelectThrow() {
        if(select === "askThrow") {
            setSelect("")
            setAction("")
        } else {
            setSelect("askThrow")
        }
        console.log(select)
    }

    function handleCaracteristicSelectChange(event) {
        setCaracteristic(event.value);
        console.log(event.value)
    }

    function handleTargetSelectChange(event) {
        setTarget(event.value);
        console.log(event.value)
    }

    function handleChange(event) {
        if (event.target.name === "actionDescription") {
            setActionDescription(functions.escapeHtmlV2(event.target.value));
        }
    }



    function handleRadioChange(event) {
        if (event.target.value === "attack") {
            setAction(event.target.value)
        } else if (event.target.value === "freeAction") {
            setAction(event.target.value)
        }
    }

    function fetchAttackTarget(){
        let result = [];
        if(adventureObject && adventureObject.npcOnAdventures){
            adventureObject.npcOnAdventures.map(npc => result.push({value:"npc " + npc.id,label:npc.npc.firstName + " " + npc.npc.lastName}))
        }
        return result
    }

    function fetchFreeActionTarget(){
        let result = [];
        if(adventureObject && adventureObject.npcOnAdventures){
            adventureObject.npcOnAdventures.map(npc => result.push({value:"npc " + npc.id,label:npc.npc.firstName + " " + npc.npc.lastName}))
        }
        if(adventureObject && adventureObject.playerCharacters) {
            adventureObject.playerCharacters.map(playerCharacter => result.push({value:"player " + playerCharacter.id, label:playerCharacter.name}))
        }
        return result
    }



    let caracteristics = [
        {value:1, label:"Force"},
        {value:2, label:"Constitution"},
        {value:3, label:"Dextérité"},
        {value:4, label:"Intelligence"},
        {value:5, label:"Sagesse"},
        {value:6, label:"Charisme"}];

    return (
        <div className={"askdice-container"}>
            <h3 className={"askdice-main"} onClick={handleSelectThrow}>Demander un jet de dè</h3>
            {select === "askThrow" ?
                <div className={"askdice-group"}>
                    <button className={"askdice-closebutton"} onClick={handleSelectThrow}>X</button>
                    <form action="">
<div className={"askdice-action-choice"} onChange={handleRadioChange}>
    <p>
        <label className={`askdice-action-label ${action === "attack" ? "askdice-action-label-active" :""}`} htmlFor="attack">
        <input className={"askdice-action-input"} id={"attack"} type="radio" value={"attack"} name={"action"}/>Attaque</label>
    </p>
    <p>
        <label className={`askdice-action-label ${action === "freeAction" ? "askdice-action-label-active" :""}`} htmlFor="freeAction">
            <input className={"askdice-action-input"} id={"freeAction"} type="radio" value={"freeAction"} name={"action"}/>Action libre</label>
    </p>
</div>
                        <div>
    {action === "attack" ?
        <div>
            <Select placeholder={"Choisissez votre cible"} options={fetchAttackTarget()} onChange={handleTargetSelectChange} name={"targetSelected"} className="target-select"/>
            <div>
                <label className={"askdice-action-description"} htmlFor="actionDescription">Description de votre action</label>
                <textarea className={"askdice-writing-textarea-input"} name="actionDescription" id="actionDescription" cols="30" rows="10" onChange={handleChange} value={actionDescription}/>
            </div>
            <button className={"askdice-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={doAttackThrow}>Lancer le dè</button>

        </div>
        : ""}


    {action === "freeAction" ?
        <div>
            <Select placeholder={"Choisissez la caractéristique utilisée"} options={caracteristics} onChange={handleCaracteristicSelectChange} name={"caracteristicSelected"} className="caracteristic-select"/>
            <Select placeholder={"Choisissez votre cible"} options={fetchFreeActionTarget()} onChange={handleTargetSelectChange} name={"targetSelected"} className="target-select"/>
            <div>
                <label className={"askdice-action-description"} htmlFor="actionDescription">Description de votre action</label>
                <textarea className={"askdice-writing-textarea-input"} name="actionDescription" id="actionDescription" cols="30" rows="10" onChange={handleChange} value={actionDescription}/>
            </div>
            <button className={"askdice-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={doFreeActionThrow}>Lancer le dè</button>
        </div>        : ""}
</div>

                    </form>

                </div>
            : ""}
        </div>
    )
}

export default AskDiceThrow;