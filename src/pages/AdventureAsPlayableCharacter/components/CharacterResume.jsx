import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"

const CharacterResume = ({jwt, setAvatarChoosed, avatarChoosed, characterArmor, characterMp, characterHp, characterName, setCharacterName}) => {
    const [avatarIcons, setAvatarIcons] = useState([]);

    const [loaded, setLoaded] = useState(false);
    const [positionAvatarInArray, setPositionAvatarInArray] = useState(0);
    const [woodArrowImg, setWoodArrowImg] = useState("/media/visuel/wood_arrow.png")


    const fetchAvatar = async () => {
        if (!loaded){
            await api_roliste.getAllData(requests.requestAvatarIcon, jwt).then(res => {
                    setAvatarIcons(res.data["hydra:member"]);
                    setLoaded(true);
                }
            ).catch(error => { console.log(error)});
        }
    }

    useEffect(() => {
        fetchAvatar()
    })


    useEffect(() => {
        console.log(avatarIcons[positionAvatarInArray])
        console.log(positionAvatarInArray)
        console.log(avatarChoosed)
    }, [positionAvatarInArray])

    function avatarChange(event) {
        event.preventDefault();
        if(event.target.name === "buttonAvatarBefore") {
            if(positionAvatarInArray === 0) {
                setPositionAvatarInArray(avatarIcons.length -1);
                setAvatarChoosed(avatarIcons[avatarIcons.length -1]);
            } else {
                setPositionAvatarInArray(positionAvatarInArray - 1);
                setAvatarChoosed(avatarIcons[positionAvatarInArray -1]);
            }
        } else if(event.target.name === "buttonAvatarAfter"){
            if (positionAvatarInArray === (avatarIcons.length -1)) {
                setPositionAvatarInArray(0);
                setAvatarChoosed(avatarIcons[0]);
            } else {
                setPositionAvatarInArray(positionAvatarInArray + 1);
                setAvatarChoosed(avatarIcons[positionAvatarInArray + 1]);
            }
        }
        //console.log(positionAvatarInArray)
        //console.log(('/media/avatar/' + avatarIcons[positionAvatarInArray]['slug']))
    }


    function handleChange(event) {
        if (event.target.name === "characterName") {
            setCharacterName(functions.escapeHtmlV2(event.target.value))
        }
    }

    return (
        <div className={"character-resume"}>
            <div className={"character-resume-part1"}>
            {loaded ?
                <div className={"character-resume-avatar-container"}>
                    <div className={"character-resume-avatar-div"}>
                        <img className={"character-resume-avatar"} src={process.env.PUBLIC_URL + '/media/avatar/' + avatarIcons[positionAvatarInArray]['slug']} alt="avatar de personnage"/>
                    </div>
                    <div className={"character-resume-button-group"}>
                    <div className={"character-resume-button-container before-div"} >
                        <img className={"character-resume-button before"} name={"buttonAvatarBefore"} onClick={avatarChange}
                        src={process.env.PUBLIC_URL + woodArrowImg} alt=""/>
                    </div>
                    <div className={"character-resume-button-container after-div"} >
                        <img className={"character-resume-button after"} name={"buttonAvatarAfter"} onClick={avatarChange}
                             src={process.env.PUBLIC_URL + woodArrowImg} alt=""/></div>
                    </div>
                </div>
                : ""}
                <div className={"character-resume-name-div"}>
                    <label className={"form-label"} htmlFor="characterName">Nom du personnage</label>
                    <input className={"form-input"}  name={"characterName"} type="text" onChange={handleChange} value={characterName}/>
                </div>
            </div>
            <div className={"character-resume-part2"}>
                <p>Points de vie : <span>{characterHp}</span></p>
                <p>Points de magie : <span>{characterMp}</span></p>
                <p>Classe d'armure : <span>{characterArmor}</span></p>

            </div>

        </div>
    )
}

export default CharacterResume;