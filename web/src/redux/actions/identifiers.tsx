interface identifiers {
	steam: string,
	discord: string,
	fivem: string,
	show: boolean,
	name: string
}

export const setIdentifiers = (currentIdentifiers: identifiers) => async (dispatch: any) => {
	try {
			dispatch({
					type: 'SET_IDENTIFIERS',
					payload: currentIdentifiers /* data */
			})
	} catch (error) {
			console.log(error)
	}
}