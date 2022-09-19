import React, {useEffect, useState} from "react";
import api_roliste from "../../../services/api_roliste";
import requests from "../../../services/requests";
import functions from "../../../services/functions";
import "../../../styles/CaracteristicsGroup.css"

const CaracteristicsGroup = ({jwt, arrayCarac, setArrayCarac, setCharacterMp, setCharacterArmor,setCharacterHp}) => {

    const [caracteristicType, setCaracteristicType] = useState();
    const [loaded, setLoaded] = useState(false);
    const [totalCarac, setTotalCarac] = useState(0);
    const [stockCarac, setStockCarac] = useState(12);

    const TOTALMAXCARAC = 12;


    const testMaxCarac = () => {
        if( Object.keys(arrayCarac).length > 0) {
            const sum = Object.values(arrayCarac).reduce((a,b) => parseInt(a)+parseInt(b));
            setTotalCarac(sum);
            setStockCarac(12- (Object.values(arrayCarac).reduce((a,b) => parseInt(a)+parseInt(b))));
            console.log(12- (Object.values(arrayCarac).reduce((a,b) => parseInt(a)+parseInt(b))))
            console.log(Object.values(arrayCarac).reduce((a,b) => parseInt(a)+parseInt(b)))
        }
    }


    const fetchCaracteristic = async () => {
        if(!loaded){
            let response = await api_roliste.getAllData(requests.requestCaracteristicType, jwt).then((res) => {

                setCaracteristicType(res.data["hydra:member"])
                setLoaded(true);

            }
        ).catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
        }

    }

    const setPoints = () => {
        console.log(totalCarac)

    }


    useEffect(() => {
        fetchCaracteristic()
    })

    useEffect(() => {
        testMaxCarac();
    }, [arrayCarac])

    function handleChange(event) {
        if(caracteristicType) {
            caracteristicType.forEach(element => {
                if (event.target.name === element.name) {
                    console.log(event.target.name)
                    const updatedValue = {};
                    updatedValue[event.target.name] = event.target.value;

                    setArrayCarac({...arrayCarac, ...updatedValue})
                    if(stockCarac < 1  ) {
                        const updatedValue = {};
                        updatedValue[event.target.name] = event.target.value - 1;

                        setArrayCarac({...arrayCarac, ...updatedValue})

                        }
                    } else {
                    if(event.target.name === "constitution"){
                        setCharacterHp(event.target.value * 5);
                    } else if(event.target.name === "intelligence") {
                        setCharacterMp(event.target.value)
                    } else if(event.target.name === "sagesse") {
                        setCharacterArmor(10 + parseInt(event.target.value))
                    }
                }
            })

        }
    }

    return (
        <div className="character-caracteristics">
            <div className={"character-caracteristics-group"}>
            {caracteristicType ? caracteristicType.map((element) =>

                (element.forCreation ?         <div key={element.id} className="character-caracteristics-one-container">
                    <label className={"character-caracteristics-one-label"} htmlFor={element.name}>{functions.capitalizeFirstLetter(element.name)}</label>
                    <input className={"character-caracteristics-one-input"} min={0} max={3} name={element.name} type="number" onChange={handleChange} value={arrayCarac[element.name] ? arrayCarac[element.name] : 0}/>
                </div> : "")):""
            }
            </div>
            <div className={"character-caracteristics-stock-container"}>
                <div className={"character-caracteristics-stock-value"}><p>{stockCarac}</p></div>
                <div className={"character-caracteristics-stock-label"}><p>Points à attribuer</p></div>
            </div>
        </div>
    )
}

export default CaracteristicsGroup;