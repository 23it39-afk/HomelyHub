
import { propertyAction } from "./property-slice";
import { axiosInstance } from "../../utils/axios";

// Get all properties
export const getAllProperties = () => async (dispatch, getState) => {
    try {
        console.log("API call started");
        console.log("BASE URL:", axiosInstance.defaults.baseURL);

        // Redux loading start
        dispatch(propertyAction.getRequest());

        // Get search parameters from Redux
        const { searchParams } = getState().properties;

        // Remove empty filter values
        const cleanSearchParams = Object.fromEntries(
            Object.entries(searchParams).filter(([key, value]) => {
                if (value === "" || value === undefined || value === null) {
                    return false;
                }

                if (Array.isArray(value) && value.length === 0) {
                    return false;
                }

                return true;
            })
        );

        console.log("SearchParams:", cleanSearchParams);

        // Backend API call
        const response = await axiosInstance.get("/v1/rent/listings", {
            params: cleanSearchParams,
        });

        console.log("API response:", response);

        if (!response) {
            throw new Error("Could not fetch any properties");
        }

        console.log("Property data:", response.data.data);

        // Send complete property data to Redux
        dispatch(propertyAction.getProperties(response.data));

    } catch (error) {
        console.error("Property API Error:", error);

        dispatch(
            propertyAction.getError(
                error.response?.data?.message || error.message
            )
        );
    }
};
