import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
// firebase
import { db } from "./firebase-config";
import { getDocs, collection, orderBy, query } from "firebase/firestore";
// context
import { UpdateContext } from "./contexts/UpdateContext";
import { DataContext } from "./contexts/DataContext";
import { AuthContext } from "./contexts/AuthContext";
// page elements
import Dashboard from "./pages/Dashboard";
import Error404 from "./pages/Error404";
import Product from "./pages/product/Product";
import CreateProduct from "./pages/product/CreateProduct";
import UpdateProduct from "./pages/product/UpdateProduct";
import ProductDetail from "./pages/product/ProductDetail";
import CreateProductCategory from "./pages/productCategory/CreateProductCategory";
import ProductCategory from "./pages/productCategory/ProductCategory";
import UpdateProductCategory from "./pages/productCategory/UpdateProductCategory";
import CreateBlogCategory from "./pages/blogCategory/CreateBlogCategory";
import BlogCategory from "./pages/blogCategory/BlogCategory";
import UpdateBlogCategory from "./pages/blogCategory/UpdateBlogCategory";
import Author from "./pages/author/Author";
import CreateAuthor from "./pages/author/CreateAuthor";
import UpdateAuthor from "./pages/author/UpdateAuthor";
import CreateBlog from "./pages/blog/CreateBlog";
import Blog from "./pages/blog/Blog";
import BlogDetail from "./pages/blog/BlogDetail";
import UpdateBlog from "./pages/blog/UpdateBlog";
import Partners from "./pages/partner/Partner";
import CreatePartner from "./pages/partner/CreatePartner";
import UpdatePartner from "./pages/partner/UpdatePartner";
import Award from "./pages/award/Award";
import CreateAward from "./pages/award/CreateAward";
import UpdateAward from "./pages/award/UpdateAward";
import Contact from "./pages/contact/Contact";
import UpdateContact from "./pages/contact/UpdateContact";
import CreateContact from "./pages/contact/CreateContact";
import UpdateProcess from "./pages/process/UpdateProcess";
import CreateProcess from "./pages/process/CreateProcess";
import Process from "./pages/process/Process";
import ProcessDetail from "./pages/process/ProcessDetail";
import Store from "./pages/store/Store";
import CreateStore from "./pages/store/CreateStore";
import UpdateStore from "./pages/store/UpdateStore";
import Gallery from "./pages/gallery/Gallery";
import CreateGallery from "./pages/gallery/CreateGallery";
import UpdateGallery from "./pages/gallery/UpdateGallery";
import CreateAdmin from "./pages/authentication/CreateAdmin";
import Admin from "./pages/authentication/Admin";
import Login from "./pages/authentication/Login";
import ForgetPassword from "./pages/authentication/ForgetPassword";
import Order from "./pages/order/Order";
import OrderDetail from "./pages/order/OrderDetail";
import CreateInvoice from "./pages/order/CreateInvoice";
function App() {
  // state
  const [theme, setTheme] = useState(
    localStorage.getItem("mode") ? localStorage.getItem("mode") : "dark"
  );

  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const userEmail = localStorage.getItem("userEmail") || "admin@gmail.com";
  const [isUpdated, setIsUpdated] = useState(false);
  // to show notification after adding
  const [showNotification, setShowNotification] = useState({
    item: "",
    status: false,
    action: "",
  });

  const [productCategoryList, setProductCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [blogCategoryList, setBlogCategoryList] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [authorList, setAuthorList] = useState([]);
  const [partnerList, setPartnerList] = useState([]);
  const [awardList, setAwardList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  // fetch all data from firebase
  useEffect(() => {
    const productCollectionRef = collection(db, "products");
    const productCategoryCollectionRef = collection(db, "product_category");
    const blogCollectionRef = collection(db, "blogs");
    const blogCategoryCollectionRef = collection(db, "blog_category");
    const authorCollectionRef = collection(db, "authors");
    const partnerCollectionRef = collection(db, "partners");
    const awardCollectionRef = collection(db, "awards");
    const contactCollectionRef = collection(db, "contact");
    const processCollectionRef = collection(db, "process");
    const storeCollectionRef = collection(db, "stores");
    const galleryCollectionRef = collection(db, "gallery");
    const adminCollectionRef = collection(db, "admin");
    const orderCollectionRef = collection(db, "orders");

    const fetchAllData = async () => {
      // fetch order data
      const order = await getDocs(
        query(orderCollectionRef, orderBy("timeStamp", "desc"))
      );
      setOrderList(order.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      // fetch data of product
      const products = await getDocs(
        query(productCollectionRef, orderBy("categoryId", "desc"))
      );
      setProductList(
        products.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      // fetch data of product category
      const productCategory = await getDocs(productCategoryCollectionRef);
      setProductCategoryList(
        productCategory.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      //fetch data of blog
      const blogs = await getDocs(blogCollectionRef);
      setBlogList(blogs.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      //fetch data of blog category
      const blogCategory = await getDocs(blogCategoryCollectionRef);
      setBlogCategoryList(
        blogCategory.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      //fetch data of author
      const author = await getDocs(authorCollectionRef);
      setAuthorList(author.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      //fetch data of partner
      const partner = await getDocs(partnerCollectionRef);
      setPartnerList(
        partner.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      // fetch data of award
      const award = await getDocs(awardCollectionRef);
      setAwardList(award.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      //fetch contact data
      const contact = await getDocs(contactCollectionRef);
      setContactList(
        contact.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      //fetch process data
      const process = await getDocs(processCollectionRef);
      setProcessList(
        process.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      //fetch store data
      const store = await getDocs(
        storeCollectionRef
        // query(storeCollectionRef, orderBy("city", "desc"))
      );
      setStoreList(store.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      //fetch gallery data
      const gallery = await getDocs(galleryCollectionRef);
      setGalleryList(
        gallery.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      //fetch admin data
      const admin = await getDocs(adminCollectionRef);
      setAdminList(admin.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    // call fetchAllData function
    fetchAllData();
    console.log("fetch data");
  }, [isUpdated]);

  // dark mode and light mode

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeSwitch = (newMode) => {
    if (theme === "dark" && newMode === "light") {
      localStorage.setItem("mode", "light");
      setTheme("light");
    } else if (theme === "light" && newMode === "dark") {
      localStorage.setItem("mode", "dark");
      setTheme("dark");
    }
  };

  // if user is not signed in
  if (!isAuth) {
    return (
      <Router>
        <Routes>
          {/* authentication */}
          <Route path="*" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
        </Routes>
      </Router>
    );
  }

  return (
    <>
      <div>
        {/* update context */}
        <UpdateContext.Provider value={{ isUpdated, setIsUpdated }}>
          {/* auth context */}
          <AuthContext.Provider value={{ setIsAuth, userEmail }}>
            {/* data context */}
            <DataContext.Provider
              value={{
                orderList,
                productCategoryList,
                productList,
                blogCategoryList,
                blogList,
                contactList,
                authorList,
                awardList,
                partnerList,
                processList,
                storeList,
                galleryList,
                adminList,
                handleThemeSwitch,
                theme,
                showNotification,
                setShowNotification,
              }}
            >
              {/* -------------router------------- */}
              <Router>
                <Routes>
                  {/* -------------error 404 route------------- */}
                  {/* delay 1s before showing the error404 page */}
                  <Route path="*" element={<Error404 />} />

                  {/* -------------dashboard route------------- */}
                  <Route path="/" element={<Dashboard />} />

                  {/* -------------product route------------- */}
                  {/* product */}
                  <Route path="/product" element={<Product />} />
                  {/* product detail */}
                  <Route
                    path="/productDetail/:id"
                    element={<ProductDetail />}
                  />
                  {/* update product */}
                  <Route
                    path="/updateProduct/:id"
                    element={<UpdateProduct />}
                  />
                  {/* create product */}
                  <Route path="/createProduct" element={<CreateProduct />} />
                  {/* update product */}
                  <Route path="/updateProduct" element={<UpdateProduct />} />

                  {/* -------------product category route------------- */}
                  {/* product category */}
                  <Route
                    path="/productCategory"
                    element={<ProductCategory />}
                  />
                  {/* create product category */}
                  <Route
                    path="/createProductCategory"
                    element={<CreateProductCategory />}
                  />
                  {/* update product category */}
                  <Route
                    path="/updateProductCategory/:id"
                    element={<UpdateProductCategory />}
                  />
                  {/* -------------blog route------------- */}
                  {/* blog */}
                  <Route path="/blog" element={<Blog />} />
                  {/* blog detail */}
                  <Route path="/blogDetail/:id" element={<BlogDetail />} />
                  {/* update blog */}
                  <Route path="/updateBlog/:id" element={<UpdateBlog />} />
                  {/* create blog */}
                  <Route path="/createBlog" element={<CreateBlog />} />

                  {/* -------------blog category route------------- */}
                  {/* blog category */}
                  <Route path="/blogCategory" element={<BlogCategory />} />

                  {/*create blog category */}
                  <Route
                    path="/createBlogCategory"
                    element={<CreateBlogCategory />}
                  />
                  {/* update blog category */}
                  <Route
                    path="/updateBlogCategory/:id"
                    element={<UpdateBlogCategory />}
                  />

                  {/* -------------Author route------------- */}
                  {/* author */}
                  <Route path="/author" element={<Author />} />
                  {/* create author */}
                  <Route path="/createAuthor" element={<CreateAuthor />} />
                  {/* update author */}
                  <Route path="/updateAuthor/:id" element={<UpdateAuthor />} />

                  {/* -------------Company partners route------------- */}
                  {/* company partners */}
                  <Route path="/partner" element={<Partners />} />
                  {/* create company partners */}
                  <Route path="/createPartner" element={<CreatePartner />} />
                  {/* update company partners */}
                  <Route
                    path="/updatePartner/:id"
                    element={<UpdatePartner />}
                  />

                  {/* -------------Company award route------------- */}
                  {/* company award */}
                  <Route path="/award" element={<Award />} />
                  {/* create company award */}
                  <Route path="/createAward" element={<CreateAward />} />
                  {/* update company award */}
                  <Route path="/updateAward/:id" element={<UpdateAward />} />

                  {/* -------------Company Contact data route------------- */}
                  {/* contact data */}
                  <Route path="/contact" element={<Contact />} />
                  {/* create contact data */}
                  <Route path="/createContact" element={<CreateContact />} />
                  {/* update contact data */}
                  <Route
                    path="/updateContact/:id"
                    element={<UpdateContact />}
                  />

                  {/* -------------process of producing route------------- */}
                  {/* process of producing */}
                  <Route path="/process" element={<Process />} />
                  {/* create process of producing */}
                  <Route path="/createProcess" element={<CreateProcess />} />
                  {/* update process of producing */}
                  <Route
                    path="/updateProcess/:id"
                    element={<UpdateProcess />}
                  />
                  {/* process detail */}
                  <Route
                    path="/processDetail/:id"
                    element={<ProcessDetail />}
                  />

                  {/* -------------store route------------- */}
                  {/* store */}
                  <Route path="/store" element={<Store />} />
                  {/* create store */}
                  <Route path="/createStore" element={<CreateStore />} />
                  {/* update store */}
                  <Route path="/updateStore/:id" element={<UpdateStore />} />

                  {/* -------------gallery route------------- */}
                  {/*  gallery*/}
                  <Route path="/gallery" element={<Gallery />} />
                  {/* create gallery */}
                  <Route path="/createGallery" element={<CreateGallery />} />
                  {/* update gallery */}
                  <Route
                    path="/updateGallery/:id"
                    element={<UpdateGallery />}
                  />

                  {/* -------------user route------------- */}
                  {/* user */}
                  <Route path="/admin" element={<Admin />} />
                  {/* create new user */}
                  <Route path="/createAdmin" element={<CreateAdmin />} />
                  {/* update user */}
                  {/* <Route path="/updateAdmin/:id" element={<UpdateAdmin />} /> */}

                  {/* -------------order route------------- */}
                  {/* order */}
                  <Route path="/order" element={<Order />} />
                  {/* order detail */}
                  <Route path="/orderDetail/:id" element={<OrderDetail />} />
                  {/* create invoice */}
                  <Route path="/createInvoice" element={<CreateInvoice />} />
                </Routes>
              </Router>
            </DataContext.Provider>
          </AuthContext.Provider>
        </UpdateContext.Provider>
      </div>
    </>
  );
}

export default App;
