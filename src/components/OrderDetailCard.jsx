import PropTypes from "prop-types";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import checkSocialMedia from "../utils/checkSocialMedia";
import getStatusColor from "../utils/getStatusColor";
import { useContext, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FaPrint } from "react-icons/fa";
import logo from "../assets/images/sorakhmer-logo.png";
import { DataContext } from "../contexts/DataContext";
import convertToPhoneNumber from "../utils/convertToPhoneNumber";
import aba from "../assets/images/aba-us.jpg";
const OrderDetailCard = ({
  orderId,
  fullName,
  phoneNumber,
  contactLink,
  address,
  message,
  cartItems,
  total,
  status,
  date,
  //   paymentMethod,
  //   timeStamp,
}) => {
  const { contactList } = useContext(DataContext);
  const contact = contactList[0];
  const contentToPrint = useRef(null);

  const [isPrint, setIsPrint] = useState(false);
  const handlePrint = useReactToPrint({
    documentTitle: orderId,
    onBeforePrint: () => setIsPrint(false),
    onAfterPrint: () => setIsPrint(false),
    removeAfterPrint: true,
  });

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground w-full max-w-3xl mx-auto bg-white shadow-xl overflow-x-auto"
      data-v0-t="card"
    >
      <div ref={contentToPrint} className="min-w-[600px]">
        <div className="p-6 pt-4 grid gap-4">
          <div className={`flex flex-col space-y-1.5 pb-0`}>
            {isPrint ? (
              <>
                <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight mt-2 text-center">
                  Invoice
                </h3>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
                  Order ID: {orderId}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Customer information
                </p>
              </>
            )}
          </div>
          <div className="grid grid-cols-2  gap-4 relative">
            <div className="flex flex-col gap-1">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Order Date
              </label>
              <p className="font-medium">{date}</p>
            </div>
            {isPrint ? (
              <div className="flex flex-col gap-1">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Order ID:
                </label>
                <p className="font-medium">{orderId}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Status
                </label>
                <p
                  className={`font-medium w-fit pt-1 px-2 capitalize rounded text-white ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Customer
              </label>
              <p className="font-medium">{fullName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Phone Number
              </label>
              <p className="font-medium  hover:text-blue-600">
                <Link to={`tel:${phoneNumber}`}>
                  {convertToPhoneNumber(phoneNumber)}
                </Link>
              </p>
            </div>
            {!isPrint && (
              <div className="flex flex-col gap-1">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  {checkSocialMedia(contactLink)}
                </label>
                <p className="font-medium text-blue-500 hover:text-blue-600">
                  <Link to={contactLink}>{contactLink}</Link>
                </p>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Address
              </label>
              <p className="font-medium">{address}</p>
            </div>
            {message && (
              <div className="flex flex-col gap-1">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Customer Remark
                </label>
                <p className="font-medium">{message}</p>
              </div>
            )}

            {isPrint && (
              <div>
                <img
                  src={logo}
                  className="w-[260px] opacity-20 absolute  top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]"
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="grid gap-4">
            <div className="overflow-auto border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&amp;_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-[80px] hidden md:table-cell">
                        Image
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 max-w-[150px]">
                        Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        Quantity
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&amp;_tr:last-child]:border-0">
                    {cartItems &&
                      cartItems.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                            <img
                              src={item.image}
                              width="64"
                              height="64"
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                            />
                          </td>
                          <td
                            className={`p-4 ${
                              isPrint && "py-2 text-sm text-gray-800"
                            } align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium`}
                          >
                            {item.name}
                          </td>
                          <td
                            className={`p-4 ${
                              isPrint && "py-2 text-sm text-gray-800"
                            } align-middle [&amp;:has([role=checkbox])]:pr-0`}
                          >
                            {item.quantity}
                          </td>
                          <td
                            className={`p-4 ${
                              isPrint && "py-2 text-sm text-gray-800"
                            } align-middle [&amp;:has([role=checkbox])]:pr-0`}
                          >
                            {item.price} $
                          </td>
                        </tr>
                      ))}

                    <tr>
                      <td className="hidden md:block"></td>
                      <td
                        colSpan={2}
                        className="p-4 align-middle text-right font-bold"
                      >
                        Total
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {total} $
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* payment aba qr */}
            {isPrint && (
              <div
                className={`flex justify-center gap-4  mt-4 z-2 relative ${
                  cartItems.length == 5 && "mt-4"
                }`}
              >
                {/* <div className="flex flex-col justify-center items-center">
                  <img src={logo} className="w-[100px]" alt="" />
                </div> */}
                <img
                  src={aba}
                  alt="qr-code
              "
                  className="w-40 h-40"
                />
                <div className="flex flex-col justify-center items-center gap-3 text-sm text-gray-600">
                  <div className="font-bold text-center">SORA KHMER</div>
                  <span>
                    📞 {contact && convertToPhoneNumber(contact.phoneNumber)}
                  </span>{" "}
                  <span>✉️ {contact && contact.email}</span>
                  <span>🌐 www.sorakhmer.com</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 flex items-center justify-between gap-2">
        <Link to="/order">
          <div className="flex items-center gap-2">
            <IoChevronBackOutline className="text-lg" />
            <span className="text-sm">Back</span>
          </div>
        </Link>
        <div>
          <button
            className="flex items-center gap-3 bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600"
            onClick={() => {
              setIsPrint(true);
              setTimeout(() => {
                handlePrint(null, () => contentToPrint.current);
              }, 300);
            }}
          >
            <FaPrint />
            {!isPrint ? "Print/Save" : "Loading..."}
          </button>
        </div>
      </div>
    </div>
  );
};

OrderDetailCard.propTypes = {
  orderId: PropTypes.string,
  fullName: PropTypes.string,
  phoneNumber: PropTypes.string,
  contactLink: PropTypes.string,
  address: PropTypes.string,
  message: PropTypes.string,
  cartItems: PropTypes.array,
  total: PropTypes.number,
  status: PropTypes.string,
  paymentMethod: PropTypes.string,
  date: PropTypes.string,
  timeStamp: PropTypes.string,
};

export default OrderDetailCard;
