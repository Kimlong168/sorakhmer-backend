import { Link } from "react-router-dom";
import { useContext } from "react";
import { UpdateContext } from "../../contexts/UpdateContext";
import Layout from "../../layouts/Layout";
import TableHead from "../../components/TableHead";
import Toast from "../../utils/Toast";
import { toast } from "react-toastify";
import { toastProps } from "../../utils/toastProps";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import LoadingInTable from "../../components/LoadingInTable";
import { DataContext } from "../../contexts/DataContext";
const Store = () => {
  const { storeList } = useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);

  // delete category notify
  const notifyDeleting = (id) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => deleteItemFucntion(id, "stores")}
          setIsUpdated={setIsUpdated}
        />
      </>,
      toastProps
    );
  };

  return (
    <Layout>
      <TableHead
        color="rgb(124,45,18)"
        title="Store"
        border="border-orange-900 text-orange-900"
        link="/createStore"
      />

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Store Name</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Map</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {storeList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold" colSpan={10}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}
              {storeList.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3">{item.storeName}</td>
                  <td className="px-4 py-3">{item.country}</td>
                  <td className="px-4 py-3">{item.city}</td>
                  <td className="px-4 py-3  line-clamp-3 hover:line-clamp-none">
                    {item.address}
                  </td>
                  <td className="px-4 py-3">{item.phone}</td>
                  <td className="px-4 py-3 ">
                    {item.mapLink.trim() !== "" ? (
                      <span
                        className="text-blue-400 underline"
                        title={item.mapLink}
                      >
                        <Link to={item.mapLink}>link</Link>
                      </span>
                    ) : (
                      "No Map"
                    )}
                  </td>
                  <td className="px-4 py-3 line-clamp-3 hover:line-clamp-none">
                    {item.description}
                  </td>

                  {/* edit button */}
                  <td className="px-4 py-3 text-sm text-center">
                    <Link to={`/updateStore/${item.id}`}>
                      <div className="px-2 py-1.5 rounded bg-green-600 text-white">
                        Edit
                      </div>
                    </Link>
                  </td>

                  {/* delete button */}
                  <td className="px-4 py-3 text-sm text-center cursor-pointer">
                    <div
                      onClick={() => notifyDeleting(item.id)}
                      className="px-2 py-1.5 rounded bg-red-600 text-white"
                    >
                      Delete
                    </div>
                  </td>
                </tr>
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

export default Store;
