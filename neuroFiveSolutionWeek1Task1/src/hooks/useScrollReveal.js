import { useEffect, useRef, useState } from 'react';
export default function useScrollReveal(options = {}) {
  const ref = useRef(null); const [visible, setVisible] = useState(false);
  useEffect(() => { const node=ref.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.unobserve(node)}},{threshold:.12,...options});observer.observe(node);return()=>observer.disconnect()},[]);
  return { ref, className: `reveal${visible ? ' visible' : ''}` };
}
