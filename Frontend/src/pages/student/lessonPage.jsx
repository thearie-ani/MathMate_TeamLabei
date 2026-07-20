import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import katex from "katex";

import { courseApi } from "../../api/courseApi";
import LessonSidebar from "../../components/common/lessonSidebar";


export default function LessonPage() {

  const {
    slug,
    lessonSlug
  } = useParams();

  const navigate = useNavigate();


  const [course,setCourse] = useState(null);
  const [lessons,setLessons] = useState([]);
  const [lesson,setLesson] = useState(null);
  const [completed,setCompleted] = useState(false);

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


        const lessonList =
          lessonsRes.data.data.lessons.sort(
            (a,b)=>
              a.chapter-b.chapter ||
              a.order-b.order
          );


        setLessons(lessonList);



        const current =
          lessonList.find(
            item=>item.slug === lessonSlug
          );


        setLesson(current);



        if(current){

          try {

            const progressRes =  await courseApi.getCourseProgress(c._id);
            const completedLessons = progressRes.data.data.completedLessons || [];
            setCompleted(
              completedLessons.includes(current._id)
            );


          }catch(error){
            // student has no enrollment
            setCompleted(false);
          }

        }


      }catch(error){

        console.log(error);

      }finally{

        setLoading(false);

      }

    }


    load();

  },[slug,lessonSlug]);




  async function handleComplete(){

    if(!lesson || completed)
      return;


    await courseApi.completeLesson(
      lesson._id
    );


    setCompleted(true);

  }



  const renderedContent = useMemo(()=>{

    if(!lesson?.content)
      return "";

    return renderMathInHtml(lesson.content);

  },[lesson]);




  if(loading){

    return (
      <div className="p-6 text-gray-400">
        Loading lesson...
      </div>
    );

  }



  if(!lesson){

    return (
      <div className="p-6 text-red-500">
        Lesson not found
      </div>
    );

  }



  return (

    <div className="
      max-w-6xl
      mx-auto
      px-6
      py-6

      grid
      grid-cols-1
      lg:grid-cols-[240px_1fr]

      gap-6
    ">
      <aside>
        <button
          onClick={()=>navigate(
            `/courses/${slug}`
          )}

          className="
            flex
            items-center
            gap-2
            text-sm
            text-[#8b5cf6]
            mb-4
          "
        >

          <ArrowLeft size={16}/>

          Back to Course

        </button>



        <div className="
          bg-white
          border
          border-[#eee7ff]
          rounded-2xl
          p-3
        ">

          <p className="
            text-xs
            font-semibold
            text-[#8b5cf6]
            mb-3
          ">
            {course?.title}
          </p>


          <LessonSidebar
            courseSlug={slug}
            lessons={lessons}
          />


        </div>


      </aside>





      <article>


        <div className="
          bg-white
          border
          border-[#eee7ff]
          rounded-3xl
          overflow-hidden
        ">


          <header className="
            px-6
            py-5
            bg-[#f8f5ff]
          ">


            <p className="
              text-xs
              uppercase
              text-[#8b5cf6]
              mb-2
            ">
              Chapter {lesson.chapter}.{lesson.order}
            </p>


            <h1 className="
              text-2xl
              font-bold
              text-[#1a1535]
            ">
              {lesson.title}
            </h1>


          </header>




          <div className="
            px-6
            py-5
          ">


            <div

              className="
                prose
                max-w-none
                text-[#1a1535]
              "

              dangerouslySetInnerHTML={{
                __html: renderedContent
              }}

            />


          </div>





          <footer className="
            px-6
            py-4
            border-t
            border-[#eee7ff]

            bg-[#faf9ff]

            flex
            justify-between
            items-center
          ">


            <span className="
              text-xs
              text-gray-400
            ">
              Complete this lesson to update progress
            </span>




            <button

              onClick={handleComplete}

              disabled={completed}

              className={`
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                text-sm
                font-semibold

                ${
                  completed
                  ?
                  "bg-green-100 text-green-600"
                  :
                  "bg-[#8b5cf6] text-white"
                }
              `}
            >


              <CheckCircle size={16}/>


              {
                completed
                ?
                "Completed"
                :
                "Mark Complete"
              }


            </button>


          </footer>


        </div>


      </article>


    </div>

  );

}



function renderMathInHtml(rawHtml){

  let output = rawHtml;


  // Block math: $$ ... $$
  output = output.replace(
    /\$\$([\s\S]+?)\$\$/g,
    (match, expression) => {

      try{

        return katex.renderToString(
          expression.trim(),
          {
            displayMode: true,
            throwOnError: false
          }
        );

      }catch(error){

        console.error(
          "KaTeX block render error:",
          error
        );

        return match;

      }

    }
  );


  // Inline math: $ ... $
  output = output.replace(
    /\$([^\$\n]+?)\$/g,
    (match, expression) => {

      try{

        return katex.renderToString(
          expression.trim(),
          {
            displayMode: false,
            throwOnError: false
          }
        );

      }catch(error){

        console.error(
          "KaTeX inline render error:",
          error
        );

        return match;

      }

    }
  );


  return output;

}