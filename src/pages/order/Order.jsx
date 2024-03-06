import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UpdateContext } from "../../contexts/UpdateContext";
import Layout from "../../layouts/Layout";
import TableHead from "../../components/TableHead";
import Toast from "../../utils/Toast";
import { toast } from "react-toastify";
import { toastProps } from "../../utils/toastProp";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import LoadingInTable from "../../components/LoadingInTable";
import { DataContext } from "../../contexts/DataContext";
import checkSocialMedia from "../../utils/checkSocialMedia";
import { db } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import getStatusColor from "../../utils/getStatusColor";
const Order = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { orderList } = useContext(DataContext);
  const [isStatusUpdated, setIsStatusUpdated] = useState({
    status: false,
    id: "1",
  });
  // delet eOrder notify
  const notifyDeleting = (id) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => deleteItemFucntion(id, "orders")}
          setIsUpdated={setIsUpdated}
        />
      </>,
      toastProps
    );
  };

  //   handle change status
  const handleChangeStatus = (e, id) => {
    const newStatus = e.target.value;
    updateOrderStatus(newStatus, id);
  };

  //   update Order
  async function updateOrderStatus(newStatus, id) {
    const docRef = doc(db, "orders", id);

    await setDoc(
      docRef,
      {
        status: newStatus,
      },
      { merge: true }
    );

    // to update the data in the table
    setIsUpdated((prev) => !prev);

    setIsStatusUpdated({
      status: true,
      id: id,
    });

    console.log("order status updated");
  }

  // This effect will trigger whenever isStatusUpdated changes
  useEffect(() => {
    if (isStatusUpdated.status) {
      // Reset state after 1 second
      const timeoutId = setTimeout(() => {
        setIsStatusUpdated({
          status: false,
          id: null,
        });
      }, 2000);

      // Clear the timeout if the component unmounts or isStatusUpdated changes
      return () => clearTimeout(timeoutId);
    }
  }, [isStatusUpdated]);

  return (
    <Layout>
      <TableHead
        color="rgb(219,39,119)"
        title="Customer Orders"
        border="border-pink-600 text-pink-600"
        link="#"
      />

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Contact Link</th>
                {/* <th className="px-4 py-3">Payment Method</th> */}
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {orderList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold" colSpan={12}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}
              {orderList.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.orderId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.fullName}
                  </td>
                  <td className="px-4 py-3">{item.address}</td>
                  <td className="px-4 py-3">
                    <Link to={`tel:${item.phoneNumber}`}>
                      {item.phoneNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={item.contactLink}
                      className="text-blue-600 hover:underline"
                    >
                      {checkSocialMedia(item.contactLink)}
                    </Link>
                  </td>
                  {/* <td className="px-4 py-3">{item.paymentMethod}</td> */}
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.total} $
                  </td>
                  <td className="px-4 py-3">
                    {isStatusUpdated.status &&
                    isStatusUpdated.id === item.id ? (
                      <div className="px-2 py-1.5 rounded  text-white flex items-center justify-center">
                        updating...
                      </div>
                    ) : (
                      <select
                        id="status"
                        value={item.status}
                        onChange={(e) => handleChangeStatus(e, item.id)}
                        className={`${getStatusColor(
                          item.status
                        )} text-white block cursor-pointer font-bold py-1 px-2 border-2 rounded-md shadow-sm   focus:outline-none  sm:text-sm`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    )}
                  </td>

                  {/* view button */}
                  <td className="px-4 py-3 text-sm text-center">
                    <Link to={`/orderDetail/${item.id}`}>
                      <div className="px-2 py-1.5 rounded bg-yellow-500 text-white">
                        view
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

export default Order;
