export default (identifiers = {currentIdentifiers: {steam: "", discord: "", fivem: "", show: false, name: ""}}, action: any) => {
	switch(action.type) {
		case 'GET_IDENTIFIERS':
			return identifiers;
		case 'SET_IDENTIFIERS': 
			return {currentIdentifiers: action.payload}
		default:
			return identifiers;
	}
}