import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import functions from "../../services/functions";
import ConnexionAdventure from "./components/ConnexionAdventure";
import CharacterCreation from "./components/CharacterCreation";
import api_roliste from "../../services/api_roliste";
import Title from "../../components/Title";
import requests from "../../services/requests";
import GameZone from "./components/GameZone";

const AdventureAsPlayableCharacter = (props) => {

    const storedJwt = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : null;
    const storedRefreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null
    const [jwt, setJwt] = useState(storedJwt || null);
    const [refreshToken, setRefreshToken] = useState(storedRefreshToken || null);

    const [payload, setPayload] = useState(jwt ? functions.parseJwt(jwt) : "");
    const [adventureId, setAdventureId] = useState();
    const [characterId, setCharacterId] = useState("Waiting");
    const [tooManyPlayers, setTooManyPlayers] = useState(false);

    const [characterObject, setCharacterObject] = useState({});
    const [adventureObject, setAdventureObject] = useState();
    const [messageObject, setMessageObject] = useState();
    const [playerUpdate, setPlayerUpdate] = useState([]);
    const [adventureUpdate, setAdventureUpdate] = useState([]);
    const [messageUpdate, setMessageUpdate] = useState([]);

    const [buttonImg1, setButtonImg1] = useState("\"/media/visuel/plank_15.png\"")




    const [playerPlayableCharacter, setPlayerPlayableCharacter] = useState(null)


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

    // On vérifie si le User a un PlayerCharacter de déja crée.
    const testPlayerCharacter = async () => {

        let adventureIdTemp = ""

        let dataRequestAdventureId = {
            "slug":slug
        }

        let fetchAdventureId = await api_roliste.postData(requests.requestAdventureId, dataRequestAdventureId, jwt).then((result) => {
            adventureIdTemp = result.data["hydra:member"][0].id;
            setAdventureId(result.data["hydra:member"][0].id)
        }).catch((response) => {
            console.log(response)
        })

        let dataRequestPC = {
            "user": "api/users/" + payload.id,
            "adventure": "api/adventures/" + adventureIdTemp
        }
        await api_roliste.postData(requests.requestCheckUserAsPlayerCharacterInAdventure, dataRequestPC,jwt).then(async(response) => {
            if(response.data['hydra:member']) {
                setCharacterId(response.data['hydra:member'][0].id)
                setPlayerPlayableCharacter(response.data['hydra:member'][0])
            }
            let dataRequestDataAdventure = {
                    "slug":slug
                }

                await api_roliste.postData(requests.requestDataAdventure, dataRequestDataAdventure, jwt).then((result) => {
                    return result.data['hydra:member'][0].playerCharacters.length > 5 ? setTooManyPlayers(true) : setTooManyPlayers("ok");

                })
        }).catch(function (error) {
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

    const fetchUpdateItems = async () => {
        await api_roliste.getAllData(requests.requestLastUpdateItem, jwt).then((response) => {
            let dataItems = response.data['hydra:member'];
            dataItems.map((item) => {
                if(item.adventure.id === adventureId){
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
                        default:
                            break;
                }
            }
            })
    }).catch(function (error) {
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

    const testUpdateItems = async () => {
    await api_roliste.getAllData(requests.requestLastUpdateItem, jwt).then((response) => {
            let dataItems = response.data['hydra:member'];
        // eslint-disable-next-line array-callback-return
        if(adventureObject && adventureObject.id){
            dataItems.map((item) => {
                if( item.adventure.id === adventureId){
                    switch (item.lastUpdateType.name) {
                        case 'playerUpdate':
                            if(playerUpdate[1]< item.itemTimeStamp) {
                                fetchPlayablePlayerCharacter()
                                fetchDataOtherCharacters()
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
                        default:
                            break;
                    }
                }
            })
        }
        }).catch(function (error) {
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

    const changeUpdateItem = async (updateItem) => {
        if(updateItem === "playerUpdate"){
            let dateTimeNow = Date.now();

            let dataUpdate = {
                itemTimeStamp: new Date(dateTimeNow),
            };

            console.log(dataUpdate);
            let newUrl = requests.requestLastUpdateItem + "/" + playerUpdate[0];
            await api_roliste.patchData(newUrl, dataUpdate, jwt).then((reponse) => {

                return fetchPlayablePlayerCharacter()
            }).catch(function (error) {
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


        if(updateItem === "messageUpdate"){
            let dateTimeNow = Date.now();

            let dataUpdate = {
                itemTimeStamp: new Date(dateTimeNow),
            };

            console.log(dataUpdate);
            let newUrl = requests.requestLastUpdateItem + "/" + messageUpdate[0];
            await api_roliste.patchData(newUrl, dataUpdate, jwt).then((reponse) => {
                return fetchMessageAdventure()
            }).catch(function (error) {
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

        if(updateItem === "adventureUpdate"){
            let dateTimeNow = Date.now();

            let dataUpdate = {
                itemTimeStamp: new Date(dateTimeNow),
            };

            console.log(dataUpdate);
            let newUrl = requests.requestLastUpdateItem + "/" + adventureUpdate[0];
            await api_roliste.patchData(newUrl, dataUpdate, jwt).then((reponse) => {
                return fetchDataAdventure()
            }).catch(function (error) {
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

    const fetchPlayablePlayerCharacter = async () => {
        let dataRequestPC = {
            "user": "api/users/" + payload.id,
            "adventure": "api/adventures/" + adventureId
        }
        await api_roliste.postData(requests.requestCheckUserAsPlayerCharacterInAdventure, dataRequestPC,jwt).then((response) => {
            if(response.data['hydra:member']) {
                setCharacterId(response.data['hydra:member'][0].id)
                setPlayerPlayableCharacter(response.data['hydra:member'][0])
            }
        }).catch(function (error) {
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

    const fetchDataAdventure = async () => {
        let dataRequestDataAdventure = {
            "slug":slug
        }

        await api_roliste.postData(requests.requestDataAdventure, dataRequestDataAdventure, jwt).then((result) => {
            setAdventureObject(result.data["hydra:member"][0])
        }).catch(function (error) {
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


    const fetchMessageAdventure = async () => {
        let dataRequestMessageAdventure = {
            "slug":slug
        }

        await api_roliste.postData(requests.requestMessagesAdventure, dataRequestMessageAdventure, jwt).then((result) => {
            setMessageObject(result.data["hydra:member"][0])
        }).catch(function (error) {
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

    const fetchDataOtherCharacters = async () => {
        let dataRequestDataCharacters = {
            "adventure": "api/adventures/" + adventureId
        }


        await api_roliste.postData(requests.requestCharactersByAdventure, dataRequestDataCharacters, jwt).then((result) => {
            setCharacterObject(result.data["hydra:member"])
        }).catch(function (error) {
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

    functions.useInterval(() => {
    testUpdateItems();
}, 1000);
/*
    useEffect(() => {
        const interval = setInterval(() => {
            testUpdateItems();
            console.log('This will run every 10 seconds!');
        }, 5000);
        return () => clearInterval(interval);
    }, []);
*/
useEffect(() => {
    if(jwt) {
        testLogged(payload.exp);
        testPlayerCharacter();
    } else {
        navigate("/")
    }
}, [])

    useEffect(() => {
        if(adventureId){
            fetchDataAdventure()
            fetchDataOtherCharacters()
            fetchMessageAdventure()
            fetchPlayablePlayerCharacter()
        }
        }, [adventureId])

    useEffect(() => {
            fetchUpdateItems()

    }, [adventureId])

    return(
        <div className={"body-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/background-bricks.jpg"})`,     backgroundSize: `cover`}}>
            <div className={"app-wrapper"}>
                <div className={"app-container"}>
                    <Title/>
                    <div className={"board-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/woodpanel.svg"})`,     backgroundSize: `cover`}}>
                        <div className={"board-container"}>
                            <ConnexionAdventure jwt={jwt} slug={slug} payload={payload} setAdventureId={(data) => setAdventureId(data)}/>
                {!characterId && tooManyPlayers === "ok" ?
                    <div>
                        <CharacterCreation adventureId={adventureId} playerId={payload.id} jwt={jwt} characterId={characterId} setCharacterId={setCharacterId} testPlayerCharacter={testPlayerCharacter} changeUpdateItem={changeUpdateItem} buttonImg1={buttonImg1}/>
                    </div>: !tooManyPlayers ?
                        <div><p>En attente ... </p></div>
                        :  tooManyPlayers !== "ok"
                            ? <div><p>Il y a trop de joueurs dans cette aventure ... </p></div>
                            : ""}
                {playerPlayableCharacter ?
                    <div>
                        <GameZone
                            adventureId={adventureId}
                            jwt={jwt}
                            characterId={characterId}
                            adventureObject={adventureObject}
                            characterObject={characterObject}
                            playerPlayableCharacter={playerPlayableCharacter}
                            messageObject={messageObject}
                            changeUpdateItem={changeUpdateItem}
                            buttonImg1={buttonImg1}
                        />
                    </div>
                    : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default AdventureAsPlayableCharacter;