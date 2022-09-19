import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/Inventory.css"
import Select from "react-select";
import {logDOM} from "@testing-library/react";

const Inventory = ({jwt, adventureId, playerPlayableCharacter, adventureObject, changeUpdateItem, buttonImg1}) => {
    const [loaded, setLoaded] = useState(false);
    const [select, setSelect] = useState("");
    const [thereIsTargetForEquipment, setThereIsTargetForEquipment] = useState(false);
    const [target, setTarget] = useState("");

    function handleSelectInventory() {
        if(select === "inventaire") {
            setSelect("")
        } else {
            setSelect("inventaire")
        }
    }

    const useItem = async (event) => {
        event.preventDefault();
        let valueArray = event.target.value.split(",");
        let itemInBagId = valueArray[0];
        let itemQuantity = valueArray[1];
        let itemId= valueArray[2];

        let targetArray = target.split(" ");
        let targetNpc = targetArray[0] === "npc" ? "api/npc_on_adventures/" + parseInt(targetArray[1]) : null;
        let targetPlayer = targetArray[0] === "player" ? "api/player_characters/" + parseInt(targetArray[1]) : null;
        let targetPlayerName = targetArray[0] === "player" ? targetArray[2] : null;
        let targetPlayerId = targetArray[0] === "player" ? parseInt(targetArray[1]) : null;

        let dateTimeNow = Date.now();
        let dataItem = "";

        if(!targetNpc && !targetPlayer) {
            dataItem = {
                itemInBag:"api/item_in_bags/"+itemInBagId,
                targetPlayerCharacter:"api/player_characters/" + playerPlayableCharacter.id,
                targetNpc:null,
                dateTimeCreate: new Date(dateTimeNow),
                dateTimeUpdate:new Date(dateTimeNow),
                gameMasterWaiting:true,
                gameMasterValidation:false,
                targetPlayerCharacterUniqueId:playerPlayableCharacter.id,
                targetPlayerCharacterName:playerPlayableCharacter.name,
                playerWhoLaunch:"api/player_characters/" + playerPlayableCharacter.id
            }
        } else {
            dataItem = {
                itemInBag: "api/item_in_bags/" + itemInBagId,
                targetPlayerCharacter: targetPlayer,
                targetNpc: targetNpc,
                dateTimeCreate: new Date(dateTimeNow),
                dateTimeUpdate: new Date(dateTimeNow),
                gameMasterWaiting: true,
                gameMasterValidation: false,
                targetPlayerCharacterUniqueId:targetPlayerId,
                targetPlayerCharacterName:targetPlayerName,
                playerWhoLaunch:"api/player_characters/" + playerPlayableCharacter.id

            }
        }

        await api_roliste.postData(requests.requestItemInAction, dataItem, jwt).then((response) => {
            setSelect("");
            changeUpdateItem("playerUpdate");

        }).catch((error) => {
            console.log(error)
        })
    }


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

    function handleCheckboxChange(event) {
        if(thereIsTargetForEquipment) {
            setThereIsTargetForEquipment(false)
        } else {setThereIsTargetForEquipment(true)
        setTarget("");}
    }

    function handleTargetSelectChange(event) {
        setTarget(event.value);
    }

    const equipItem = async (event) => {
        event.preventDefault();
        let valueArray = event.target.value.split(",");
        let itemInBagId = valueArray[0];
        let itemId = valueArray[1];
        let equipmentType = valueArray[2];
        console.log(valueArray[2])





        let itemToDesequippedArray = playerPlayableCharacter.equipment.map((element) => {
            if(element.itemInBag.item.equipmentType.id === parseInt(equipmentType)){
                return [element.id, element.itemInBag.id]
            }
        }).filter((element) => {return element != null})
        let itemToDesequipped = "";
        let itemToDesequippedId = "";

        if(itemToDesequippedArray[0]) {
            itemToDesequipped = itemToDesequippedArray[0][0];
            itemToDesequippedId = itemToDesequippedArray[0][1];


            if (parseInt(itemInBagId) !== itemToDesequippedId) {
                let newUrl = requests.requestEquipment + "/" + itemToDesequipped
                await api_roliste.deleteData(newUrl, jwt).then(async (reponse) => {
                    let dataNewEquipment = {
                        playerCharacter: "api/player_characters/" + playerPlayableCharacter.id,
                        itemInBag:"api/item_in_bags/"+ itemInBagId
                    }
                    await api_roliste.postData(requests.requestEquipment, dataNewEquipment, jwt).then((reponse) => {
                        setSelect("");
                        changeUpdateItem("playerUpdate");
                    })
                })
            }
        } else {let dataNewEquipment = {
            playerCharacter: "api/player_characters/" + playerPlayableCharacter.id,
            itemInBag:"api/item_in_bags/"+ itemInBagId
        }
            await api_roliste.postData(requests.requestEquipment, dataNewEquipment, jwt).then((reponse) => {
                setSelect("");
                changeUpdateItem("playerUpdate");
            })}



/*

        let dateTimeNow = Date.now();

        let dataItem = {
            adventure:"api/adventures/" + adventureId,
            itemInBag:"api/item_in_bags/"+itemSelected.id,
            targetPlayerCharacter:targetPlayer,
            targetNpc:targetNpc,
            dateTimeCreate: new Date(dateTimeNow),
            dateTimeUpdate:new Date(dateTimeNow),
            gameMasterWaiting:true,
            gameMasterValidation:false
        }

        await api_roliste.postData(requests.requestItemInAction, dataItem, jwt).then( async (response) => {
            console.log(response);
            setTarget("");
            if(itemSelected.quantity > 1) {
                let newQuantity = (itemSelected.quantity -1);
                let dataUpdate = {
                    id:itemSelected.id,
                    playerCharacter:"api/player_characters/" + playerPlayableCharacter.id,
                    quantity:newQuantity ,
                    item:"api/items/" + itemSelected.item.id
                };
                console.log(dataUpdate);
                //await api_roliste.putData(requests.requestItemInBag, dataUpdate, jwt)
            } else {
                let newUrl = requests.requestItemInBag + "/" + itemSelected.id;
                console.log(newUrl);
                // await api_roliste.putData(newUrl, dataUpdate, jwt)
            }

        }).catch((error) => {
            console.log(error)
        })

*/
    }

    return (
        <div className={"inventory-container"}>
            <h3 className={"inventory-main"} onClick={handleSelectInventory}>Inventaire</h3>

            {select === "inventaire" ?(
                <div className={"inventory-group"}>
                    <div className={"inventory-select"}>
                        <input onChange={handleCheckboxChange} type="checkbox" name={"thereIsTargetForEquipment"} id={"thereIsTargetForEquipment"}/>
                        <label htmlFor="thereIsTargetForEquipment">Cibler un être vivant (ou non) en particulier</label>
                        {thereIsTargetForEquipment ?
                            <Select placeholder={"Choisissez votre cible"} options={fetchTarget()} onChange={handleTargetSelectChange} name={"targetSelected"} className="target-select"/> : ""}
                    </div>
                    <div className={"inventory-items-group"}>
                    {playerPlayableCharacter ? playerPlayableCharacter.itemInBags.map((item) => {
                        if(item.quantity > 0) {
                        return <div key={item.id}>
                            <p className={"inventory-item-content"}>{item.item.name} : <span>{item.quantity}</span>
                                {item.item.usable ? <button className={"inventory-item-button"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} value={[item.id, item.quantity, item.item.id]} onClick={useItem}>Utiliser</button> : ""}
                                {item.item.equipable ? <button className={"inventory-item-button"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} value={[item.id, item.item.id, item.item.equipmentType.id]} onClick={equipItem} >Equiper</button> : ""}
                            </p>
                        </div>}}
                    ) : ""}
                    </div>
                </div>
            ):""}
        </div>
    )
}

export default Inventory;

/*

 */