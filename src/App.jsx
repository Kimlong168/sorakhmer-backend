import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import CreateProductCategory from "./pages/productCategory/CreateProductCategory";
import ProductCategory from "./pages/productCategory/ProductCategory";
import UpdateProductCategory from "./pages/productCategory/UpdateProductCategory";
import { db } from "./firebase-config";
import { getDocs, collection } from "firebase/firestore";
// , query, orderBy, limit for firebase fetching data
import { UpdateContext } from "./contexts/UpdateContext";
import Product from "./pages/product/Product";
import CreateProduct from "./pages/product/CreateProduct";
import UpdateProduct from "./pages/product/UpdateProduct";
import ProductDetail from "./pages/product/ProductDetail";
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
function App() {
  // state
  const [isUpdated, setIsUpdated] = useState(false);
  const [productCategoryList, setProductCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [blogCategoryList, setBlogCategoryList] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [authorList, setAuthorList] = useState([]);
  const [partnerList, setPartnerList] = useState([]);
  const [awardList, setAwardList] = useState([]);

  // fetch all data from firebase
  useEffect(() => {
    const productCollectionRef = collection(db, "products");
    const productCategoryCollectionRef = collection(db, "product_category");
    const blogCollectionRef = collection(db, "blogs");
    const blogCategoryCollectionRef = collection(db, "blog_category");
    const authorCollectionRef = collection(db, "authors");
    const partnerCollectionRef = collection(db, "partners");
    const awardCollectionRef = collection(db, "awards");

    const fetchAllData = async () => {
      // fetch data of product
      const products = await getDocs(productCollectionRef);
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

    
    };

    // call fetchAllData function
    fetchAllData();
  }, [isUpdated]);

  return (
    <>
      <div>
        {/* update context */}
        <UpdateContext.Provider value={{ isUpdated, setIsUpdated }}>
          {/* -------------router------------- */}
          <Router>
            <Routes>
              {/* -------------dashboard route------------- */}
              <Route path="/" element={<Dashboard />} />

              {/* -------------product route------------- */}
              {/* product */}
              <Route
                path="/product"
                element={
                  <Product
                    productList={productList}
                    productCategoryList={productCategoryList}
                  />
                }
              />
              {/* product detail */}
              <Route
                path="/productDetail/:id"
                element={
                  <ProductDetail productCategoryList={productCategoryList} />
                }
              />
              {/* update product */}
              <Route
                path="/updateProduct/:id"
                element={
                  <UpdateProduct productCategoryList={productCategoryList} />
                }
              />
              {/* create product */}
              <Route
                path="/createProduct"
                element={
                  <CreateProduct productCategoryList={productCategoryList} />
                }
              />
              {/* update product */}
              <Route path="/updateProduct" element={<UpdateProduct />} />

              {/* -------------product category route------------- */}
              {/* product category */}
              <Route
                path="/productCategory"
                element={
                  <ProductCategory ProductCategoryList={productCategoryList} />
                }
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
              <Route
                path="/blog"
                element={
                  <Blog
                    blogList={blogList}
                    blogCategoryList={blogCategoryList}
                    authorList={authorList}
                  />
                }
              />
              {/* blog detail */}
              <Route
                path="/blogDetail/:id"
                element={
                  <BlogDetail
                    blogCategoryList={blogCategoryList}
                    authorList={authorList}
                  />
                }
              />
              {/* update blog */}
              <Route
                path="/updateBlog/:id"
                element={
                  <UpdateBlog
                    blogCategoryList={blogCategoryList}
                    authorList={authorList}
                  />
                }
              />
              {/* create blog */}
              <Route
                path="/createBlog"
                element={
                  <CreateBlog
                    blogCategoryList={blogCategoryList}
                    authorList={authorList}
                  />
                }
              />

              {/* -------------blog category route------------- */}
              {/* blog category */}
              <Route
                path="/blogCategory"
                element={<BlogCategory blogCategoryList={blogCategoryList} />}
              />

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
              <Route
                path="/author"
                element={<Author authorList={authorList} />}
              />
              {/* create author */}
              <Route path="/createAuthor" element={<CreateAuthor />} />
              {/* update author */}
              <Route path="/updateAuthor/:id" element={<UpdateAuthor />} />

              {/* -------------Company partners route------------- */}
              {/* company partners */}
              <Route
                path="/partner"
                element={<Partners partnerList={partnerList} />}
              />
              {/* create company partners */}
              <Route path="/createPartner" element={<CreatePartner />} />
              {/* update company partners */}
              <Route path="/updatePartner/:id" element={<UpdatePartner />} />

              {/* -------------Company award route------------- */}
              {/* company award */}
              <Route path="/award" element={<Award awardList={awardList} />} />
              {/* create company award */}
              <Route path="/createAward" element={<CreateAward />} />
              {/* update company award */}
              <Route path="/updateAward/:id" element={<UpdateAward />} />
            </Routes>
          </Router>
        </UpdateContext.Provider>
      </div>
    </>
  );
}

export default App;
