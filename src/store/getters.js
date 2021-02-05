const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.oidcStore.access_token,
  avatar: state => "",//state.oidcStore.oidcUser.sub,
  name: state => state.oidcStore.oidcUser.display_name
}
export default getters
