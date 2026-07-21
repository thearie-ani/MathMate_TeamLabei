
// @desc  Upload a single image (used by the Tiptap editor's image button)
// @route POST /api/uploads/image
// @access Private/Admin
export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: "No file uploaded" 
    });
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: { url },
  });
};
