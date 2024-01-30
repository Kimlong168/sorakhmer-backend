import Layout from "../../layouts/Layout";
import { useContext } from "react";
import { Link } from "react-router-dom";
import TableHead from "../../components/TableHead";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Toast from "../../utils/Toast";
import { toastProps } from "../../utils/ToastProps";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import { UpdateContext } from "../../contexts/UpdateContext";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase-config";
import LoadingInTable from "../../components/LoadingInTable";
const Product = ({ productList, productCategoryList }) => {
  const { setIsUpdated } = useContext(UpdateContext);

  // delete product notify
  const notifyDeleting = (id, imageId) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            deleteItemFucntion(id, "products")
              .then((result) => {
                // call delete image function
                if (result) {
                  deleteImageFromStorage(imageId);
                }
              }) // This will log true if the item was deleted successfully
              .catch((error) => console.error(error));
          }}
          setIsUpdated={setIsUpdated}
        />
      </>,
      toastProps
    );
  };

  // delete image from firebase storage
  const deleteImageFromStorage = (imageId) => {
    const storageRef = ref(storage, `productImages/${imageId}`);
    deleteObject(storageRef)
      .then(() => {
        // File deleted successfully
        console.log("image deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };

  return (
    <Layout>
      <TableHead
        color="red"
        title="Products"
        border="border-red-600 text-red-600"
        link="/createProduct"
      />

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {productList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={10}>
                    <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}

              {productList.map((product, index) => (
                <>
                  <tr
                    key={product.id}
                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{product.name}</td>

                    <td className="px-4 py-3">
                      {productCategoryList &&
                        productCategoryList.map((data) => {
                          if (data.id == product.categoryId) {
                            return data.categoryName;
                          }
                        })}
                    </td>
                    <td className="px-4 py-3">{product.price} $</td>
                    <td className="px-4 py-3">
                      {product.isActive ? "Enable" : "Disable"}
                    </td>
                    <td className="px-4 py-3">
                      {product.image ? (
                        <img
                          className="min-w-[70px] h-[50px] rounded-sm"
                          src={product.image}
                          loading="lazy"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center cursor-pointer">
                      <Link to={`/productDetail/${product.id}`}>
                        <div className="px-2 py-1.5 rounded bg-yellow-500 text-white cursor-pointer">
                          View
                        </div>
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-sm text-center">
                      <Link to={`/updateProduct/${product.id}`}>
                        <div className="px-2 py-1.5 rounded bg-green-600 text-white">
                          Edit
                        </div>
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-sm text-center cursor-pointer">
                      <div
                        onClick={() =>
                          notifyDeleting(product.id, product.imageId)
                        }
                        className="px-2 py-1.5 rounded bg-red-600 text-white"
                      >
                        Delete
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"></div>
      </div>

      {/* toast alert */}
      <Toast />
    </Layout>
  );
};
Product.propTypes = {
  productList: PropTypes.array.isRequired,
  productCategoryList: PropTypes.array.isRequired,
};
export default Product;
