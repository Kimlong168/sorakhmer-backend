import Layout from "../../layouts/Layout";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TableHead from "../../components/TableHead";
import { toast } from "react-toastify";
import Toast from "../../utils/Toast";
import { toastProps } from "../../utils/toastProp";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import { UpdateContext } from "../../contexts/UpdateContext";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase-config";
import LoadingInTable from "../../components/LoadingInTable";
import PopupImage from "../../components/PopupImage";
import { DataContext } from "../../contexts/DataContext";
import { FaSearch } from "react-icons/fa";
import { TbMathEqualLower } from "react-icons/tb";
import PropType from "prop-types";

const Product = () => {
  const {
    productList,
    productCategoryList,
    setShowNotification,
  } = useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);
  const [showImage, setShowImage] = useState({
    open: false,
    image: null,
  });
  const [products, setProducts] = useState(productList);
  const [filter, setFilter] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100);
  const [minPrice, setMinPrice] = useState(1);
  const [priceRange, setPriceRange] = useState(maxPrice || 100);

  useEffect(() => {
    if (productList && productList.length > 0) {
      let maxPrice = Math.max(
        ...productList.map((product) => parseFloat(product.price))
      );

      let minPrice = Math.min(
        ...productList.map((product) => parseFloat(product.price))
      );
      setMinPrice(parseInt(minPrice + 1));
      setMaxPrice(parseInt(maxPrice + 1));
    }
  }, [productList]);

  // delete product notify
  const notifyDeleting = (id, imageId) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            deleteItemFucntion(id, "products")
              .then((result) => {
                // call delete image function
                if (result) {
                  deleteImageFromStorage(imageId);
                  setShowNotification({
                    status: true,
                    action: "deleted",
                    item: "product",
                  });
                }
              }) // This will log true if the item was deleted successfully
              .catch((error) => console.error(error));
          }}
          setIsUpdated={setIsUpdated}
        />
      </>,
      toastProps
    );
  };

  // delete image from firebase storage
  const deleteImageFromStorage = (imageId) => {
    const storageRef = ref(storage, `productImages/${imageId}`);
    deleteObject(storageRef)
      .then(() => {
        // File deleted successfully
        console.log("image deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };

  // search product
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("default");
    setPriceRange(maxPrice);
    let searchedproduct = [];

    // seach product base on name, productCode or price
    if (!isNaN(searchKeyword)) {
      searchedproduct = productList.filter(
        (product) =>
          product.price
            .toString()
            .includes(searchKeyword.toLowerCase().trim()) ||
          product.productCode.toLowerCase() ===
            searchKeyword.toLowerCase().trim()
      );
    } else {
      searchedproduct = productList.filter((product) =>
        product.name
          .toLowerCase()
          .includes(
            searchKeyword.toLowerCase().trim() ||
              product.productCode.toLowerCase() ===
                searchKeyword.toLowerCase().trim()
          )
      );
    }

    setProducts(searchedproduct);
    setIsSearched(true);
  };

  //  filter base on category and status
  useEffect(() => {
    let filteredProduct = [];
    if (filter === "default") {
      filteredProduct = productList;
    } else if (filter == "active") {
      filteredProduct = productList.filter((product) => product.isActive);
    } else if (filter == "inactive") {
      filteredProduct = productList.filter((product) => !product.isActive);
    } else {
      filteredProduct = productList.filter(
        (product) => product.categoryId === filter
      );
    }
    setProducts(filteredProduct);
    setIsSearched(false);
    // setPriceRange(maxPrice);
  }, [filter, productList, maxPrice]);

  // filter product base on price

  useEffect(() => {
    let filteredProduct = productList.filter(
      (product) =>
        parseFloat(product.price) >= 0 &&
        parseFloat(product.price) <= priceRange
    );

    setProducts(filteredProduct);
    setIsSearched(false);
    setFilter("default");
  }, [priceRange, productList]);

  return (
    <Layout>
      <TableHead
        color="red"
        title={`Products (${productList.length})`}
        border="border-red-600 text-red-600"
        link="/createProduct"
      />

      {/* search, sort and filter component */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        {/* show all product button */}
        <button
          onClick={() => {
            setProducts(productList);
            setFilter("default");
            setSearchKeyword("");
            setPriceRange(maxPrice);
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
            <div onClick={handleSearch}>
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
          <option value="default">All Categories</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          {productCategoryList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>

        {/* price range */}
        <div className="px-4 py-2 ">
          <PriceRangeFilter
            maxPrice={maxPrice}
            minPrice={minPrice}
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {productList && productList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={10}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}

              {productList &&
                productList.length > 0 &&
                products &&
                products.length == 0 && (
                  <>
                    <tr className=" text-center">
                      <td
                        className="py-8 dark:text-white font-bold "
                        colSpan={10}
                      >
                        {/* loading */}
                        No products found!
                      </td>
                    </tr>
                  </>
                )}

              {products &&
                products.map((product, index) => (
                  <tr
                    key={product.id}
                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    {/* category */}
                    <td className="px-4 py-3">
                      {productCategoryList &&
                      productCategoryList
                        .map((data) =>
                          data.id === product.categoryId
                            ? data.categoryName
                            : null
                        )
                        .filter((category) => category !== null).length > 0 ? (
                        productCategoryList.map((data) =>
                          data.id === product.categoryId
                            ? data.categoryName
                            : null
                        )
                      ) : (
                        <p className="truncate">No Category⚠️</p>
                      )}
                    </td>
                    {/* price */}
                    <td className="px-4 py-3">{product.price} $</td>
                    {/* product code */}
                    <td className="px-4 py-3">
                      {product.productCode ? product.productCode : "No code"}
                    </td>
                    {/* status */}
                    <td className="px-4 py-3 text-xs">
                      {product.isActive ? (
                        <span className="p-2 py-0.5 rounded border border-green-600 text-green-600 bg-green-600/10">
                          Active
                        </span>
                      ) : (
                        <span className="p-2 py-0.5 rounded border border-red-600 text-red-600 bg-red-600/10">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* product image */}
                    <td className="px-4 py-3">
                      {product.image ? (
                        <img
                          className="min-w-[60px] min-h-[70px] w-[60px] h-[70px] rounded-sm cursor-pointer"
                          src={product.image}
                          loading="lazy"
                          onClick={() => {
                            setShowImage({
                              image: product.image,
                              open: true,
                            });
                          }}
                        />
                      ) : (
                        "No Image"
                      )}

                      {/* pop up image */}
                      {showImage.open && showImage.image == product.image && (
                        <PopupImage
                          image={product.image}
                          setShowImage={(condition) => {
                            setShowImage({
                              image: product.image,
                              open: condition,
                            });
                            setShowImage({
                              image: null,
                              open: false,
                            });
                          }}
                        />
                      )}
                    </td>
                    {/* view button */}
                    <td className="px-4 py-3 text-sm text-center cursor-pointer">
                      <Link to={`/productDetail/${product.id}`}>
                        <div className="px-2 py-1.5 rounded bg-yellow-500 text-white cursor-pointer">
                          View
                        </div>
                      </Link>
                    </td>
                    {/* edit button */}
                    <td className="px-4 py-3 text-sm text-center">
                      <Link to={`/updateProduct/${product.id}`}>
                        <div className="px-2 py-1.5 rounded bg-green-600 text-white">
                          Edit
                        </div>
                      </Link>
                    </td>
                    {/* delete button */}
                    <td className="px-4 py-3 text-sm text-center cursor-pointer">
                      <div
                        onClick={() =>
                          notifyDeleting(product.id, product.imageId)
                        }
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
const PriceRangeFilter = ({
  maxPrice = 500,
  minPrice = 1,
  priceRange,
  setPriceRange,
}) => {
  const handleChange = (event) => {
    setPriceRange(parseInt(event.target.value));
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="flex items-center">
        <label className="mr-2 font-bold whitespace-pre">Price Range:</label>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
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

PriceRangeFilter.propTypes = {
  maxPrice: PropType.number,
  minPrice: PropType.number,
  priceRange: PropType.number,
  setPriceRange: PropType.func,
};

export default Product;
