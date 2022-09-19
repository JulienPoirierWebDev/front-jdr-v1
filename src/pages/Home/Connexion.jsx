import React, {useEffect, useState} from "react";
import requests from "../../services/requests";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import functions from "../../services/functions";


const Connexion = ({buttonImg}) => {

    const [connexionEmailValue, setConnexionEmailValue] = useState("");
    const [connexionPasswordValue, setConnexionPasswordValue] = useState("");
    const [testAlert, setTestAlert] = useState("");
    const [testAlertClass, setTestAlertClass] = useState("invalid");


    const [logged, setLogged] = useState(null);

    const storedJwt = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : null;
    const storedRefreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null
    const [jwt, setJwt] = useState(storedJwt || null);
    const [refreshToken, setRefreshToken] = useState(storedRefreshToken || null);

    let navigate = useNavigate();


    const login = async (data) => {
        // On indique dans les en-tête de la requête que l'on envoi du JSON
        let config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        //Lancement de la requête de connexion
        let result = await axios.post(requests.requestLogin, data, config);
        console.log(result)
        // On récupère le JWT et le refresh_token
        return [result.data.token, result.data['refresh_token']];
    }

    function handleChange(event) {
        if(event.target.name === "connexionEmail") {
            setConnexionEmailValue(event.target.value)
        } else if (event.target.name === "connexionPassword") {
            setConnexionPasswordValue(event.target.value);
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        if(connexionPasswordValue && connexionEmailValue){
            let data = {
                "username":connexionEmailValue,
                "password":connexionPasswordValue
            };
            await login(data).then( (res) => {
                    // Si promesse acceptée : on stocke les token et on change le loged pour rediriger
                    setJwt(res[0]);
                    setRefreshToken(res[1]);

                    localStorage.setItem("jwt",res[0]);
                    localStorage.setItem("refreshToken", res[1]);

                        setLogged(true);

                },
                    //Si promesse rejetée : on affiche l'échec
                    ()=> {
                    console.log("fail")
                        setTestAlert("Il y a un problème avec votre adresse email ou votre mot de passe : veuillez contacter votre MJ.")
                    });
            }
        }

    useEffect(() => {
        if(logged) {
            navigate("/vos-aventures");
        }
    }, [logged, navigate]);

    return (
        <div>
            <h2 className={"div-title"}>Se connecter</h2>
                <form className={"form"} action="">

                <div className={"form-div"}>
                    <label className={"form-label"} htmlFor="connexionEmail">Adresse e-mail</label>
                    <input className={"form-input"} type="email" name="connexionEmail" value={connexionEmailValue} onChange={handleChange}/>
                </div>
                <div className={"form-div"}>
                    <label className={"form-label"} htmlFor="connexionPassword">Mot de passe</label>
                    <input className={"form-input"} type="password" name="connexionPassword" value={connexionPasswordValue} onChange={handleChange}/>
                </div>
                <button className={"submit-button-wooden"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + buttonImg})`, backgroundSize: `100% 100%`}} onClick={handleLogin}>Connexion</button>
                <p className={testAlert ? testAlertClass : ""}>{testAlert}</p>
            </form>
        </div>
    )
}

export default Connexion;