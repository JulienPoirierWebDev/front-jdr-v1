import React, {useState} from "react";
import functions from "../services/functions";



const Caracteristic = ({id, name }) => {

const [carac, setCarac] = useState();



    return (
        <div className="Caracteristic">
            <label htmlFor={name}>{functions.capitalizeFirstLetter(name)}</label>
            <input name={name} type="number" />
        </div>
    )
}

export default Caracteristic;