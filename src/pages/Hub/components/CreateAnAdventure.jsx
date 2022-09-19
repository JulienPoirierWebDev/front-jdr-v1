import React, {useEffect, useState} from "react";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import api_roliste from "../../../services/api_roliste";
import {useNavigate} from "react-router-dom";
import axios from "axios";


const CreateAnAdventure = (props) => {
    const buttonImg1 = props.buttonImg1;
    const [warningNbAdventures, setWarningNbAdventures] = useState("");

    let navigate = useNavigate();
    const [clicked, setClicked] = useState(null);

    let handleCreateAdventure= async () => {
        let data = {"user": "api/users/" + props.payload.id};
        let nbAdventures = await api_roliste.postData(requests.requestAdventureCount, data, props.jwt).catch(function (error) {
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
        });;
        let nbAventuresTest = nbAdventures.data['hydra:member'][0]["adventureSup3"];
        if (nbAventuresTest) {
            setWarningNbAdventures("Vous menez trop d'aventures en même temps. Pour en créer une nouvelle, il vous faut en terminer avec l'une d'entre elles...")
        } else {
            setClicked(true);
        }
    }

    useEffect(() => {
        if(clicked === true) {
            navigate("/creer-une-aventure");
        }
    }, [clicked, navigate]);

    return (

        <div className={"create-button-container"}>
            <p>{warningNbAdventures}</p>
          <button className={"create-button submit-button-wooden"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={handleCreateAdventure}>Creer une aventure</button>
        </div>
    )
}

export default CreateAnAdventure;