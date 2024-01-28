import { FiShoppingCart, FiUsers, FiAward, FiMail } from "react-icons/fi";
import { FaSteamSymbol } from "react-icons/fa";
import { FaBlog } from "react-icons/fa6";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { PiFactory, PiStorefront } from "react-icons/pi";
import { TbCategory2 } from "react-icons/tb";
const CardGroup = () => {
  return (
    <div className="pb-4 ">
      <p className="text-xl font-semibold mb-2">Dashboard</p>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card
          title="Product"
          subtitle="Manage product"
          href="/product"
          Icon={FiShoppingCart}
        />
        <Card
          title="Product Category"
          subtitle="Manage product category"
          href="/productCategory"
          Icon={TbCategory2}
        />
        <Card title="Blog" subtitle="Manage blog" href="/blog" Icon={FaBlog} />
        <Card
          title="Blog Category"
          subtitle="Manage blog category"
          href="/blogCategory"
          Icon={TbCategory2}
        />
        <Card
          title="Author"
          subtitle="Manage author"
          href="/author"
          Icon={FiUsers}
        />
        <Card
          title="Award"
          subtitle="Manage award"
          href="/award"
          Icon={FiAward}
        />
        <Card
          title="Partner"
          subtitle="Manage partner"
          href="/partner"
          Icon={FaSteamSymbol}
        />

        <Card
          title="Process"
          subtitle="Manage process of producing"
          href="/process"
          Icon={PiFactory}
        />

        <Card
          title="Store"
          subtitle="Manage store"
          href="/store"
          Icon={PiStorefront}
        />

        <Card
          title="Contact"
          subtitle="Manage contact"
          href="/contact"
          Icon={FiMail}
        />
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, Icon, href }) => {
  return (
    <Link
      to={href}
      className="w-full p-4 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

      <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
      <Icon className="mb-2 text-2xl text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" />
      <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
        {subtitle}
      </p>
    </Link>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  Icon: PropTypes.element,
};

export default CardGroup;
