import React, { createContext, useContext, useState } from "react"

type UserConfig = {
  theme: "light" | "dark"
  name: string
}
type UserConfigContextType = {
  state: UserConfig
  dispatch: {
    setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>
  }
}
type UserConfigProviderType = { children: React.ReactNode }

const INITIAL_USER_CONFIGS: UserConfig = {
  theme: "light",
  name: "John Doe",
}
const INITIAL_USER_CONFIGS_CONTEXT_VALUE: UserConfigContextType = {
  state: INITIAL_USER_CONFIGS,
  dispatch: {
    setUserConfig: () => undefined,
  },
}

const UserConfigContext = createContext<UserConfigContextType | undefined>(INITIAL_USER_CONFIGS_CONTEXT_VALUE)
const { Provider } = UserConfigContext

const UserProvider: React.FC<UserConfigProviderType> = ({ children }) => {
  const [userConfig, setUserConfig] = useState(INITIAL_USER_CONFIGS)
  const contextValue: UserConfigContextType = {
    state: userConfig,
    dispatch: { setUserConfig },
  }
  return <Provider value={contextValue}>{children}</Provider>
}

export const useUserConfig = () => {
  const context = useContext(UserConfigContext)
  if (context === undefined) {
    throw new Error("useUserConfig must be used within a UserProvider")
  }
  return context
}

export default UserProvider
