import React, {useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import {logDOM} from "@testing-library/react";
import {useNavigate} from "react-router-dom";
import functions from "../../../services/functions";

const ConnectToAnAdventure = ({jwt, payload, buttonImg1}) => {

    const [adventureNameAsPlayerValue, setAdventureNameAsPlayerValue] = useState("");
    const [adventureAsPlayerPasswordValue, setAdventureAsPlayerPasswordValue] = useState("");

    let navigate = useNavigate();

    let connectAdventure = async (event) => {
        event.preventDefault();
        let test = await api_roliste.postData(requests.requestAdventureConnection, {"slug":adventureNameAsPlayerValue, "password":adventureAsPlayerPasswordValue},jwt).then(res => {
            let testValue =  res.data['hydra:member'][0];
            if (testValue) {

                localStorage.setItem(((adventureNameAsPlayerValue).replaceAll(" ", "-").toLowerCase()) + 512, true);
                navigate(("/vivre-une-aventure/" + adventureNameAsPlayerValue))
            } else {
                return console.log("Mauvais mot de passe")
            }
            }
        ).catch(error => {
            console.log(error);
            console.log("Cette aventure n'existe pas")
            }
        )
    }

    const handleChange = (event) => {
        if (event.target.name === "adventureNameAsPlayer") {
            setAdventureNameAsPlayerValue(event.target.value);
        } else if (event.target.name === "adventureAsPlayerPassword") {
            setAdventureAsPlayerPasswordValue(event.target.value);
        }
    }

            return (
                <div className={"center border"}>
                    <form action="">
                        <div className={"form-div"}>
                            <label className={"form-label"}  htmlFor="adventureNameAsPlayer">Nom de l'aventure</label>
                            <input className={"form-input"} type="text" name="adventureNameAsPlayer" value={adventureNameAsPlayerValue}
                                   onChange={handleChange}/>
                        </div>
                        <div className={"form-div"}>
                            <label className={"form-label"}  htmlFor="adventureAsPlayerPassword">Confirmation</label>
                            <input className={"form-input"} type="password" name="adventureAsPlayerPassword"
                                   value={adventureAsPlayerPasswordValue}
                                   onChange={handleChange}/>
                        </div>
                        <button  className={"connect-button submit-button-wooden"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} type="submit" onClick={connectAdventure}>Se connecter en tant que Personnage Joueur !</button>

                    </form>
                </div>
            )
        }



export default ConnectToAnAdventure;