import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { BiCategoryAlt } from "react-icons/bi";
import { FiUser, FiUsers } from "react-icons/fi";
import { FaAward, FaBlog, FaFileInvoice } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { FaSteamSymbol } from "react-icons/fa";
import { AiFillPlusCircle } from "react-icons/ai";
import { PiFactory, PiImage, PiStorefront } from "react-icons/pi";

// all the CreateItemCards in the dashboard
const CreateItemCardGroup = () => {
  return (
    <div>
      <div className="grid auto-rows-auto grid-cols-2  lg:grid-cols-4 gap-4 ">
        {/* create new invoice*/}
        <Link to="/createInvoice">
          <CreateItemCard
            title="Invoice"
            color="bg-gray-400"
            icon={<FaFileInvoice />}
          />
        </Link>
        {/* create product */}
        <Link to="/createProduct">
          <CreateItemCard
            title="Product"
            color="bg-red-600"
            icon={<TiShoppingCart />}
          />
        </Link>

        {/* create prodcut category */}
        <Link to="/createProductCategory">
          <CreateItemCard
            title="Product Category"
            color="bg-yellow-400"
            icon={<BiCategoryAlt />}
          />
        </Link>

        {/* create blog  */}
        <Link to="/createBlog">
          <CreateItemCard
            title="Blog"
            color="bg-violet-500"
            icon={<FaBlog />}
          />
        </Link>

        {/* create blog category */}
        <Link to="/createBlogCategory">
          <CreateItemCard
            title="Blog Category"
            color="bg-pink-500"
            icon={<BiCategoryAlt />}
          />
        </Link>
        {/* create author for blog post */}
        <Link to="/createAuthor">
          <CreateItemCard
            title="Author"
            color="bg-blue-500"
            icon={<FiUsers />}
          />
        </Link>

        {/* create company awards */}
        <Link to="/createAward">
          <CreateItemCard
            title="Awards"
            color="bg-purple-400"
            icon={<FaAward />}
          />
        </Link>

        {/* create company partners  */}
        <Link to="/createPartner">
          <CreateItemCard
            title="Partners"
            color="bg-green-500"
            icon={<FaSteamSymbol />}
          />
        </Link>

        {/* create process of producing */}
        <Link to="/createProcess">
          <CreateItemCard
            title="Process"
            color="bg-blue-900"
            icon={<PiFactory />}
          />
        </Link>

        {/* create store */}
        <Link to="/createStore">
          <CreateItemCard
            title="Store"
            color="bg-orange-900"
            icon={<PiStorefront />}
          />
        </Link>

        {/* create gallery*/}
        <Link to="/createGallery">
          <CreateItemCard
            title="Gallery"
            color="bg-purple-900"
            icon={<PiImage />}
          />
        </Link>

        {/* create user*/}
        <Link to="/createAdmin">
          <CreateItemCard
            title="Admin"
            color="bg-orange-500"
            icon={<FiUser />}
          />
        </Link>
      </div>
    </div>
  );
};

const CreateItemCard = ({ title, color, icon }) => {
  // text-purple-600 hover:text-white border hover:border-0 hover:border-l-[10px] hover:bg-violet-500
  return (
    <div
      className={` h-[110px] rounded-r p-4 shadow-xl ${color} text-white font-semibold text-lg cursor-pointer border-l-[10px] border-gray-300 hover:border-gray-700 flex items-center justify-center gap-4 uppercase`}
    >
      <AiFillPlusCircle />
      <div className="flex items-center justify-end gap-2 ">
        <span className="hidden lg:block text-center ">{title}</span>
        <span>{icon}</span>
      </div>
    </div>
  );
};

CreateItemCard.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  icon: PropTypes.element,
};
export default CreateItemCardGroup;
