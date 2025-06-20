
// import { useState } from 'react';
import { MapPin, Home, Trash2 } from 'lucide-react';
import { type Property, type PCRDATATYPE } from '../utils/types';
import EditablePropContent from './EditablePropContent';


const PropertyCard = ({ 
    property, 
    index, 
    type = "sale", 
    toggleEdit, 
    setEditedData, 
    startIndex, 
    cloudinaryConfig, 
    adminChecker,
}: {
    property: Property;
    index: number;
    type?: "sale" | "shortlet";
    toggleEdit: boolean;
    setEditedData: React.Dispatch<React.SetStateAction<PCRDATATYPE>>;
    startIndex: number;
    cloudinaryConfig?: {
        cloudName: string;
        uploadPreset: string;
    };
    adminChecker: boolean;
}) => {
    const updateProperty = (index: number, field: string, value: string) => {
        const actualIndex = startIndex + index; // Convert local index to global index
        setEditedData(prev => ({
            ...prev,
            propertyData: prev.propertyData?.map((prop, i) =>
                i === actualIndex ? { ...prop, [field]: value } : prop
            )
        }));
    };

    const removeProperty = (index: number) => {
        const actualIndex = startIndex + index; // Convert local index to global index
        setEditedData(prev => ({
            ...prev,
            propertyData: prev.propertyData?.filter((_, i) => i !== actualIndex)
        }));
    };



    return (
        <div className="flex md:flex-row flex-col md:justify-between justify-center md:items-start 
            items-center bg-white border border-gray-200 rounded-lg md:p-6 p-2 shadow-sm hover:shadow-md 
            transition-shadow relative"
        >
            {toggleEdit && adminChecker && (
                <button
                    onClick={() => removeProperty(index)}
                    className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 rounded text-red-600"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
            <div className="flex items-start gap-3 mb-4 flex-1">
                {
                    window.innerWidth > 500 ? (
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Home className="w-5 h-5 text-blue-600" />
                        </div>
                    ) : null
                }
                <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2 leading-relaxed">
                        <EditablePropContent
                            value={property.description}
                            onChange={(value) => updateProperty(index, 'description', value)}
                            className="font-semibold text-gray-900"
                            multiline={true}
                            placeholder="Property description"
                            toggleEdit={toggleEdit}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <EditablePropContent
                            value={property.location}
                            onChange={(value) => updateProperty(index, 'location', value)}
                            className="text-sm"
                            placeholder="Property location"
                            toggleEdit={toggleEdit}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm">
                            <span className="font-medium text-gray-700">Title: </span>
                            <EditablePropContent
                                value={property.title}
                                onChange={(value) => updateProperty(index, 'title', value)}
                                className="text-gray-600"
                                placeholder="Property title"
                                toggleEdit={toggleEdit}
                            />
                        </div>
                        <div className="text-lg font-bold text-green-600">
                            <EditablePropContent
                                value={type === "shortlet" ? property.rent : property.price}
                                onChange={(value) => updateProperty(index, type === "shortlet" ? 'rent' : 'price', value)}
                                className="text-lg font-bold text-green-600"
                                placeholder="Price"
                                toggleEdit={toggleEdit}
                            />
                        </div>
                        {(property.note || toggleEdit) && (
                            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                <EditablePropContent
                                    value={property.note}
                                    onChange={(value) => updateProperty(index, 'note', value)}
                                    className="text-sm text-blue-600"
                                    placeholder="Additional notes (optional)"
                                    toggleEdit={toggleEdit}
                                />
                            </div>
                        )}
                        {toggleEdit && (
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Image URL: </span>
                                <EditablePropContent
                                    value={property?.image || ""}
                                    onChange={(value) => updateProperty(index, 'image', value)}
                                    className="text-gray-600"
                                    placeholder="Image URL"
                                    toggleEdit={toggleEdit}
                                    allowImageUpload={true}
                                    cloudinaryConfig={cloudinaryConfig}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='md:w-[350px] w-full'>
                <img
                    src={property.image}
                    alt='property image'
                    className="w-full h-[300px] object-cover rounded-[6px]"
                />
            </div>
        </div>
    )
}

export default PropertyCard
