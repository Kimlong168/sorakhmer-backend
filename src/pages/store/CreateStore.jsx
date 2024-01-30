import { useState, useContext } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack"
const CreateStore = () => {
  const [store, setStore] = useState({
    storeName: null,
    description: "",
    country: "",
    city: "",
    mapLink: "",
  });
  let navigate = useNavigate();
  const postCollectionRef = collection(db, "stores");

  //   update context
  const { setIsUpdated } = useContext(UpdateContext);

  //   handle onChange event for input
  const handleOnChange = (e) => {
    setStore({
      ...store,
      [e.target.name]: e.target.value,
    });
  };

  //   create store fucntion
  const createStore = () => {
    addDoc(postCollectionRef, {
      storeName: store.storeName,
      country: store.country,
      city: store.city,
      description: store.description,
      mapLink: store.mapLink,
    });

    console.log(" store created!", store.storeName);
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    navigate("/store");
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-orange-900 underline uppercase">
          Create Store
        </div>
        <br />

        {/* create product categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* store name input */}
            <label className="font-bold text-xl">Store Name<RedStar /></label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              placeholder="example: Bayon Market"
              type="text"
              name="storeName"
              value={store.storeName}
              onChange={(e) => handleOnChange(e)}
            />

            {/* country */}
            <label className="font-bold text-xl">Country<RedStar /></label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              placeholder="example: Japan"
              type="text"
              name="country"
              value={store.country}
              onChange={(e) => handleOnChange(e)}
            />

            {/* city */}
            <label className="font-bold text-xl">City<RedStar /></label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              placeholder="example: Tokyo"
              type="text"
              name="city"
              value={store.city}
              onChange={(e) => handleOnChange(e)}
            />

            {/* map */}
            <label className="font-bold text-xl">Google Map</label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="url"
              placeholder="copy link from google map and paste here"
              name="mapLink"
              value={store.mapLink}
              onChange={(e) => handleOnChange(e)}
            />

            {/* description input */}
            <label className="font-bold text-xl">Description</label>
            <textarea
              placeholder="Write something to describe this store (optional)"
              rows={4}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="description"
              value={store.description}
              onChange={(e) => handleOnChange(e)}
            />
            {/*check if storeName is not filled yet. */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                store.storeName && store.city && store.country
                  ? createStore
                  : notify
              }
            >
              Create Store
            </button>
          </div>
        </div>

        {/* toast alert */}
        <Toast />
        
            {/* button back */}
            <ButtonBack link="/store"/>
      </div>
    </Layout>
  );
};

export default CreateStore;
