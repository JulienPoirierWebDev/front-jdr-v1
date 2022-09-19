import React from "react";
import World from "../../../components/World.jsx";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import {useNavigate} from "react-router-dom";


const EmptyCard = ({background, buttonImg1}) => {

    return (
        <div className={"world-card"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + background[4]})`, backgroundSize: `100% 100%`}}>
            <p style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} className={"world-card-empty-content"}>Aventure disponible</p>
        </div>
    )
}

export default EmptyCard;