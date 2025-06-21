
import { useEffect, useState, useMemo } from 'react';
import { Phone, Mail, Globe, Building, Crown, Save, Plus, Trash2 } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { type Property, type PCRDATATYPE } from '../utils/types';
import EditableText from './EditableText';
import PaginationControls from './Pagination';
import { handleReset, handleSaveData, handleFetchData, handleFetchUserData, handleAuth } from '../services/api';
import Loader from './Loader';
import { getLocalStorageObject } from '../utils/data';
import AuthModal from "../auth/AuthModal";
import { toast } from 'sonner';
import Swal from 'sweetalert2';



interface SwalResult {
  isConfirmed: boolean;
  isDenied: boolean;
}

const PropertyBulletin = () => {
  const [toggleEdit, setToggleEdit] = useState(false);
  const [pcrData, setPcrData] = useState<PCRDATATYPE>({});
  const [editedData, setEditedData] = useState<PCRDATATYPE>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", email: "", password: "" });
  const [adminChecker, setAdminChecker] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const cloudinaryConfig = { cloudName: cloudName, uploadPreset: uploadPreset }

  // Admin email constant
  const ADMIN_EMAIL = useMemo(() => (["ogbogukenny@yahoo.com", "nelshantel101@gmail.com"]), []);

  const { 
    headerTitle, 
    officeAddress, 
    officeEmail, 
    officeWebsite, 
    phoneNumberData, 
    propertyData, 
    companyName, 
    companyType,
  } = toggleEdit && adminChecker ? editedData : pcrData;

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

  useEffect(() => {
    handleFetchData(setPcrData, setIsPageLoading, setError);
    handleFetchUserData(profileData, setProfileData, setIsTokenExpired);
    console.log("User Data Checking:", profileData);
    console.log("Has Token Expired:", `${isTokenExpired ? "Yes" : "No"}`);
    console.log("Is User Logged In:", `${isLoggedIn ? "Yes" : "No"}`);
    console.log("Is The Admin Logged In:", `${adminChecker ? "Yes" : "No"}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Updated admin checker to ensure user is logged in AND has admin email
  useEffect(() => {
    const isAdmin = !!(isLoggedIn && profileData?.email && ADMIN_EMAIL.includes(profileData.email) && !isTokenExpired);
    setAdminChecker(isAdmin);
    
    // If user loses admin privileges while in edit mode, exit edit mode
    if (!isAdmin && toggleEdit) {
      setToggleEdit(false);
    }
  }, [profileData.email, isLoggedIn, isTokenExpired, toggleEdit, ADMIN_EMAIL]);

  // Retry function
  const handleRetry = () => {
    handleFetchData(setPcrData, setIsPageLoading, setError);
  };

  if (isPageLoading) {
    return (
      <Loader retry={handleRetry} error={error} />
    )
  }

  const handleAdminCheck = async () => {
    // Only allow admin access for authenticated admin user
    if (!isLoggedIn) {
      setModalOpen(true);
      return;
    }

    const errorStylingOptions = {
      duration: 3000,
      className: "bg-red-50 border border-red-400 text-red-800 shadow-md",
    }
    
    if (!adminChecker) {
      toast.error("Access denied!", errorStylingOptions);

      const result: SwalResult = await Swal.fire({
        title: 'Sign in again?',
        text: "Do you want to sign in with a different account?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I want to sign in!',
        cancelButtonText: `No, I don't want to sign in!`
      });

      if (result.isConfirmed) {
        setModalOpen(true);
        return;
      }

      if (result.isDenied) {
        toast.error("Access denied!", errorStylingOptions);
        return;
      }
    }

    setPcrData(getLocalStorageObject("PCR_DATA"));
    setEditedData(getLocalStorageObject("PCR_DATA"));
    setToggleEdit(!toggleEdit);
  }

  const updateEditedData = (field: string, value: string | number | undefined) => {
    // Only allow updates if user is admin
    if (!adminChecker) return;
    
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addProperty = () => {
    // Only allow adding properties if user is admin
    if (!adminChecker) return;
    
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
      propertyData: [newProperty, ...(prev.propertyData || [])]
    }));
    setCurrentPage(1);
  };

  const updatePhoneNumber = (index: number, field: string, value: string) => {
    // Only allow updates if user is admin
    if (!adminChecker) return;
    
    setEditedData(prev => ({
      ...prev,
      phoneNumberData: prev.phoneNumberData?.map((phone, i) => 
        i === index ? { ...phone, [field]: value } : phone
      )
    }));
  };

  const addPhoneNumber = () => {
    // Only allow adding phone numbers if user is admin
    if (!adminChecker) return;
    
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
    // Only allow removing phone numbers if user is admin
    if (!adminChecker) return;
    
    setEditedData(prev => ({
      ...prev,
      phoneNumberData: prev.phoneNumberData?.filter((_, i) => i !== index)
    }));
  };

  const handleSaveChanges = () => {
    // Only allow saving if user is admin
    if (!adminChecker) {
      alert("Access denied. Only authorized admin can save changes.");
      return;
    }
    handleSaveData(editedData, setToggleEdit, setPcrData, setIsPageLoading, setError);
  };

  const handleResetData = () => {
    // Only allow reset if user is admin
    if (!adminChecker) {
      alert("Access denied. Only authorized admin can reset data.");
      return;
    }
    handleReset(setPcrData, setIsPageLoading, setError);
  };

  const handleSignOut = () => {
    handleAuth("SIGNOUT", profileData?.name);
    setIsLoggedIn(false);
    setToggleEdit(false); // Exit edit mode when signing out
  };

  // Function to refresh user data and admin status
  const refreshUserData = () => {
    handleFetchUserData(profileData, setProfileData, setIsTokenExpired);
    // Reset admin checker will be handled by useEffect
  };




  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto md:px-6 px-2 md:py-8 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <EditableText
                value={headerTitle}
                onChange={(value) => updateEditedData('headerTitle', value)}
                className="md:text-3xl text-2xl font-bold text-gray-900"
                placeholder="Header Title"
                toggleEdit={toggleEdit && adminChecker}
              />
            </h1>
            <h2 className="md:text-xl text-lg text-blue-700 font-semibold mb-4">
              PROPERTY BULLETIN
            </h2>
          </div>
          
          <div className="bg-blue-100 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Office Address</h3>
                <div className="text-gray-600 md:w-[220px] w-[96%]">
                  <EditableText
                    value={officeAddress}
                    onChange={(value) => updateEditedData('officeAddress', value)}
                    className="text-gray-600"
                    multiline={true}
                    placeholder="Office address"
                    toggleEdit={toggleEdit && adminChecker}
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
                    toggleEdit={toggleEdit && adminChecker}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <EditableText
                    value={officeWebsite}
                    onChange={(value) => updateEditedData('officeWebsite', value)}
                    placeholder="Office website"
                    toggleEdit={toggleEdit && adminChecker}
                  />
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div className='md:w-[170px] w-[98%] grid grid-cols-3 gap-x-2'>
                    {phoneNumberData?.map((phone, index) => (
                      <div key={phone.id} className="flex items-center gap-1 mb-1">
                        <EditableText
                          value={phone.phoneNumber}
                          onChange={(value) => updatePhoneNumber(index, 'phoneNumber', value)}
                          className="text-sm"
                          placeholder="Phone number"
                          toggleEdit={toggleEdit && adminChecker}
                        />&nbsp;
                        {toggleEdit && adminChecker && (
                          <button
                            onClick={() => removePhoneNumber(index)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {toggleEdit && adminChecker && (
                      <button
                        onClick={addPhoneNumber}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Phone
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-300 rounded-[4px] py-2 px-2 
                  shadow-md shadow-green-950/20">
                  {
                    toggleEdit 
                      ? <Save className="w-4 h-4 text-green-600" /> 
                      : <Crown className="w-4 h-4 text-blue-600" />
                  }
                  {toggleEdit ? (
                    <div className="flex gap-3">
                      {adminChecker && (
                        <div className='flex md:gap-6 gap-7 justify-between'>
                          <span 
                            onClick={handleSaveChanges} 
                            className="cursor-pointer text-green-600 hover:text-green-800"
                          >
                            Save
                          </span>
                          <span 
                            onClick={() => setToggleEdit(false)} 
                            className="cursor-pointer text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </span>
                          <span 
                            onClick={handleResetData} 
                            className="cursor-pointer text-red-400 hover:text-red-800"
                          >
                            Reset
                          </span>
                          <span 
                            onClick={handleSignOut} 
                            className="cursor-pointer text-slate-800 hover:text-slate-800"
                          >
                            Sign out
                          </span>
                        </div>
                      )}
                      {!adminChecker && isLoggedIn && (
                        <div className='flex gap-6'>
                          <span 
                            onClick={handleSignOut} 
                            className="cursor-pointer text-slate-800 hover:text-slate-800"
                          >
                            Sign out
                          </span>
                          <span 
                            onClick={() => setToggleEdit(false)} 
                            className="cursor-pointer text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span 
                      onClick={handleAdminCheck} 
                      className="cursor-pointer flex items-center gap-1 text-slate-600"
                    >
                      {/* <Edit className="w-4 h-4" /> */}
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
      <div className="max-w-6xl mx-auto md:px-6 px-2 md:py-8 py-6">
        {/* Houses for Sale */}
        <section className="mb-12">
          <div className="flex md:items-center items-start justify-between md:mb-6 mb-12">
            <div className="flex md:items-center items-start gap-3">
              <Building className="w-6 h-6 text-blue-600 md:mt-0 mt-[6px]" />
              <h2 className="text-2xl font-bold text-gray-900 flex md:flex-row flex-col 
                md:justify-normal justify-center md:items-center items-start">
                HOUSES FOR SALE
                {totalItems > 0 && (
                  <span className="text-lg font-normal text-gray-600 md:ml-2 ml-0">
                    (&nbsp;{totalItems} {totalItems === 1 ? 'property' : 'properties'}&nbsp;)
                  </span>
                )}
              </h2>
            </div>
            {toggleEdit && adminChecker && (
              <button
                onClick={addProperty}
                className="flex md:items-center items-start gap-2 md:px-4 px-3 md:py-2 py-2 
                bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-end 
                md:mt-0 mt-[6px] md:leading-normal leading-[22px]"
              >
                <Plus className="w-5 h-5" />
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
                toggleEdit={toggleEdit && adminChecker}
                setEditedData={setEditedData}
                startIndex={startIndex}
                cloudinaryConfig={cloudinaryConfig}
                adminChecker={adminChecker}
              />
            ))}
          </div>
          
          <PaginationControls 
            setItemsPerPage={setItemsPerPage} 
            setCurrentPage={setCurrentPage} 
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
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
                toggleEdit={toggleEdit && adminChecker}
              />
            </p>
            <p className="text-gray-600">
              <EditableText
                value={companyType}
                onChange={(value) => updateEditedData('companyType', value)}
                className="text-gray-600"
                placeholder="Company type"
                toggleEdit={toggleEdit && adminChecker}
              />
            </p>
            <p className="text-blue-600 font-medium">
              <EditableText
                value={officeWebsite}
                onChange={(value) => updateEditedData('officeWebsite', value)}
                className="text-blue-600 font-medium"
                placeholder="Website"
                toggleEdit={toggleEdit && adminChecker}
              />
            </p>
            <div className='flex items-start gap-2'>
              <Phone className="w-4 h-4 text-blue-600 md:mt-0 mt-2" />
              <div className="grid grid-cols-2 gap-x-4">
                {phoneNumberData?.map((number) => (
                  <div key={number.id} className="flex items-center gap-x-1">
                    <a 
                      href={`tel:${number.phoneNumber}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <span>{number.phoneNumber}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Auth Modal */}
      {modalOpen && (
        <AuthModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          setIsLoggedIn={setIsLoggedIn} 
          onAuthSuccess={refreshUserData} 
        />
      )}
    </div>
  );
};

export default PropertyBulletin;
