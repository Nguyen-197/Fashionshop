import React, { useState } from 'react'
type IUserContextProps = {
    children: JSX.Element;
}
interface UserContextInterface {
}
export const UserContext = React.createContext<UserContextInterface | any>(null);

export function UserProvider(props: IUserContextProps) {

    const [userInfo ,setUserInfo] = useState(null);

    const setUserInfoFunc = (user) => {
        setUserInfo(Object.assign(user, userInfo));
    };

    return (
        <UserContext.Provider
            value={{
                userInfo: userInfo,
                setUserInfoFunc: setUserInfoFunc
            }}
        >
            { props.children }
        </UserContext.Provider>
    )
}