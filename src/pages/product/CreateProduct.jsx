import { useState, useContext, useRef } from "react";
import JoditEditor from "jodit-react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Layout from "../../layouts/Layout";
import WidgetGroup from "../../components/WidgetGroup";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import PropTypes from "prop-types";
import { UpdateContext } from "../../contexts/UpdateContext";

const CreateProduct = ({ productCategoryList }) => {
  //  set default category
  const category = productCategoryList.map((data) => data.id)[0];
  // state
  const [product, setProduct] = useState({
    name: null,
    description: "",
    detail: "",
    price: "",
    image: "",
    isActive: "true",
    categoryId: category,
  });

  let navigate = useNavigate();
  const postCollectionRef = collection(db, "products");

  // jodit text editor
  const editor = useRef(null);
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: "Write more detail about this product...",
  };

  //   update context
  const { setIsUpdated } = useContext(UpdateContext);

  //   handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "image") {
      setProduct({
        ...product,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  //   create product fucntion
  const createProduct = (imageUrl, imageId) => {
    addDoc(postCollectionRef, {
      name: product.name,
      description: product.description,
      detail: product.detail,
      price: product.price,
      image: imageUrl,
      imageId: imageId,
      // convert string to boolean because the value we get from the select form is string.
      isActive:
        typeof product.isActive === "string"
          ? JSON.parse(product.isActive.toLowerCase())
          : product.isActive,
      categoryId: product.categoryId,
    });

    console.log("Product created!", product.categoryName);
    // to update the data in the table
    setIsUpdated((prev) => !prev);
  };

  // upload image to firebase storage
  const uploadImageAndCreateProduct = () => {
    // navigate to product page in advance
    navigate("/product");

    // Concatenate full name and timestamp to create the ID
    const productNameNoSpaces = product.name.replace(/\s+/g, "");
    const timestamp = new Date().getTime();
    const imageId = `${productNameNoSpaces}_${timestamp}`;

    const imageRef = ref(storage, `productImages/${imageId}`);
    uploadBytes(imageRef, product.image).then(() => {
      // Get the download URL for the uploaded image
      getDownloadURL(imageRef)
        .then((downloadURL) => {
          console.log("image URL:", downloadURL);
          createProduct(downloadURL, imageId);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });

      console.log("product image uploaded");
    });
  };

  return (
    <Layout>
      {/* all widget in the dashboard */}
      <WidgetGroup />

      <div className="text-gray-900  border-gray-700 mt-6 rounded">
        {/* title */}
        <div className="text-center p-4 font-bold text-3xl text-red-600 underline uppercase">
          Create Product
        </div>
        <br />

        {/* create product categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* product name input */}
              <div className="w-full">
                <label className="font-bold text-xl">Product Name:</label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              {/* product image url input */}
              <div className="w-full">
                <label className="font-bold text-xl">Product Image:</label>
                <input
                  className="border border-gray-700 p-1.5 rounded w-full outline-none mb-5"
                  type="file"
                  name="image"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* category input */}
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">Category</label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="categoryId"
                  value={product.categoryId}
                  onChange={(e) => handleOnChange(e)}
                >
                  {productCategoryList.map((data) => (
                    <>
                      <option value={data.id}>{data.categoryName}</option>
                    </>
                  ))}
                </select>
              </div>
              {/* isActive input */}
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">Status</label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="isActive"
                  value={product.isActive}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value={true}>Enable</option>
                  <option value={false}>Disable</option>
                </select>
              </div>
            </div>

            {/* product price input */}
            <div>
              <label className="font-bold text-xl">Price</label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="number"
                name="price"
                value={product.price}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            {/* description input */}
            <label className="font-bold text-xl">Description:</label>
            <textarea
              placeholder="Write something to describe this product "
              rows={3}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="description"
              value={product.description}
              onChange={(e) => handleOnChange(e)}
            />

            {/* product detail input */}
            <label className="font-bold text-xl">Detail:</label>
            <div>
              <JoditEditor
                ref={editor}
                value={product.detail}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => {
                  setProduct({
                    ...product,
                    detail: newContent,
                  });
                }} // preferred to use only this option to update the content for performance reasons
                // onChange={(newContent) => setContent(newContent)}
              />
            </div>

            {/*create product button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                // check if all required input is filled
                product.name &&
                product.description &&
                product.price &&
                product.image
                  ? uploadImageAndCreateProduct
                  : notify
              }
            >
              Create Product
            </button>
          </div>
        </div>

        {/* toast alert */}
        <Toast />
      </div>
    </Layout>
  );
};
CreateProduct.propTypes = {
  productCategoryList: PropTypes.array.isRequired,
};
export default CreateProduct;
