import Course from '../models/Course.js';
import { importFromOpenstax } from '../utils/openstaxImporter.js';

// @desc  Fetch + clean an OpenStax page and return a preview the admin can
//        load into the Tiptap editor. Nothing is saved to the DB here.
// @route POST /api/import/openstax
// @body  { url: string }
// @access Private/Admin
const previewOpenstaxImport = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    res.status(400).message("A url is required");
  }

  const result = await importFromOpenstax(url);

  // Tell the frontend whether a matching course already exists so the
  // admin can either reuse it or create a new one from bookSlug.
  const existingCourse = await Course.findOne({ slug: result.bookSlug });

  res.json({
    success: true,
    data: {
      ...result,
      existingCourse: existingCourse || null,
      // A readable default title if the admin creates a new course from this import
      suggestedCourseTitle: existingCourse
        ? existingCourse.title
        : result.bookSlug
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
    },
  });
};

export default previewOpenstaxImport;