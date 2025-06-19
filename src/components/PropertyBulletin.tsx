
import { useEffect, useState } from 'react';
import { Phone, Mail, Globe, Building, Crown, Save, Edit, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PCR_DATA } from '../utils/data';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import { type Property, type PCRDATATYPE } from '../utils/types';


const PropertyBulletin = () => {
  const [messageCheck, setMessageCheck] = useState("");
  const [toggleEdit, setToggleEdit] = useState(false);
  const [pcrData, setPcrData] = useState<PCRDATATYPE>({});
  const [editedData, setEditedData] = useState<PCRDATATYPE>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const cloudinaryConfig = { 
    cloudName: import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME, 
    uploadPreset: import.meta.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET, 
  }

  const { 
    headerTitle, 
    officeAddress, 
    officeEmail, 
    officeWebsite, 
    phoneNumberData, 
    propertyData, 
    companyName, 
    companyType,
  } = toggleEdit ? editedData : pcrData;

  // Pagination calculations
  const totalItems = propertyData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = propertyData?.slice(startIndex, endIndex) || [];

  // Reset to first page when properties change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const fetchGreeting = async () => {
    try {
      const response = await axios.get('https://pcr-backend-server.vercel.app/api/hello');
      return response?.data?.message;
    } catch (error) {
      console.error('Error fetching greeting:', error);
      throw error;
    }
  }

  useEffect(() => {
    setPcrData(PCR_DATA);
    setEditedData(PCR_DATA);
    fetchGreeting().then((greeting) => {
      console.log(greeting);
      setMessageCheck(greeting);
    });
  }, []);

  const handleAdminCheck = () => {
    console.log("Fetch Greetings:", messageCheck);
    setToggleEdit(!toggleEdit);
  };

  const handleSave = () => {
    setPcrData(editedData);
    setToggleEdit(false);
    // Here you would typically make an API call to save the data
    console.log("Saving data:", editedData);
  };

  const updateEditedData = (field: string, value: string | number | undefined) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // const updateProperty = (index: number, field: string, value: string) => {
  //   const actualIndex = startIndex + index; // Convert local index to global index
  //   setEditedData(prev => ({
  //     ...prev,
  //     propertyData: prev.propertyData?.map((prop, i) => 
  //       i === actualIndex ? { ...prop, [field]: value } : prop
  //     )
  //   }));
  // };

  const addProperty = () => {
    const newProperty: Property = {
      id: Date.now(),
      description: "New Property Description",
      location: "New Location",
      title: "New Property Title",
      price: "₦0",
      image: ""
    };
    setEditedData(prev => ({
      ...prev,
      propertyData: [...(prev.propertyData || []), newProperty]
    }));
    // Navigate to the last page to see the new property
    const newTotalPages = Math.ceil(((propertyData?.length || 0) + 1) / itemsPerPage);
    setCurrentPage(newTotalPages);
  };

  // const removeProperty = (index: number) => {
  //   const actualIndex = startIndex + index; // Convert local index to global index
  //   setEditedData(prev => ({
  //     ...prev,
  //     propertyData: prev.propertyData?.filter((_, i) => i !== actualIndex)
  //   }));
  // };

  const updatePhoneNumber = (index: number, field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      phoneNumberData: prev.phoneNumberData?.map((phone, i) => 
        i === index ? { ...phone, [field]: value } : phone
      )
    }));
  };

  const addPhoneNumber = () => {
    const newPhone = {
      id: Date.now(),
      phoneNumber: "New Phone Number",
      name: "New Name"
    };
    setEditedData(prev => ({
      ...prev,
      phoneNumberData: [...(prev.phoneNumberData || []), newPhone]
    }));
  };

  const removePhoneNumber = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      phoneNumberData: prev.phoneNumberData?.filter((_, i) => i !== index)
    }));
  };

  const EditableText = ({ 
    value, 
    onChange, 
    className = "", 
    multiline = false,
    placeholder = ""
  }: {
    value: string | undefined;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
  }) => {
    if (toggleEdit) {
      return multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`border border-gray-300 rounded px-2 py-1 w-full resize-none ${className}`}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`border border-gray-300 rounded px-2 py-1 w-full ${className}`}
          placeholder={placeholder}
        />
      );
    }
    return <span className={className}>{value}</span>;
  };

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    // eslint-disable-next-line prefer-const
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} properties
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 rounded hover:bg-gray-100 text-sm"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}
          
          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded text-sm ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 rounded hover:bg-gray-100 text-sm"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <EditableText
                value={headerTitle}
                onChange={(value) => updateEditedData('headerTitle', value)}
                className="text-3xl font-bold text-gray-900"
                placeholder="Header Title"
              />
            </h1>
            <h2 className="text-xl text-blue-600 font-semibold mb-4">
              PROPERTY BULLETIN
            </h2>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Office Address</h3>
                <div className="text-gray-600 md:w-[220px] w-[150px]">
                  <EditableText
                    value={officeAddress}
                    onChange={(value) => updateEditedData('officeAddress', value)}
                    className="text-gray-600"
                    multiline={true}
                    placeholder="Office address"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <EditableText
                    value={officeEmail}
                    onChange={(value) => updateEditedData('officeEmail', value)}
                    placeholder="Office email"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <EditableText
                    value={officeWebsite}
                    onChange={(value) => updateEditedData('officeWebsite', value)}
                    placeholder="Office website"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div className='md:w-[170px] w-[150px]'>
                    {phoneNumberData?.map((phone, index) => (
                      <div key={phone.id} className="flex items-center gap-1 mb-1">
                        <EditableText
                          value={phone.phoneNumber}
                          onChange={(value) => updatePhoneNumber(index, 'phoneNumber', value)}
                          className="text-sm"
                          placeholder="Phone number"
                        />
                        {toggleEdit && (
                          <button
                            onClick={() => removePhoneNumber(index)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {toggleEdit && (
                      <button
                        onClick={addPhoneNumber}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Phone
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-200 rounded-[4px] py-2 px-1">
                  {toggleEdit ? <Save className="w-4 h-4 text-green-600" /> : <Crown className="w-4 h-4 text-blue-600" />}
                  {toggleEdit ? (
                    <div className="flex gap-2">
                      <span 
                        onClick={handleSave} 
                        className="cursor-pointer text-green-600 hover:text-green-800"
                      >
                        Save Changes
                      </span>
                      <span 
                        onClick={() => setToggleEdit(false)} 
                        className="cursor-pointer text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </span>
                    </div>
                  ) : (
                    <span 
                      onClick={handleAdminCheck} 
                      className="cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Admin Section
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Houses for Sale */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                HOUSES FOR SALE
                {totalItems > 0 && (
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    ({totalItems} {totalItems === 1 ? 'property' : 'properties'})
                  </span>
                )}
              </h2>
            </div>
            {toggleEdit && (
              <button
                onClick={addProperty}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </button>
            )}
          </div>
          <div className="grid gap-6">
            {currentProperties.map((property, index) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                index={index} 
                toggleEdit={toggleEdit}
                setEditedData={setEditedData}
                startIndex={startIndex}
                cloudinaryConfig={cloudinaryConfig}
              />
            ))}
          </div>
          
          <PaginationControls />
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
            FOR FURTHER ENQUIRY AND INSPECTION
          </h2>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">
              Please Contact: <EditableText
                value={companyName}
                onChange={(value) => updateEditedData('companyName', value)}
                className="font-semibold"
                placeholder="Company name"
              />
            </p>
            <p className="text-gray-600">
              <EditableText
                value={companyType}
                onChange={(value) => updateEditedData('companyType', value)}
                className="text-gray-600"
                placeholder="Company type"
              />
            </p>
            <p className="text-blue-600 font-medium">
              <EditableText
                value={officeWebsite}
                onChange={(value) => updateEditedData('officeWebsite', value)}
                className="text-blue-600 font-medium"
                placeholder="Website"
              />
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {phoneNumberData?.slice(0, 2).map((number, index) => (
                <div key={number.id} className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>
                    <EditableText
                      value={number.phoneNumber}
                      onChange={(value) => updatePhoneNumber(index, 'phoneNumber', value)}
                      placeholder="Phone number"
                    />
                    {' - '}
                    <EditableText
                      value={number.name}
                      onChange={(value) => updatePhoneNumber(index, 'name', value)}
                      placeholder="Name"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertyBulletin;
