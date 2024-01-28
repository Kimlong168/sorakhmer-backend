import { useContext, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import { BsTrash } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import validateEmail from "../../utils/ValidateEmailFunction";
const CreateContact = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const [contact, setContact] = useState({
    phoneNumber: "",
    email: "",
    telegram: "",
    socialMedia: [
      {
        title: "",
        url: "",
      },
    ],
  });

  // const [placeToBuy, setPlaceToBuy] = useState([
  //   {
  //     shopName: "",
  //     shopLocation: "",
  //     country: "",
  //   },
  // ]);

  // const [process, setProcess] = useState([
  //   {
  //     title: "",
  //     description: "",
  //   },
  // ]);

  // handle onChange event for input
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (index, e) => {
    const { name, value } = e.target;
    setContact((prevContact) => {
      const updatedSocialMedia = [...prevContact.socialMedia];
      updatedSocialMedia[index] = {
        ...updatedSocialMedia[index],
        [name]: value,
      };
      return { ...prevContact, socialMedia: updatedSocialMedia };
    });
  };

  // add new link
  const addLink = () => {
    setContact({
      ...contact,
      socialMedia: [...contact.socialMedia, { title: "", url: "" }],
    });
  };

  // remove link
  const removeLink = (index) => {
    const updatedLinks = contact.socialMedia.filter((_, i) => i !== index);
    setContact({
      ...contact,
      socialMedia: updatedLinks,
    });
  };

  // const handlePlaceToBuyChange = (index, e) => {
  //   const { name, value } = e.target;
  //   setPlaceToBuy((prevPlaceToBuy) => {
  //     const updatedPlaceToBuy = [...prevPlaceToBuy];
  //     updatedPlaceToBuy[index] = {
  //       ...updatedPlaceToBuy[index],
  //       [name]: value,
  //     };
  //     return updatedPlaceToBuy;
  //   });
  // };

  // const handleProcessChange = (index, e) => {
  //   const { name, value } = e.target;
  //   setProcess((prevProcess) => {
  //     const updatedProcess = [...prevProcess];
  //     updatedProcess[index] = {
  //       ...updatedProcess[index],
  //       [name]: value,
  //     };
  //     return updatedProcess;
  //   });
  // };

  let navigate = useNavigate();
  const postCollectionRef = collection(db, "contact");

  const createContact = () => {
    // if the email is not valid
    if (!validateEmail(contact.email)) {
      alert("Email is valid");
      setContact({
        ...contact,
        email: "",
      });
    } else {
      // if the email is valid

      navigate(`/contact`);
      // add author to firestore
      addDoc(postCollectionRef, {
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        telegram: contact.telegram,
        socialMedia: contact.socialMedia,
      });
      // to update the data in the table
      setIsUpdated((prev) => !prev);
      console.log("company contact added");
    }
  };

  

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-purple-400 underline uppercase">
          Create Company Award
        </div>
        <br />

        {/* create dynamic data form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* contact section */}
            <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
              <legend className="text-xl uppercase font-bold text-purple-500">
                Contact Information
              </legend>
              {/* email name input */}
              <label className="font-bold text-xl">Phone number:</label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="text"
                name="phoneNumber"
                value={contact.phoneNumber}
                onChange={(e) => handleContactChange(e)}
              />
              {/* email name input */}
              <label className="font-bold text-xl">Email:</label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="email"
                name="email"
                value={contact.email}
                onChange={(e) => handleContactChange(e)}
              />
              {/* telegram name input */}
              <label className="font-bold text-xl">Telegram username:</label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="text"
                name="telegram"
                placeholder="example : https://t.me/kimlong_chann"
                value={contact.telegram}
                onChange={(e) => handleContactChange(e)}
              />
              {/* social media input */}
              <h2 className="font-bold text-xl flex items-center justify-between mb-2">
                Social Media
                <button
                  className="uppercase text-sm text-green-600 flex items-center gap-2"
                  onClick={addLink}
                >
                  Add Link
                  <IoMdAddCircleOutline color="green" size="20" />
                </button>
              </h2>

              {contact.socialMedia.map((socialMedia, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="title"
                    placeholder="title"
                    value={socialMedia.title}
                    onChange={(e) => handleSocialMediaChange(index, e)}
                  />
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="url"
                    name="url"
                    placeholder="url"
                    value={socialMedia.url}
                    onChange={(e) => handleSocialMediaChange(index, e)}
                  />

                  {/* icon to delete each link */}
                  {contact.socialMedia.length > 1 && (
                    <button
                      className="grid place-items-center"
                      title="remove link"
                      onClick={() => removeLink(index)}
                    >
                      <BsTrash color="red" size="20" />
                    </button>
                  )}
                </div>
              ))}
            </fieldset>

            {/* place to buy section */}
            {/* <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
              <legend className="text-xl uppercase font-bold text-purple-500">
                Place to buy
              </legend>
   

              {placeToBuy.map((place, index) => (
                <div key={index} className="flex items-center gap-4">
           
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="shopName"
                    placeholder="shop name"
                    value={place.shopName}
                    onChange={(e) => handlePlaceToBuyChange(index, e)}
                  />

              
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="shopLocation"
                    placeholder="shop location"
                    value={place.shopLocation}
                    onChange={(e) => handlePlaceToBuyChange(index, e)}
                  />
                
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="country"
                    placeholder="country"
                    value={place.country}
                    onChange={(e) => handlePlaceToBuyChange(index, e)}
                  />
                </div>
              ))}
            </fieldset> */}

            {/* process section */}
            {/* <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
              <legend className="text-xl uppercase font-bold text-purple-500">
                Process
              </legend>
       
              {process.map((process, index) => (
                <div key={index}>
                  <label className="font-bold text-xl">Title:</label>
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="title"
                    placeholder="title"
                    value={process.title}
                    onChange={(e) => handleProcessChange(index, e)}
                  />
              
                  <label className="font-bold text-xl">Description:</label>
                  <textarea
                    placeholder="description"
                    rows={3}
                    value={process.description}
                    name="description"
                    onChange={(e) => handleProcessChange(index, e)}
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  />
                </div>
              ))}
            </fieldset> */}

            {/* create partner button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                contact.email &&
                contact.phoneNumber &&
                contact.telegram &&
                contact.socialMedia
                  ? createContact
                  : notify
              }
            >
              Create Contact
            </button>

            {/* toast alert */}
            <Toast />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateContact;
