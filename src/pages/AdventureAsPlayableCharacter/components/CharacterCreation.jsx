import React, {useEffect, useState} from "react";
import CaracteristicsGroup from "./CaracteristicsGroup";
import CharacterResume from "./CharacterResume";
import PowerGroup from "./PowerGroup";
import SkillGroup from "./SkillGroup";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";

import "../../../styles/CharacterResume.css"
import  "../../../styles/CharacterCreation.css"

const CharacterCreation = ({jwt, adventureId, playerId, characterId, setCharacterId, testPlayerCharacter, changeUpdateItem, buttonImg1}) => {

    const [arrayCarac, setArrayCarac] = useState({});
    const [avatarChoosed, setAvatarChoosed] = useState(0);
    const [characterHp, setCharacterHp] = useState(0);
    const [characterMp, setCharacterMp] = useState(0);
    const [characterArmor, setCharacterArmor] = useState(10);
    const [powersSelected, setPowersSelected] = useState([]);
    const [skillsSelected, setSkillsSelected] = useState([]);
    const [characterName, setCharacterName] = useState("");
    const [characterUnderCreation, setCharacterUnderCreation] = useState(false);



    const handleSubmit = async () => {

        if(!characterUnderCreation){

            setCharacterUnderCreation(true);
            console.log(characterUnderCreation)

            let characterIdTemp = "";

            let avatarIcon = avatarChoosed.id?avatarChoosed.id:157

            let dataCharacter = {
                "name":characterName,
                "adventure":"api/adventures/" + adventureId,
                "user":"api/users/" + playerId,
                "avatarIcon":"api/avatar_icons/" + avatarIcon,
                "race" : "api/races/" + 1
            }
            console.log(dataCharacter)
            await api_roliste.postData(requests.requestPlayerCharacter, dataCharacter, jwt).then((response) => {
                 setCharacterId(response.data.id) ; characterIdTemp = response.data.id}).catch(error => console.log(error));

            console.log(characterId)

            for (let i = 0 ; i < skillsSelected.length ; i++) {
                let dataSkillsDevelopped = {
                    "skill":"api/skills/" + skillsSelected[i],
                    "playerCharacter": "api/player_characters/" + characterIdTemp,
                }

                let postSkillDevelopped = await api_roliste.postData(requests.requestSkillDeveloped, dataSkillsDevelopped, jwt).catch(error => console.log(error));
            }

            for (let i = 0 ; i < powersSelected.length ; i++) {
                console.log("power " + [i])
                console.log(powersSelected[i])

                let dataPowerDevelopped = {
                    "power":"api/powers/" + powersSelected[i],
                    "playerCharacter": "api/player_characters/" + characterIdTemp,
                }

                let postSkillDevelopped = await api_roliste.postData(requests.requestPowerDeveloped, dataPowerDevelopped, jwt).catch(error => console.log(error));
            }


            let dataStrength = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" + 1,
                "value":functions.setValueInt(arrayCarac['force'])
            }

            let strengthPost = await api_roliste.postData(requests.requestCaracteristic, dataStrength, jwt).catch(error => console.log(error));

            let dataConstitution = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" + 2,
                "value":functions.setValueInt(arrayCarac['constitution'])
            }
            console.log(arrayCarac['constitution']);

            let constitutionPost = await api_roliste.postData(requests.requestCaracteristic, dataConstitution, jwt).catch(error => console.log(error));


            let dataDexterity = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" + 3,
                "value":functions.setValueInt(arrayCarac['dextérité'])
            }

            let dexterityPost = await api_roliste.postData(requests.requestCaracteristic, dataDexterity, jwt).catch(error => console.log(error));


            let dataIntelligence = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" + 4,
                "value":functions.setValueInt(arrayCarac['intelligence'])
            }

            let intelligencePost = await api_roliste.postData(requests.requestCaracteristic, dataIntelligence, jwt).catch(error => console.log(error));


            let dataWisdom = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" + 5,
                "value":functions.setValueInt(arrayCarac['sagesse'])
            }

            let wisdomPost = await api_roliste.postData(requests.requestCaracteristic, dataWisdom, jwt).catch(error => console.log(error));


            let dataCharisma = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" +6,
                "value":functions.setValueInt(arrayCarac['charisme'])
            }

            let charismaPost = await api_roliste.postData(requests.requestCaracteristic, dataCharisma, jwt).catch(error => console.log(error));


            let dataHealth = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" +7,
                "value":functions.setValueInt(characterHp)
            }

            let healthPost = await api_roliste.postData(requests.requestCaracteristic, dataHealth, jwt).catch(error => console.log(error));


            let dataMaxHealth = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" +8,
                "value":functions.setValueInt(characterHp)
            }

            let maxHealthPost = await api_roliste.postData(requests.requestCaracteristic, dataMaxHealth, jwt).catch(error => console.log(error));


            let dataArmor = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" +9,
                "value":functions.setValueInt(characterArmor)
            }

            let armorPost = await api_roliste.postData(requests.requestCaracteristic, dataArmor, jwt).catch(error => console.log(error));


            let dataExperience = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" +10,
                "value":0
            }

            let experiencePost = await api_roliste.postData(requests.requestCaracteristic, dataExperience, jwt).catch(error => console.log(error));


            let dataLevel = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" +11,
                "value":1
            }

            let levelPost = await api_roliste.postData(requests.requestCaracteristic, dataLevel, jwt).catch(error => console.log(error));


            let dataHeroism = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" + 12,
                "value":0
            }

            let heroismPost = await api_roliste.postData(requests.requestCaracteristic, dataHeroism, jwt).catch(error => console.log(error));

            let dataMagic = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" + 13,
                "value":functions.setValueInt(characterMp)
            }

            let magicPost = await api_roliste.postData(requests.requestCaracteristic, dataMagic, jwt).catch(error => console.log(error));

            let dataMaxMagic = {
                "playerCharacter": "api/player_characters/" + characterIdTemp,
                "caracteristicType":"api/caracteristic_types/" + 14,
                "value":functions.setValueInt(characterMp)
            }

            let maxMagicPost = await api_roliste.postData(requests.requestCaracteristic, dataMaxMagic, jwt).catch(error => console.log(error));

            let dataitem1 = {
                playerCharacter: "api/player_characters/" + characterIdTemp,
                quantity:10,
                item: "api/items/3"
            }

            let item1Post = await api_roliste.postData(requests.requestItemInBag, dataitem1, jwt).catch(error => console.log(error));

            let dataitem2 = {
                playerCharacter: "api/player_characters/" + characterIdTemp,
                quantity:1,
                item: "api/items/5"
            }

            let item2Post = await api_roliste.postData(requests.requestItemInBag, dataitem2, jwt).catch(error => console.log(error));

            let dataitem3 = {
                playerCharacter: "api/player_characters/" + characterIdTemp,
                quantity:1,
                item: "api/items/4"
            }

            let item3Post = await api_roliste.postData(requests.requestItemInBag, dataitem3, jwt).catch(error => console.log(error));

            let dataitem4 = {
                playerCharacter: "api/player_characters/" + characterIdTemp,
                quantity:20,
                item: "api/items/1"
            }

            let item4Post = await api_roliste.postData(requests.requestItemInBag, dataitem4, jwt).catch(error => console.log(error));

            let dataitem5 = {
                playerCharacter: "api/player_characters/" + characterIdTemp,
                quantity:1,
                item: "api/items/2"
            }

            let item5Post = await api_roliste.postData(requests.requestItemInBag, dataitem5, jwt).catch(error => console.log(error));


            testPlayerCharacter();
            changeUpdateItem("playerUpdate")

        } else{console.log("Personnage en cours de construction")}
    }


    useEffect(() => {
        console.log(arrayCarac);

    }, [arrayCarac])


    return (
        <div className={"character-creation-container"}>
            <div className={"character-creation-resume"}>
                <CaracteristicsGroup jwt={jwt} arrayCarac={arrayCarac} setArrayCarac={setArrayCarac} setCharacterHp={setCharacterHp}  setCharacterMp={setCharacterMp}  setCharacterArmor={setCharacterArmor}/>
                <CharacterResume jwt={jwt} avatarChoosed={avatarChoosed} setAvatarChoosed={setAvatarChoosed}  characterHp={characterHp} characterMp={characterMp} characterArmor={characterArmor} characterName={characterName} setCharacterName={setCharacterName}/>
            </div>
            <div className={"character-creation-special-action"}>
                <PowerGroup jwt={jwt} powersSelected={powersSelected} setPowersSelected={setPowersSelected} />
                <SkillGroup jwt={jwt} skillsSelected={skillsSelected} setSkillsSelected={setSkillsSelected}/>
            </div>
            <div className={"character-creation-validation"}>
                <button className={"submit-button-wooden character-creation-submit"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg1})`, backgroundSize: `100% 100%`}} onClick={handleSubmit}>Donner vie à {characterName ? characterName : "un inconnu"}</button>
            </div>
        </div>
    )
}

export default CharacterCreation;