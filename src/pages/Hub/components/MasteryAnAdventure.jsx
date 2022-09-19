import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import AdventureCard from "./AdventureCard";
import EmptyCard from "./EmptyCard";
import {useNavigate} from "react-router-dom";



const MasteryAnAdventure = ({payload, jwt, buttonImg1, buttonImg2, buttonImg3, backgrounds}) => {


const [adventures, setAdventures] = useState([]);
const [load, setLoad] = useState(false);
const [emptyAdventuresGroup, setEmptyAdventuresGroup] = useState([]);


const navigate = useNavigate();

let compteurBackground = -1;

    /*
        const adventures = [{id: 1, title : "Aventure 1", content: "Balblablablabla"},{id: 2, title : "Aventure 2", content: "Balblablablabla"}];
        const nbAdventures = adventures.length;
        const maxAdventure = 4;
            */

    function testLogged(payloadExp)  {
        let expirationDate = new Date(payloadExp * 1000);
        let actualDate = Date.now();
        if(actualDate>expirationDate) {
            navigate("/")
        }
    }

    const fetchAdventures = async () => {
        testLogged(payload.exp);
        // Si la donnée est déja chargé, on s'arrete là.
        if (!load){
            //lancement de la requeête avec le JWT
        await api_roliste.getOneData(requests.requestAdventureByUser, [["user", payload.id]], jwt).then((response) => {
            setAdventures(response.data['hydra:member'][0]);
            setLoad(true)
        }).catch(function (error) {
            // Gestion des erreurs, comme le préconise la documentation AXIOS
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
        });

        }
    }

    const emptyAdventureFetch = () => {

        let emptyCard = [];
        for (let i =0; i < (4 - adventures.length); i++) {
            emptyCard.push(<EmptyCard buttonImg1={buttonImg1} background={backgrounds} key={i + 1000}/>)
        }
        setEmptyAdventuresGroup(emptyCard);
    }

    useEffect(()=> {
        fetchAdventures();
    })

    useEffect(()=> {
        emptyAdventureFetch()
    }, [load])/*
    for (let i = 0; i<(maxAdventure - nbAdventures); i++) {
        // eslint-disable-next-line no-unused-vars
        emptyAdventures.push(<World real={false}/>);
    }
*/
    return (
        <div className={"mastery"}>
            <h2 className={"div-title mastery-title"}>Mondes crées</h2>
            <div className={"world-container"}>
                {adventures.map((adventure)=> {
                    compteurBackground++
                    return <div key={adventure.id}><AdventureCard adventure={adventure} buttonImg1={buttonImg1} buttonImg2={buttonImg2} buttonImg3={buttonImg3} backgrounds={backgrounds} compteurBackground={compteurBackground}/></div>
                })}

                {emptyAdventuresGroup.map(element => {return element})}
            </div>
        </div>
    )
}

export default MasteryAnAdventure;