import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const AdventureCreation = () => {

    let navigate = useNavigate();
    navigate("/")

    useEffect(() => {
         navigate("/")
    })

    return (
        <div>Hello</div>
    )
}

export default AdventureCreation;