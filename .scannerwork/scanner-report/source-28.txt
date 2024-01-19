  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import Blog from "./Blog";
  import "../assets/Blogs.css"; // Ensure you have this CSS file with the required styles

  const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
      // Fetch all blogs on component mount
      const fetchBlogs = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/blog");
          setBlogs(res.data.blogs);
        } catch (err) {
          console.error("Error fetching blogs:", err);
        }
      };

      fetchBlogs();
    }, []);

    const handleBlogClick = async (blogId) => {
      // Fetch details of a single blog when a blog is clicked
      try {
        const response = await axios.get(`http://localhost:5000/api/blog/${blogId}`);
        setSelectedBlog(response.data.blog);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };
    //description first 5 words 
    function formatDescription(description) {
      const words = description.split(" ");
      const firstFive = words.slice(0, 5).join(" ");
      const rest = words.slice(5).join(" ");
      
  
      return (
          <>
                   <strong style={{ fontSize: '30px' }}>{firstFive}</strong> {rest}
       
          </>
      );
  }
  



    const handleBackToList = () => {
      // Handle going back to the list of blogs
      setSelectedBlog(null);
    };

    return (
      <div>
        {selectedBlog ? (
        <div className="blog-details">
          <button className="back-button" onClick={handleBackToList}>
            &#8592; All Blogs
          </button>
          <div className="blog-content">
            <h2 className="blog-title">{selectedBlog.title}</h2>
            {/* Image grid with boxes */}
            <div className="image-grid">
            {selectedBlog.images.map((image, index) => (
              <div key={index} className="image-box">
                <img src={`http://localhost:5000/${image}`} alt={`Blog ${selectedBlog.title}`} />
              </div>

            ))}
          </div>

                <div className="likes-count">
                   Number of Likes:{selectedBlog.likes.length}❤️{/* Displaying the total number of likes here */}
                 
                </div>
              
          


                <p className="blog-description">
                {formatDescription(selectedBlog.description)}
            </p>

            {/* Likes and comments logic remains unchanged */}
          </div>
        </div>
      ) : (
          // Map through the blogs and render them with only the first image
          <div>
            {blogs.map((blog) => (
              <div key={blog._id} onClick={() => handleBlogClick(blog._id)}>
                <Blog
                  title={blog.title}
                  description={blog.description}
                  images={blog.images.length > 0 ? [blog.images[0]] : []}
                  isUser={localStorage.getItem("userId") === blog.user._id}
                  id={blog._id}
                  onBlogClick={handleBlogClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default Blogs;
