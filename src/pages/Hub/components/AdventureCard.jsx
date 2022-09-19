import React from "react";
import World from "../../../components/World.jsx";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import {useNavigate} from "react-router-dom";



const AdventureCard = ({adventure, buttonImg1, buttonImg2, buttonImg3, backgrounds, compteurBackground}) => {
    let navigate = useNavigate();
    function goToAdventure() {
        navigate("/maitriser-une-aventure/" + adventure.slug)
    }

    return (
        <div className={"world-card"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + backgrounds[compteurBackground]})`, backgroundSize: `cover`}}>
            <h3 className={"div-title world-card-title"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg3})`, backgroundSize: `100% 100%`}}>{adventure.title}</h3>
            <div className={"world-card-content"}>
                <p>{adventure.description}</p>
                <button className={"submit-button-wooden world-card-button"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg2})`, backgroundSize: `100% 100%`}} onClick={goToAdventure}>Reprendre cette aventure</button>
            </div>
        </div>
    )
}

export default AdventureCard;