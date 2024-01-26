import { RxDashboard } from "react-icons/rx";
import { BiCategoryAlt } from "react-icons/bi";
import { FaBlog } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { HiOutlineLogout } from "react-icons/hi";
import { FaSteamSymbol, FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../assets/images/sorakhmer-logo.png";
// import { auth } from "../firebase-config";
// import { onAuthStateChanged } from "firebase/auth";

const Layout = (props) => {
  //   let displayName = "admin";

  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       displayName = user.displayName;
  //     }
  //   });
  return (
    <div>
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased  text-black">
        <div className="fixed w-full flex items-center justify-between h-14 text-white z-10">
          <div className="flex items-center justify-start md:justify-center gap-5 pl-3 w-14 md:w-64 h-14 bg-gray-800 border-none">
            <div>
              <Link to="/">
                <img src={logo} alt="logo" width={60} />
              </Link>
            </div>
            <span className="hidden md:block font-bold">SORA KHMER</span>
          </div>
          {/* logout */}
          <div className="flex justify-end items-center h-14 bg-gray-800  header-right w-full pr-5">
            <button className="flex justify-center gap-2 items-center bg-red-600 p-1 px-3 rounded font-bold">
              Logout <HiOutlineLogout />
            </button>
          </div>
        </div>

        <div className="fixed flex flex-col top-14 left-0 w-14 hover:w-64 md:w-64 bg-blue-900 dark:bg-gray-900 h-full text-white transition-all duration-300 border-none z-10 sidebar">
          <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              <li className="px-5 hidden md:block">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-400 uppercase">
                    Main
                  </div>
                </div>
              </li>

              {/* dashboad */}
              <li>
                <Link
                  to="/"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <RxDashboard />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Dashboard
                  </span>
                </Link>
              </li>

              {/* product */}
              <li>
                <Link
                  to="/product"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <TiShoppingCart />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Products
                  </span>
                </Link>
              </li>

              {/* product category */}
              <li>
                <Link
                  to="/productCategory"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <BiCategoryAlt />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Product category
                  </span>
                </Link>
              </li>

              {/* blog */}
              <li>
                <Link
                  to="/blog"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FaBlog />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Blog
                  </span>
                </Link>
              </li>

              {/* blog category */}
              <li>
                <Link
                  to="/blogCategory"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <BiCategoryAlt />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Blog category
                  </span>
                </Link>
              </li>

              {/* author */}
              <li>
                <Link
                  to="/author"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FiUsers />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Authors
                  </span>
                </Link>
              </li>

              {/* award */}
              <li>
                <Link
                  to="/award"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FaAward />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Company awards
                  </span>
                </Link>
              </li>

              {/* partner */}
              <li>
                <Link
                  to="/partner"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FaSteamSymbol />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Company partners
                  </span>
                </Link>
              </li>
            </ul>
            <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">
              Copyright @sorakhmer 2024
            </p>
          </div>
        </div>

        <div className="h-full ml-14 mt-14 mb-10 md:ml-64 p-2 md:p-4 lg:p-10 pt-5">
          {props.children}
        </div>
      </div>
    </div>
  );
};
Layout.propTypes = {
  children: PropTypes.node,
};
export default Layout;
