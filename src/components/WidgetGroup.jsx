import { Link } from "react-router-dom";
import { BiCategoryAlt } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { FaAward, FaBlog } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { FaSteamSymbol } from "react-icons/fa";
import Widget from "./Widget";

// all the widgets in the dashboard
const WidgetGroup = () => {
  return (
    <div>
      <div className="grid auto-rows-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
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

        {/* create company partners  */}
        <Link to="/createPartner">
          <Widget
            title="Partners"
            color="bg-green-500"
            icon={<FaSteamSymbol />}
          />
        </Link>

        {/* create company awards */}
        <Link to="/createAward">
          <Widget title="Awards" color="bg-purple-300" icon={<FaAward />} />
        </Link>
      </div>
    </div>
  );
};

export default WidgetGroup;
