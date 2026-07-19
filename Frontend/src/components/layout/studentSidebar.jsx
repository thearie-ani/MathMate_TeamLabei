import {
Home,
BookOpen,
Brain,
ClipboardList,
LogOut
} from "lucide-react";

import {NavLink} from "react-router-dom";


const links=[

{
name:"Dashboard",
path:"/",
icon:Home
},

{
name:"Courses",
path:"/courses",
icon:BookOpen
},

{
name:"Quiz",
path:"/quiz",
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


<div
className="
mb-10
"
>
<h1
className="
text-xl
font-bold
text-[#1a1535]
"
>
LearnSpace

</h1>


<p
className="
text-xs
text-gray-400
mt-1
"
>
Student Portal
</p>
</div>
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