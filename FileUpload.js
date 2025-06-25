import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FileUpload = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const title = form.title.value;
    const img = form.img.value;
    const food = form.food.value;
    const des = form.des.value;
    const price = form.price.value;

    const data = { title, img, food, des, price, quantity: 1 };

    // Validation
    if (!title || !img || !food || !des || !price) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:6001/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        toast.success("🎉 Uploaded successfully");
        form.reset();
      } else {
        toast.error("❌ Upload failed");
      }
    } catch (error) {
      toast.error("🚫 Server error");
      console.error(error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <h2>Upload Doll</h2>

        <div>
          <label>Title:</label>
          <input type="text" name="title" />
        </div>

        <div>
          <label>Image URL:</label>
          <input type="text" name="img" />
        </div>

        <div>
          <label>ID:</label>
          <input type="text" name="food" />
        </div>

        <div>
          <label>Description:</label>
          <input type="text" name="des" />
        </div>

        <div>
          <label>Price:</label>
          <input type="number" name="price" />
        </div>

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUpload;
