import React, {useEffect, useState} from "react";
import Title from "../../components/Title";
import CreateAnAdventure from "./components/CreateAnAdventure";
import ConnectToAnAdventure from "./components/ConnectToAnAdventure";
import MasteryAnAdventure from "./components/MasteryAnAdventure";
import "../../styles/app.css"
import "../../styles/hub.css"

import requests from "../../services/requests";
import functions from "../../services/functions";
import api_roliste from "../../services/api_roliste";
import {useNavigate} from "react-router-dom";
import axios from "axios";


const Hub = () => {

    const storedJwt = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : null;
    const storedRefreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null
    const [jwt, setJwt] = useState(storedJwt || null);
    const [refreshToken, setRefreshToken] = useState(storedRefreshToken || null);
    const [payload, setPayload] = useState(jwt ? functions.parseJwt(jwt) : "");
    const [buttonImg1, setButtonImg1] = useState("\"/media/visuel/plank_15.png\"")
    const [buttonImg2, setButtonImg2] = useState("\"/media/visuel/bt_03_b.png\"")
    const [buttonImg3, setButtonImg3] = useState("\"/media/visuel/bt_04_b.png\"")
    const [background1, setBackground1] = useState("\"/media/visuel/bg_01.png\"")
    const [background2, setBackground2] = useState("\"/media/visuel/bg_02.png\"")
    const [background3, setBackground3] = useState("\"/media/visuel/bg_03.png\"")
    const [background4, setBackground4] = useState("\"/media/visuel/bg_04.png\"")
    const [background5, setBackground5] = useState("\"/media/visuel/planks.png\"")

    let navigate = useNavigate();


//On vérifie que le token qui a servi pour le payload n'est pas expiré
    function testLogged(payloadExp)  {
        let expirationDate = new Date(payloadExp * 1000);
        let actualDate = Date.now();
        if(actualDate>expirationDate) {
            navigate("/")
        }
    }

    // On vérifie systématiquement que le token JWT est expiré.
    useEffect(() => {
        if(jwt) {
        testLogged(payload.exp);
        } else {
            navigate("/")
        }
    }, [])

    return (
        <div className={"body-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/background-bricks.jpg"})`,     backgroundSize: `cover`}}>
            <div className={"app-wrapper"}>
                <div className={"app-container"}>
                    <Title/>
                    <div className={"board-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/woodpanel.svg"})`,     backgroundSize: `cover`}}>
                        <div className={"board-container"}>
                            <div className={"hub-container"}>
                                <div className={"create-or-connect-container"}>
                                    <CreateAnAdventure payload={payload} jwt={jwt} buttonImg={buttonImg1} buttonImg1={buttonImg1}/>
                                    <ConnectToAnAdventure payload={payload} jwt={jwt} buttonImg1={buttonImg1}/>
                                </div>
                                <div  className={"mastery-container"}>
                                    <MasteryAnAdventure payload={payload} jwt={jwt} buttonImg1={buttonImg1} buttonImg2={buttonImg2} buttonImg3={buttonImg3} backgrounds={[background1, background2, background3, background4, background5]}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hub;