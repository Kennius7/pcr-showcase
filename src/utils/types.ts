export type Property = {
    id: string | number;
    description: string;
    location: string;
    title: string;
    price?: string;
    rent?: string;
    note?: string;
    image?: string;
};

export type PCRDATATYPE = {
    headerTitle?: string;
    officeAddress?: string;
    officeEmail?: string;
    officeWebsite?: string;
    phoneNumberData?: {
        id: number;
        phoneNumber: string;
        name: string;
    }[];
    propertyData?: Property[];
    companyName?: string;
    companyType?: string;
};

export interface EditableTextProps {
    value: string | undefined;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
    allowImageUpload?: boolean;
    cloudinaryConfig?: {
        cloudName: string;
        uploadPreset: string;
    };
    toggleEdit: boolean; // Added this as it was referenced but not in props
}


