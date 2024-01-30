import { useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layouts/Layout";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import { BsTrash } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import validateEmail from "../../utils/ValidateEmailFunction";
import Loading from "../../components/Loading";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack"
const UpdateContact = () => {
  const { id: contactParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const [contact, setContact] = useState({
    phoneNumber: null,
    email: "",
    telegram: "",
    socialMedia: [
      {
        title: "",
        url: "",
      },
    ],
  });

  useEffect(() => {
    const docRef = doc(db, "contact", contactParams);

    // fetch a field of data from firebase by contactParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);
          setContact({
            phoneNumber: data.phoneNumber,
            email: data.email,
            telegram: data.telegram,
            socialMedia: data.socialMedia,
          });

          console.log("data", data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [contactParams]);

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

  let navigate = useNavigate();

  async function updateContact() {
    const docRef = doc(db, "contact", contactParams);
    if (!validateEmail(contact.email)) {
      alert("Please enter a valid email address");
      setContact({
        ...contact,
        email: "",
      });
      return;
    }
    await setDoc(
      docRef,
      {
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        telegram: contact.telegram,
        socialMedia: contact.socialMedia,
      },
      { merge: true }
    );
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    navigate("/contact");
  }
  if (contact.phoneNumber === null) {
    return (
      <>
        <Layout>
          <Loading />
        </Layout>
      </>
    );
  }

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded mt-5">
        {/* update contact data form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* contact section */}
            <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
              <legend className="text-xl md:text-4xl uppercase font-bold text-purple-500">
                Update Contact Information
              </legend>
              {/* email name input */}
              <label className="font-bold text-xl">
                Phone number
                <RedStar />
              </label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                placeholder="example: 012345678"
                type="tel"
                name="phoneNumber"
                value={contact.phoneNumber}
                onChange={(e) => handleContactChange(e)}
              />
              {/* email name input */}
              <label className="font-bold text-xl">
                Email
                <RedStar />
              </label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="email"
                name="email"
                value={contact.email}
                onChange={(e) => handleContactChange(e)}
              />
              {/* telegram name input */}
              <label className="font-bold text-xl">
                Telegram username
                <RedStar />
              </label>
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
                <div>
                  Social Media
                  <RedStar />
                </div>
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

              {/* update contact button */}
              <button
                className="bg-gray-700 text-white font-bold p-2 mt-2 rounded w-full"
                onClick={
                  contact.email &&
                  contact.phoneNumber &&
                  contact.telegram &&
                  contact.socialMedia
                    ? updateContact
                    : notify
                }
              >
                Update Contact
              </button>
            </fieldset>

            {/* toast alert */}
            <Toast />
            
            {/* button back */}
            <ButtonBack link="/contact"/>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateContact;
