import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {

    // Destructure toggleWishlistItem and isInWishlist from useAppContext
    const { products, navigate, currency, addToCart, toggleWishlistItem, isInWishlist } = useAppContext();
    const { id } = useParams();
    const [relatedProducts, setRetatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => item._id === id);

    useEffect(() => {
        if (products.length > 0 && product) { // Ensure product is found before filtering
            let productsCopy = products.slice();
            // Filter related products by category, excluding the current product itself
            productsCopy = productsCopy.filter((item) => product.category === item.category && item._id !== product._id);
            setRetatedProducts(productsCopy.slice(0, 5));
        }
    }, [products, product]); // Added product to dependencies

    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null);
    }, [product]);

    // Added a loading state if product is not found yet
    if (!product) {
        return <div className="text-center mt-20 text-lg">Loading product details...</div>;
    }

    return (
        <div className="mt-12">
            <p>
                <Link to={"/"} className="text-gray-600 hover:text-primary transition">Home</Link> /
                <Link to={"/products"} className="text-gray-600 hover:text-primary transition"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} className="text-gray-600 hover:text-primary transition"> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className={`border max-w-24 rounded overflow-hidden cursor-pointer ${thumbnail === image ? 'border-primary' : 'border-gray-500/30'}`} >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden relative"> {/* Added relative class here */}
                        <img src={thumbnail} alt="Selected product" className="w-full h-auto" />

                        {/* Wishlist Button - Positioned absolutely inside the image container */}
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleWishlistItem(product._id); }}
                            className={`absolute top-2 right-2 flex items-center justify-center gap-1  md:w-[40px] w-[34px] h-[34px]  text-primary-600 cursor-pointer ${isInWishlist(product._id) ? ' border-primary text-white' : ' border-gray-400/40'}`}
                            aria-label="Add to wishlist"
                        >
                            <img
                                src={isInWishlist(product._id) ? assets.wishlist_icon_filled : assets.wishlist_icon}
                                alt="wishlist icon"
                                className="w-6 h-6"
                            />
                        </button>
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            // Removed the problematic comment from this line
                            <img key={i} src={i < product.rating ? assets.star_icon : assets.star_dull_icon} className="md:w-4 w-3.5" alt="star rating" />
                        ))}
                        <p className="text-base ml-2">({product.rating || 'N/A'})</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        {/* Wishlist Button */}


                        <button onClick={() => addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button onClick={() => { addToCart(product._id); navigate("/cart") }} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            {/* ------------------related products --------------- */}
            <div className=" flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max ">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>
                <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
                    {relatedProducts.filter((p) => p.inStock).map((p, index) => (
                        <ProductCard key={index} product={p} />
                    ))}
                </div>
                <button onClick={() => { navigate('/products'); scrollTo(0, 0) }} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">See more</button>
            </div>
        </div>
    );
};

export default ProductDetails;