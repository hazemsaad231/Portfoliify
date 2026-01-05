'use client';

import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { supabase } from '../../utils/supabase';
import { useState, useEffect } from 'react';



export default function Experience({ userId }: { userId: string }) {


  const [dbContact, setDbContact] = useState<any>(null);

  // 1. جلب البيانات من Supabase
  useEffect(() => {
    async function getContact() {
      const { data } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', userId);
      
      if (data) 
      setDbContact(data);
    }
    getContact();
  }, []);

  const data = dbContact || [];



  return (
    <div id="experience" className="py-24">
        <div className="px-4 sm:px-4 md:px-6 lg:px-8 xl:px-32" > 
       <div className="text-start w-full my-10">
           <h1 className="bg-linear-to-r from-[#8750f7] to-white bg-clip-text text-transparent mb-4 text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl  font-bold inline-block">
             Experience <span className='w-4 h-4 bg-[#8750f7] inline-block rounded-full'></span>
           </h1>
         </div>

         {/* التعديل هنا: إضافة layout="1-column-left" */}
         <VerticalTimeline lineColor="white" layout="1-column-left">
         {data.map((data: any) => (
            <VerticalTimelineElement
              date={data.date}
              icon={<FontAwesomeIcon icon={faBriefcase} />}
              iconStyle={{ background: '#8750f7', color: '#fff' }} // لون الأيقونة
              contentStyle={{ 
                background: "transparent", 
                border: "1px solid #333", // إطاره بسيط عشان يظهر في الدارك مود
                textAlign: "left", 
              
              }}
              key={data.id}
            >
              <div className="text-white">
                <h3 className="text-[#8750f7] font-bold text-xl">{data.name}</h3>
                <h4 className="text-gray-300 font-semibold">{data.title}</h4>
                <p className="text-gray-400">
                  {data.text}
                </p>
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
}


