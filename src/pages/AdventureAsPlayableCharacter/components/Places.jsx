import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/Places.css"

const Places = ({jwt, adventureId, adventureObject}) => {
    const [select, setSelect] = useState("");


    function handleSelectAllPlaces() {
        if(select === "allPlaces") {
            setSelect("")
        } else {
            setSelect("allPlaces")
        }
    }

    return (
        <div className={"places-container"}>
            <h3 className={"div-title"}>Lieu</h3>

            {adventureObject ? adventureObject.visitedPlaces.map((place) => {
                if(place.actualPlace){
                   return <div key={place.id}>
                            <h3>{place.place.name}</h3>
                            <p className={"places-content"}>{place.description}</p>
                    </div>
                }
                }
                ) : ""}

            <h4 className={"div-title places-sub-title"} onClick={handleSelectAllPlaces}>Lieux déja visités</h4>
            {select === "allPlaces" ?
            <div>
                    {adventureObject.visitedPlaces.map(place => <div key={place.id}>
                    <h4>{place.place.name}</h4>
                    <p className={"places-content"}>{place.description}</p>
                </div>)}
            </div>
            : ""}
        </div>
    )
}

export default Places;