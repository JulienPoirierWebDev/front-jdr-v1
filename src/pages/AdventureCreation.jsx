import React, {useState} from "react";
import Title from "../components/Title";
import "../styles/adventureCreation.css"
import functions from "../services/functions";
import api_roliste from "../services/api_roliste";
import requests from "../services/requests";
import {useNavigate} from "react-router-dom";


const AdventureCreation = () => {

    const storedJwt = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : null;
    const storedRefreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null
    const [jwt, setJwt] = useState(storedJwt || null);
    const [refreshToken, setRefreshToken] = useState(storedRefreshToken || null);

    const [payload, setPayload] = useState(jwt ? functions.parseJwt(jwt) : "");

    const [adventureNameValue, setAdventureNameValue] = useState("");
    const [checkAdventureName, setCheckAdventureName] = useState(false);
    const [testAlertAdventureName, setTestAlertAdventureName] = useState(null);
    const [testAlertAdventureNameClass, setTestAlertAdventureNameClass] = useState("");

    const [adventurePasswordValue, setAdventurePasswordValue] = useState("");
    const [adventurePasswordRepeatValue, setAdventurePasswordRepeatValue] = useState("");
    const [testAlertPassword, setTestAlertPassword] = useState(null);
    const [testAlertClass, setTestAlertClass] = useState("invalid");
    const [adventureDescriptionValue, setAdventureDescriptionValue] = useState(
        "Merci de décrire votre aventure ici : il s'agit du premier texte que verrons vos aventuriers... Vous pourrez le modifier par la suite, pour l'actualiser ou réctifier vos erreurs !"
    );
    const [urlForPlayer, setUrlForPlayer] = useState(null);
    const [adventureSlug, setAdventureSlug] = useState(null);

    const [logged, setLogged] = useState();

    const [buttonImg1, setButtonImg1] = useState("\"/media/visuel/plank_15.png\"")



    let navigate = useNavigate();



    function testLogged(payloadExp)  {
        let expirationDate = new Date(payloadExp *1000);
        let actualDate = Date.now();
        if(actualDate>expirationDate) {
            navigate("/")
        } else {
            console.log("logged")}
    }

    if(jwt) {
    testLogged(payload.exp);
    } else {
        navigate("/")
    }

    const handleChange = (event) => {

        if (event.target.name === "adventureName") {
            setAdventureNameValue(event.target.value);
            setAdventureSlug(event.target.value.replaceAll(" ", "-").toLowerCase());
        }
        else if (event.target.name === "adventurePassword") {
            setAdventurePasswordValue(event.target.value);
            if(adventurePasswordRepeatValue && adventurePasswordValue) {
                if(adventurePasswordValue !== adventurePasswordRepeatValue) {
                    setTestAlertPassword("Les mots de passe ne correspondent pas.")
                }
            }
            if(!adventurePasswordValue || !adventurePasswordRepeatValue) {
                setTestAlertPassword("")
            }
        }
        else if (event.target.name === "adventurePasswordRepeat") {
            setAdventurePasswordRepeatValue(event.target.value);
        }
        else if (event.target.name === "adventureDescription") {
            setAdventureDescriptionValue(event.target.value);
        }
    }


    const testPassword = ( ) => {
        if(adventurePasswordRepeatValue && adventurePasswordValue) {
            if(adventurePasswordValue !== adventurePasswordRepeatValue ) {
                setTestAlertPassword("Les mots de passe ne correspondent pas.")
            }
        } else if(adventurePasswordValue === "" || adventurePasswordRepeatValue === "") {
            setTestAlertPassword("")
        } else if(adventurePasswordValue === adventurePasswordRepeatValue ) {
        setTestAlertPassword("")
    }
    }



    const testAdventureName = async () => {
        if(adventureNameValue !== ""){
            setTestAlertAdventureName("");
            let slugToTest = adventureNameValue.replaceAll(" ", "-").toLowerCase();
            console.log(slugToTest)
            await api_roliste.postData(requests.requestAdventureCheck, {"slug": slugToTest}, jwt).then((response) => {
                setCheckAdventureName(response['data']['hydra:member']);
                console.log(response);
                if (!response['data']['hydra:member'][0] && adventureNameValue !== "") {
                    setTestAlertAdventureName("Le nom de cette aventure est disponible");
                    setTestAlertAdventureNameClass("valid");
                    setUrlForPlayer(window.location.origin + "/vivre-une-aventure/"+ slugToTest.toLowerCase());

                } else if( adventureNameValue !== "") {
                    setTestAlertAdventureName("Ce nom d'aventure est déja utilisé");
                    setTestAlertAdventureNameClass("invalid");
                } else {
                    setTestAlertAdventureName("");

                }
            })

        }
    }

    const createAdventure = async () => {

        if(testAlertAdventureName === "Le nom de cette aventure est disponible" && adventurePasswordValue !== "" && (adventurePasswordValue === adventurePasswordRepeatValue)) {

        let data = {
            "user":"api/users/" + payload.id,
            "password":adventurePasswordValue,
            "gameMasterNickName":"Maitre du jeu",
            "title":adventureNameValue,
            "slug":adventureSlug,
            "description":adventureDescriptionValue
        }
        let createAdventurePost = await api_roliste.postData(requests.requestAdventure, data, jwt).then(async (response) => {
            let dataRequestAdventureId = {
                "slug":adventureSlug
            }

            let fetchAdventureId = await api_roliste.postData(requests.requestAdventureId, dataRequestAdventureId, jwt).then( async (result) => {
                let dateTimeNow = Date.now();

                let dataUpdateItem1 = {
                    lastUpdateType: "api/last_update_types/6",
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                    itemTimeStamp:new Date(dateTimeNow)
                }
                let dataUpdateItem2 = {
                    lastUpdateType: "api/last_update_types/7",
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                    itemTimeStamp:new Date(dateTimeNow)
                }
                let dataUpdateItem3 = {
                    lastUpdateType: "api/last_update_types/8",
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                    itemTimeStamp:new Date(dateTimeNow)
                }
                let dataUpdateItem4 = {
                    lastUpdateType: "api/last_update_types/9",
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                    itemTimeStamp:new Date(dateTimeNow)
                }
                let dataFirstPlace = {
                    place:"api/places/1",
                    description: "Ce quartier possède une auberge, une place de marché, des boutiques pour les nobles et des échoppes tenus par les diverses guildes.",
                    actualPlace:true,
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                }

                let dataFirstQuest = {
                    quest:"api/quests/3",
                    description: "Vous êtes à la taverne, un endroit idéal pour rencontrer le peuple, et prendre le pouls du pays. Vous êtes en compagnie de curieux personnages, certains sont des visages connus, d'autres non. Présentez vous pour ceux qui ne vous connaissent pas, ou bien remémorez vous une période charnière de votre relation.",
                    dateTimeCreate:new Date(dateTimeNow),
                    dateTimeUpdate:new Date(dateTimeNow),
                    focus:true,
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                }



                let dataNpc1 = {
                    dateTimeUpdate:new Date(dateTimeNow),
                    npc:"api/npcs/1",
                    description: "Bob est une personne assez banale, il travaille le cuir mais le sien n'est pas épais.",
                    presentOnScene:true,
                    health:5,
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                }

                let dataNpc2 = {
                    dateTimeUpdate:new Date(dateTimeNow),
                    npc:"api/npcs/2",
                    description: "Johnny est une personne peu fréquentable, ne le regardez pas dans les yeux.",
                    presentOnScene:true,
                    health:20,
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                }

                let dataNpc3 = {
                    dateTimeUpdate:new Date(dateTimeNow),
                    npc:"api/npcs/3",
                    description: "Le seigneur Haldo est riche et puissant, il dirige Calente depuis la mort de son cousin il y a 10 ans, sur un champ de bataille. Le peuple semble satisfait de lui, qui n'a guère de velléité guerrière et souhaite installer durablement un climat de paix, propice aux affaires, sur la vallée du Trast.",
                    presentOnScene:true,
                    health:30,
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                }

                let dataNpc4 = {
                    dateTimeUpdate:new Date(dateTimeNow),
                    npc:"api/npcs/4",
                    description: "Leomot est le tavernier du \"La marmotte et le Tonneau\". Il s'occupe de cet endroit depuis sa majorité, depuis vingt ans maintenant. Il apprécie les voyageurs mais peu les aventuriers qui souhaitent profiter des problèmes de la ville pour s'enrichir. La taverne en forme de U est composé d'un rez-de-chaussée et de deux étages, celui-ci est idéalement situé au coeur de la ville. Au rez-de-chaussée, se trouve une salle pouvant contenir 40 personnes. De belles poutres apparentes attestent de la qualité de l'auberge. Devant l'établissement, installées sur du parquet, de belles tables et chaises permettent de se restaurer en contemplant le paysage. Dans cette auberge, on peut rencontrer des veuves fortunées cherchant de la compagnie, de plus la proximité de l'hôtel de ville, permet d'y rencontrer souvent les notables.",
                    presentOnScene:true,
                    health:5,
                    adventure:"api/adventures/" + result.data["hydra:member"][0].id,
                }

                await api_roliste.postData(requests.requestLastUpdateItem,dataUpdateItem1,jwt).catch((error) => {
                    console.log(error)
                });
                await api_roliste.postData(requests.requestLastUpdateItem,dataUpdateItem2,jwt).catch((error) => {
                    console.log(error)
                });
                await api_roliste.postData(requests.requestLastUpdateItem,dataUpdateItem3,jwt).catch((error) => {
                    console.log(error)
                });
                await api_roliste.postData(requests.requestLastUpdateItem,dataUpdateItem4,jwt).catch((error) => {
                    console.log(error)
                });
                await api_roliste.postData(requests.requestVisitedPlace,dataFirstPlace,jwt).catch((error) => {
                    console.log(error)
                });
                await api_roliste.postData(requests.requestQuestInAdventure,dataFirstQuest,jwt).catch((error) => {
                    console.log(error)
                });
                await api_roliste.postData(requests.requestNpcOnAdventure,dataNpc1,jwt).catch((error) => {
                    console.log(error)
                });
                await api_roliste.postData(requests.requestNpcOnAdventure,dataNpc2,jwt).catch((error) => {
                    console.log(error)
                });
                await api_roliste.postData(requests.requestNpcOnAdventure,dataNpc3,jwt).catch((error) => {
                    console.log(error)
                });
                await api_roliste.postData(requests.requestNpcOnAdventure,dataNpc4,jwt).catch((error) => {
                    console.log(error)
                });



            })
        });
        await testAdventureName();
            navigate("/maitriser-une-aventure/" + adventureSlug);
        } else {
            console.log("Non !")
        }
    }

    return (
        <div className={"body-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/background-bricks.jpg"})`,     backgroundSize: `cover`}}>
            <div className={"app-wrapper"}>
                <div className={"app-container"}>
                <Title/>
                <div className={"board-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/woodpanel.svg"})`,     backgroundSize: `cover`}}>
                    <div className={"board-container"}>
                        <div  className={"adventure-creation-form"}>
                            <form action="">
                                <div className={"form-div"}>
                        <label className={"form-label"} htmlFor="adventureName">Nom de l'aventure</label>
                        <input className={"form-input"} type="text" name="adventureName" value={adventureNameValue} onChange={handleChange} onBlur={testAdventureName}/>
                            </div>
                    <div className={"form-div"}>
                        <label className={"form-label"} htmlFor="adventurePassword">Mot de passe</label>
                        <input className={"form-input"} type="password" name="adventurePassword" value={adventurePasswordValue}
                               onChange={handleChange} onBlur={testPassword}/>
                    </div>
                    <div className={"form-div"}>
                        <label className={"form-label"} htmlFor="adventurePasswordRepeat">Confirmation</label>
                        <input className={"form-input"} type="password" name="adventurePasswordRepeat" value={adventurePasswordRepeatValue}
                               onChange={handleChange} onBlur={testPassword}/>
                    </div>
                            </form>
                            <div className={"adventure-creation-form-alert"}>
                                <p className={ testAlertPassword ? testAlertClass : ""}>{testAlertPassword}</p>
                                <p className={testAlertAdventureName ? testAlertAdventureNameClass : ""}>{testAlertAdventureName}</p>
                            </div>



                </div>
                <div className={"adventure-creation-description-div"}>
                    <div>
                        <label className={"form-label"} htmlFor="adventureDescription">Description de votre aventure</label>
                        <textarea className={"adventure-creation-description-input"} name="adventureDescription" id="adventureDescription" cols="30" rows="10" onChange={handleChange} value={adventureDescriptionValue}/>
                    </div>
                </div>
                    <div className={"adventure-creation-invitation-div"}>

                        <p className={"form-label"} htmlFor="adventureInvitations">Login pour vos aventuriers</p>
                        <p  className={`adventure-creation-invitation-link ${urlForPlayer ? "valid" : "" } `}>{adventureSlug} | {adventurePasswordValue} <br/>(pensez bien a noter vos identifiants d'aventure quelque part ...)</p>
                    </div>
                <button className={"submit-button-wooden adventure-creation-button"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={createAdventure}>Créer une aventure !</button>
            </div>
                </div>
            </div>
        </div>
        </div>
            )
}

export default AdventureCreation;