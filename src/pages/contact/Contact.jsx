import Layout from "../../layouts/Layout";
import LinkIcon from "../../components/LinkIcon";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../contexts/DataContext";
const Contact = () => {
  const { contactList } = useContext(DataContext);
  const contact = contactList[0];
  const [time, setTime] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [time]);

  if (!contact)
    return (
      <Layout>
        {time < 10 ? (
          <div>
            {time > 5 && (
              <span className="text-xl text-red-600">
                Please wait for 5s more...
              </span>
            )}
            <Loading />
          </div>
        ) : (
          <div>
            <div className="text-xl mb-4">
              Click the button below to create contact
            </div>
            <Link to="/createContact">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600">
                Create
              </button>
            </Link>
          </div>
        )}
      </Layout>
    );

  return (
    <Layout>
      <div className="w-full overflow-auto">
        <fieldset className="border border-gray-700 p-8 rounded-md shadow-md mb-10 relative">
          <legend className="text-xl md:text-4xl uppercase font-bold text-purple-500">
            Contact Information
          </legend>
          <table className="text-xl">
            <tbody>
              <tr>
                <td className="pr-10 pb-3">Phone Number:</td>
                <td className="pr-10 pb-3">{contact.phoneNumber}</td>
              </tr>
              <tr>
                <td className="pr-10 pb-3">Email:</td>
                <td className="pr-10 pb-3">{contact.email}</td>
              </tr>
              <tr>
                <td className="pr-10 pb-3">Telegram Username:</td>
                <td className="pr-10 pb-3 underline text-blue-400">
                  <Link to={contact.telegram}>{contact.telegram}</Link>
                </td>
              </tr>
              <tr>
                <td className="pr-10 pb-3">Social Media:</td>
                <td className="pr-10 pb-3">
                  <div className="flex flex-wrap gap-3">
                    {contact.socialMedia &&
                      contact.socialMedia.map((item, index) => (
                        <Link to={item.url} key={index}>
                          <LinkIcon title={item.title} />
                        </Link>
                      ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {/* button */}
          {contactList.length > 0 ? (
            <Link to={`/updateContact/${contact.id}`}>
              <button className="absolute top-0 right-4 px-4 py-1.5 rounded hover:shadow-xl text-sm text-white font-bold bg-green-600 flex gap-3 justify-center items-center">
                <FiEdit /> Edit
              </button>
            </Link>
          ) : (
            <button className="bg-red-500 absolute top-0 right-4 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600">
              Create
            </button>
          )}
        </fieldset>
      </div>
    </Layout>
  );
};

export default Contact;
