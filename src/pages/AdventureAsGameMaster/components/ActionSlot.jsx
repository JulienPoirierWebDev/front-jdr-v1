import React, {useEffect, useState} from "react";
import "../../../styles/CharacterResume.css"
import "../../../styles/app.css"
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import {specialChars} from "@testing-library/user-event";



const ActionSlot = ({allNpc, type, targetNpc, targetPlayerCharacter, playerLauncher, characterObject, name, description, targetNpcId, id, selectAction, setSelectAction, object, jwt, adventureObject, changeUpdateItem, targetPlayerCharacterUniqueId, targetPlayerCharacterName, targetNpcOnAdventure, buttonImg1}) => {

    function handleSelectDescription() {
        if(selectAction === ("description" + id)) {
            setSelectAction("")
        } else {
            setSelectAction(("description" + id))
        }
    }

    let typeAction = "";
    let typeActionMessage = "";


    switch (type) {
        case "ItemInAction" :
            typeAction = "Utilisation d'objet";
            typeActionMessage = "L'utilisation de l'objet";
            break;
        case "SpellInAction" :
            typeAction = "Lancement de sort";
            typeActionMessage = "Le lancement de sort";
            break;
        case "SkillInAction" :
            typeAction = "Utilisation de compétence";
            typeActionMessage = "L'utilisation de compétence";
            break;
        case "PowerInAction" :
            typeAction = "Utilisation de pouvoir";
            typeActionMessage = "L'utilisation du pouvoir";
            break;
    }

    const handleActionSuccess = async(event) => {
        // Pour les sorts :
        if(type === "SpellInAction" ){

                // On récupère un array contenant les données sur les points de magie du personnage
             let magicPointsArray = characterObject.map((character) => {
                 if(character["@id"] === playerLauncher){
                     return character.caracteristics.map((caracteristic) => {
                         if(caracteristic.caracteristicType.name === "magic") {
                             return caracteristic.value;
                         }
                     })
                 }
             });
// On filtre cet array pour supprimer les élements null.
            let magicPoints = magicPointsArray.filter(n => n)[0].filter(n => n);
            // Si le niveau du sort est sup aux points de magie du personnage, on refuse l'action pour ce motif.
            if(object.spell.level > magicPoints){
                let targetPlayerCharacterForData = null;
                let targetNpcForData = null;
                if(targetPlayerCharacterUniqueId){
                    targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
                }
                if(targetNpc) {
                    targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
                }

                let data = {
                    spell:"api/spells/"+ object.spell.id,
                    targetPlayerCharacter: targetPlayerCharacterForData,
                    targetNpc: targetNpcForData,
                    dateTimeCreate: object.dateTimeCreate,
                    dateTimeUpdate: new Date(Date.now()),
                    gameMasterWaiting: false,
                    gameMasterValidation: false,
                    playerWhoLaunch: playerLauncher,
                    targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                    targetPlayerCharacterName:targetPlayerCharacterName
                }



                await api_roliste.patchData(requests.requestSpellInAction + "/" + object.id, data, jwt).then(async (response) => {
                    // On signale la MAJ d'une donnée joueur
                    changeUpdateItem("playerUpdate")
                    // On prepare le message de refus
                    let nameOfLauncher = characterObject.map((character) => {
                        if(character["@id"] === playerLauncher){
                            return character.name
                        }
                    })

                    let targetMessage = targetPlayerCharacterName ? targetPlayerCharacterName : targetNpc

                    let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetMessage + " a échoué car le nombre de points de magie est insuffisant !"
                    let dataMessage = {
                        adventure:"api/adventures/" + adventureObject.id,
                        content:messageContent.replace(/,+/g,''),
                        isPlayerMessage:false,
                        dateTimeCreate: new Date(Date.now()),
                        gameMasterOnly: false,
                        targetPlayerCharacter:null,
                        playerCharacter:null,
                        nameOfSpeaker:null,
                        isSystemMessage:true,
                        npcReceiver:null,
                        npcWhoSpeak:null
                    }

                    // Envoi du message de refus
                    await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                        changeUpdateItem("messageUpdate");

                    }).catch((error) => {
                        console.log(error)
                    })
                })} else {
                    // Si le personnage a assez de points de magie
                    let caracteristicTypeMagicId = "";
                    let magicCaracteristicIdArray = characterObject.map((character) => {
                            if(character["@id"] === playerLauncher){
                                return character.caracteristics.map((caracteristic) => {
                                    if(caracteristic.caracteristicType.name === "magic") {
                                        caracteristicTypeMagicId = caracteristic.caracteristicType.id;
                                        return caracteristic.id;
                                    }
                                })
                            }
                        })
                    ;

                    let magicCaracteristicId = magicCaracteristicIdArray.filter(n => n)[0].filter(n => n)[0]
                    // On calcul le nouveau nombre de points de magie
                    let newValue = magicPoints - object.spell.level;

                    // On prépare les données pour envoyer la nouvelle valeur de la caractéristique magie.
                    let dataCaracteristic = {
                        playerCharacter: playerLauncher,
                        caracteristicType:"api/caracteristic_types/" + caracteristicTypeMagicId,
                        value: newValue
                    }

                    // On met a jour
                    await api_roliste.patchData(requests.requestCaracteristic + "/" + magicCaracteristicId, dataCaracteristic,jwt);

                   // Si il y a un modificateur d'une caractéristique dans le sort.

                    if(object.spell.modifier !== 0) {

                    let target = [object.targetNpc ? object.targetNpc : object.targetPlayerCharacter, object.targetNpc ? "npc" : "player" ];
                    // Si la cible est un personnage non joueur.
                    if(target[1] === "npc") {
                        // On calcule ses nouveaux points de vie : pour l'instant, il n'y a pas de sorts visant d'autres caractéristiques.
                        let newHealth = target[0].health + object.spell.modifier < 0 ? 0 : target[0].health + object.spell.modifier;
                        // preparation des données.
                        let data = {
                            adventure: "api/adventures/" + adventureObject.id,
                            npc: targetNpcId,
                            description:target[0].description,
                            presentOnScene: target[0].presentOnScene,
                            health:newHealth
                        }
                        // Mise a jour
                        await api_roliste.patchData(requests.requestNpcOnAdventure + "/" + object.targetNpc.id, data, jwt).then(async (response) => {
                            // Préparation des données pour mettre a jour comme accepté et traité le SpellInAction
                            let data = {
                                spell:"api/spells/"+ object.spell.id,
                                targetPlayerCharacter: null,
                                targetNpc: "api/npc_on_adventures/" + targetNpcOnAdventure,
                                dateTimeCreate: object.dateTimeCreate,
                                dateTimeUpdate: new Date(Date.now()),
                                gameMasterWaiting: false,
                                gameMasterValidation: true,
                                playerWhoLaunch: playerLauncher,
                                targetPlayerCharacterUniqueId:null,
                                targetPlayerCharacterName:null
                            }

                            // Mise a jour du SpellInAction
                            await api_roliste.patchData(requests.requestSpellInAction + "/" + object.id, data, jwt).then(async (response) => {
                                changeUpdateItem("playerUpdate")
                                // ajouter message systeme de reussite
                                let nameOfLauncher = characterObject.map((character) => {
                                    if(character["@id"] === playerLauncher){
                                        return character.name
                                    }
                                })
                                // Preparation du message
                                let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetNpc + " est une réussite !"
                                let dataMessage = {
                                    adventure:"api/adventures/" + adventureObject.id,
                                    content:messageContent.replace(/,+/g,''),
                                    isPlayerMessage:false,
                                    dateTimeCreate: new Date(Date.now()),
                                    gameMasterOnly: false,
                                    targetPlayerCharacter:null,
                                    playerCharacter:null,
                                    nameOfSpeaker:null,
                                    isSystemMessage:true,
                                    npcReceiver:null,
                                    npcWhoSpeak:null
                                }

                                // Envoi du message
                                await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                                    changeUpdateItem("messageUpdate");

                                }).catch((error) => {
                                    console.log(error)
                                })

                            })
                        })
                    }
                    // Si la cible est un joueur
                    else if(target[1] === "player") {
                        // Identification de la caractéristique ciblé par le sort
                        let caracteristicTypeTarget = object.spell.caracteristicType.id;
                        let caracteristicOfPlayerTarget = [];
                        characterObject.map((character) => {
                            console.log(character)
                            if(character.id === targetPlayerCharacterUniqueId){
                                character.caracteristics.map((oneCaracteristic) => {
                                    if(oneCaracteristic.caracteristicType.id === caracteristicTypeTarget) {
                                        caracteristicOfPlayerTarget = [oneCaracteristic.id, oneCaracteristic.value];
                                    }
                                })
                            }
                        })
                        // Calcul de la valeur de la nouvelle caractéristique
                        let newCaracteristicOfPlayerValue = caracteristicOfPlayerTarget[1] + object.spell.modifier < 0 ? 0 : caracteristicOfPlayerTarget[1] + object.spell.modifier;
                        //Préparation des données pour la MAJ de la valeur de la caractéristique.
                        let data = {
                            playerCharacter: "api/player_characters/" + targetPlayerCharacterUniqueId,
                            caracteristicType:"api/caracteristic_types/" + caracteristicTypeTarget,
                            value:newCaracteristicOfPlayerValue
                        }
                        // envoi de la requête
                        await api_roliste.patchData(requests.requestCaracteristic + "/" + caracteristicOfPlayerTarget[0], data, jwt).then(async(response) => {
                            // préparation des données du spellInAction
                            let data = {
                                spell:"api/spells/"+ object.spell.id,
                                targetPlayerCharacter: "api/player_characters/" + targetPlayerCharacterUniqueId,
                                targetNpc: null,
                                dateTimeCreate: object.dateTimeCreate,
                                dateTimeUpdate: new Date(Date.now()),
                                gameMasterWaiting: false,
                                gameMasterValidation: true,
                                playerWhoLaunch: playerLauncher,
                                targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                                targetPlayerCharacterName:targetPlayerCharacterName
                            }
                            // envoi de la requête
                            await api_roliste.patchData(requests.requestSpellInAction + "/" + object.id, data, jwt).then(async (response) => {
                                changeUpdateItem("playerUpdate")
                                // ajouter message systeme de reussite
                                let nameOfLauncher = characterObject.map((character) => {
                                    if(character["@id"] === playerLauncher){
                                        return character.name
                                    }
                                })
                                // preparation du message
                                let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetPlayerCharacterName + " est une réussite !"
                                let dataMessage = {
                                    adventure:"api/adventures/" + adventureObject.id,
                                    content:messageContent.replace(/,+/g,''),
                                    isPlayerMessage:false,
                                    dateTimeCreate: new Date(Date.now()),
                                    gameMasterOnly: false,
                                    targetPlayerCharacter:null,
                                    playerCharacter:null,
                                    nameOfSpeaker:null,
                                    isSystemMessage:true,
                                    npcReceiver:null,
                                    npcWhoSpeak:null
                                }

                                //Envoio du message
                                await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                                    changeUpdateItem("messageUpdate");

                                }).catch((error) => {
                                    console.log(error)
                                })

                            })
                        })
                    }
                } else  {
                    // si le sort n'a pas de modificateur de caractéristique
                    let targetPlayerCharacterForData = null;
                    let targetNpcForData = null;
                    // gestion de la cible : si NPC ou joueur
                    if(targetPlayerCharacterUniqueId){
                        targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
                    }
                    if(targetNpc) {
                        targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
                    }
                    // préparation des données du spellInAction
                    let data = {
                        spell:"api/spells/"+ object.spell.id,
                        targetPlayerCharacter: targetPlayerCharacterForData,
                        targetNpc: targetNpcForData,
                        dateTimeCreate: object.dateTimeCreate,
                        dateTimeUpdate: new Date(Date.now()),
                        gameMasterWaiting: false,
                        gameMasterValidation: true,
                        playerWhoLaunch: playerLauncher,
                        targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                        targetPlayerCharacterName:targetPlayerCharacterName
                    }
                    // envoi de la requete
                    await api_roliste.patchData(requests.requestSpellInAction + "/" + object.id, data, jwt).then(async (response) => {
                        changeUpdateItem("playerUpdate")
                            let nameOfLauncher = characterObject.map((character) => {
                                if(character["@id"] === playerLauncher){
                                    return character.name
                                }
                            })
                            // Preparation du message, en prenant en compte la cible PNJ ou Joueur
                            let messageContent = ""

                            if(targetPlayerCharacterUniqueId){
                                messageContent =  typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetPlayerCharacterName + " est une réussite !"
                            }
                            if(targetNpc) {
                                messageContent =  typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetNpc + " est une réussite !"
                            }

                            let dataMessage = {
                                adventure:"api/adventures/" + adventureObject.id,
                                content:messageContent.replace(/,+/g,''),
                                isPlayerMessage:false,
                                dateTimeCreate: new Date(Date.now()),
                                gameMasterOnly: false,
                                targetPlayerCharacter:null,
                                playerCharacter:null,
                                nameOfSpeaker:null,
                                isSystemMessage:true,
                                npcReceiver:null,
                                npcWhoSpeak:null
                            }

                            await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                                changeUpdateItem("messageUpdate");

                    }).catch((error) => {
                        console.log(error)
                    })
                }
                    )}

            }
            }
            if(type === "SkillInAction" ){
                let targetPlayerCharacterForData = null;
                let targetNpcForData = null;
                if(targetPlayerCharacterUniqueId){
                    targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
                }
                if(targetNpc) {
                    targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
                }

                    let data = {
                        skillDeveloped:"api/skill_developeds/"+ object.skillDeveloped.id,
                        targetPlayerCharacter: targetPlayerCharacterForData,
                        targetNpc: targetNpcForData,
                        dateTimeCreate: object.dateTimeCreate,
                        dateTimeUpdate: new Date(Date.now()),
                        gameMasterWaiting: false,
                        gameMasterValidation: true,
                        playerWhoLaunch: playerLauncher,
                        targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                        targetPlayerCharacterName:targetPlayerCharacterName
                    }
                    await api_roliste.patchData(requests.requestSkillInAction + "/" + object.id, data, jwt).then(async (response) => {
                            changeUpdateItem("playerUpdate")
                            let nameOfLauncher = characterObject.map((character) => {
                                if(character["@id"] === playerLauncher){
                                    return character.name
                                }
                            })

                        let messageContent = ""

                        if(targetPlayerCharacterUniqueId){
                            messageContent =  typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetPlayerCharacterName + " est une réussite !"
                        }
                        if(targetNpc) {
                            messageContent =  typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetNpc + " est une réussite !"
                        }                            let dataMessage = {
                                adventure:"api/adventures/" + adventureObject.id,
                                content:messageContent.replace(/,+/g,''),
                                isPlayerMessage:false,
                                dateTimeCreate: new Date(Date.now()),
                                gameMasterOnly: false,
                                targetPlayerCharacter:null,
                                playerCharacter:null,
                                nameOfSpeaker:null,
                                isSystemMessage:true,
                                npcReceiver:null,
                                npcWhoSpeak:null
                            }

                            await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                                changeUpdateItem("messageUpdate");

                            }).catch((error) => {
                                console.log(error)
                            })
                        }
                    )}
            if(type === "PowerInAction" ){
                let targetPlayerCharacterForData = null;
                let targetNpcForData = null;
                if(targetPlayerCharacterUniqueId){
                    targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
                }
                if(targetNpc) {
                    targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
                }
                let data = {
                    powerDeveloped:"api/power_developeds/"+ object.powerDeveloped.id,
                    targetPlayerCharacter: targetPlayerCharacterForData,
                    targetNpc: targetNpcForData,
                    dateTimeCreate: object.dateTimeCreate,
                    dateTimeUpdate: new Date(Date.now()),
                    gameMasterWaiting: false,
                    gameMasterValidation: true,
                    playerWhoLaunch: playerLauncher,
                    targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                    targetPlayerCharacterName:targetPlayerCharacterName
                }
                await api_roliste.patchData(requests.requestPowerInAction + "/" + object.id, data, jwt).then(async (response) => {
                        changeUpdateItem("playerUpdate")
                        let nameOfLauncher = characterObject.map((character) => {
                            if(character["@id"] === playerLauncher){
                                return character.name
                            }
                        })
                        let messageContent = ""

                        if(targetPlayerCharacterUniqueId){
                            messageContent =  typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetPlayerCharacterName + " est une réussite !"
                        }
                        if(targetNpc) {
                            messageContent =  typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetNpc + " est une réussite !"
                        }

                        let dataMessage = {
                            adventure:"api/adventures/" + adventureObject.id,
                            content:messageContent.replace(/,+/g,''),
                            isPlayerMessage:false,
                            dateTimeCreate: new Date(Date.now()),
                            gameMasterOnly: false,
                            targetPlayerCharacter:null,
                            playerCharacter:null,
                            nameOfSpeaker:null,
                            isSystemMessage:true,
                            npcReceiver:null,
                            npcWhoSpeak:null
                        }

                        await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                            changeUpdateItem("messageUpdate");

                        }).catch((error) => {
                            console.log(error)
                        })
                    }
                )}
            if(type === "ItemInAction" ){

                let quantity = object.itemInBag.quantity;
                if(quantity < 1) {

                    let targetPlayerCharacterForData = null;
                    let targetNpcForData = null;
                    if(targetPlayerCharacterUniqueId){
                        targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
                    }
                    if(targetNpc) {
                        targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
                    }

                    let data = {
                        itemInBag:"api/item_in_bags/"+ object.itemInBag.id,
                        targetPlayerCharacter: targetPlayerCharacterForData,
                        targetNpc: targetNpcForData,
                        dateTimeCreate: object.dateTimeCreate,
                        dateTimeUpdate: new Date(Date.now()),
                        gameMasterWaiting: false,
                        gameMasterValidation: false,
                        playerWhoLaunch: playerLauncher,
                        targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                        targetPlayerCharacterName:targetPlayerCharacterName
                    }

                    await api_roliste.patchData(requests.requestItemInAction + "/" + object.id, data, jwt).then(async (response) => {
                        changeUpdateItem("playerUpdate")
                        let nameOfLauncher = characterObject.map((character) => {
                            if(character["@id"] === playerLauncher){
                                return character.name
                            }
                        })

                        let targetMessage = targetPlayerCharacterName ? targetPlayerCharacterName : targetNpc

                        let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetMessage + " a échoué car l'objet " + object.itemInBag.item.name + " est possédé en quantité insuffisante !"
                        let dataMessage = {
                            adventure:"api/adventures/" + adventureObject.id,
                            content:messageContent.replace(/,+/g,'').replace(/,+/g,''),
                            isPlayerMessage:false,
                            dateTimeCreate: new Date(Date.now()),
                            gameMasterOnly: false,
                            targetPlayerCharacter:null,
                            playerCharacter:null,
                            nameOfSpeaker:null,
                            isSystemMessage:true,
                            npcReceiver:null,
                            npcWhoSpeak:null
                        }

                        await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                            changeUpdateItem("messageUpdate");

                        }).catch((error) => {
                            console.log(error)
                        })
                    })} else {

                    let dataItemInBag = {
                        playerCharacter: playerLauncher,
                        quantity:object.itemInBag.quantity - 1,
                        item: "api/items/" + object.itemInBag.item.id
                    }

                    await api_roliste.patchData(requests.requestItemInBag + "/" + object.itemInBag.id , dataItemInBag,jwt);

                    if(object.itemInBag.item.modifier !== 0) {

                        let target = [object.targetNpc ? object.targetNpc : object.targetPlayerCharacter, object.targetNpc ? "npc" : "player" ];
                        if(target[1] === "npc") {
                            console.log(target[0])
                            let newHealth = target[0].health + object.itemInBag.item.modifier < 0 ? 0 : target[0].health + object.itemInBag.item.modifier;
                            let data = {
                                adventure: "api/adventures/" + adventureObject.id,
                                npc: targetNpcId,
                                description:target[0].description,
                                presentOnScene: target[0].presentOnScene,
                                health:newHealth
                            }
                            await api_roliste.patchData(requests.requestNpcOnAdventure + "/" + object.targetNpc.id, data, jwt).then(async (response) => {
                                let data = {

                                    itemInBag:"api/item_in_bags/"+ object.itemInBag.id,
                                    targetPlayerCharacter: null,
                                    targetNpc: "api/npc_on_adventures/" + targetNpcOnAdventure,
                                    dateTimeCreate: object.dateTimeCreate,
                                    dateTimeUpdate: new Date(Date.now()),
                                    gameMasterWaiting: false,
                                    gameMasterValidation: true,
                                    playerWhoLaunch: playerLauncher,
                                    targetPlayerCharacterUniqueId:null,
                                    targetPlayerCharacterName:null
                                }



                                await api_roliste.patchData(requests.requestItemInAction + "/" + object.id, data, jwt).then(async (response) => {
                                    changeUpdateItem("playerUpdate")
                                    // ajouter message systeme de reussite
                                    let nameOfLauncher = characterObject.map((character) => {
                                        if(character["@id"] === playerLauncher){
                                            return character.name
                                        }
                                    })
                                    let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetNpc + " est une réussite !"
                                    let dataMessage = {
                                        adventure:"api/adventures/" + adventureObject.id,
                                        content:messageContent.replace(/,+/g,''),
                                        isPlayerMessage:false,
                                        dateTimeCreate: new Date(Date.now()),
                                        gameMasterOnly: false,
                                        targetPlayerCharacter:null,
                                        playerCharacter:null,
                                        nameOfSpeaker:null,
                                        isSystemMessage:true,
                                        npcReceiver:null,
                                        npcWhoSpeak:null
                                    }

                                    console.log(dataMessage)


                                    await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                                        changeUpdateItem("messageUpdate");

                                    }).catch((error) => {
                                        console.log(error)
                                    })

                                })
                            })
                        }
                        else if(target[1] === "player") {
                            let caracteristicTypeTarget = object.itemInBag.item.caracteristicType.id;
                            let caracteristicOfPlayerTarget = [];
                            characterObject.map((character) => {
                                console.log(character)
                                if(character.id === targetPlayerCharacterUniqueId){
                                    character.caracteristics.map((oneCaracteristic) => {
                                        if(oneCaracteristic.caracteristicType.id === caracteristicTypeTarget) {
                                            caracteristicOfPlayerTarget = [oneCaracteristic.id, oneCaracteristic.value];
                                        }
                                    })
                                }
                            })
                            let newCaracteristicOfPlayerValue = caracteristicOfPlayerTarget[1] + object.itemInBag.item.modifier < 0 ? 0 : caracteristicOfPlayerTarget[1] + object.itemInBag.item.modifier;
                            let data = {
                                playerCharacter: "api/player_characters/" + targetPlayerCharacterUniqueId,
                                caracteristicType:"api/caracteristic_types/" + caracteristicTypeTarget,
                                value:newCaracteristicOfPlayerValue
                            }
                            await api_roliste.patchData(requests.requestCaracteristic + "/" + caracteristicOfPlayerTarget[0], data, jwt).then(async(response) => {
                                let data = {
                                    itemInBag:"api/item_in_bags/"+ object.itemInBag.id,
                                    targetPlayerCharacter: "api/player_characters/" + targetPlayerCharacterUniqueId,
                                    targetNpc: null,
                                    dateTimeCreate: object.dateTimeCreate,
                                    dateTimeUpdate: new Date(Date.now()),
                                    gameMasterWaiting: false,
                                    gameMasterValidation: true,
                                    playerWhoLaunch: playerLauncher,
                                    targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                                    targetPlayerCharacterName:targetPlayerCharacterName
                                }
                                await api_roliste.patchData(requests.requestItemInAction + "/" + object.id, data, jwt).then(async (response) => {
                                    changeUpdateItem("playerUpdate")
                                    // ajouter message systeme de reussite
                                    let nameOfLauncher = characterObject.map((character) => {
                                        if(character["@id"] === playerLauncher){
                                            return character.name
                                        }
                                    })
                                    let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetPlayerCharacterName + " est une réussite !"
                                    let dataMessage = {
                                        adventure:"api/adventures/" + adventureObject.id,
                                        content:messageContent.replace(/,+/g,''),
                                        isPlayerMessage:false,
                                        dateTimeCreate: new Date(Date.now()),
                                        gameMasterOnly: false,
                                        targetPlayerCharacter:null,
                                        playerCharacter:null,
                                        nameOfSpeaker:null,
                                        isSystemMessage:true,
                                        npcReceiver:null,
                                        npcWhoSpeak:null
                                    }

                                    await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                                        changeUpdateItem("messageUpdate");

                                    }).catch((error) => {
                                        console.log(error)
                                    })

                                })
                            })
                        }
                    } else  {
                        let targetPlayerCharacterForData = null;
                        let targetNpcForData = null;
                        if(targetPlayerCharacterUniqueId){
                            targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
                        }
                        if(targetNpc) {
                            targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
                        }
                        let data = {
                            itemInBag:"api/item_in_bags/"+ object.spell.id,
                            targetPlayerCharacter: targetPlayerCharacterForData,
                            targetNpc: targetNpcForData,
                            dateTimeCreate: object.dateTimeCreate,
                            dateTimeUpdate: new Date(Date.now()),
                            gameMasterWaiting: false,
                            gameMasterValidation: true,
                            playerWhoLaunch: playerLauncher,
                            targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                            targetPlayerCharacterName:targetPlayerCharacterName
                        }
                        await api_roliste.patchData(requests.requestItemInAction + "/" + object.id, data, jwt).then(async (response) => {
                                changeUpdateItem("playerUpdate")
                                let nameOfLauncher = characterObject.map((character) => {
                                    if(character["@id"] === playerLauncher){
                                        return character.name
                                    }
                                })

                                let messageContent = ""

                                if(targetPlayerCharacterUniqueId){
                                    messageContent =  typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetPlayerCharacterName + " est une réussite !"
                                }
                                if(targetNpc) {
                                    messageContent =  typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetNpc + " est une réussite !"
                                }                    let dataMessage = {
                                    adventure:"api/adventures/" + adventureObject.id,
                                    content:messageContent.replace(/,+/g,''),
                                    isPlayerMessage:false,
                                    dateTimeCreate: new Date(Date.now()),
                                    gameMasterOnly: false,
                                    targetPlayerCharacter:null,
                                    playerCharacter:null,
                                    nameOfSpeaker:null,
                                    isSystemMessage:true,
                                    npcReceiver:null,
                                    npcWhoSpeak:null
                                }

                                await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                                    changeUpdateItem("messageUpdate");

                                }).catch((error) => {
                                    console.log(error)
                                })
                            }
                        )}

                }
            }

    }

    const handleActionFail = async () => {
        if(type === "SpellInAction"){
            let targetPlayerCharacterForData = null;
            let targetNpcForData = null;
            if(targetPlayerCharacterUniqueId){
                targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
            }
            if(targetNpc) {
                targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
            }

            let data = {
                spell:"api/spells/"+ object.spell.id,
                targetPlayerCharacter: targetPlayerCharacterForData,
                targetNpc: targetNpcForData,
                dateTimeCreate: object.dateTimeCreate,
                dateTimeUpdate: new Date(Date.now()),
                gameMasterWaiting: false,
                gameMasterValidation: false,
                playerWhoLaunch: playerLauncher,
                targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                targetPlayerCharacterName:targetPlayerCharacterName
            }



            await api_roliste.patchData(requests.requestSpellInAction + "/" + object.id, data, jwt).then(async (response) => {
                changeUpdateItem("playerUpdate")
                let nameOfLauncher = characterObject.map((character) => {
                    if(character["@id"] === playerLauncher){
                        return character.name
                    }
                })

                let targetMessage = targetPlayerCharacterName ? targetPlayerCharacterName : targetNpc

                let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetMessage + " n'a pas été validé."
                let dataMessage = {
                    adventure:"api/adventures/" + adventureObject.id,
                    content:messageContent.replace(/,+/g,''),
                    isPlayerMessage:false,
                    dateTimeCreate: new Date(Date.now()),
                    gameMasterOnly: false,
                    targetPlayerCharacter:null,
                    playerCharacter:null,
                    nameOfSpeaker:null,
                    isSystemMessage:true,
                    npcReceiver:null,
                    npcWhoSpeak:null
                }

                await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                    changeUpdateItem("messageUpdate");

                }).catch((error) => {
                    console.log(error)
                })})
        }
        else if(type === "SkillInAction"){
            let targetPlayerCharacterForData = null;
            let targetNpcForData = null;
            if(targetPlayerCharacterUniqueId){
                targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
            }
            if(targetNpc) {
                targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
            }

            let data = {
                skillDeveloped:"api/skill_developeds/"+ object.skillDeveloped.id,
                targetPlayerCharacter: targetPlayerCharacterForData,
                targetNpc: targetNpcForData,
                dateTimeCreate: object.dateTimeCreate,
                dateTimeUpdate: new Date(Date.now()),
                gameMasterWaiting: false,
                gameMasterValidation: false,
                playerWhoLaunch: playerLauncher,
                targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                targetPlayerCharacterName:targetPlayerCharacterName
            }
            await api_roliste.patchData(requests.requestSkillInAction + "/" + object.id, data, jwt).then(async (response) => {
                changeUpdateItem("playerUpdate")
                let nameOfLauncher = characterObject.map((character) => {
                    if(character["@id"] === playerLauncher){
                        return character.name
                    }
                })

                let targetMessage = targetPlayerCharacterName ? targetPlayerCharacterName : targetNpc

                let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetMessage + " n'a pas été validé."
                let dataMessage = {
                    adventure:"api/adventures/" + adventureObject.id,
                    content:messageContent.replace(/,+/g,''),
                    isPlayerMessage:false,
                    dateTimeCreate: new Date(Date.now()),
                    gameMasterOnly: false,
                    targetPlayerCharacter:null,
                    playerCharacter:null,
                    nameOfSpeaker:null,
                    isSystemMessage:true,
                    npcReceiver:null,
                    npcWhoSpeak:null
                }

                await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                    changeUpdateItem("messageUpdate");

                }).catch((error) => {
                    console.log(error)
                })
            })}
        else if(type === "PowerInAction"){
            let targetPlayerCharacterForData = null;
            let targetNpcForData = null;
            if(targetPlayerCharacterUniqueId){
                targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
            }
            if(targetNpc) {
                targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
            }
            let data = {
                powerDeveloped:"api/power_developeds/"+ object.powerDeveloped.id,
                targetPlayerCharacter: targetPlayerCharacterForData,
                targetNpc: targetNpcForData,
                dateTimeCreate: object.dateTimeCreate,
                dateTimeUpdate: new Date(Date.now()),
                gameMasterWaiting: false,
                gameMasterValidation: true,
                playerWhoLaunch: playerLauncher,
                targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                targetPlayerCharacterName:targetPlayerCharacterName
            }
            await api_roliste.patchData(requests.requestPowerInAction + "/" + object.id, data, jwt).then(async (response) => {
                changeUpdateItem("playerUpdate")
                let nameOfLauncher = characterObject.map((character) => {
                    if(character["@id"] === playerLauncher){
                        return character.name
                    }
                })

                let targetMessage = targetPlayerCharacterName ? targetPlayerCharacterName : targetNpc

                let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetMessage + " n'a pas été validé."
                let dataMessage = {
                    adventure:"api/adventures/" + adventureObject.id,
                    content:messageContent.replace(/,+/g,''),
                    isPlayerMessage:false,
                    dateTimeCreate: new Date(Date.now()),
                    gameMasterOnly: false,
                    targetPlayerCharacter:null,
                    playerCharacter:null,
                    nameOfSpeaker:null,
                    isSystemMessage:true,
                    npcReceiver:null,
                    npcWhoSpeak:null
                }

                await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                    changeUpdateItem("messageUpdate");

                }).catch((error) => {
                    console.log(error)
                })})

        }
        else if(type === "ItemInAction"){
            let targetPlayerCharacterForData = null;
            let targetNpcForData = null;
            if(targetPlayerCharacterUniqueId){
                targetPlayerCharacterForData = "api/player_characters/" + targetPlayerCharacterUniqueId
            }
            if(targetNpc) {
                targetNpcForData = "api/npc_on_adventures/" + targetNpcOnAdventure
            }

            let data = {
                itemInBag:"api/item_in_bags/"+ object.itemInBag.id,
                targetPlayerCharacter: targetPlayerCharacterForData,
                targetNpc: targetNpcForData,
                dateTimeCreate: object.dateTimeCreate,
                dateTimeUpdate: new Date(Date.now()),
                gameMasterWaiting: false,
                gameMasterValidation: false,
                playerWhoLaunch: playerLauncher,
                targetPlayerCharacterUniqueId:targetPlayerCharacterUniqueId,
                targetPlayerCharacterName:targetPlayerCharacterName
            }

            await api_roliste.patchData(requests.requestItemInAction + "/" + object.id, data, jwt).then(async (response) => {
                changeUpdateItem("playerUpdate")
                let nameOfLauncher = characterObject.map((character) => {
                    if(character["@id"] === playerLauncher){
                        return character.name
                    }
                })

                let targetMessage = targetPlayerCharacterName ? targetPlayerCharacterName : targetNpc

                let messageContent = typeActionMessage + ' "' + name +  '" par ' + nameOfLauncher + " visant " + targetMessage + " n'a pas été validée !"
                let dataMessage = {
                    adventure:"api/adventures/" + adventureObject.id,
                    content:messageContent.replace(/,+/g,''),
                    isPlayerMessage:false,
                    dateTimeCreate: new Date(Date.now()),
                    gameMasterOnly: false,
                    targetPlayerCharacter:null,
                    playerCharacter:null,
                    nameOfSpeaker:null,
                    isSystemMessage:true,
                    npcReceiver:null,
                    npcWhoSpeak:null
                }

                await api_roliste.postData(requests.requestMessageInChat, dataMessage, jwt).then((response) => {
                    changeUpdateItem("messageUpdate");

                }).catch((error) => {
                    console.log(error)
                })})
        }

    }



    return (
        <div className={`actionslot-container ${selectAction === ("description" + id) ? "actionslot-container-active" : ""}`}>
            <h2 className={"actionslot-title"}>{typeAction} par {characterObject.map((character) => {
                if(character["@id"] === playerLauncher){
                    return character.name
                }
            })}</h2>
            <p>Cible : {targetPlayerCharacterName}
                {targetNpc}</p>
            <h3 onClick={handleSelectDescription}>Description</h3>
            {selectAction === ("description" + id) ? <p className={"actionslot-description"}><span className={"actionslot-description-name"}>{name}</span>  : {description}</p> :""}
            <div><button className={"submit-button-wooden actionslot-button"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={handleActionSuccess}>Valider</button>
                <button className={"submit-button-wooden actionslot-button"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={handleActionFail}>Rejeter</button></div>
        </div>
    )
}

export default ActionSlot;