import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/GmActionsWaiting.css"
import ActionSlot from "./ActionSlot";

import "../../../styles/app.css"

const GmActionsWaiting = ({jwt, adventureObject, actions, characterObject, allNpc, changeUpdateItem, buttonImg1}) => {
    const [groupOfActions, setGroupOfActions] = useState([]);
    const [selectAction, setSelectAction] = useState("");

    function compareDate(a, b) {
        if(new Date(a.dateTimeCreate).getTime() < new Date(b.dateTimeCreate).getTime()) {
            return -1;
        } if(new Date(a.dateTimeCreate).getTime() > new Date(b.dateTimeCreate).getTime()) {
            return 1;
        } else {return 0;}
    }

    function dispatchData() {
        let data = [];

        actions.map((character) => {
            character.playerWhoLaunchItem.map((action) => {
                if(action.gameMasterWaiting === true) {
                return data.push(action)
                }
            })

            character.playerWhoLaunchPower.map((action) => {
                if(action.gameMasterWaiting === true) {
                    return data.push(action)
                }
            })
            character.playerWhoLaunchSkill.map((action) => {
                if(action.gameMasterWaiting === true) {
                    return data.push(action)
                }
            })
            character.spellsInActionsLaunched.map((action) => {
                if(action.gameMasterWaiting === true) {
                    return data.push(action)
                }
            })

        })

        setGroupOfActions(data)
    }

    useEffect(() => {
        if(adventureObject) {
            dispatchData()
        }
    }, [adventureObject, actions])


    return (
        <div className={"actionswaiting-container"} >
            <h3 className={"div-title actionswaiting-title"}>Actions en attente</h3>
            <div className={"actionswaiting-group"}>
            {groupOfActions.sort(compareDate).map((action) => {
                 return <div key={action.id + action.dateTimeCreate}>
                    <ActionSlot
                        changeUpdateItem={changeUpdateItem}
                        adventureObject={adventureObject}
                        jwt={jwt}
                        object={action}
                        selectAction={selectAction}
                        setSelectAction={setSelectAction}
                        id={action.dateTimeCreate}
                        allNpc={allNpc}
                        characterObject={characterObject}
                        type={action["@type"]}
                        targetNpcOnAdventure={action.targetNpc && action.targetNpc.id ? action.targetNpc.id : null}
                        targetNpcId={action.targetNpc && action.targetNpc.id ? action.targetNpc.npc["@id"]:"" }
                        targetNpc={action.targetNpc && action.targetNpc.id ? action.targetNpc.npc.firstName + " " + action.targetNpc.npc.lastName :"" }
                        targetPlayerCharacter={(typeof (action.targetPlayerCharacter)) === "object" ? action.targetPlayerCharacter : action.targetPlayerCharacter }
                        targetPlayerCharacterName={action.targetPlayerCharacterName}
                        targetPlayerCharacterUniqueId={action.targetPlayerCharacterUniqueId}
                        playerLauncher={(action.playerWhoLaunch ? action.playerWhoLaunch :
                            (action.itemInBag ? action.itemInBag.playerCharacter :
                                (action.powerDeveloped ? action.powerDeveloped.playerCharacter :
                                    (action.skillDeveloped ? action.skillDeveloped.playerCharacter : ""))))}
                        name ={(action.itemInBag ? action.itemInBag.item.name :
                            (action.powerDeveloped ? action.powerDeveloped.power.name :
                                (action.skillDeveloped ? action.skillDeveloped.skill.name :
                                    action.spell ? action.spell.name : "")))}
                        description={(action.itemInBag ? action.itemInBag.item.description :
                            (action.powerDeveloped ? action.powerDeveloped.power.description :
                                (action.skillDeveloped ? action.skillDeveloped.skill.description :
                                    action.spell ? action.spell.description : "")))}
                        buttonImg1={buttonImg1}
                    />
                </div>
            })}
            </div>
        </div>
    )
}

export default GmActionsWaiting;