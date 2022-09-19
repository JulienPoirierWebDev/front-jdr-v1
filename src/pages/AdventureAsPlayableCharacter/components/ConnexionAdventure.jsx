import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import functions from "../../../services/functions";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";

const ConnexionAdventure = ({slug, jwt, payload, setAdventureId}) => {



    const [adventureAsPlayerPasswordValue, setAdventureAsPlayerPasswordValue] = useState("");
    const [connected, setConnected] = useState("");
    const [question, setQuestion] = useState();
    let navigate = useNavigate();

    let testLogged = (payloadExp) =>  {
        let expirationDate = new Date(payloadExp * 1000);
        let actualDate = Date.now();
        if(actualDate>expirationDate) {
            navigate("/")
        }
    }

    let testConnected = async () => {
        testLogged(payload.exp);
        let testAdventure = localStorage.getItem(slug+"512")
        if(testAdventure) {
            setQuestion(true);      
            await api_roliste.postData(requests.requestAdventureConnection, {"slug":slug, "password":adventureAsPlayerPasswordValue},jwt).then((response) => {
            setAdventureId(response.data["hydra:member"][1])}).catch((error) => {
                console.log(error)
            })

            } else {
            setQuestion(false);
            console.log("ca marche pas")
        }
    }


    let connectAdventure = async (event) => {
        event.preventDefault();
        let response = await api_roliste.postData(requests.requestAdventureConnection, {"slug":slug, "password":adventureAsPlayerPasswordValue},jwt).then((res) => {
                let testValue =  res.data['hydra:member'][0];
                if (testValue) {
                    localStorage.setItem(((slug).replaceAll(" ", "-").toLowerCase()) + 512, true);
                    setConnected(true);
                } else {
                    console.log("Mauvais mot de passe")
                }
            }
        ).catch(error => {
                console.log(error);
                console.log("Cette aventure n'existe pas")
            }
        )
        console.log(response)
    }

    const handleChange = (event) => {
        if (event.target.name === "adventureAsPlayerPassword") {
            setAdventureAsPlayerPasswordValue(functions.escapeHtmlV2(event.target.value));
        }
    }

    useEffect(() => {
        testConnected();
    }, [connected])

    return (
        <div>
            {!question ?                 <form  className={"center border"} action="">
                <div>
                    <label htmlFor="adventureAsPlayerPassword">Confirmation</label>
                    <input type="password" name="adventureAsPlayerPassword"
                           value={adventureAsPlayerPasswordValue}
                           onChange={handleChange}/>
                </div>
                <button type="submit" className={"adventureButton"} onClick={connectAdventure}>Se connecter en tant que Personnage Joueur !</button>
            </form>:""}
        </div>
    )
}

export default ConnexionAdventure;