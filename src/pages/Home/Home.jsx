import React, {useState} from "react";
import Title from "../../components/Title";
import Connexion from "./Connexion";
import Inscription from "./Inscription";
import Presentation from "./Presentation";
import Footer from "../../components/Footer";

import "../../styles/app.css"
import "../../styles/home.css"


const Home = () => {
    const [buttonImg, setButtonImg] = useState("\"/media/visuel/plank_15.png\"")

    return (
        <div className={"body-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/background-bricks.jpg"})`,     backgroundSize: `cover`}}>
            <div className={"app-wrapper"}>
                <div className={"app-container"}>
                    <Title/>
               <div className={"board-wrapper"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/media/visuel/woodpanel.svg"})`,     backgroundSize: `cover`}}>
                   <div className={"board-container"}>
                       <div className={"login-container"}>
                            <Connexion buttonImg={buttonImg}/>
                            <Inscription buttonImg={buttonImg}/>
                        </div>
                        <Presentation/>
                        <Footer/>
                   </div>
               </div>
           </div>
        </div>
        </div>
    )
}

export default Home;

/*              <img className={"board-paper"} src={process.env.PUBLIC_URL + "/media/visuel/page.svg"} alt=""/>
*/