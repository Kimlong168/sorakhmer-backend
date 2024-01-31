import { Link } from "react-router-dom";
import Layout from "../../layouts/Layout";
import TableHead from "../../components/TableHead";
import { toast } from "react-toastify";
import Toast from "../../utils/Toast";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { storage } from "../../firebase-config";
import { deleteObject, ref } from "firebase/storage";
import { useContext, useState } from "react";
import { UpdateContext } from "../../contexts/UpdateContext";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import { toastProps } from "../../utils/ToastProps";
import LoadingInTable from "../../components/LoadingInTable";
import PopupImage from "../../components/PopupImage";
const Award = ({ awardList }) => {
  const { setIsUpdated } = useContext(UpdateContext);
  const [showImage, setShowImage] = useState({
    open: false,
    image: null,
  });
  // delete category notify
  const notifyDeleting = (id, awardLogoId) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            // isDeleted = await deleteItemFucntion(id, "partners");
            deleteItemFucntion(id, "awards")
              .then((result) => {
                // call delete image function
                if (result) {
                  deleteImageFromStorage(awardLogoId);
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
  const deleteImageFromStorage = (awardLogoId) => {
    // Create a reference to the image you want to delete
    const imageRef = ref(storage, `awardImages/${awardLogoId}`);

    // Delete the old image
    deleteObject(imageRef)
      .then(() => {
        console.log("award Logo deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  return (
    <Layout>
      <TableHead
        color="purple"
        title="Award"
        border="border-purple-400 text-purple-400"
        link="/createAward"
      />

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Award Name</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Awarded By</th>
                <th className="px-4 py-3">Recieve Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {awardList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 font-bold text-white" colSpan={8}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}

              {awardList.map((item, index) => (
                <>
                  <tr
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.awardName}</td>
                    <td className="px-4 py-3">
                      <img
                        onClick={() => {
                          setShowImage({
                            image: item.awardLogo,
                            open: true,
                          });
                        }}
                        className="w-[100px] cursor-pointer"
                        src={item.awardLogo}
                        loading="lazy"
                      />
                      {showImage.open && showImage.image == item.awardLogo && (
                        <PopupImage
                          image={item.awardLogo}
                          setShowImage={(condition) => {
                            setShowImage({
                              image: item.awardLogo,
                              open: condition,
                            });
                            setShowImage({
                              image: null,
                              open: false,
                            });
                          }}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">{item.awardedBy}</td>
                    <td className="px-4 py-3">{item.recieveDate}</td>
                    <td className="px-4 py-3">
                      <div className="line-clamp-1 break-all  hover:line-clamp-none max-w-[300px] cursor-pointer transition-all transition-delay-300">
                        {item.description}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-center">
                      <Link to={`/updateAward/${item.id}`}>
                        <div className="px-2 py-1.5 rounded bg-green-600 text-white">
                          Edit
                        </div>
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-sm text-center cursor-pointer">
                      <div
                        onClick={() =>
                          notifyDeleting(item.id, item.awardLogoId)
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

      {/* Toast alert */}
      <Toast />
    </Layout>
  );
};
Award.propTypes = {
  awardList: PropTypes.array.isRequired,
};
export default Award;
