import { useEffect, useState, useContext } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { useParams } from "react-router-dom";
import { UpdateContext } from "../../contexts/UpdateContext";
import Loading from "../../components/Loading";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import AutoSuggestInput from "../../components/AutoSuggestInput";
import { cities, countries } from "../../utils/cityAndCountryList";
import { DataContext } from "../../contexts/DataContext";
const UpdateStore = () => {
  const { id: storeParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [store, setStore] = useState({
    storeName: null,
    description: "",
    country: "",
    city: "",
    address: "",
    phone: "",
    mapLink: "",
  });

  let navigate = useNavigate();

  //   handle onChange event for input
  const handleOnChange = (e) => {
    setStore({
      ...store,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "stores", storeParams);

    // fetch a field of data from firebase by storeParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);
          setStore({
            storeName: data.storeName,
            country: data.country,
            city: data.city,
            address: data.address,
            phone: data.phone,
            description: data.description,
            mapLink: data.mapLink,
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [storeParams]);

  //   update category if all required fields are filled
  async function updateStore() {
    const docRef = doc(db, "stores", storeParams);
    await setDoc(
      docRef,
      {
        storeName: store.storeName,
        country: store.country.trim(),
        city: store.city.trim(),
        address: store.address,
        phone: store.phone,
        description: store.description,
        mapLink: store.mapLink,
      },
      { merge: true }
    );

    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "store",
      action: "updated",
    });
    navigate("/store");
    console.log("store updated");
  }

  // loading until data is fetched
  if (store.storeName === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-gray-900  border-gray-900 mt-6 rounded">
        {/* title */}
        <div className="text-center p-4 font-bold text-3xl text-orange-900 underline uppercase">
          Update Store
        </div>
        <br />
        {/* update form */}
        <section className="pt-0">
          {/* store name input */}
          <label className="font-bold text-xl">
            Store Name
            <RedStar />
          </label>
          <input
            className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            placeholder="example: Bayon Market"
            type="text"
            name="storeName"
            value={store.storeName}
            onChange={(e) => handleOnChange(e)}
          />
          {/* country */}
          <label className="font-bold text-xl">
            Country
            <RedStar />
          </label>
          <AutoSuggestInput
            data={countries}
            name="country"
            placeholder="example: Japan"
            value={store.country}
            setValue={(newValue) => {
              setStore({ ...store, country: newValue });
            }}
          />

          {/* city */}
          <label className="font-bold text-xl">
            City
            <RedStar />
          </label>
          <AutoSuggestInput
            data={cities}
            name="city"
            placeholder="example: Tokyo"
            value={store.city}
            setValue={(newValue) => {
              setStore({ ...store, city: newValue });
            }}
          />

          {/* address */}
          <label className="font-bold text-xl">Address</label>
          <input
            className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            type="text"
            name="address"
            value={store.address}
            onChange={(e) => handleOnChange(e)}
          />

          {/* phone */}
          <label className="font-bold text-xl">Phone</label>
          <input
            className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            type="tel"
            name="phone"
            value={store.phone}
            onChange={(e) => handleOnChange(e)}
          />

          {/* map */}
          <label className="font-bold text-xl">Google Map</label>
          <input
            className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            type="url"
            name="mapLink"
            placeholder="copy link from google map and paste here"
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

          {/* update button */}
          <button
            className="bg-gray-700 w-full  text-white font-bold p-2 mt-2 rounded"
            onClick={
              store.storeName && store.city && store.country
                ? updateStore
                : notify
            }
          >
            Update Category
          </button>
          {/* toast alert */}
          <Toast />

          {/* button back */}
          <ButtonBack link="/store" />
        </section>
      </div>
    </Layout>
  );
};

export default UpdateStore;
