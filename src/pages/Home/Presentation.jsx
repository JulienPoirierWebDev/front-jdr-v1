import React from "react";

//import "../../styles/presentation.css"

const Presentation = () => {
    return (
        <div>
            <div className={"presentation-container"}>
                <h2 className={"div-title"}>Explications</h2>
            <p>L'application "Roliste" est un système de jeu de rôle en ligne, permettant d'organiser des parties où les joueurs et le maitre du jeu interagissent à partir d'un chat.</p>
            <p>Le maitre du jeu peut organiser, créer et modifier les élements du monde, que ce soit la géographie, le peuple qui y habite ainsi que les quêtes que les héros pourront suivre (ou non).</p>
            <p>Le système de jeu vise a rendre le jeu plus pratique, simple et rapide, tout en laissant une grande liberté de jeu et de choix au maitre du jeu et aux joueurs. L'objetcif est d'assister la maitrise sans en réduire les possibilités.</p>
            <p>Cette application a été créer dans le cadre de la validation du diplôme de développeur web. Il ne s'agit pas d'une application commerciale.</p>
            </div>
        </div>
    )
}

export default Presentation;