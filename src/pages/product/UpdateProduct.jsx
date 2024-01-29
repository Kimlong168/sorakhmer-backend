import { useEffect, useState, useContext, useRef } from "react";
import JoditEditor from "jodit-react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { useParams } from "react-router-dom";
import { UpdateContext } from "../../contexts/UpdateContext";
import Loading from "../../components/Loading";
import PropTypes from "prop-types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import RedStar from "../../components/RedStar";

const UpdateProduct = ({ productCategoryList }) => {
  const { id: productParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const [product, setProduct] = useState({
    name: null,
    description: "",
    detail: "",
    price: "",
    image: "",
    imageId: "",
    isActive: "",
    categoryId: "",
  });

  const [oldImageUrl, setOldImageUrl] = useState(null);

  let navigate = useNavigate();
  // jodit text editor
  const editor = useRef(null);
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: "Write more detail about this product...",
  };

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
  useEffect(() => {
    const docRef = doc(db, "products", productParams);

    // fetch a field of data from firebase by productParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);
          setProduct({
            name: data.name,
            description: data.description,
            detail: data.detail,
            price: data.price,
            isActive: data.isActive,
            categoryId: data.categoryId,
            imageId: data.imageId,
            // no need to get image
            image: null,
          });

          // get old image url
          setOldImageUrl(data.image);
          console.log("data", data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [productParams]);

  //   update product if all required fields are filled
  async function updateProduct() {
    // navigate to product detail page in advance
    navigate("/productDetail/" + productParams);

    const docRef = doc(db, "products", productParams);

    // if image is not updated
    if (product.image === null) {
      await setDoc(
        docRef,
        {
          name: product.name,
          description: product.description,
          detail: product.detail,
          price: product.price,
          imageId: product.imageId,
          image: oldImageUrl,
          // convert string to boolean
          isActive:
            typeof product.isActive === "string"
              ? JSON.parse(product.isActive.toLowerCase())
              : product.isActive,
          categoryId: product.categoryId,
        },
        { merge: true }
      );
      // to update the data in the table
      setIsUpdated((prev) => !prev);
    } else {
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `productImages/${product.imageId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log(product.name, "image deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `productImages/${product.imageId}`);
      uploadBytes(imageRef, product.image).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("new image URL:", downloadURL);
            // update data in the firestore with a new image url and new data
            updateProductAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new product image uploaded");
      });
    }

    console.log("product updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updateProduct function because we need to get the new image url first
  async function updateProductAndNewImage(newImageUrl) {
    const docRef = doc(db, "products", productParams);
    await setDoc(
      docRef,
      {
        name: product.name,
        description: product.description,
        detail: product.detail,
        price: product.price,
        imageId: product.imageId,
        // new image url
        image: newImageUrl,
        // convert string to boolean
        isActive:
          typeof product.isActive === "string"
            ? JSON.parse(product.isActive.toLowerCase())
            : product.isActive,
        categoryId: product.categoryId,
      },
      { merge: true }
    );
    // to update the data in the table
    setIsUpdated((prev) => !prev);
  }

  // loading until data is fetched
  if (product.name === null) {
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
        <div className="text-center p-4 font-bold text-3xl text-red-600 underline uppercase">
          Update Product
        </div>
        <br />

        {/* update product form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* product name input */}
              <div className="w-full">
                <label className="font-bold text-xl">
                  Product Name
                  <RedStar />
                </label>
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
                <label className="font-bold text-xl">Product Image</label>
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
                  {productCategoryList &&
                    productCategoryList.map((data) => (
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
              <label className="font-bold text-xl">
                Price ($)
                <RedStar />
              </label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="number"
                name="price"
                value={product.price}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            {/* description input */}
            <label className="font-bold text-xl">
              Description
              <RedStar />
            </label>
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
            <label className="font-bold text-xl">Detail</label>
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
                }}
              />
            </div>

            {/* update button */}
            <button
              className="bg-gray-700 w-full  text-white font-bold p-2 mt-2 rounded"
              onClick={
                // check if all required input is filled
                product.name && product.description && product.price
                  ? updateProduct
                  : notify
              }
            >
              Update Product
            </button>
          </div>
        </div>

        {/* toast alert */}
        <Toast />
      </div>
    </Layout>
  );
};
UpdateProduct.propTypes = {
  productCategoryList: PropTypes.array,
};
export default UpdateProduct;
