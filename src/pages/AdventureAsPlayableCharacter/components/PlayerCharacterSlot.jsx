import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"

const PlayerCharacterSlot = ({name, avatarIcon, health, maxHealth, level, magic, maxMagic}) => {


    return (

                <div className={"playablecharacters-slot"}>
                    <div className={"playablecharacters-slot-avatar-div"}><img className={"playablecharacters-slot-avatar"} src={process.env.PUBLIC_URL + '/media/avatar/' + avatarIcon} alt={"Avatar de " + name}/></div>
                    <div  className={"playablecharacters-slot-group"}>
                    <p className={"playablecharacters-slot-name"}>{name}</p>
                    <p className={"playablecharacters-slot-level"}>Niveau <span>{level}</span></p>
                    <p className={"playablecharacters-slot-pv"}>PV : <span>{health} / {maxHealth}</span></p>
                    <p className={"playablecharacters-slot-pm"}>PM : <span>{magic} / {maxMagic}</span></p>
                    </div>
                </div>
    )
}

export default PlayerCharacterSlot;