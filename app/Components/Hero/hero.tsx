
import { FaGithub } from "react-icons/fa";
import { FaLinkedin} from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "../../utils/supabase";


const Hero = async ({ userId }: { userId: string | null }) => {

  let data = null;

  if (userId) {
    const { data: fetchedData } = await supabase
      .from('hero')
      .select('*')
      .eq('user_id', userId)
      .single();

    data = fetchedData;
  }

  if (data) {
    console.log("Hero Data:", data);
  }

  const { full_name = 'Your Name', job_title = 'Your Job Title', mini_bio = 'Your professional bio goes here.', exp_years = '0', projects_completed = '0', linkedin_url = '#', github_url = '#', whatsapp_url = '', cv_url = '#' } = data || {};

  return (
    <div className="py-44"  id="home">
    <div className='flex flex-col px-4 sm:px-4 md:px-6 lg:px-8 xl:px-32' >

    <div className='mt-10'>
      
    <h1 
  className="bg-linear-to-r from-[#8750f7] to-white bg-clip-text text-5xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-bold tracking-[2px] inline-block"
  style={{ WebkitTextFillColor: "transparent" }}
>
 I am {full_name}
</h1>
        <h1 className='text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl my-3'>
        {job_title}
          </h1>

        <p className='text-md text-gray-200 sm:text-md md:text-md lg:text-lg xl:text-xl w-80 mb-4 '>

          {mini_bio}

        </p>
        <div className='flex mb-8'>

<div className="relative z-10">
  <a href={`${cv_url}`} download={true}>
<button className="text-sm flex bg-linear-to-t from-[#8750f7] to-white py-2.5 px-4 font-medium uppercase text-white rounded-full ">
        Download Cv
      </button></a>
    </div>
        <a href={`${github_url}`}><FaGithub className='text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl mx-3 text-white'/></a>
        <a href={`${linkedin_url}`}><FaLinkedin className='text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl'/></a>
        <a href={`https://wa.me/2${whatsapp_url}`}> <FaWhatsapp className='text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl text-white mx-3'/></a>


        </div>
    </div>

<div className='card rounded-xl border-2 border-linear-to-t from-[#8750f7] to-white shadow-xl w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[50%] transition-all duration-500 ease-in-out  p-4 hover:border-[#8750f7]'>
  <ul className='flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-center items-center gap-8 sm:gap-8 md:gap-16 lg:gap-24 xl:gap-24'> 
    <li className='flex gap-2'> <span className='font-bold text-5xl'>+{exp_years}</span><span className='text-sm relative top-4'>Years of Experience</span></li>
    <li className='flex gap-2'> <span className='font-bold text-5xl'>+{projects_completed}</span><span className='text-sm relative top-4'>Projects Completed</span></li>
    <li></li>
  </ul>
</div> 



</div>

</div>

  )
};

export default Hero;
