import {
Home,
BookOpen,
Brain,
ClipboardList,
LogOut
} from "lucide-react";

import {NavLink, Link} from "react-router-dom";


const links=[

{
name:"Dashboard",
path:"/dashboard",
icon:Home
},

{
name:"Courses",
path:"/courses",
icon:BookOpen
},

{
name:"Quiz",
path:"/quizzes",
icon:ClipboardList
},

{
name:"AI Tutor",
path:"/ai-tutor",
icon:Brain
}

];



export default function StudentSidebar({
onLogout
}){


return (

<aside
className="
w-64
bg-white
border-r
border-[#eee7ff]
p-5
hidden
md:flex
flex-col
"
>


    <Link to="/" className="flex items-center gap-2 text-lg font-bold text-[#1a1535]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 text-white text-sm font-bold">
            ∑
          </span>
          MathMate
        </Link>

<nav
className="
space-y-2
flex-1
"
>

{

links.map(item=>{


const Icon=item.icon;


return (

<NavLink

key={item.path}

to={item.path}

className={({isActive})=>

`
flex
items-center
gap-3
px-4
py-3
rounded-xl
text-sm
font-medium

transition

${
isActive

?
"bg-[#f3edff] text-[#8b5cf6]"

:

"text-gray-500 hover:bg-[#faf7ff]"
}

`
}
>
<Icon size={18}/>
{item.name}
</NavLink>
)

})
}
</nav>

<button
onClick={onLogout}

className="
flex
items-center
gap-3
text-sm
text-red-500
px-4
py-3
hover:bg-red-50
rounded-xl
"
>
<LogOut size={18}/>
Logout
</button>
</aside>
)
}