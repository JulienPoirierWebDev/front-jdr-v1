import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/Quests.css"

const Quests = ({jwt, adventureId, adventureObject}) => {
    const [select, setSelect] = useState("");


    function handleSelectAllQuests() {
        if(select === "allQuests") {
            setSelect("")
        } else {
            setSelect("allQuests")
        }
        console.log(select)
    }



    return (
        <div className={"quests-container"} >
            <h3 className={"div-title"}>Quêtes</h3>
            {adventureObject ? adventureObject.questInAdventures.map((quest) => {
                if(quest.focus){
                return <div key={quest.id}>
                    <h4>{quest.quest.name}</h4>
                    <p className={"quests-content"}>{quest.description}</p>
                    <ul>
                        {quest.goalInAdventures.map((goal) => {
                            return <li key={goal.id}>{goal.goal.goalType.name} : {goal.goal.targetItem ? goal.goal.targetItem.name :
                                goal.goal.targetNpc ? goal.goal.targetNpc.name :
                                    goal.goal.targetPlace ? goal.goal.targetPlace.name : ""}</li>
                        })}
                    </ul>
                </div>}}
            ) : ""}


            <h4 className={"div-title quests-sub-title"} onClick={handleSelectAllQuests}>Quêtes non suivies</h4>
            {select === "allQuests" ?
                <div>
                    {adventureObject.questInAdventures.map((quest) => {
                        if(!quest.focus){
                            return <div key={quest.id}>
                                        <h4>{quest.quest.name}</h4>
                                        <p className={"quests-container"}>{quest.description}</p>
                                <ul>
                                    {quest.goalInAdventures.map((goal) => {
                                        return <li>{goal.goal.goalType.name} : {goal.goal.targetItem ? goal.goal.targetItem.name :
                                            goal.goal.targetNpc ? goal.goal.targetNpc.firstName + " " + goal.goal.targetNpc.lastName  :
                                                goal.goal.targetPlace ? goal.goal.targetPlace.name : ""}</li>
                                    })}
                                </ul>
                                    </div>}
                    })}
                </div>
                : ""}
        </div>
    )
}

export default Quests;