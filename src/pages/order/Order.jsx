import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UpdateContext } from "../../contexts/UpdateContext";
import PropType from "prop-types";
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
import { FaSearch } from "react-icons/fa";
import { TbMathEqualLower } from "react-icons/tb";

const Order = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { orderList } = useContext(DataContext);
  const [isStatusUpdated, setIsStatusUpdated] = useState({
    status: false,
    id: "1",
  });
  const [orders, setOrders] = useState(orderList);
  const [filter, setFilter] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [maxTotalPrice, setMaxTotalPrice] = useState(1000);
  const [minTotalPrice, setMinTotalPrice] = useState(1);
  const [priceRange, setPriceRange] = useState(maxTotalPrice || 1000);

  // get the max total price
  useEffect(() => {
    if (orderList && orderList.length > 0) {
      let maxPrice = Math.max(
        ...orderList.map((item) => parseFloat(item.total))
      );

      let minPrice = Math.min(
        ...orderList.map((item) => parseFloat(item.total))
      );
      setMinTotalPrice(parseInt(minPrice+1));
      setMaxTotalPrice(parseInt(maxPrice+1));
    }
  }, [orderList]);

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

    // to show the updating status
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
  }, [isStatusUpdated.status]);

  // search order by total price, customer name, phone or order id
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("default");
    setPriceRange(maxTotalPrice);
    let searchedorder = [];

    // seach order base on name, orderCode or price
    if (!isNaN(searchKeyword)) {
      searchedorder = orderList.filter(
        (order) =>
          order.total.toString().includes(searchKeyword.toLowerCase().trim()) ||
          order.phoneNumber
            .toLowerCase()
            .includes(searchKeyword.toLowerCase().trim())
      );
    } else {
      searchedorder = orderList.filter(
        (order) =>
          order.fullName
            .toLowerCase()
            .includes(searchKeyword.toLowerCase().trim()) ||
          order.orderId
            .toLowerCase()
            .includes(searchKeyword.toLowerCase().trim())
      );
    }
    // to display the result
    setOrders(searchedorder);

    // to show the search result text
    setIsSearched(true);
  };

  //  filter base on status
  useEffect(() => {
    let filteredOrder = [];
    if (filter == "pending") {
      filteredOrder = orderList.filter((order) => order.status === "pending");
    } else if (filter == "processing") {
      filteredOrder = orderList.filter(
        (order) => order.status === "processing"
      );
    } else if (filter == "paid") {
      filteredOrder = orderList.filter((order) => order.status === "paid");
    } else if (filter == "delivered") {
      filteredOrder = orderList.filter((order) => order.status === "delivered");
    } else if (filter == "cancelled") {
      filteredOrder = orderList.filter((order) => order.status === "cancelled");
    } else {
      filteredOrder = orderList;
    }

    setOrders(filteredOrder);

    // reset everything to default when filter is changed
    setIsSearched(false);
    setPriceRange(maxTotalPrice);
  }, [filter, orderList, maxTotalPrice]);

  // filter order base on total price

  useEffect(() => {
    let filteredOrder = orderList.filter(
      (order) =>
        parseFloat(order.total) >= 0 && parseFloat(order.total) <= priceRange
    );

    setOrders(filteredOrder);

    // reset everything to default when filter is changed
    setIsSearched(false);
    setFilter("default");
  }, [priceRange, orderList]);

  return (
    <Layout>
      <TableHead
        color="rgb(219,39,119)"
        title="Customer Orders"
        border="border-pink-600 text-pink-600"
        link="/createInvoice"
      />

      {/* search, sort and filter component */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        {/* show all order button */}
        <button
          onClick={() => {
            setOrders(orderList);
            setFilter("default");
            setSearchKeyword("");
            setPriceRange(maxTotalPrice);
          }}
          className="px-4 py-2 font-bold border bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl rounded w-fit"
        >
          Show all
        </button>
        {/* search bar */}
        <form className="w-full lg:w-auto " onSubmit={handleSearch}>
          <div className="flex  items-center gap-3 px-4 py-1.5 border">
            {/* search input */}
            <input
              className="outline-none border-none p-1 w-full"
              type="text"
              placeholder="Search..."
              name="search"
              value={searchKeyword}
              // onBlur={() => setIsSearched(false)}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                handleSearch(e);
              }}
            />

            {/* search icon */}
            <div
              onClick={handleSearch}
              className="cursor-pointer hover:text-yellow-500"
            >
              <FaSearch />
            </div>
          </div>
        </form>

        {/* filter by category */}
        <select
          className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="default">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="paid">Paid</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* price range */}
        <div className="px-4 py-2 ">
          <TotalPriceRangeFilter
            maxTotalPrice={maxTotalPrice}
            minTotalPrice={minTotalPrice}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>
      </div>

      {/* result search for text */}
      {isSearched && searchKeyword.length !== 0 && (
        <div className="mt-4 mb-2">
          Search result for{" "}
          <span className="text-primary font-bold">
            &quot;{searchKeyword}&ldquo;
          </span>
        </div>
      )}

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
                <th className="px-4 py-3">Contact</th>
                {/* <th className="px-4 py-3">Payment Method</th> */}
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {orderList && orderList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={11}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}

              {orderList &&
                orderList.length > 0 &&
                orders &&
                orders.length == 0 && (
                  <>
                    <tr className=" text-center">
                      <td
                        className="py-8 dark:text-white font-bold "
                        colSpan={11}
                      >
                        {/* loading */}
                        No result found!
                      </td>
                    </tr>
                  </>
                )}

              {orders &&
                orders.map((item, index) => (
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
                        <div className="px-2 py-1.5 rounded  dark:text-white flex items-center justify-center">
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
                          <option value="paid">Paid</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>

                    {/* view button */}
                    <td className="px-4 py-3 text-sm text-center">
                      <Link to={`/orderDetail/${item.orderId}`}>
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

// price range filter component
const TotalPriceRangeFilter = ({
  maxTotalPrice,
  minTotalPrice,
  priceRange,
  setPriceRange,
}) => {
  const handleChange = (event) => {
    setPriceRange(parseInt(event.target.value));
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="flex items-center">
        <label className="mr-2 font-bold whitespace-pre">
          Total Price Range:
        </label>
        <input
          type="range"
          min={minTotalPrice}
          max={maxTotalPrice}
          value={priceRange}
          onChange={(event) => handleChange(event)}
          className="slider appearance-none w-24 lg:w-36 h-1 md:h-2 bg-yellow-500 rounded-full outline-none cursor-pointer"
        />
        <span className="ml-2 flex items-center gap-2 whitespace-pre">
          <TbMathEqualLower /> {priceRange} $
        </span>
      </div>
    </div>
  );
};

TotalPriceRangeFilter.propTypes = {
  maxTotalPrice: PropType.number,
  minTotalPrice: PropType.number,
  priceRange: PropType.number,
  setPriceRange: PropType.func,
};

export default Order;
