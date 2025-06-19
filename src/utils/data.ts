import PCR_PICS from '../assets/img/pcr-image1.jpg';
import type { PCRDATATYPE } from './types';


export const MAIN_URL = "https://pcr-backend-server.vercel.app/api";

export const setLocalStorageObject = (key: string, obj: PCRDATATYPE) => {
    localStorage.setItem(key, JSON.stringify(obj));
}

export const getLocalStorageObject = (key: string) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error parsing localStorage item:', error);
        return null;
    }
}

export const housesForSale = [
    {
        id: 1,
        description: "Brand new and exquisitely finished 5 bedroom detached smart house with BQ",
        location: "Peaceville Estate, Idado - Lekki",
        title: "C of O & Approved Building Plan",
        price: "₦550M (ONO)",
        image: PCR_PICS,
    },
    {
        id: 2,
        description:"Brand New 9 nos. 2 bedroom luxury flats with 1-room BQ in a serene Estate",
        location: "Agungi/Idado area, Lekki",
        title: "Governor's Consent",
        price: "₦80M/unit",
        image: PCR_PICS,
    },
    {
        id: 3,
        description: "Almost completed 6 nos. detached houses with 1-room BQ each",
        location: "Peaceville Estate, Idado - Lekki",
        title: "Good",
        price: "4 bedrooms - ₦230M, 5 bedrooms - ₦260M",
        image: PCR_PICS,
    },
    {
        id: 4,
        description: "Brand new 2 nos. 5 bedroom detached houses with BQ each",
        location: "Ocean Bay Estate, Orchid Road",
        title: "Governor's Consent",
        price: "₦230M/unit",
        image: PCR_PICS,
    },
    {
        id: 5,
        description: "5 bedroom detached house with 2-rooms BQ, swimming pool on 800sqm",
        location: "Northern Foreshore Estate, Off Chevron Drive, Lekki",
        title: "Governor's Consent",
        price: "₦500M",
        image: PCR_PICS,
    },
    {
        id: 6,
        description: "Brand new and spacious 1 & 2 bedroom flats",
        location: "Lekki Phase 1",
        title: "Governor's Consent",
        price: "₦180M & ₦220M respectively",
        image: PCR_PICS,
    },
    {
        id: 7,
        description: "Almost completed smart 5 bedroom detached house with 2 rooms & swimming pool",
        location: "Northern Foreshore Estate, Off Chevron Drive, Lekki",
        title: "Governor's Consent",
        price: "₦750M",
        image: PCR_PICS,
    },
    {
        id: 8,
        description: "Serviced 4 bedroom townhouse with 1-room BQ",
        location: "Ikate, Lekki",
        title: "Governor's Consent",
        price: "₦260M",
        image: PCR_PICS,
    },
];

export const PCR_DATA = {
    companyName: "Jide Onasile & Co.",
    companyType: "Chartered Estate Surveyors & Valuers",
    headerTitle: "JIDE ONASILE & CO PROPERTIES",
    officeAddress: "Suite C6 Elegushi Plaza, IWS Close Jakande, KM 15, Lekki/Epe Expressway, Lekki, Lagos",
    officeEmail: "info@jideonasileandco.com",
    phoneNumberData: [
        { id: 1, phoneNumber: "08026772294", name: "Jide Onasile" },
        { id: 2, phoneNumber: "08032797503", name: "Jide Onasile" },
        { id: 3, phoneNumber: "08022928395", name: "Seyi" },
        { id: 4, phoneNumber: "09044306491", name: "Seyi" },
    ],
    officeWebsite: "www.jideonasileandco.com",
    propertyData: housesForSale,
}

