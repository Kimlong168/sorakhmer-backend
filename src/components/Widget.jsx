import { AiFillPlusCircle } from "react-icons/ai";
import PropTypes from "prop-types";
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
  color: PropTypes.number,
  icon: PropTypes.element,
};

export default Widget;
