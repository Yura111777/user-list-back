import React from "react";

const UserListItem = ({img, name, email, positions}) => {
    return (
        <li>
            <div className="flex">
                <img src={img === 'default.png' ?  `./img/users/${img}`  : img} alt="user avatar" />
                <div className="info">
                    <span className="name">
                        {name}
                    </span>
                    <span className="email">
                        {email}
                    </span>
                    <span className="positions">
                        {positions}
                    </span>
                </div>
            </div>
           
        </li>
    )
}

export default UserListItem;