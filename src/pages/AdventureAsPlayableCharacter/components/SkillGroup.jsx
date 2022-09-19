import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"
import Select, {components} from "react-select";

import "../../../styles/SkillGroup.css"

const SkillGroup = ({jwt, skillsSelected, setSkillsSelected}) => {
    const [loaded, setLoaded] = useState(false);
    const [skillsGroup, setSkillsGroup] = useState([]);
    const [newSkillsGroup, setNewSkillsGroup] = useState([]);
    const [revealSkills, setRevealSkills] = useState("");

    // Je crée une limite pour le Select issu du bundle React-Select
    const isValidNewOption = (inputValue, selectValue) =>
        inputValue.length > 0 && selectValue.length < 3;

    // Je crée un menu personnalisé pour le Select, permettant d'afficher si la limite est dépassé
    const Menu = props => {
        const optionSelectedLength = props.getValue().length || 0;
        return (
            <components.Menu {...props}>
                {optionSelectedLength < 3 ? (
                    props.children
                ) : (
                    <div className={"full"}>Votre potentiel est comblé !</div>
                )}
            </components.Menu>
        );
    };

    const fetchSkill = async () => {
        if (!loaded){
            await api_roliste.getAllData(requests.requestSkill, jwt).then(res => {
                setSkillsGroup(res.data["hydra:member"]);
                setLoaded(true);
                }
            ).catch(error => { console.log(error)});
        }
    }

    const makeOptionsForSelect = () => {
        let options = []
        skillsGroup.map(element => {
            options.push({value:element.id, label: element.name})
        })
        setNewSkillsGroup(options)
    }


    useEffect(() => {
        console.log(skillsGroup);
    }, [loaded]);

    useEffect(() => {
        makeOptionsForSelect();
    }, [skillsGroup])

    useEffect(() => {
        fetchSkill()
    }, [])


    const newHandleChange = (event) => {
        //console.log(event[0]);
        //console.log(powersGroup[0].id)
        let descriptionGroup = []
        for (let i = 0 ; i < event.length ; i++) {
            let oneDescritpion = skillsGroup.find(element=> parseInt(element.id) === parseInt(event[i].value));
            descriptionGroup.push(oneDescritpion)
            //let oneDescritpion = powersGroup.find(element=> element.id === event[i][0]);
        }

        setRevealSkills(descriptionGroup.map(element =>
            <div key={element.id}><h3>{element.name}</h3><p>{element.description}</p></div>
        ))

        setSkillsSelected(descriptionGroup.map(element =>
            element.id))
        //let newReveal = powersGroup.find(element=> element['id'] === event[0]);
        //console.log(newReveal)
    }

    return (
        <div className={"character-creation-skills"}>
            <label htmlFor="skillsSelected">
                Veuillez choisir vos trois compétences
            </label>

            <Select placeholder={"Démontrez votre potentiel ..."} components={{Menu}} options={newSkillsGroup} onChange={newHandleChange} isMulti isValidNewOptions={isValidNewOption} name={"skillsSelected"} className="skills-select"
            />
            <div>{revealSkills}</div>
        </div>
    )
}

export default SkillGroup;