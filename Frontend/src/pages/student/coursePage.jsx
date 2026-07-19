import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Lock, CheckCircle } from "lucide-react";
import { courseApi } from "../../api/courseApi.js";

export default function CoursePage() {

  const { slug } = useParams();
  const navigate = useNavigate();

  const [course,setCourse] = useState(null);
  const [lessons,setLessons] = useState([]);
  const [progress,setProgress] = useState(null);
  const [enrolled,setEnrolled] = useState(false);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{

    async function load(){

      try{

        const courseRes =
          await courseApi.getCourseBySlug(slug);

        const c =
          courseRes.data.data.course;

        setCourse(c);


        const lessonsRes =
          await courseApi.getLessonsByCourse(c._id);

        setLessons(
          lessonsRes.data.data.lessons.sort(
            (a,b)=>
              a.chapter-b.chapter ||
              a.order-b.order
          )
        );


        const myCourses =
          await courseApi.getMyCourses();


        const check =
          myCourses.data.data.courses.some(
            item=>item._id===c._id
          );


        setEnrolled(check);


        if(check){

          const progressRes =
            await courseApi.getCourseProgress(c._id);

          setProgress(
            progressRes.data.data
          );

        }


      }finally{

        setLoading(false);

      }

    }


    load();

  },[slug]);



  async function handleEnroll(){

    await courseApi.enrollCourse(
      course._id
    );

    setEnrolled(true);

    const progressRes =
      await courseApi.getCourseProgress(
        course._id
      );
    console.log(progressRes.data.data);
    setProgress(
      progressRes.data.data
    );

  }



  if(loading)
    return (
      <div className="p-6 text-gray-400">
        Loading course...
      </div>
    );


  return (

    <div className="
      max-w-6xl mx-auto
      px-6 py-8
    ">


      <button
        onClick={()=>navigate("/courses")}
        className="
          flex items-center gap-2
          text-sm text-[#8b5cf6]
          mb-5
        "
      >
        <ArrowLeft size={16}/>
        Back to Courses
      </button>



      <div className="
        bg-white
        border border-[#eee7ff]
        rounded-3xl
        overflow-hidden
      ">


        <div className="
          p-6
          bg-[#f8f5ff]
        ">

          <h1 className="
            text-3xl
            font-bold
            text-[#1a1535]
          ">
            {course?.title}
          </h1>


          <p className="
            mt-2
            text-gray-500
          ">
            {course?.description}
          </p>



          {
            enrolled ?

            <div className="mt-5">

              <div className="
                flex justify-between
                text-sm mb-2
              ">
                <span>
                  Progress
                </span>

                <span>
                  {progress?.progressPercentage || 0}%
                </span>
              </div>


              <div className="
                h-3
                rounded-full
                bg-purple-100
              ">

                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#8b5cf6]
                  "
                  style={{
                    width:
                    `${progress?.progressPercentage || 0}%`
                  }}
                />

              </div>

            </div>


            :

            <button
              onClick={handleEnroll}
              className="
                mt-5
                bg-[#8b5cf6]
                text-white
                px-5 py-2.5
                rounded-xl
                font-semibold
              "
            >
              Enroll Course
            </button>

          }


        </div>



        <div className="p-6">


          <h2 className="
            font-semibold
            text-[#1a1535]
            mb-4
          ">
            Lessons
          </h2>


          <div className="space-y-3">


            {
              lessons.map((lesson)=>(

                <button
                  key={lesson._id}
                  disabled={!enrolled}

                  onClick={()=>navigate(
                    `/courses/${slug}/lessons/${lesson.slug}`
                  )}

                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-xl
                    border border-[#eee7ff]

                    ${
                      enrolled
                      ?
                      "hover:bg-[#faf7ff]"
                      :
                      "opacity-60 cursor-not-allowed"
                    }
                  `}
                >


                  <div className="
                    flex items-center gap-3
                  ">


                    {
                      enrolled
                      ?
                      <BookOpen
                        size={18}
                        className="text-[#8b5cf6]"
                      />

                      :

                      <Lock
                        size={18}
                        className="text-gray-400"
                      />

                    }
                    <div className="text-left">

                      <p className="
                        font-medium
                        text-[#1a1535]
                      ">
                        {lesson.title}
                      </p>


                      <p className="
                        text-xs
                        text-gray-400
                      ">
                        Chapter {lesson.chapter}.{lesson.order}
                      </p>

                    </div>
                  </div>
                  {
  Array.isArray(progress?.completedLessons) &&
  progress.completedLessons.some(
    item => 
      item._id === lesson._id ||
      item === lesson._id
  )
  &&
  <CheckCircle
    size={18}
    className="text-green-500"
  />
}
                </button>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );

}