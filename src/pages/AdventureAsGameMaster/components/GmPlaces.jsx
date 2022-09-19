import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"

const GmPlaces = ({jwt, adventureId, adventureObject}) => {
    const [select, setSelect] = useState("");
    const [placeName, setPlaceName] = useState("");
    const [placeDescription, setPlaceDescription] = useState("");
    const [regionName, setRegionName] = useState("");
    const [regionDescription, setRegionDescription] = useState("");
    const [countryName, setCountryName] = useState("");
    const [countryDescription, setCountryDescription] = useState("");
    const [zoneName, setZoneName] = useState("");
    const [zoneDescription, setZoneDescription] = useState("");

    function handleSelectAllPlaces() {
        if(select === "allPlaces") {
            setSelect("")
        } else {
            setSelect("allPlaces")
        }
    }

    function handleSelectCreatePlaces() {
        if(select === "createPlaces") {
            setSelect("")
        } else {
            setSelect("createPlaces")
        }
    }

    const handlePlaceCreation = () => {
        
        let dataPlace = {
            region: "api/regions/1",
            placeType:"api/place_types/1",
            userWhoCreate:"api/users/" + adventureObject.user.id,
            userCreation:true,
            name:placeName,
            description:placeDescription
        }

        let dataRegion = {
            country: "api/countries/1",
            userWhoCreate:"api/users/" + adventureObject.user.id,
            userCreation:true,
            name:regionName,
            description:regionDescription
        }

        let dataCountry = {
            zone: "api/zone/1",
            userWhoCreate:"api/users/" + adventureObject.user.id,
            userCreation:true,
            name:countryName,
            description:countryDescription
        }

        let dataZone = {
            userWhoCreate:"api/users/" + adventureObject.user.id,
            userCreation:true,
            name:zoneName,
            description:zoneDescription
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
            <h4 onClick={handleSelectCreatePlaces}>Créer un lieu</h4>


        </div>
    )
}

export default GmPlaces;