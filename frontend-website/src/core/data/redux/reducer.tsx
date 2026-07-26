import initialState from "./initial.values";

const rootReducer: number | string | boolean = (state = initialState, action: number | string | boolean) => {
  switch (action.type) {
    case "HEADER_DATA":
      return { ...state, header_data: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
