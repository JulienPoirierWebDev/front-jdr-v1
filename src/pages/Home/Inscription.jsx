import React, {useEffect, useState} from "react";
import requests from "../../services/requests";
import functions from "../../services/functions";
import api_roliste from "../../services/api_roliste";
import {useNavigate} from "react-router-dom";
import axios from "axios";


const Inscription = ({buttonImg}) => {


    const [inscriptionEmailValue, setInscriptionEmailValue] = useState("");
    const [inscriptionPasswordValue, setInscriptionPasswordValue] = useState("");
    const [inscriptionPasswordRepeatValue, setInscriptionPasswordRepeatValue] = useState("");
    const [validEmail, setValidEmail] = useState(null);
    const [checkEmail, setCheckEmail] = useState(null);
    const [testAlertEmail, setTestAlertEmail] = useState("");
    const [testAlertPassword, setTestAlertPassword] = useState("");

    const [testAlertClass, setTestAlertClass] = useState("");
    const [passwordHashed, setPasswordHashed] = useState("");

    const [registered, setRegistered] = useState(null);

    const storedJwt = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : null;
    const storedRefreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null
    const [jwt, setJwt] = useState(storedJwt || null);
    const [refreshToken, setRefreshToken] = useState(storedRefreshToken || null);

    let navigate = useNavigate();


    const hashPassword = async () => {
            const data = await api_roliste.postData(requests.requestHash, {"password":inscriptionPasswordValue}).then((response) => {
                return setPasswordHashed(response['data']["hydra:member"][0]);
            }).catch((error) => {
                console.log(error)
            });
    }


    const register = async (data) => {
       await api_roliste.postData(requests.requestUser, data);
    }

    const login = async (data) => {
        let config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        let result = await axios.post(requests.requestLogin, data, config);
        setJwt(result.data.token);
        setRefreshToken(result.data['refresh_token']);

        return [result.data.token, result.data['refresh_token']];


    }

    function setEmailIsValid() {
        if(functions.validateEmail(inscriptionEmailValue)) {
            setValidEmail(true)
        } else {
            setValidEmail(false)
        }
    }

    const handleChange = (event) => {

        if (event.target.name === "inscriptionEmail") {
            setInscriptionEmailValue(event.target.value);
        }
        else if (event.target.name === "inscriptionPassword") {
            setInscriptionPasswordValue(event.target.value);
            if(inscriptionPasswordRepeatValue && inscriptionPasswordValue) {
                if(inscriptionPasswordValue !== inscriptionPasswordRepeatValue) {
                    setTestAlertPassword("Les mots de passe ne correspondent pas.")
                }
            }
            if(!inscriptionPasswordValue || !inscriptionPasswordRepeatValue) {
                setTestAlertPassword("")
            }
        }
        else if (event.target.name === "inscriptionPasswordRepeat") {
            setInscriptionPasswordRepeatValue(event.target.value);
        }
    }

    const testPassword = ( ) => {
        if(inscriptionPasswordRepeatValue && inscriptionPasswordValue) {
            if(inscriptionPasswordValue !== inscriptionPasswordRepeatValue ) {
                setTestAlertPassword("Les mots de passe ne correspondent pas.")
            }
        }
        if(inscriptionPasswordValue === "" || inscriptionPasswordRepeatValue === "") {
            setTestAlertPassword("")
        }
    }


    const handleRegister = async (event) => {
        event.preventDefault();
        if(inscriptionPasswordValue === inscriptionPasswordRepeatValue){
            let data = {
                "email":inscriptionEmailValue,
                "password":passwordHashed,
                "roles": {1:"ROLE_USER"}
                };
            let registerResponse =  register(data);
            registerResponse.then( async () => {
                data = {
                    "username":inscriptionEmailValue,
                    "password":inscriptionPasswordValue
                };
                login(data).then( (res) => {
                        // Si promesse acceptée : on stocke les token et on change le loged pour rediriger
                        console.log(res[0])
                        setJwt(res[0]);
                        setRefreshToken(res[1]);

                        localStorage.setItem("jwt",res[0]);
                        localStorage.setItem("refreshToken", res[1]);
                        console.log(jwt)
                        console.log(res[0])
                        /*setReadyToNavigateAfterLogin(true);
                        if(readyToNavigateAfterLogin) {*/
                        setRegistered(true);
                        /*}*/

                    },
                    //Si promesse rejetée : on affiche l'échec
                    ()=> {
                        console.log("fail")
                    });
            })
        }
    }


    const testEmail = async () => {
        setTestAlertEmail("");
        const data = await api_roliste.postData(requests.requestCheck, {"email": inscriptionEmailValue});
        setCheckEmail(data['data']['hydra:member']);
        let testFormatEmail = functions.validateEmail(inscriptionEmailValue);
        if (!testFormatEmail && inscriptionEmailValue !== "") {
            setTestAlertEmail("Cet email n'est pas valide");
            setTestAlertClass("invalid");
        } else if (!data['data']['hydra:member'][0] && inscriptionEmailValue !== "") {
            setTestAlertEmail("Cet email est disponible");
            setTestAlertClass("valid");
        } else if( inscriptionEmailValue !== "") {
            setTestAlertEmail("Cet email est déja utilisé");
            setTestAlertClass("invalid");
        } else {
            setTestAlertEmail("");

        }
            }

    useEffect(() => {
        setEmailIsValid()
    }, [inscriptionEmailValue])


    useEffect( () => {
        hashPassword();
    },[inscriptionPasswordValue])

    useEffect(() => {
        if(registered) {
            navigate("/vos-aventures");
        }
    }, [registered]);

    return (
        <div >
            <h2 className={"div-title"}>S'inscrire</h2>
                <form className={"form"} action="">
                <div className={"form-div"}>
                    <label className={"form-label"} htmlFor="inscriptionEmail">Mail</label>
                    <input className={"form-input"} type="email" name="inscriptionEmail" value={inscriptionEmailValue}
                           onChange={handleChange} onBlur={testEmail}/>
                </div>
                <div className={"form-div"}>
                    <label className={"form-label"} htmlFor="inscriptionPaswword">Mot de passe</label>
                    <input className={"form-input"} type="password" name="inscriptionPassword" value={inscriptionPasswordValue}
                           onChange={handleChange} onBlur={testPassword}/>
                </div>
                <div className={"form-div"}>
                    <label className={"form-label"} htmlFor="inscriptionPasswordRepeat">Confirmation</label>
                    <input className={"form-input"} type="password" name="inscriptionPasswordRepeat" value={inscriptionPasswordRepeatValue}
                           onChange={handleChange} onBlur={testPassword}/>
                </div>
                <button className={"submit-button-wooden"} onClick={handleRegister} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg})`, backgroundSize: `100% 100%`}}>Inscription</button>

                <p className={testAlertEmail ? testAlertClass : ""}>{testAlertEmail}</p>
                <p className={testAlertPassword ? testAlertClass : ""}>{testAlertPassword}</p>
                </form>
        </div>
    )
}

export default Inscription;