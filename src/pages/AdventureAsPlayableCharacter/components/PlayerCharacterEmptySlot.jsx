import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"

const PlayerCharacterEmptySlot = () => {


    return (

                <div className={"playablecharacters-slot"}>
                    <p>Place disponible</p>
                    <img/>
                </div>
    )
}

export default PlayerCharacterEmptySlot;