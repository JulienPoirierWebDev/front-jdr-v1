import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/Equipments.css"

const Equipments = ({jwt, adventureId, playerPlayableCharacter, changeUpdateItem}) => {
    const [loaded, setLoaded] = useState(false);
    const [select, setSelect] = useState("");
    const [equipment, setEquipment] = useState([]);
    const [head, setHead] = useState("");
    const [neck, setNeck] = useState("");
    const [chest, setChest] = useState("");
    const [hands, setHands] = useState("");
    const [legs, setLegs] = useState("");
    const [foot, setFoot] = useState("");


    function handleSelectInventory() {
        if(select === "equipment") {
            setSelect("")
        } else {
            setSelect("equipment")
        }
    }

    function findEquipment(zone){
        let elementArr = playerPlayableCharacter.equipment.map((equipmentTested => {
            if(equipmentTested.itemInBag.item.equipmentType.name === zone) {
                return equipmentTested.id
            }
        }))
        let elementId = elementArr.filter((e) => {
            return e != null;
        })
        let result = ""

        if (elementId.length > 0) {
            result = playerPlayableCharacter.equipment.map((element) => {
                if(element.id === parseInt(elementId)){
                    return <p key={element.id}>{zone} : <span>{element.itemInBag.item.name}</span></p>
                }
            })
        } else {
            result = <p>{zone} : <span key={elementId}>Pas d'objet équipé</span></p>
        }
        return result;
    }

    function fetchEquipement() {
        let length = playerPlayableCharacter.equipment.length;
        let equipmentType = ["Tête", "Cou", "Torse", "Mains", "Jambes", "Pieds"];

        let equipment = equipmentType.map((equipmentType) => {
            let element = playerPlayableCharacter.equipment.map((equipment) => {
                if (equipment.itemInBag.item.name === equipmentType) {
                    return (<p>{equipmentType} : <span>{equipment.itemInBag.item.name}</span>
                    </p>)
                }})
        if(element){return element} else {
                    return <p>{equipmentType} : <span>Pas d'objet équipé</span> </p>
                }
            })

        console.log(equipment)
        return equipment
    }

    const unequipped = async (event) => {
        event.preventDefault();
        let newUrl = requests.requestEquipment + "/" + event.target.value;
        await api_roliste.deleteData(newUrl, jwt).then(async (reponse) => {
            changeUpdateItem("playerUpdate");
            return console.log("ca marche")
            })
    }

useEffect(() => {
    if(playerPlayableCharacter){
    setHead(findEquipment("Tête"));
    setNeck(findEquipment("Cou"));
    setChest(findEquipment("Torse"));
    setHands(findEquipment("Mains"));
    setLegs(findEquipment("Jambes"));
    setFoot(findEquipment("Pieds"));
    }

}, [playerPlayableCharacter])
    return (
        <div className={"equipment-container"}>
            <h3 className={"equipment-main"} onClick={handleSelectInventory}>Equipement</h3>

            {select === "equipment" && equipment ?(
                <div className={"equipment-group"}>
                    {head}
                    {neck}
                    {chest}
                    {hands}
                    {legs}
                    {foot}
                </div>
            ):""}
        </div>
    )
}

export default Equipments;