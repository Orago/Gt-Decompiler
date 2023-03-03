function query (url, { replace = false } = {}) {
	const searchParams = new URL(url || location.href).searchParams;

	return {
		set: (key, value) => {
			if (searchParams.has(key))
				searchParams.delete(key);

			searchParams.append(key, value);

			const path = window.origin + '?' + searchParams.toString();

			if (replace == true)
				window.history.replaceState({ path }, '', path);

			return value;
		},
		get: (key) => searchParams.get(key),
		obj: () => searchParams,
		clear: () => {
			if (replace == true)
				window.history.replaceState({
					path: window.origin
				}, '', window.origin)
		}
	}

}

export default query;