import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CharacterResume.css"
import Select from "react-select";
import { components } from "react-select";
import '../../../styles/PowerGroup.css'

const PowerGroup = ({jwt, powersSelected, setPowersSelected}) => {
    const [loaded, setLoaded] = useState(false);
    const [powersGroup, setPowersGroup] = useState([]);
    const [newPowerGroup, setNewPowerGroup] = useState([]);
    const [revealPower, setRevealPower] = useState("");


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
                    <div className={"full"}>Vos pouvoirs sont déja révélés !</div>
                )}
            </components.Menu>
        );
    };

    const fetchPower = async () => {
        if (!loaded){
            await api_roliste.getAllData(requests.requestPower, jwt).then(res => {
                setPowersGroup(res.data["hydra:member"]);
                setLoaded(true);
                }
            ).catch(error => { console.log(error)});
        }
    }

    const makeOptionsForSelect = () => {
        let options = []
        powersGroup.map(element => {
            options.push({value:element.id, label: element.name})
        })
        setNewPowerGroup(options)
    }





/*    function handleChange(event) {
        let value = event.target.value;
        let saveArray = powersSelected;
        if(saveArray.find(element => element === value)) {
            for (let i = 0; i > saveArray.length; i++) {
                if(saveArray[i] === value) {
                    saveArray.splice(i,1)
                }
            }
        } else {
            saveArray.push(value)
        }
        setPowersSelected(saveArray)
        console.log(powersSelected)
    }
    */

    const newHandleChange = (event) => {
        //console.log(event[0]);
        //console.log(powersGroup[0].id)
        let descriptionGroup = []
        for (let i = 0 ; i < event.length ; i++) {
            let oneDescritpion = powersGroup.find(element=> parseInt(element.id) === parseInt(event[i].value));
            descriptionGroup.push(oneDescritpion)
            //let oneDescritpion = powersGroup.find(element=> element.id === event[i][0]);
        }

        setRevealPower(descriptionGroup.map(element =>
            <div key={element.id}><h3>{element.name}</h3><p>{element.description}</p></div>
        ))

        setPowersSelected(descriptionGroup.map(element =>
        element.id))
        //let newReveal = powersGroup.find(element=> element['id'] === event[0]);
        //console.log(newReveal)
    }

    useEffect(() => {
        makeOptionsForSelect();
    }, [powersGroup])

    useEffect(() => {
        fetchPower()
    }, [])

    return (
        <div className={"character-creation-powers"}>
            <label htmlFor="powersSelected">
                Veuillez choisir vos trois pouvoirs

            </label>
            <Select placeholder={"Découvrez votre puissance ..."} components={{Menu}} options={newPowerGroup} onChange={newHandleChange} isMulti isValidNewOptions={isValidNewOption} name={"powersSelected"} className="power-select"
            />
            <div>{revealPower}</div>

        </div>
    )
}

export default PowerGroup;