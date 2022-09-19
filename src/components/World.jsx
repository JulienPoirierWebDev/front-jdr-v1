import React from "react";


const World = ({key, title, content, real}) => {
    if(real == false) {
    return (
        <div>
            <p>Hello</p>
        </div>
    )
    }

    return (
        <div>
            <h3>{title}</h3>
            <p>{content}</p>
        </div>
    )
}

export default World;