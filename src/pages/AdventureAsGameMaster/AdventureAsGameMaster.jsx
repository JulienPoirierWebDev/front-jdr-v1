import React, {useEffect, useState} from "react";
import functions from "../../services/functions";
import {useNavigate, useParams} from "react-router-dom";
import api_roliste from "../../services/api_roliste";
import requests from "../../services/requests";
import MasteryZone from "./components/MasteryZone";
import Title from "../../components/Title";

const AdventureAsGameMaster = () => {

    const storedJwt = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : null;
    const storedRefreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null
    const [jwt, setJwt] = useState(storedJwt || null);
    const [refreshToken, setRefreshToken] = useState(storedRefreshToken || null);
    const [loaded, setLoaded] = useState(false);

    const [payload, setPayload] = useState(jwt ? functions.parseJwt(jwt) : "");

    const [characterObject, setCharacterObject] = useState({});
    const [adventureObject, setAdventureObject] = useState();
    const [messageObject, setMessageObject] = useState();
    const [allNpc, setAllNpc] = useState([]);
    const [actions, setActions] = useState([]);


    const [playerUpdate, setPlayerUpdate] = useState([]);
    const [adventureUpdate, setAdventureUpdate] = useState([]);
    const [messageUpdate, setMessageUpdate] = useState([]);
    const [catalogUpdate, setCatalogUpdate] = useState([]);

    const [buttonImg1, setButtonImg1] = useState("\"/media/visuel/plank_15.png\"")



    const {slug} = useParams();
    let navigate = useNavigate();

    //On vérifie que le token qui a servi pour le payload n'est pas expiré
    function testLogged(payloadExp)  {
        let expirationDate = new Date(payloadExp * 1000);
        let actualDate = Date.now();
        if(actualDate>expirationDate) {
            navigate("/")
        }
    }

    function testIsGameMaster(){
        if(adventureObject.user.id !== payload.id){
            navigate("/")
        }
    }

    const fetchUpdateItems = async () => {
        await api_roliste.getAllData(requests.requestLastUpdateItem, jwt).then((response) => {
            let dataItems = response.data['hydra:member'];
            dataItems.map((item) => {
                if(item.adventure.id === adventureObject.id){
                    switch (item.lastUpdateType.name) {
                        case 'playerUpdate':
                            setPlayerUpdate([item.id, item.itemTimeStamp])
                            break;
                        case 'messageUpdate':
                            setMessageUpdate([item.id, item.itemTimeStamp])
                            break
                        case 'adventureUpdate':
                            setAdventureUpdate([item.id, item.itemTimeStamp])
                            break;
                        case 'catalogUpdate':
                            setCatalogUpdate([item.id, item.itemTimeStamp])
                            break;
                        default:
                            break;
                    }
                }
            })
        })
    }

    const testUpdateItems = async () => {
        await api_roliste.getAllData(requests.requestLastUpdateItem, jwt).then((response) => {
            let dataItems = response.data['hydra:member'];
            dataItems.map((item) => {
                if( item.adventure.id === adventureObject.id){
                    switch (item.lastUpdateType.name) {
                        case 'playerUpdate':
                            if(playerUpdate[1] < item.itemTimeStamp) {
                                fetchDataCharacters()
                                fetchActions()
                                fetchUpdateItems()
                            }
                            break;
                        case 'messageUpdate':
                            if(messageUpdate[1] < item.itemTimeStamp) {
                                fetchMessageAdventure()
                                fetchUpdateItems()
                            }
                            break;
                        case 'adventureUpdate':
                            if(adventureUpdate[1] < item.itemTimeStamp) {
                                fetchDataAdventure()
                                fetchUpdateItems()
                            }
                            break;
                        case 'catalogUpdate':
                            if(catalogUpdate[1] < item.itemTimeStamp) {
                                fetchDataAdventure()
                                fetchUpdateItems()
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
        }).catch((error) => {
            console.log(error)
            navigate("/")
        })

    }

    const changeUpdateItem = async (updateItem) => {
        if(updateItem === "playerUpdate"){
            let dateTimeNow = Date.now();

            let dataUpdate = {
                itemTimeStamp: new Date(dateTimeNow),
            };

            let newUrl = requests.requestLastUpdateItem + "/" + playerUpdate[0];
            await api_roliste.patchData(newUrl, dataUpdate, jwt).then((reponse) => {

                return fetchDataCharacters()
            })
        }


        if(updateItem === "messageUpdate"){
            let dateTimeNow = Date.now();

            let dataUpdate = {
                itemTimeStamp: new Date(dateTimeNow),
            };

            let newUrl = requests.requestLastUpdateItem + "/" + messageUpdate[0];
            await api_roliste.patchData(newUrl, dataUpdate, jwt).then((reponse) => {
                return fetchMessageAdventure()
            })
        }

        if(updateItem === "adventureUpdate"){
            let dateTimeNow = Date.now();

            let dataUpdate = {
                itemTimeStamp: new Date(dateTimeNow),
            };

            let newUrl = requests.requestLastUpdateItem + "/" + adventureUpdate[0];
            await api_roliste.patchData(newUrl, dataUpdate, jwt).then((reponse) => {
                return fetchDataAdventure()
            })
        }


        if(updateItem === "calatogUpdate"){
            let dateTimeNow = Date.now();

            let dataUpdate = {
                itemTimeStamp: new Date(dateTimeNow),
            };

            let newUrl = requests.requestLastUpdateItem + "/" + catalogUpdate[0];
            await api_roliste.patchData(newUrl, dataUpdate, jwt).then((reponse) => {
                return fetchAllNpc()
            })
        }
    }


    const fetchDataAdventure = async () => {
        let dataRequestDataAdventure = {
            "slug":slug
        }

        await api_roliste.postData(requests.requestDataAdventure, dataRequestDataAdventure, jwt).then((result) => {
            setAdventureObject(result.data["hydra:member"][0])
            setLoaded(true)
        })
    }

    const fetchDataCharacters = async () => {
        let dataRequestDataCharacters = {
            "adventure": "api/adventures/" + adventureObject.id
        }

        await api_roliste.postData(requests.requestCharactersByAdventure, dataRequestDataCharacters, jwt).then((result) => {
            setCharacterObject(result.data["hydra:member"])
        })
    }

    const fetchMessageAdventure = async () => {
        let dataRequestMessageAdventure = {
            "slug":slug
        }
        await api_roliste.postData(requests.requestMessagesAdventure, dataRequestMessageAdventure, jwt).then((result) => {
            setMessageObject(result.data["hydra:member"][0])
        })
    }

    const fetchAllNpc = async () => {
        await api_roliste.getAllData(requests.requestNpc, jwt).then((result) => {
            setAllNpc(result.data["hydra:member"])
        })
    }


    const fetchActions = async () => {
        let dataRequestActionsAdventure = {
            "adventure": "api/adventures/" + adventureObject.id
        }
        await api_roliste.postData(requests.requestDataActions,dataRequestActionsAdventure, jwt).then((result) => {
            setActions(result.data["hydra:member"])
        })

    }

/*
    const fetchActions = async () => {
        let dataRequestActionsAdventure = {
            "adventure": "api/adventures/" + adventureObject.id
        }
        let data = []
        await api_roliste.getAllData(requests.requestSkillInAction, jwt).then((result) => {
            result.data["hydra:member"].map(action => data.push(action))
        })
        await api_roliste.getAllData(requests.requestItemInAction, jwt).then((result) => {
            result.data["hydra:member"].map(action => data.push(action))
        })
        await api_roliste.getAllData(requests.requestPowerInAction, jwt).then((result) => {
            result.data["hydra:member"].map(action => data.push(action))
        })
        await api_roliste.getAllData(requests.requestSpellInAction, jwt).then((result) => {
            result.data["hydra:member"].map(action => data.push(action))
        })

        setActions(data)

    }

*/



    useEffect(()=>{
        if(jwt) {
        testLogged(payload.exp);
    } else {
        navigate("/")
    }

        if(!loaded) {
            fetchDataAdventure()
        }
    },[])

useEffect(() => {
    if(adventureObject){
        fetchDataCharacters()
        fetchMessageAdventure()
        fetchUpdateItems()
        testIsGameMaster()
        fetchAllNpc()
        fetchActions()


    }}, [adventureObject])


    functions.useInterval(() => {
        if(adventureObject){
        testUpdateItems();
        console.log('This will run every 10 seconds!')}}, 10000);

    return (
        <div className={"body-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/background-bricks.jpg"})`,     backgroundSize: `cover`}}>
            <div className={"app-wrapper"}>
                <div className={"app-container"}>
                    <Title/>
                    <div className={"board-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/woodpanel.svg"})`,     backgroundSize: `cover`}}>
                        <div className={"board-container"}>
                        {adventureObject && adventureObject.id ?
                        <MasteryZone
                            adventureObject={adventureObject}
                            jwt={jwt}
                            characterObject={characterObject}
                            messageObject={messageObject}
                            allNpc={allNpc}
                            changeUpdateItem={changeUpdateItem}
                            actions={actions}
                            payload={payload}
                            buttonImg1={buttonImg1}
                        /> : "" }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default AdventureAsGameMaster;