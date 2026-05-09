export const notFoundHandler = (req, res) => {
    res.status(404).json({ message: "Route not found" });
  };
  
  export const errorHandler = (err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  };