import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
	const [values, setValues] = useState(initialState);

	const onChange = (event) => {
		// Need to spread first or else will become overwritten
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	const onSubmit = (event) => {
		event.preventDefault();
		callback(); // Depedning on your page used in the call back will be differerent, keeping code modular
	};

	return {
		onChange,
		onSubmit,
		values,
	};
};
