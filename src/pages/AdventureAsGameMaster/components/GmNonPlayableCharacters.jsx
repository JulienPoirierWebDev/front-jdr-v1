import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"
import {use} from "bcrypt/promises";
import NpcSlot from "../../AdventureAsPlayableCharacter/components/NpcSlot";
import Select from "react-select";

const GmNonPlayableCharacters = ({jwt, adventureObject, allNpc, changeUpdateItem, buttonImg1}) => {

    const [npcOnAdventure, setNpcOnAdventure] = useState()
    const [npcOnScene, setNpcOnScene] = useState([]);
    const [select, setSelect] = useState("");

    const [npcNotOnScene, setNpcNotOnScene] = useState([]);

    const [npcStrength, setNpcStrength] = useState([]);
    const [npcStrengthIsLoaded, setNpcStrengthIsLoaded] = useState(false);

    const [npcJob, setNpcJob] = useState([]);
    const [npcJobIsLoaded, setNpcJobIsLoaded] = useState(false);


    const [npcFirstName, setNpcFirstName] = useState();
    const [npcLastName, setNpcLastName] = useState();
    const [npcDescription, setNpcDescription] = useState("Décrivez votre personnage, son rôle, son background ... Cette description sera modifiable");

    const [npcStrengthChoosed, setNpcStrengthChoosed] = useState();
    const [npcJobChoosed, setNpcJobChoosed] = useState();




    function dispatchData() {
        let data = [];
        let data2 = []
        if(Array.isArray(npcOnAdventure)){
            let map = npcOnAdventure.map((npc) => {
                if(npc.presentOnScene) {
                    return data.push(npc)
                } else {
                    return data2.push(npc)
                }
                 }
            )
            setNpcOnScene(data);
            setNpcNotOnScene(data2)
        }
    }

    const fetchNpcStrength = async () => {
        await api_roliste.getAllData(requests.requestNpcStrength, jwt).then((response) => {
            setNpcStrength(response.data["hydra:member"]);
        })
    }

    function optionNpcStrength() {
        let options = [];
        if(npcStrength && Array.isArray(npcStrength)){
            npcStrength.map((strength) => {
                return options.push({value:strength.id, label:strength.name})
            } )
        }

        console.log(options)

        return options;
    }

    function handleChangeSelectNpcStrength(event) {
        setNpcStrengthChoosed(event.value)
    }

    const fetchNpcJob = async () => {
        await api_roliste.getAllData(requests.requestNpcJob, jwt).then((response) => {
            setNpcJob(response.data["hydra:member"]);
        })
    }

    function optionNpcJob() {
        let options = [];
        if(npcJob && Array.isArray(npcJob)){
            npcJob.map((job) => {
                return options.push({value:job.id, label:job.name})
            } )
        }

        console.log(options)

        return options;
    }

    const handleNpcCreation = async () => {
        let xpReward = "";
        switch (npcStrengthChoosed) {
            case 1 :
                xpReward=1;
                break;
            case 2 :
                xpReward = 2;
                break;
            case 3 :
                xpReward = 4;
                break;
            case 4 :
                xpReward = 10;
                break;
            case 5 :
                xpReward = 15;
                break;
            case 6 :
                xpReward = 25;
                break;
            case 7 :
                xpReward = 40;
                break;
            case 8 :
                xpReward = 60;
                break;
        }


        let dataNpcCreation = {
            npcStrength:"api/npc_strengths/" + npcStrengthChoosed,
            npcJob:"api/npc_jobs/" + npcJobChoosed,
            userWhoCreate:"api/users/" + adventureObject.user.id,
            userCreation:true,
            xpReward:xpReward,
            firstName:functions.escapeHtmlV2(npcFirstName),
            lastName:functions.escapeHtmlV2(npcLastName),
            description:functions.escapeHtmlV2(npcDescription)
        }

        await api_roliste.postData(requests.requestNpc, dataNpcCreation, jwt).then((response) => {
            setNpcLastName("");
            setNpcFirstName("");
            setNpcDescription("Décrivez votre personnage, son rôle, son background ... Cette description sera modifiable");
            setSelect("");
            changeUpdateItem("calatogUpdate");
        })
    }

    function handleChangeSelectNpcJob(event) {
        setNpcJobChoosed(event.value)
    }

    function handleSelectNpcOnScene() {
        if(select === "npcOnScene") {
            setSelect("")
        } else {
            setSelect("npcOnScene")
        }
    }

    function handleSelectNpcNotOnScene() {
        if(select === "npcNotOnScene") {
            setSelect("")
        } else {
            setSelect("npcNotOnScene")
        }
    }

    function handleSelectNpcNotInAdventure() {
        if(select === "npcNotInAdventure") {
            setSelect("")
        } else {
            setSelect("npcNotInAdventure")
        }
    }

    function handleSelectCreateNpc() {
        if(select === "createNpc") {
            setSelect("")
        } else {
            setSelect("createNpc")
        }
    }

    useEffect(() => {
        if(adventureObject) {
        setNpcOnAdventure(adventureObject.npcOnAdventures)
        }
    }, [adventureObject])

    useEffect(() => {
        if(npcOnAdventure) {
            dispatchData()
        }
    }, [npcOnAdventure])

    useEffect(() => {
        if(!npcStrengthIsLoaded) {
            fetchNpcStrength()
        }
        if(!npcJobIsLoaded) {
            fetchNpcJob()
        }
    }, [])


    function handleChange(event) {
        if (event.target.name === "npcFirstName") {
            setNpcFirstName(event.target.value)
        } else if (event.target.name === "npcLastName") {
            setNpcLastName(event.target.value)
        } else if (event.target.name === "npcDescription") {
            setNpcDescription(event.target.value)
        }
    }

    return (
        <div className={"gm_npc"}>
            <h2  className={"div-title"} onClick={handleSelectNpcOnScene}>Npc dans la scène</h2>
            {select === "npcOnScene" ?
                <div className={"npc-container"}>
                    {npcOnScene.map(npcOnScene =>
                        <div key={npcOnScene.id}>
                            <NpcSlot jwt={jwt} adventureId={adventureObject.id} npcOnAdventureId={npcOnScene.id}
                                     npcId={npcOnScene.npc.id} firstName={npcOnScene.npc.firstName}
                                     lastName={npcOnScene.npc.lastName} job={npcOnScene.npc.npcJob.name}
                                     strength={npcOnScene.npc.npcStrength.name} scene={"in"}
                                     health={npcOnScene.health}
                                     changeUpdateItem={changeUpdateItem}
                                     buttonImg1={buttonImg1}
                            />
                        </div>
                    )
                    }</div>:""}

            {npcNotOnScene.length > 0 ?
            <h2  className={"div-title"} onClick={handleSelectNpcNotOnScene}>Npc de l'aventure absent de la scène</h2> : ""}

            {select === "npcNotOnScene" ?
                <div className={"npc-container"}>
                    {npcNotOnScene.map(npc =>
                    <div  key={npc.id}>
                        <NpcSlot jwt={jwt}  adventureId={adventureObject.id} npcOnAdventureId={npc.id} npcId={npc.npc.id} firstName={npc.npc.firstName} lastName={npc.npc.lastName} job={npc.npc.npcJob.name} strength={npc.npc.npcStrength.name} scene={"off"} health={npc.health} changeUpdateItem={changeUpdateItem}                         buttonImg1={buttonImg1}
                        />
                    </div>
                    )}
                </div>:""}


            <h2  className={"div-title"} onClick={handleSelectNpcNotInAdventure}>Ajouter un NPC dans l'aventure</h2>
                {select === "npcNotInAdventure" ?
                    <div className={"npc-container"}>
                        {allNpc ? allNpc.map(npc =>
                <div key={npc.id}>
                    <NpcSlot
                        jwt={jwt}
                        firstName={npc.firstName}
                        lastName={npc.lastName}
                        isGm={true}
                        job={npc.npcJob.name}
                        strength={npc.npcStrength.name}
                        description={npc.description}
                        adventureId={adventureObject.id}
                        npcId={npc.id}
                        npcStrength={npc.npcStrength.id}
                        changeUpdateItem={changeUpdateItem}
                        buttonImg1={buttonImg1}
                    />
                </div>):""} </div>:""}

            <h2 className={"div-title"} onClick={handleSelectCreateNpc}>Créer un PNJ</h2>

            {select === "createNpc" ?
            <div className={"npc-container"}>

                <div className={"npc-creation-div"}>
                    <label className={"npc-creation-label"} htmlFor="npcFirstName">Prénom du personnage</label>
                    <input className={"npc-creation-input"} name={"npcFirstName"} type="text" onChange={handleChange} value={npcFirstName}/>
                </div>
                <div className={"npc-creation-div"}>
                    <label className={"npc-creation-label"}  htmlFor="npcLastName">Nom du personnage</label>
                    <input className={"npc-creation-input"} name={"npcLastName"} type="text" onChange={handleChange} value={npcLastName}/>
                </div>
                <Select placeholder={"Choisissez la force de votre PNJ"} options={optionNpcStrength()} onChange={handleChangeSelectNpcStrength} name={"strengthSelected"} className="select-stregth"/>
                <Select placeholder={"Choisissez l'activité de votre PNJ"} options={optionNpcJob()} onChange={handleChangeSelectNpcJob} name={"jobSelected"} className="select-job"/>
                <div className={"npc-creation-textarea-div"}>
                    <label className={"npc-creation-label"} htmlFor="npcDescription">Description du PNJ</label>
                    <textarea className={"npc-creation-textarea-input"} name="npcDescription" id="npcDescription" cols="60" rows="10" onChange={handleChange} value={npcDescription}/>
                </div>
                <button className={"submit-button-wooden npc-creation-button-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={handleNpcCreation}>Donner vie au personnage</button>

            </div>
                :""}
        </div>
    )
}

export default GmNonPlayableCharacters;