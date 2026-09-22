
import { propertyDetailAction } from "./PropertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

// Get property details by ID
export const getPropertyDetails = (id) => async (dispatch) => {
  try {
    dispatch(propertyDetailAction.getRequest());

    const response = await axiosInstance.get(`/v1/rent/listings/${id}`);
    console.log("FULL DETAIL RESPONSE:", response.data);
    console.log("PROPERTY DATA:", response.data.data);

    console.log("Property Detail API Response:", response);

    if (!response) {
      throw new Error("Could not fetch property details");
    }
    const{data}=response.data;
    dispatch(propertyDetailAction.getPropertyDetails(response.data.data));

  } catch (error) {
    console.error("Property Detail API Error:", error);

    dispatch(
      propertyDetailAction.getError(
        error.response?.data?.message || error.message
      )
    );
  }
};