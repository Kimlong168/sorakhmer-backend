import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { BiCategoryAlt } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { FaAward, FaBlog } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { FaSteamSymbol } from "react-icons/fa";
import { AiFillPlusCircle } from "react-icons/ai";
import { PiFactory, PiStorefront } from "react-icons/pi";

// all the widgets in the dashboard
const WidgetGroup = () => {
  return (
    <div>
      <div className="grid auto-rows-auto grid-cols-2  lg:grid-cols-4 gap-4 ">
        {/* create product */}
        <Link to="/createProduct">
          <Widget
            title="Product"
            color="bg-red-600"
            icon={<TiShoppingCart />}
          />
        </Link>

        {/* create prodcut category */}
        <Link to="/createProductCategory">
          <Widget
            title="Product Category"
            color="bg-yellow-400"
            icon={<BiCategoryAlt />}
          />
        </Link>

        {/* create blog  */}
        <Link to="/createBlog">
          <Widget title="Blog" color="bg-violet-500" icon={<FaBlog />} />
        </Link>

        {/* create blog category */}
        <Link to="/createBlogCategory">
          <Widget
            title="Blog Category"
            color="bg-pink-500"
            icon={<BiCategoryAlt />}
          />
        </Link>
        {/* create author for blog post */}
        <Link to="/createAuthor">
          <Widget title="Author" color="bg-blue-500" icon={<FiUsers />} />
        </Link>

        {/* create company awards */}
        <Link to="/createAward">
          <Widget title="Awards" color="bg-purple-400" icon={<FaAward />} />
        </Link>

        {/* create company partners  */}
        <Link to="/createPartner">
          <Widget
            title="Partners"
            color="bg-green-500"
            icon={<FaSteamSymbol />}
          />
        </Link>

        {/* create company contact */}
        {/* <Link to="/createContact">
          <Widget title="Contact" color="bg-orange-400" icon={<FiMail />} />
        </Link> */}

        {/* create process of producing */}
        <Link to="/createProcess">
          <Widget title="Process" color="bg-blue-900" icon={<PiFactory />} />
        </Link>

        {/* create place to buy */}
        <Link to="/createStore">
          <Widget title="Create Store" color="bg-orange-900" icon={<PiStorefront />} />
        </Link>
      </div>
    </div>
  );
};
const Widget = ({ title, color, icon }) => {
  return (
    <div
      className={` h-[100px] rounded-r-md p-4 shadow-xl ${color}  text-white font-semibold text-lg cursor-pointer border-l-[10px] border-gray-300 hover:border-gray-900 flex items-center justify-center gap-3 uppercase`}
    >
      <AiFillPlusCircle />
      <div className="flex items-center justify-end gap-2">
        <span className="hidden lg:block text-center">{title}</span> {icon}
      </div>
    </div>
  );
};

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  icon: PropTypes.element,
};
export default WidgetGroup;
