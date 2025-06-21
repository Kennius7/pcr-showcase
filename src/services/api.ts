import { toast } from 'sonner';
import axios from 'axios';
import Swal from 'sweetalert2';
import { PCR_DATA, MAIN_URL, setLocalStorageObject } from '../utils/data';
import { type PCRDATATYPE } from '../utils/types';



interface SwalResult {
    isConfirmed: boolean;
}

interface ApiErrorResponse {
    message?: string;
    error?: string;
    [key: string]: unknown;
}

interface UserProfileData {
    name: string;
    email: string;
    password: string;
    [key: string]: unknown;
}

type SetProfileData = (data: UserProfileData) => void;
type SetIsTokenExpired = (expired: boolean) => void;

const successStylingOptions = {
    duration: 3000,
    className: "bg-green-50 border border-green-400 text-green-800 shadow-md",
}

const errorStylingOptions = {
    duration: 3000,
    className: "bg-red-50 border border-red-400 text-red-800 shadow-md",
}

let signUpOptions;
let signInOptions;
let signOutOptions;



//? ==================================================================================
//? ==================================================================================

export const handleFetchData = async (
    setPcrData: (data: PCRDATATYPE) => void,
    setIsPageLoading: (loading: boolean) => void,
    setError: (error: string) => void
) => {
    setIsPageLoading(true);
    console.log("Fetching data...");
    try {
        const response = await axios.get(`${MAIN_URL}/product?apiType=GETPRODUCTS`);
        const fetchedData = response?.data?.data[0];
        // console.log('Fetched data:', fetchedData);
        setPcrData(fetchedData);
        // localStorage.setItem('PCR_DATA', JSON.stringify(fetchedData));
        setLocalStorageObject('PCR_DATA', fetchedData);
        // console.log('Set LocalStorage data:', getLocalStorageObject('PCR_DATA'));
        setIsPageLoading(false);
    } catch (error: unknown) {
        let errorMessage: string = 'Failed to fetch data';

        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with error status
                const status: number = error.response.status;
                const errorData: ApiErrorResponse = error.response.data;
                
                switch (status) {
                    case 400:
                        errorMessage = errorData?.message || 'Bad request - Invalid parameters';
                        setError(errorMessage);
                        break;
                    case 401:
                        errorMessage = 'Unauthorized - Please login again';
                        setError(errorMessage);
                        break;
                    case 403:
                        errorMessage = 'Forbidden - Access denied';
                        setError(errorMessage);
                        break;
                    case 404:
                        errorMessage = 'Data not found';
                        setError(errorMessage);
                        break;
                    case 500:
                        errorMessage = 'Server error - Please try again later';
                        setError(errorMessage);
                        break;
                    default:
                        errorMessage = errorData?.message || `Error: ${status}`;
                        setError(errorMessage);
                }
            } else if (error.request) {
                errorMessage = 'Network error - Check your connection';
                setError(errorMessage);
            } else if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'ECONNABORTED') {
                errorMessage = 'Request timeout - Please try again';
                setError(errorMessage);
            } else {
                errorMessage = (error as Error).message || 'An unexpected error occurred';
                setError(errorMessage);
            }
        } else if (error instanceof Error) {
            errorMessage = error.message || 'An unexpected error occurred';
            setError(errorMessage);
        }
        setError(errorMessage);
        console.error('API Error:', errorMessage, error);
    }
}

//? ==================================================================================
//? ==================================================================================

export const handleReset = async ( 
    setPcrData: (data: PCRDATATYPE) => void,
    setIsPageLoading: (loading: boolean) => void,
    setError: (error: string) => void
) => {
    console.log("Resetting data...");

    const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to continue with this action?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, continue!",
        cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
        console.log("User confirmed - continuing execution");

        const successMessage = "Data posted successfully!"
        const errorMessage = "Failed to post data"

        try {
            const loadingToast = toast.loading("Posting data...");
            const response = await axios.post(`${MAIN_URL}/product`, {
                ...PCR_DATA,
                apiType: "POST_INIT_PROPERTY_DATA",
            });
            console.log("Data posted successfully:", response.data);
            toast.dismiss(loadingToast);
            toast.success(successMessage, successStylingOptions);
            handleFetchData(setPcrData, setIsPageLoading, setError);
            return response.data;
        } catch (error) {
            toast.dismiss();
            let errorMsg = errorMessage;
            if (axios.isAxiosError(error)) {
                errorMsg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                errorMessage;
            } else if (error instanceof Error) {
                errorMsg = error.message || errorMessage;
            }
            toast.error(errorMsg, errorStylingOptions);
            console.error("Error posting data:", errorMsg);
            throw error;
        }
    } else {
        console.log("User cancelled - stopping execution");
        return; // Exit the function
    }
};

//? ==================================================================================
//? ==================================================================================

export const handleSaveData = async (
    editedData: PCRDATATYPE,
    setToggleEdit: (value: boolean) => void,
    setPcrData: (data: PCRDATATYPE) => void,
    setIsPageLoading: (loading: boolean) => void,
    setError: (error: string) => void
) => {
    console.log("Saving data...");

    const result: SwalResult = await Swal.fire({
        title: 'Save?',
        text: "Do you want to continue with this action?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I want to save!',
        cancelButtonText: `No, I don't want to save`
    });

    if (result.isConfirmed) {
        console.log('User confirmed - continuing execution');

        const successMessage = 'Data saved successfully!'
        const errorMessage = 'Failed to save data';

        try {
            const loadingToast: string | number = toast.loading('Saving data...');
            const response = await axios.post(`${MAIN_URL}/product`, {...editedData, apiType: "POST_SAVED_PROPERTY_DATA"});
            console.log('Data saved successfully:', response.data);
            toast.dismiss(loadingToast);
            toast.success(successMessage, successStylingOptions);
            handleFetchData(setPcrData, setIsPageLoading, setError);
            setToggleEdit(false);
            return response.data;
        } catch (error: unknown) {
            toast.dismiss();
            let errorMsg: string = errorMessage;
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMsg = error.message || errorMessage;
            }
            toast.error(errorMsg, errorStylingOptions);
            console.error('Error saving data:', errorMsg);
            throw error;
        }
    } else {
        console.log('User cancelled - stopping execution');
        return; // Exit the function
    }
}


//? ==================================================================================
//? ==================================================================================

export const handleAuth = async (
    apiType: string, 
    email?: string, 
    password?: string, 
    name?: string, 
    setIsLoggedIn?: (value: boolean) => void,
    setProfileData?: (value: { name: string, email: string, password: string }) => void,
    profileData?: { name: string, email: string, password: string }
) => {
    console.log("Handling authentication>>>>>:", apiType, email, password, name);
    if (apiType === "SIGNUP") {
        console.log("Signing up user...");
        if (!name || !email || !password) {
            console.error('Name, email, and password are required.');
            return;
        }

        const {
            successMessage = 'Signed Up successfully!',
            errorMessage = 'Failed to sign up!',
        } = signUpOptions || {};

        try {
            const loadingToast: string | number = toast.loading('Signing Up...');
            const response = await axios.post(`${MAIN_URL}/auth`, { name, email, password, apiType });
            toast.dismiss(loadingToast);
            toast.success(successMessage, successStylingOptions);
            console.log("Sign Up Response:", response.data);
            return response.data;
        } catch (error: unknown) {
            toast.dismiss();
            let errorMsg: string = errorMessage;
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMsg = error.message || errorMessage;
            }
            toast.error(errorMsg, errorStylingOptions);
            console.error('Error signing up:', errorMsg);
            throw error;
        }
    } else if (apiType === "SIGNIN") {
        console.log("Logging in user...");
        if (!email || !password) {
            console.error('email and password are required.');
            return;
        }

        const {
            successMessage = 'Signed in successfully!',
            errorMessage = 'Failed to sign in!',
        } = signInOptions || {};

        try {
            const loadingToast: string | number = toast.loading('Signing in...');
            const response = await axios.post(`${MAIN_URL}/auth`, { email, password, apiType });
            const fetchedToken = response?.data?.token;
            localStorage.setItem("user-token", fetchedToken);
            toast.dismiss(loadingToast);
            toast.success(successMessage, successStylingOptions);
            console.log("Sign In Response:", response.data);
            if (setIsLoggedIn) {
                setIsLoggedIn(true);
            }
            return response.data;
        } catch (error: unknown) {
            toast.dismiss();
            let errorMsg: string = errorMessage;
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMsg = error.message || errorMessage;
            }
            toast.error(errorMsg, errorStylingOptions);
            console.error('Error signing in:', errorMsg);
            throw error;
        }
    } else {
        console.log("Signing out user...");
        const {
            successMessage = 'Signed out successfully!',
            errorMessage = 'Failed to sign out!',
        } = signOutOptions || {};

        try {
            const loadingToast: string | number = toast.loading('Signing out...');
            const response = await axios.post(`${MAIN_URL}/auth`, { apiType, name });
            toast.dismiss(loadingToast);
            toast.success(successMessage, successStylingOptions);
            console.log("Sign Out Response:", response.data);
            localStorage.removeItem("user-token");
            if (setIsLoggedIn) {
                setIsLoggedIn(true);
            }
            if (setProfileData) {
                setProfileData({ ...profileData, name: "", email: "", password: "" });
            }
            return response.data;
        } catch (error: unknown) {
            toast.dismiss();
            let errorMsg: string = errorMessage;
            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMsg = error.message || errorMessage;
            }
            toast.error(errorMsg, errorStylingOptions);
            console.error('Error signing out:', errorMsg);
            throw error;
        }
    }
}


//? ==================================================================================
//? ==================================================================================

export const handleFetchUserData = async (
    profileData: UserProfileData,
    setProfileData: SetProfileData,
    setIsTokenExpired: SetIsTokenExpired
): Promise<void> => {
    const userToken = localStorage.getItem("user-token");
    console.log("User Token: >>>>", userToken);
    const apiType = "FETCHUSERDATA"; 
    try {
        const response = await axios.get(`${MAIN_URL}/user`, {
            params: { apiType },
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${userToken}`,
            },
            // withCredentials: false,
        });
        const { name, email } = response.data.data;
        console.log("Fetched Profile Data: ", response.data.data);

        setProfileData({ 
            ...profileData, 
            name: name, 
            email: email,
        });
        console.log("Updated Profile Data: ", profileData);
        setIsTokenExpired(false);
    } catch (error) {
        let errorMessage: string = '';
        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data;
        }
        if (userToken && errorMessage === "Invalid Token!") setIsTokenExpired(true);
        console.error("Error downloading profile data: >>>>", error);
    }
}



